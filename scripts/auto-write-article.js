const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function getArgValue(flag) {
  const prefix = `${flag}=`;
  const exactIdx = process.argv.indexOf(flag);
  if (exactIdx !== -1) return process.argv[exactIdx + 1];
  const withEq = process.argv.find((a) => a.startsWith(prefix));
  if (withEq) return withEq.slice(prefix.length);
  return undefined;
}

function stripCodeFences(s) {
  if (!s) return s;
  return s.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
}

function safeJsonParse(s) {
  const cleaned = stripCodeFences(String(s || ""));
  return JSON.parse(cleaned);
}

function assertString(v, name) {
  if (typeof v !== "string" || !v.trim()) {
    throw new Error(`AI 回傳欄位 "${name}" 不是有效字串`);
  }
}

function assertStringArray(v, name) {
  if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) {
    throw new Error(`AI 回傳欄位 "${name}" 不是字串陣列`);
  }
}

async function resolveCategorySlug(categoryInput) {
  if (!categoryInput) throw new Error("請提供 --category (name 或 slug)");

  const category = await prisma.category.findFirst({
    where: { OR: [{ slug: categoryInput }, { name: categoryInput }] },
    select: { slug: true },
  });

  if (!category) {
    throw new Error(`找不到分類 "${categoryInput}"（請輸入分類 name 或 slug）`);
  }

  return category.slug;
}

async function generateWithGemini(prompt, apiKey) {
  const attempts = [
    { version: "v1beta", model: "gemini-2.5-flash" },
    { version: "v1beta", model: "gemini-2.5-pro" },
    { version: "v1beta", model: "gemini-2.0-flash" },
  ];

  let lastError = null;

  for (const attempt of attempts) {
    const apiUrl = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return { text, model: attempt.model };
        lastError = "Empty response text";
        continue;
      }

      lastError =
        data?.error?.message || data?.error?.status || `HTTP ${res.status}`;
      if (res.status === 403) {
        throw new Error(`API Key 無效或權限不足：${lastError}`);
      }
      if (res.status === 404) continue;
    } catch (e) {
      lastError = e?.message || String(e);
    }
  }

  throw new Error(`Gemini 生成失敗：${lastError}`);
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("尚未配置 GEMINI_API_KEY（請在 .env 設定）");
  }

  const categoryInput = getArgValue("--category");
  const categorySlug = await resolveCategorySlug(categoryInput);

  const topic = getArgValue("--topic") || "塔羅新手入門";
  const tone = getArgValue("--tone") || "溫暖、務實、可行動";

  const prompt = `
你是一位專業塔羅寫作編輯，請為網站部落格產出「一篇」新文章資料，供我直接存入資料庫。

【分類 slug】${categorySlug}
【主題方向】${topic}
【語氣】${tone}

請只輸出「純 JSON」，不要任何額外文字、不要 Markdown。
JSON schema:
{
  "title": "string（繁中，吸引人但不誇張）",
  "slug": "string（英文小寫-kebab-case，務必唯一，避免跟常見既有文章重複）",
  "excerpt": "string（繁中，約 60-100 字）",
  "content": "string（HTML，至少 900 字，使用 <p><h2><h3><ul><li><strong> 等，結構清楚）",
  "tags": ["string", "string", "string"],
  "coverImage": "string（https://images.unsplash.com/... 可用連結）"
}

寫作要求：
- 內容要是新手真的看得懂、做得到的教學文，避免空泛心靈雞湯
- 不要提到「AI」或「模型」或「prompt」
- 不要抄襲：用原創的段落與例子
`;

  console.log(`✍️ 開始自動寫文：category=${categorySlug}`);
  const { text, model } = await generateWithGemini(prompt, apiKey);
  console.log(`🤖 生成完成（${model}），開始解析 JSON...`);

  const article = safeJsonParse(text);

  assertString(article.title, "title");
  assertString(article.slug, "slug");
  assertString(article.excerpt, "excerpt");
  assertString(article.content, "content");
  assertStringArray(article.tags, "tags");
  assertString(article.coverImage, "coverImage");

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true },
  });
  if (!category) throw new Error(`找不到分類 slug: ${categorySlug}`);

  const post = await prisma.post.upsert({
    where: { slug: article.slug },
    update: {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      tags: article.tags,
      published: true,
      categoryId: category.id,
      updatedAt: new Date(),
    },
    create: {
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      tags: article.tags,
      published: true,
      categoryId: category.id,
    },
  });

  console.log(`✅ 已自動寫文並發布/更新：${post.title} (${post.slug})`);
}

main()
  .catch((e) => {
    console.error("❌ 自動寫文失敗：", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

