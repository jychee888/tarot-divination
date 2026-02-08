'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getSystemSettings() {
  try {
    // Debug: Log available models on prisma client
    const models = Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$'));
    console.log("[Settings] Available Prisma models:", models);

    // Try multiple possible model names due to Prisma naming conventions and singular/plural variations
    // Pattern: singular (systemSetting), plural (systemSettings), PascalCase (SystemSetting/SystemSettings)
    const systemSettingModel = 
      (prisma as any).systemSetting || 
      (prisma as any).systemSettings || 
      (prisma as any).SystemSetting || 
      (prisma as any).SystemSettings;
    
    if (!systemSettingModel) {
      throw new Error(`SystemSetting model not found in Prisma client. Available models: ${models.join(', ')}`);
    }

    const settings = await systemSettingModel.findMany()
    console.log(`[Settings] Fetched ${settings.length} settings from database`);
    
    // Convert array to searchable object
    const settingsMap = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value
      return acc
    }, {})
    
    return { success: true, data: settingsMap }
  } catch (error: any) {
    console.error("[Settings] Error fetching settings:", error.message)
    return { success: false, error: `讀取失敗: ${error.message}` }
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
    const systemSettingModel = 
      (prisma as any).systemSetting || 
      (prisma as any).systemSettings || 
      (prisma as any).SystemSetting || 
      (prisma as any).SystemSettings;
    
    if (!systemSettingModel) {
      throw new Error("SystemSetting model not found in Prisma client");
    }

    const upserts = Object.entries(settings).map(([key, value]) => {
      return systemSettingModel.upsert({
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
