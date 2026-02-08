'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getSystemSettings() {
  try {
    const settings = await (prisma as any).systemSettings.findMany()
    console.log(`[Settings] Fetched ${settings.length} settings from database`);
    
    // Convert array to searchable object
    const settingsMap = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value
      return acc
    }, {})
    
    return { success: true, data: settingsMap }
  } catch (error: any) {
    console.error("[Settings] Error fetching settings:", error.message)
    return { success: false, error: "Failed to fetch settings" }
  }
}

export async function updateSystemSettings(settings: Record<string, string>) {
  const session = await getServerSession(authOptions)
  const isSuperAdmin = session?.user?.email === "jychee888@gmail.com"
  const isAdmin = session?.user?.role === "admin" || isSuperAdmin

  console.log(`[Settings] Update attempt by: ${session?.user?.email}, Role: ${session?.user?.role}, isAdmin: ${isAdmin}`);

  if (!isAdmin) {
    console.warn(`[Settings] Unauthorized update attempt by ${session?.user?.email}`);
    return { success: false, error: "權限不足：僅限管理員修改設定" };
  }

  try {
    const upserts = Object.entries(settings).map(([key, value]) => {
      return (prisma as any).systemSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    })

    await Promise.all(upserts)
    console.log(`[Settings] Successfully updated ${Object.keys(settings).length} settings`);
    
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("[Settings] Critical update error:", error)
    return { success: false, error: `資料庫儲存失敗: ${error.message || "未知錯誤"}` }
  }
}
