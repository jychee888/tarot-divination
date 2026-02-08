import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

/**
 * 這是 Next.js 提供的動態 Sitemap 生成功能。
 * 它會在每次被請求時執行，這就是 SSR (Server Side Rendering) 的特性。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 從環境變數獲取網址，確保抓到的是最新的正確網域
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tarot-divination.zipffdigital.com'

  // 1. 定義您的主要公開靜態頁面
  const staticPages = [
    '',
    '/daily',
    '/divination',
    '/love-tarot',
    '/articles',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. 獲取所有已發布的文章
  // 使用 any 繞過類型檢查，確保能抓到 Post 模型
  const postModel = (prisma as any).post || (prisma as any).Post;
  
  let dynamicPages: MetadataRoute.Sitemap = [];
  
  try {
    const posts = await postModel.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    });

    dynamicPages = posts.map((post: any) => ({
      url: `${baseUrl}/articles/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch posts for sitemap:", error);
  }

  // 合併並回傳。Next.js 會自動將輸出的物件轉為標準的 sitemap.xml 格式。
  return [...staticPages, ...dynamicPages]
}
