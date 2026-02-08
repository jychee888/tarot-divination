'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { startOfDay, subDays } from "date-fns"

export async function getAdminStats() {
  const session = await getServerSession(authOptions)
  const isSuperAdmin = session?.user?.email === "jychee888@gmail.com"
  const isAdmin = session?.user?.role === "admin" || isSuperAdmin

  if (!isAdmin) {
    throw new Error("Unauthorized")
  }

  try {
    // 1. 基礎統計數據 (從資料庫抓取真實數據)
    const totalUsers = await prisma.user.count()
    const totalDivinations = await prisma.divinationRecord.count()
    
    const today = startOfDay(new Date())
    const todayDivinations = await prisma.divinationRecord.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    const activeUsers24h = await prisma.user.count({
      where: {
        lastActiveAt: {
          gte: subDays(new Date(), 1)
        }
      }
    })

    // 2. 占卜主題分佈 (真實數據)
    const themeCounts = await prisma.divinationRecord.groupBy({
      by: ['theme'],
      _count: {
        _all: true
      },
      orderBy: {
        _count: {
          theme: 'desc'
        }
      },
      take: 5
    })

    // 3. 趨勢圖數據 (過去 7 天的占卜量 - 真實數據)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), i)
      return {
        date: d.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' }),
        fullDate: startOfDay(d)
      }
    }).reverse()

    const trendData = await Promise.all(last7Days.map(async (day) => {
      const count = await prisma.divinationRecord.count({
        where: {
          createdAt: {
            gte: day.fullDate,
            lt: new Date(day.fullDate.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
      return {
        name: day.date,
        count: count,
        // Mock GA data until integrated
        views: count * (Math.floor(Math.random() * 5) + 3) 
      }
    }))

    return {
      success: true,
      data: {
        totalUsers,
        totalDivinations,
        todayDivinations,
        activeUsers24h,
        themeCounts: themeCounts.map(t => ({ name: t.theme, value: t._count._all })),
        trendData,
        // 這些是暫時模擬的 GA 數據
        gaMock: {
          realtime: Math.floor(Math.random() * 10) + 1,
          avgSessionDuration: "3m 42s",
          bounceRate: "42.5%"
        }
      }
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}
