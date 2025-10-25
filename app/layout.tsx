import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: '心靈之眼 | 塔羅牌占卜 - Soul\'s Eye Tarot',
    template: '%s | 心靈之眼 - Soul\'s Eye Tarot',
  },
  description: '開啟你的內在智慧，讓塔羅牌指引你找到生命的答案。專業塔羅牌占卜，探索未知的未來與內在自我。',
  keywords: ['塔羅牌', '占卜', '心靈之眼', 'Soul\'s Eye', '塔羅占卜', '心靈成長', 'tarot', 'divination'],
  generator: 'Next.js',
  applicationName: '心靈之眼 - Soul\'s Eye Tarot',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '心靈之眼 | 塔羅牌占卜 - Soul\'s Eye Tarot',
    description: '開啟你的內在智慧，讓塔羅牌指引你找到生命的答案。',
    type: 'website',
    locale: 'zh_TW',
    url: 'https://your-website-url.com',
    siteName: '心靈之眼 - Soul\'s Eye',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '心靈之眼 - Soul\'s Eye Tarot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '心靈之眼 | 塔羅牌占卜 - Soul\'s Eye Tarot',
    description: '開啟你的內在智慧，讓塔羅牌指引你找到生命的答案。',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://your-website-url.com',
  },
};

export const viewport: Viewport = {
  themeColor: '#171111',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-[rgb(23,17,17)] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
