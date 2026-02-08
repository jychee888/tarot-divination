'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Get current user's profile data
 */
export async function getUserProfile(): Promise<{
  success: boolean;
  data?: {
    id: string;
    name: string | null;
    email: string | null;
    nickname: string | null;
    bio: string | null;
    birthday: string | null;
    birthTime: string | null;
    gender: string | null;
  };
  error?: string;
}> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        nickname: true,
        bio: true,
        birthday: true,
        birthTime: true,
        gender: true,
      } as any,
    })

    if (!user) {
      throw new Error("User not found")
    }

    return { success: true, data: user as any }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, error: "Failed to fetch user profile" }
  }
}

/**
 * Update current user's profile data
 */
export async function updateUserProfile(formData: {
  nickname?: string
  bio?: string
  birthday?: string
  birthTime?: string
  gender?: string
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    const { nickname, bio, birthday, birthTime, gender } = formData
    const userId = session.user.id

    // Check if nickname is already taken by another user
    if (nickname) {
      const existingUser = await prisma.user.findFirst({
        where: {
          nickname: nickname,
          NOT: { id: userId },
        },
      })

      if (existingUser) {
        return { success: false, error: "Nickname already taken" }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nickname: nickname || undefined,
        bio: bio || undefined,
        birthday: birthday || undefined,
        birthTime: birthTime || undefined,
        gender: gender || undefined,
      } as any,
    })

    // Revalidate the profile page to reflect changes
    revalidatePath('/profile')

    return { success: true, data: updatedUser }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user profile" }
  }
}

/**
 * Update user role (Admin only)
 */
export async function updateUserRole(targetUserId: string, newRole: string) {
  const session = await getServerSession(authOptions)

  // Verify authorization
  const isSuperAdmin = session?.user?.email === "jychee888@gmail.com"
  const isAdmin = session?.user?.role === "admin" || isSuperAdmin

  if (!session || !isAdmin) {
    throw new Error("Unauthorized: Admin access required")
  }

  try {
    // Fetch target user to check email
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { email: true }
    })

    if (!targetUser) {
      return { success: false, error: "Target user not found" }
    }

    // Protection: Cannot change the role of the super admin
    if (targetUser.email === "jychee888@gmail.com") {
      return { success: false, error: "Cannot change the role of the super admin" }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole } as any
    })

    // Refresh the admin users management page
    revalidatePath('/admin/users')

    return { success: true, data: updatedUser }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { success: false, error: "Failed to update user role" }
  }
}

/**
 * Update user status (Admin only) - Block/Unblock
 */
export async function updateUserStatus(targetUserId: string, newStatus: string) {
  const session = await getServerSession(authOptions)

  // Verify authorization
  const isSuperAdmin = session?.user?.email === "jychee888@gmail.com"
  const isAdmin = session?.user?.role === "admin" || isSuperAdmin

  if (!session || !isAdmin) {
    throw new Error("Unauthorized: Admin access required")
  }

  try {
    // Fetch target user to check email
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { email: true }
    })

    if (!targetUser) {
      return { success: false, error: "Target user not found" }
    }

    // Protection: Cannot block the super admin
    if (targetUser.email === "jychee888@gmail.com" && newStatus === "blocked") {
      return { success: false, error: "Cannot block the super admin" }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: newStatus } as any
    })

    // Refresh the admin users management page
    revalidatePath('/admin/users')

    return { success: true, data: updatedUser }
  } catch (error) {
    console.error("Error updating user status:", error)
    return { success: false, error: "Failed to update user status" }
  }
}
