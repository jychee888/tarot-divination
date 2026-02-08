const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 改用 Pexels 圖庫，穩定性較高，且同樣擁有高質感的情境圖
const pexelsImages = [
  // 1. 魔術師 (The Magician) - 神秘、星空、能量
  {
    slug: "the-magician-guide",
    coverImage:
      "https://images.pexels.com/photos/1010519/pexels-photo-1010519.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  // 2. 教皇 (The Hierophant) - 古老書籍、智慧、光影
  {
    slug: "the-hierophant-guide",
    coverImage:
      "https://images.pexels.com/photos/415571/pexels-photo-415571.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  // 3. 寶劍一 (Ace of Swords) - 雲霧中的光芒、突破
  {
    slug: "ace-of-swords-guide",
    coverImage:
      "https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  // 4. 初次抽牌 (First Tarot Reading) - 專注的占卜情境
  {
    slug: "first-tarot-reading-tutorial",
    coverImage:
      "https://images.pexels.com/photos/4022097/pexels-photo-4022097.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  // 5. 每日一抽 (Daily Draw) - 寫日記、靜心時光
  {
    slug: "daily-draw-practice",
    coverImage:
      "https://images.pexels.com/photos/6633605/pexels-photo-6633605.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  // 6. 三張牌陣 (Three Card Spread) - 牌卡排列展示
  {
    slug: "three-card-spread-guide",
    coverImage:
      "https://images.pexels.com/photos/4245009/pexels-photo-4245009.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

async function main() {
  console.log("正在切換圖源至 Pexels (更穩定、高質感)...");

  for (const item of pexelsImages) {
    const post = await prisma.post.findUnique({
      where: { slug: item.slug },
    });

    if (post) {
      await prisma.post.update({
        where: { slug: item.slug },
        data: { coverImage: item.coverImage },
      });
      console.log(`✅ [Pexels] 已更新: ${post.title}`);
    } else {
      console.warn(`⚠️ 找不到文章: ${item.slug}`);
    }
  }

  console.log("🎉 所有失效圖片已替換為 Pexels 穩定圖源！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
