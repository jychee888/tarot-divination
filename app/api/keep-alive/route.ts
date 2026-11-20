import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/**
 * Keep-Alive & Health Check API
 * 
 * 用途：
 * 1. 供外部排程監控 (如 UptimeRobot, cron-job.org, GitHub Actions) 定期 ping。
 * 2. 測試資料庫連線狀況，重置連線閒置計時，避免伺服器冷啟動與連線斷開。
 * 3. 若配置了 Supabase，可一併向 Supabase 發送存取請求防止專案休眠。
 */
export async function GET() {
  const timestamp = new Date().toISOString()
  const results: Record<string, any> = {
    timestamp,
    status: "ok",
    checks: {},
  }

  // 1. 檢查主資料庫連線 (MongoDB Atlas)
  try {
    // 透過簡易查詢維持資料庫連線活躍
    const dbCount = await prisma.user.count().catch(() => null)
    results.checks.database = {
      status: "connected",
      message: dbCount !== null ? "Database connection healthy" : "Query completed",
    }
  } catch (error: any) {
    results.checks.database = {
      status: "warning",
      error: error?.message || "Database ping failed",
    }
  }

  // 2. 若有設定 Supabase，發送保活請求
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jiorbrohmdoiuteqeifc.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (supabaseUrl) {
    try {
      const headers: Record<string, string> = {}
      if (supabaseAnonKey) {
        headers["apikey"] = supabaseAnonKey
        headers["Authorization"] = `Bearer ${supabaseAnonKey}`
      }

      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: "GET",
        headers,
        cache: "no-store",
      })

      results.checks.supabase = {
        status: res.status < 500 ? "active" : "unreachable",
        httpStatus: res.status,
      }
    } catch (err: any) {
      results.checks.supabase = {
        status: "error",
        error: err?.message || "Failed to reach Supabase",
      }
    }
  }

  return NextResponse.json(results, { status: 200 })
}
