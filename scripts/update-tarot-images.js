const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const imageUpdates = [
  // --- 大阿爾克那 (Rider-Waite-Smith) ---
  {
    slug: "the-magician-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  },
  {
    slug: "the-high-priestess-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  },
  {
    slug: "the-empress-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
  },
  {
    slug: "the-emperor-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  },
  {
    slug: "the-hierophant-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  },
  {
    slug: "the-lovers-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg",
  },

  // --- 小阿爾克那 ---
  {
    slug: "ace-of-swords-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/Swords01.jpg",
  },
  {
    slug: "two-of-cups-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Cups02.jpg",
  },
  {
    slug: "eight-of-wands-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wands08.jpg",
  },
  {
    slug: "ten-of-pentacles-guide",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Pents10.jpg",
  },

  // --- 教學文章 (更具體的 Unsplash 圖片) ---
  {
    slug: "first-tarot-reading-tutorial",
    // 手拿塔羅牌，第一人稱視角
    coverImage:
      "https://images.unsplash.com/photo-1630343710506-89f8b9f21d31?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "daily-draw-practice",
    // 晨間、咖啡、一張牌
    coverImage:
      "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "three-card-spread-guide",
    // 三張牌排列
    coverImage:
      "https://images.unsplash.com/photo-1632517594917-1941c5304620?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "two-paths-spread",
    // 兩條路或選擇的意象
    coverImage:
      "https://images.unsplash.com/photo-1505569127510-bde15360d7f6?auto=format&fit=crop&q=80&w=2070",
  },
];

async function main() {
  console.log("正在更新文章配圖為更精準的版本...");

  let updatedCount = 0;

  for (const update of imageUpdates) {
    // 檢查文章是否存在
    const post = await prisma.post.findUnique({
      where: { slug: update.slug },
    });

    if (post) {
      await prisma.post.update({
        where: { slug: update.slug },
        data: { coverImage: update.coverImage },
      });
      console.log(`✅ 已更新配圖: ${post.title}`);
      updatedCount++;
    } else {
      console.warn(`⚠️ 找不到文章 slug: ${update.slug}，略過。`);
    }
  }

  console.log(`🎉 完成！共更新了 ${updatedCount} 篇文章的配圖。`);
  console.log("注意：部分圖片可能因為連結有效性而需要重新整理瀏覽器快取。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
