'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

/**
 * Check if the current user is an admin
 */
async function checkAdmin() {
  const session = await getServerSession(authOptions)
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const isSuperAdmin = session?.user?.email === superAdminEmail;
  const isAdmin = session?.user?.role === "admin" || isSuperAdmin;
  
  if (!isAdmin) {
    throw new Error("Unauthorized")
  }
}

// --- Category Actions ---

export async function getCategories() {
  try {
    const categoryModel = (prisma as any).category || (prisma as any).Category;
    const categories = await categoryModel.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } }
    })
    return { success: true, data: categories }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createCategory(data: { name: string, slug?: string, description?: string }) {
  await checkAdmin()
  try {
    const categoryModel = (prisma as any).category || (prisma as any).Category;
    const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const category = await categoryModel.create({
      data: { ...data, slug }
    })
    revalidatePath('/admin/posts')
    return { success: true, data: category }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateCategory(id: string, data: { name: string, slug?: string, description?: string }) {
  await checkAdmin()
  try {
    const categoryModel = (prisma as any).category || (prisma as any).Category;
    const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const category = await categoryModel.update({
      where: { id },
      data: { ...data, slug }
    })
    revalidatePath('/admin/posts')
    return { success: true, data: category }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteCategory(id: string) {
  await checkAdmin()
  try {
    const categoryModel = (prisma as any).category || (prisma as any).Category;
    await categoryModel.delete({ where: { id } })
    revalidatePath('/admin/posts')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// --- Tag Actions ---

export async function getTags() {
  try {
    const tagModel = (prisma as any).tag || (prisma as any).Tag;
    const tags = await tagModel.findMany({
      orderBy: { name: 'asc' }
    })
    return { success: true, data: tags }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createTag(name: string) {
  await checkAdmin()
  try {
    const tagModel = (prisma as any).tag || (prisma as any).Tag;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const tag = await tagModel.upsert({
      where: { name },
      update: {},
      create: { name, slug }
    })
    return { success: true, data: tag }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
