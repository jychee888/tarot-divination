import { MetadataRoute } from 'next'

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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. 如果您未來有動態內容（例如：公開的占卜分析文章或部落格）
  // 您可以在這裡直接用 Prisma 抓取數據
  /*
  const publicRecords = await prisma.divinationRecord.findMany({
    where: { isPublic: true }, // 假設您有這個欄位
    select: { id: true, updatedAt: true }
  })
  
  const dynamicPages = publicRecords.map((record) => ({
    url: `${baseUrl}/reading/${record.id}`,
    lastModified: record.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))
  */

  // 合併並回傳。Next.js 會自動將輸出的物件轉為標準的 sitemap.xml 格式。
  return [...staticPages]
}
