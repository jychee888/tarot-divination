'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getSystemSettings() {
  try {
    const settings = await (prisma as any).systemSettings.findMany()
    // Convert array to searchable object
    const settingsMap = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value
      return acc
    }, {})
    
    return { success: true, data: settingsMap }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return { success: false, error: "Failed to fetch settings" }
  }
}

export async function updateSystemSettings(settings: Record<string, string>) {
  const session = await getServerSession(authOptions)
  const isSuperAdmin = session?.user?.email === "jychee888@gmail.com"
  const isAdmin = session?.user?.role === "admin" || isSuperAdmin

  if (!isAdmin) {
    throw new Error("Unauthorized")
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
    revalidatePath('/') // Revalidate everything to apply SEO/GA changes
    return { success: true }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}
