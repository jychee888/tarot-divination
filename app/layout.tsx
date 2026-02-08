import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { prisma } from "@/lib/prisma";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Helper to fetch settings
async function getSettings() {
  try {
    const settings = await (prisma as any).systemSettings.findMany();
    return settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  } catch (error) {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const title =
    settings.site_title || "心靈之眼 | 塔羅牌占卜 - Soul's Eye Tarot";
  const description =
    settings.site_description ||
    "開啟你的內在智慧，讓塔羅牌指引你找到生命的答案。";
  const keywords = settings.site_keywords
    ? settings.site_keywords.split(",").map((k: string) => k.trim())
    : ["塔羅牌", "占卜", "心靈之眼"];

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    generator: "Next.js",
    applicationName: title,
    referrer: "origin-when-cross-origin",
    openGraph: {
      title,
      description,
      type: "website",
      locale: "zh_TW",
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#171111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body className="min-h-screen bg-[#171111] text-white">
        {/* Inject Google Analytics if ID is present */}
        {settings.ga_id && <GoogleAnalytics gaId={settings.ga_id} />}

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
