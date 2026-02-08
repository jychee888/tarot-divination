import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { prisma } from "@/lib/prisma";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Helper to fetch settings
async function getSettings() {
  try {
    const systemSettingModel =
      (prisma as any).systemSetting ||
      (prisma as any).systemSettings ||
      (prisma as any).SystemSetting ||
      (prisma as any).SystemSettings;

    if (!systemSettingModel) return {};

    const settings = await systemSettingModel.findMany();
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
    settings.site_title ||
    "心靈之眼 Soul's Eye | AI 塔羅占卜 - 洞悉命運的靈魂之窗";
  const description =
    settings.site_description ||
    "結合先端 AI 靈性導師與古老塔羅牌義，為您的愛情、事業與生活提供最深度的啟示。";
  const keywords = settings.site_keywords
    ? settings.site_keywords.split(",").map((k: string) => k.trim())
    : ["塔羅牌", "占卜", "心靈之眼", "Soul's Eye", "AI 塔羅"];

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    metadataBase: new URL("https://your-domain.com"), // 建議在後台設定
    alternates: {
      canonical: "/",
    },
    generator: "Next.js",
    applicationName: "心靈之眼 Soul's Eye",
    referrer: "origin-when-cross-origin",
    openGraph: {
      title,
      description,
      type: "website",
      locale: "zh_TW",
      siteName: "心靈之眼 Soul's Eye",
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
