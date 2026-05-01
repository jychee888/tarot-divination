'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

type GeneratePostDraftInput = {
  topic: string
  tone?: string
  audience?: string
  length?: "short" | "medium" | "long"
  keywords?: string
  categoryId: string
}

export type GeneratedPostDraft = {
  title: string
  slug: string
  excerpt: string
  content: string // HTML
  tags: string[]
  coverImage: string
}

declare global {
  // eslint-disable-next-line no-var
  var __aiPostDraftCooldown: Map<string, number> | undefined
}

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
  const isSuperAdmin = session?.user?.email === superAdminEmail
  const isAdmin = session?.user?.role === "admin" || isSuperAdmin

  if (!isAdmin) throw new Error("Unauthorized")

  return {
    userKey: session?.user?.email || "admin",
  }
}

function normalizeSlug(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function stripScriptTags(html: string) {
  return String(html || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
}

function stripCodeFences(s: string) {
  // 1. 移除 Markdown 代碼塊標記
  let cleaned = s.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim()
  
  // 2. 如果還是無法解析，嘗試提取第一個 { 到最後一個 } 之間的內容
  if (!cleaned.startsWith("{")) {
    const start = s.indexOf("{")
    const end = s.lastIndexOf("}")
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = s.substring(start, end + 1)
    }
  }
  return cleaned
}

function ensureString(val: unknown, name: string) {
  if (typeof val !== "string" || !val.trim()) throw new Error(`AI 回傳欄位 "${name}" 無效`)
}

function ensureStringArray(val: unknown, name: string) {
  if (!Array.isArray(val) || val.some((x) => typeof x !== "string")) {
    throw new Error(`AI 回傳欄位 "${name}" 需為字串陣列`)
  }
}

async function generateWithGemini(prompt: string, apiKey: string) {
  const attempts = [
    { version: "v1beta", model: "gemini-2.5-flash" },
    { version: "v1beta", model: "gemini-2.5-pro" },
    { version: "v1beta", model: "gemini-2.0-flash" },
  ] as const

  let lastError: string | null = null

  for (const attempt of attempts) {
    const apiUrl = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${apiKey}`
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      })

      const data = await res.json()

      if (res.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) return { text, model: attempt.model }
        lastError = "Empty response text"
        continue
      }

      lastError = data?.error?.message || data?.error?.status || `HTTP ${res.status}`
      if (res.status === 403) throw new Error(`API Key 無效或權限不足：${lastError}`)
      if (res.status === 404) continue
    } catch (e: any) {
      lastError = e?.message || String(e)
    }
  }

  throw new Error(`Gemini 生成失敗：${lastError}`)
}

export async function generatePostDraft(input: GeneratePostDraftInput) {
  try {
    const { userKey } = await checkAdmin()

    const cooldownMs = 30_000
    const now = Date.now()
    if (!globalThis.__aiPostDraftCooldown) globalThis.__aiPostDraftCooldown = new Map()
    const last = globalThis.__aiPostDraftCooldown.get(userKey) || 0
    if (now - last < cooldownMs) {
      const remain = Math.ceil((cooldownMs - (now - last)) / 1000)
      return { success: false as const, error: `請稍候 ${remain}s 再試（避免短時間大量呼叫 AI）` }
    }
    globalThis.__aiPostDraftCooldown.set(userKey, now)

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return { success: false as const, error: "尚未配置 AI API 金鑰。請在 .env 中添加 GEMINI_API_KEY。" }
    }

    if (!input?.categoryId?.trim()) {
      return { success: false as const, error: "請選擇分類" }
    }

    const categoryModel = (prisma as any).category || (prisma as any).Category
    const category = await categoryModel.findUnique({
      where: { id: input.categoryId },
      select: { id: true, name: true, slug: true },
    })
    if (!category) return { success: false as const, error: "找不到分類（categoryId 無效）" }

    const topic = input.topic?.trim()
    const tone = input.tone?.trim() || "溫暖、務實、可行動"
    const audience = input.audience?.trim() || "新手"
    const length = input.length || "medium"
    const keywords = input.keywords?.trim()

    const lengthHint =
      length === "short" ? "約 600-800 字" : length === "long" ? "約 1400-1800 字" : "約 900-1200 字"

    const prompt = `
你是一位專業內容編輯與塔羅教學作者，請為部落格產出「一篇」新文章草稿。

【分類】${category.name} (${category.slug})
【主題】${topic || "（請根據分類自行擬定一個高品質且吸引人的主題）"}
【目標讀者】${audience}
【語氣】${tone}
【長度】${lengthHint}
${keywords ? `【關鍵字參考】${keywords}` : ""}

寫作要求：
- 如果【主題】為空，請先為該分類設計一個當前最適合、具備 SEO 潛力且有趣的標題。
- 原創、可操作、避免空泛心靈雞湯。
- 不要提到 AI / 模型 / prompt。
- 避免不當內容，避免宣稱醫療/投資保證。

輸出格式要求：
- 只輸出「純 JSON」，不要任何額外文字、不要 Markdown。
- JSON schema:
{
  "title": "string（繁中，這應該是文章的標題）",
  "slug": "string（英文小寫-kebab-case）",
  "excerpt": "string（繁中，約 60-100 字）",
  "content": "string（HTML，用 <p><h2><h3><ul><li><strong> 等，結構清楚）",
  "tags": ["string","string","string"],
  "coverImage": "string（https://images.unsplash.com/...）"
}
`

    const { text } = await generateWithGemini(prompt, apiKey)

    let parsed: any
    try {
      const cleaned = stripCodeFences(text)
      parsed = JSON.parse(cleaned)
    } catch (err: any) {
      console.error("[generatePostDraft] JSON Parse Error:", err.message)
      console.error("[generatePostDraft] Raw AI Text:", text)
      return { success: false as const, error: "AI 回傳格式異常（不是可解析的 JSON），請重試" }
    }

    ensureString(parsed.title, "title")
    ensureString(parsed.slug, "slug")
    ensureString(parsed.excerpt, "excerpt")
    ensureString(parsed.content, "content")
    ensureString(parsed.coverImage, "coverImage")
    ensureStringArray(parsed.tags, "tags")

    const title = String(parsed.title).trim()
    const excerpt = String(parsed.excerpt).trim()
    const coverImage = String(parsed.coverImage).trim()
    const tags = (parsed.tags as string[]).map((t) => String(t).trim()).filter(Boolean).slice(0, 8)
    const content = stripScriptTags(String(parsed.content))

    let slug = normalizeSlug(parsed.slug)
    if (!slug) slug = normalizeSlug(title)
    if (!slug) return { success: false as const, error: "AI 生成的 slug 無效，請重試" }

    const postModel = (prisma as any).post || (prisma as any).Post
    const exists = await postModel.findUnique({ where: { slug }, select: { id: true } })
    if (exists) {
      const suffix = Date.now().toString(36).slice(-4)
      slug = `${slug}-${suffix}`
    }

    const draft: GeneratedPostDraft = {
      title,
      slug,
      excerpt,
      content,
      tags,
      coverImage,
    }

    return { success: true as const, data: draft }
  } catch (e: any) {
    return { success: false as const, error: e?.message || "AI 生成失敗" }
  }
}

