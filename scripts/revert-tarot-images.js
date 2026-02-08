const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 這是最初 seed 腳本中使用的有效 ID 列表，這些圖片是經過驗證可以顯示的。
// 我們將恢復這些圖片，並確保它們帶有正確的參數。
const originalValidImages = [
  // --- 大阿爾克那 ---
  {
    slug: "the-magician-guide",
    // 原始：行動、手、光芒 (Unsplash: 1596706062103-3a6d71f78082)
    coverImage:
      "https://images.unsplash.com/photo-1596706062103-3a6d71f78082?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-high-priestess-guide",
    // 原始：月亮、神秘氛圍 (Unsplash: 1534068590799-09895a701e3e)
    coverImage:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-empress-guide",
    // 原始：自然、麥田、豐收 (Unsplash: 1518173946687-a4c8892bbd9f)
    coverImage:
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-emperor-guide",
    // 原始：結構、岩石、穩定 (Unsplash: 1541963463532-d68292c34b19)
    coverImage:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-hierophant-guide",
    // 原始：傳統、教堂、光影 (Unsplash: 1519681393798-3828fb4090bb)
    coverImage:
      "https://images.unsplash.com/photo-1519681393798-3828fb4090bb?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-lovers-guide",
    // 原始：手部特寫、連結 (Unsplash: 1516589178581-6cd7833ae3b2)
    coverImage:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=2070",
  },

  // --- 小阿爾克那 ---
  {
    slug: "ace-of-swords-guide",
    // 原始：雲、光 (Unsplash: 1598556885312-e5659850559e)
    coverImage:
      "https://images.unsplash.com/photo-1598556885312-e5659850559e?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "two-of-cups-guide",
    // 原始：乾杯、聚會 (Unsplash: 1518199266791-5375a83190b7)
    coverImage:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "eight-of-wands-guide",
    // 原始：飛鳥、速度 (Unsplash: 1500462918059-b1a0cb512f1d)
    coverImage:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "ten-of-pentacles-guide",
    // 原始：家庭、庭院 (Unsplash: 1629196914375-f7e48f477b6d)
    coverImage:
      "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=2070",
  },

  // --- 教學文章 ---
  {
    slug: "first-tarot-reading-tutorial",
    // 原始：手持塔羅牌 (Unsplash: 1632517594917-1941c5304620)
    coverImage:
      "https://images.unsplash.com/photo-1632517594917-1941c5304620?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "daily-draw-practice",
    // 原始：日記、咖啡 (Unsplash: 1507415492521-937f102798f0)
    coverImage:
      "https://images.unsplash.com/photo-1507415492521-937f102798f0?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "three-card-spread-guide",
    // 原始：三張牌 (Unsplash: 1519543886566-68b3d6872594)
    coverImage:
      "https://images.unsplash.com/photo-1519543886566-68b3d6872594?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "two-paths-spread",
    // 原始：岔路、選擇 (Unsplash: 1549313861-33587f3d2956)
    coverImage:
      "https://images.unsplash.com/photo-1549313861-33587f3d2956?auto=format&fit=crop&q=80&w=2070",
  },
];

async function main() {
  console.log("正在修復圖片連結，恢復至已知有效的氛圍配圖...");

  let updatedCount = 0;

  for (const update of originalValidImages) {
    const post = await prisma.post.findUnique({
      where: { slug: update.slug },
    });

    if (post) {
      await prisma.post.update({
        where: { slug: update.slug },
        data: { coverImage: update.coverImage },
      });
      console.log(`✅ 已修復配圖: ${post.title}`);
      updatedCount++;
    } else {
      console.warn(`⚠️ 找不到文章 slug: ${update.slug}，略過。`);
    }
  }

  console.log(`🎉 修復完成！共恢復了 ${updatedCount} 篇文章的配圖。`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
