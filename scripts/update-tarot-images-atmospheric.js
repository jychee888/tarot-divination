const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const imageUpdates = [
  // --- 大阿爾克那 (使用高質感氛圍與意象圖) ---
  {
    slug: "the-magician-guide",
    // 意象：魔法、煉金術、神秘的光芒、創造
    coverImage:
      "https://images.unsplash.com/photo-1598556885312-e5659850559e?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-high-priestess-guide",
    // 意象：月亮、神秘女性、黑夜、直覺
    coverImage:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-empress-guide",
    // 意象：大自然、豐收、麥田、溫暖陽光
    coverImage:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-emperor-guide",
    // 意象：宏偉建築、王座、權力結構、冷色調
    coverImage:
      "https://images.unsplash.com/photo-1590059390047-6058f27fb120?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-hierophant-guide",
    // 意象：教堂光影、神聖空間、信仰、書籍
    coverImage:
      "https://images.unsplash.com/photo-1548625361-ec8fdea59502?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "the-lovers-guide",
    // 意象：兩隻手交握、親密關係、溫暖色調
    coverImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2070",
  },

  // --- 小阿爾克那 ---
  {
    slug: "ace-of-swords-guide",
    // 意象：鋒利的物品、清晰的光線、突破迷霧
    coverImage:
      "https://images.unsplash.com/photo-1592652426687-a29272895690?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "two-of-cups-guide",
    // 意象：乾杯、連結、浪漫晚餐、情感交流
    coverImage:
      "https://images.unsplash.com/photo-1516905041604-7935af78f572?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "eight-of-wands-guide",
    // 意象：流星、動態模糊、速度感、光軌
    coverImage:
      "https://images.unsplash.com/photo-1496347312944-933391d3ddbf?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "ten-of-pentacles-guide",
    // 意象：金幣、家族聚會、豪華宅邸、傳承
    coverImage:
      "https://images.unsplash.com/photo-1565514020176-db7d47f97805?auto=format&fit=crop&q=80&w=2070",
  },

  // --- 教學文章 (維持高質感氛圍) ---
  {
    slug: "first-tarot-reading-tutorial",
    // 手拿塔羅牌，神秘氛圍
    coverImage:
      "https://images.unsplash.com/photo-1630343710506-89f8b9f21d31?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "daily-draw-practice",
    // 晨間、日記、靜心
    coverImage:
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "three-card-spread-guide",
    // 三張牌排列
    coverImage:
      "https://images.unsplash.com/photo-1519543886566-68b3d6872594?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "two-paths-spread",
    // 岔路、選擇
    coverImage:
      "https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&q=80&w=2070",
  },
];

async function main() {
  console.log("正在將文章配圖更新為「高質感氛圍情境圖」...");

  let updatedCount = 0;

  for (const update of imageUpdates) {
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

  console.log(`🎉 更新完成！共處理了 ${updatedCount} 篇文章。`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
