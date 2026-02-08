import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // 建議在 .env 中設定 SITE_URL，例如 https://souls-eye.com
  const baseUrl = process.env.NEXTAUTH_URL || 'https://your-domain.com'
  
  // 公開頁面清單
  const routes = [
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

  return routes
}
