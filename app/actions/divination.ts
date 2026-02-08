'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Get all divination records for the current user
 */
export async function getDivinationRecords() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    const records = await prisma.divinationRecord.findMany({
      where: { userId: session.user.id },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: records }
  } catch (error) {
    console.error("Error fetching divination records:", error)
    return { success: false, error: "Failed to fetch divination records" }
  }
}

/**
 * Create a new divination record
 */
export async function createDivinationRecord(data: {
  theme: string
  spreadType: string
  cards: any[]
  question?: string
  aiReading?: string
  userContext?: any
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    const { theme, spreadType, cards, question, aiReading, userContext } = data
    const userId = session.user.id

    if (!theme || !spreadType || !cards) {
      return { success: false, error: 'Missing required fields' }
    }

    const newRecord = await prisma.divinationRecord.create({
      data: {
        theme,
        spreadType,
        cards,
        question,
        aiReading,
        userContext,
        userId,
      } as any,
    })

    // Update user profile if userContext is provided
    if (userContext && userId) {
      try {
        const user = await (prisma.user as any).findUnique({
          where: { id: userId },
          select: { birthday: true, birthTime: true, gender: true }
        })

        if (user && (!user.birthday || !user.birthTime || !user.gender)) {
          await (prisma.user as any).update({
            where: { id: userId },
            data: {
              birthday: user.birthday || userContext.birthday,
              birthTime: user.birthTime || userContext.birthTime,
              gender: user.gender || userContext.gender,
            }
          })
        }
      } catch (profileError) {
        console.warn("Failed to update user profile:", profileError)
      }
    }

    // Revalidate history page
    revalidatePath('/history')

    return { success: true, data: newRecord }
  } catch (error) {
    console.error("Error creating divination record:", error)
    return { success: false, error: "Failed to create divination record" }
  }
}

/**
 * Delete a divination record by ID
 */
export async function deleteDivinationRecord(recordId: string) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    if (!recordId) {
      return { success: false, error: "Record ID is required" }
    }

    // Verify the record belongs to the user
    const record = await prisma.divinationRecord.findUnique({
      where: { id: recordId },
    })

    if (!record) {
      return { success: false, error: "Record not found" }
    }

    if (record.userId !== session.user.id) {
      return { success: false, error: "Unauthorized to delete this record" }
    }

    // Delete the record
    await prisma.divinationRecord.delete({
      where: { id: recordId },
    })

    // Revalidate history page
    revalidatePath('/history')

    return { success: true, message: "Record deleted successfully" }
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Failed to delete divination record" }
  }
}
