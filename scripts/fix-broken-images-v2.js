const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 這些是使用者回報失效的圖片對應的文章 Slug
// 我們將換上一批全新的、穩定的高品質圖片
const fixes = [
  // 1. 魔術師 (The Magician) -> 魔法、星雲、創造
  {
    slug: "the-magician-guide",
    coverImage:
      "https://images.unsplash.com/photo-1531654639908-2510255c2763?auto=format&fit=crop&q=80&w=2070",
  },
  // 2. 教皇 (The Hierophant) -> 信仰、書籍、智慧、光
  {
    slug: "the-hierophant-guide",
    coverImage:
      "https://images.unsplash.com/photo-1490555366472-f1d39b83b3de?auto=format&fit=crop&q=80&w=2070",
  },
  // 3. 寶劍一 (Ace of Swords) -> 突破、金屬光澤、幾何
  {
    slug: "ace-of-swords-guide",
    coverImage:
      "https://images.unsplash.com/photo-1535581652167-3d6b98c5f247?auto=format&fit=crop&q=80&w=2070",
  },
  // 4. 初次抽牌 (First Tarot Reading) -> 手持牌卡
  {
    slug: "first-tarot-reading-tutorial",
    coverImage:
      "https://images.unsplash.com/photo-1572295629165-24c8b7470f59?auto=format&fit=crop&q=80&w=2070",
  },
  // 5. 每日一抽 (Daily Draw) -> 書寫、日記、靜心
  {
    slug: "daily-draw-practice",
    coverImage:
      "https://images.unsplash.com/photo-1484503793037-5c9644d6a792?auto=format&fit=crop&q=80&w=2070",
  },
  // 6. 三張牌陣 (Three Card Spread) -> 牌陣排列
  {
    slug: "three-card-spread-guide",
    coverImage:
      "https://images.unsplash.com/photo-1630472403607-427909c279c0?auto=format&fit=crop&q=80&w=2070",
  },
];

async function main() {
  console.log("正在精準修復失效的 6 張配圖...");

  for (const fix of fixes) {
    const post = await prisma.post.findUnique({
      where: { slug: fix.slug },
    });

    if (post) {
      await prisma.post.update({
        where: { slug: fix.slug },
        data: { coverImage: fix.coverImage },
      });
      console.log(`✅ 已更換新圖: ${post.title}`);
    } else {
      console.warn(`⚠️ 找不到文章: ${fix.slug}`);
    }
  }

  console.log("🎉 修復完成！已確保其他正常的圖片不動，只更新這 6 張。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
