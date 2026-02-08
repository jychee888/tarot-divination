'use server'

import { prisma } from "@/lib/prisma"
import { User, Library } from "lucide-react";
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

export async function getPosts(onlyPublished = false) {
  try {
    const postModel = (prisma as any).post || (prisma as any).Post;
    const posts = await postModel.findMany({
      where: onlyPublished ? { published: true } : {},
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    })
    return { success: true, data: posts }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const postModel = (prisma as any).post || (prisma as any).Post;
    console.log(`[getPostBySlug] Searching for slug: "${slug}"`);
    const post = await postModel.findUnique({
      where: { slug },
      include: { category: true }
    })
    console.log(`[getPostBySlug] Result:`, post ? "Found" : "Not Found");
    return { success: true, data: post }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getPostById(id: string) {
  await checkAdmin()
  try {
    const postModel = (prisma as any).post || (prisma as any).Post;
    const post = await postModel.findUnique({
      where: { id },
      include: { category: true }
    })
    return { success: true, data: post }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createPost(data: any) {
  await checkAdmin()
  try {
    const postModel = (prisma as any).post || (prisma as any).Post;
    const post = await postModel.create({
      data: {
        ...data,
        slug: data.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }
    })
    revalidatePath('/admin/posts')
    revalidatePath('/articles')
    return { success: true, data: post }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updatePost(id: string, data: any) {
  await checkAdmin()
  try {
    const postModel = (prisma as any).post || (prisma as any).Post;
    const post = await postModel.update({
      where: { id },
      data: {
        ...data,
        slug: data.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }
    })
    revalidatePath('/admin/posts')
    revalidatePath(`/admin/posts/${id}/edit`)
    revalidatePath('/articles')
    revalidatePath(`/articles/${post.slug}`)
    return { success: true, data: post }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ... existing code ...
export async function deletePost(id: string) {
  await checkAdmin()
  try {
    const postModel = (prisma as any).post || (prisma as any).Post;
    await postModel.delete({
      where: { id }
    })
    revalidatePath('/admin/posts')
    revalidatePath('/articles')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getPreviousAndNextPosts(currentSlug: string) {
  try {
    const postModel = (prisma as any).post || (prisma as any).Post;
    
    // 1. Get current post
    const currentPost = await postModel.findUnique({
      where: { slug: currentSlug },
      select: { createdAt: true }
    });

    if (!currentPost) return { success: false, error: "Post not found" };

    // 2. Find previous post (newer date)
    let previousPost = await postModel.findFirst({
      where: { 
        published: true,
        createdAt: { gt: currentPost.createdAt }
      },
      orderBy: { createdAt: 'asc' },
      select: { title: true, slug: true }
    });

    // If no previous (it's the newest), wrap around to the oldest
    if (!previousPost) {
       previousPost = await postModel.findFirst({
        where: { published: true },
        orderBy: { createdAt: 'asc' }, // Oldest post
        select: { title: true, slug: true }
      });
    }

    // 3. Find next post (older date)
    let nextPost = await postModel.findFirst({
      where: { 
        published: true,
        createdAt: { lt: currentPost.createdAt }
      },
      orderBy: { createdAt: 'desc' },
      select: { title: true, slug: true }
    });

     // If no next (it's the oldest), wrap around to the newest
    if (!nextPost) {
      nextPost = await postModel.findFirst({
        where: { published: true },
        orderBy: { createdAt: 'desc' }, // Newest post
        select: { title: true, slug: true }
      });
    }

    return { success: true, data: { previous: previousPost, next: nextPost } };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
