const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categories = [
  {
    name: "大阿爾克那 (Major Arcana)",
    slug: "major-arcana",
    description: "象徵靈魂之旅與人生重大課題的 22 張主牌完整解析。",
  },
  {
    name: "小阿爾克那 (Minor Arcana)",
    slug: "minor-arcana",
    description: "涵蓋權杖、聖杯、寶劍與錢幣，反映日常生活細節的 56 張副牌。",
  },
  {
    name: "新手入門指南 (Beginner's Guide)",
    slug: "beginner-guide",
    description: "第一次接觸塔羅？從如何洗牌、抽牌到建立儀式感的完整教學。",
  },
  {
    name: "經典牌陣研究 (Tarot Spreads)",
    slug: "tarot-spreads",
    description: "從簡單的時間之流到凱爾特十字，各種實用牌陣的擺法與應用。",
  },
  {
    name: "解牌心法與秘訣 (Reading Secrets)",
    slug: "reading-secrets",
    description: "不只是背牌義！傳授直覺連結、元素生剋與讀牌邏輯的高階心法。",
  },
  {
    name: "實戰案例分析 (Case Studies)",
    slug: "case-studies",
    description: "透過真實的占卜案例，解析牌卡在實際問題中的對應與解答。",
  },
];

async function main() {
  console.log("正在為您建立塔羅分類...");

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });

    if (existing) {
      console.log(`分類已存在 (跳過): ${cat.name}`);
    } else {
      await prisma.category.create({
        data: cat,
      });
      console.log(`✅ 成功建立: ${cat.name}`);
    }
  }
  console.log("🎉 分類建置完成！請重新整理後台分類頁面。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
