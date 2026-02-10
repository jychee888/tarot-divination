import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tarot-divination.zipffdigital.com'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/articles/'],
      disallow: [
        '/admin/',
        '/api/',
        '/profile/',
        '/history/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
