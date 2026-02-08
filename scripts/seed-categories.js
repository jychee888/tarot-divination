const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categories = [
  {
    name: "大阿爾克那 (Major Arcana)",
    slug: "major-arcana",
    description:
      "塔羅牌中象徵人生重大階段與精神轉化的 22 張主牌，從 0 號愚者到 21 號世界。",
  },
  {
    name: "小阿爾克那 (Minor Arcana)",
    slug: "minor-arcana",
    description:
      "反映日常生活細節與具體事件的 56 張副牌，包含權杖、聖杯、寶劍與錢幣四個牌組。",
  },
  {
    name: "權杖組 (Wands)",
    slug: "suit-of-wands",
    description: "象徵火元素，與行動力、熱情、創造力及靈感有關的牌組。",
  },
  {
    name: "聖杯組 (Cups)",
    slug: "suit-of-cups",
    description: "象徵水元素，與情感、直覺、潛意識及人際關係有關的牌組。",
  },
  {
    name: "寶劍組 (Swords)",
    slug: "suit-of-swords",
    description: "象徵風元素，與理智、溝通、衝突及思想層面有關的牌組。",
  },
  {
    name: "錢幣組 (Pentacles)",
    slug: "suit-of-pentacles",
    description: "象徵土元素，與物質、財富、工作及實際成果有關的牌組。",
  },
  {
    name: "塔羅占卜教學 (Reading Guide)",
    slug: "reading-guide",
    description: "提供塔羅牌陣介紹、解牌技巧與直覺訓練的教學文章。",
  },
  {
    name: "心靈成長 (Spirituality)",
    slug: "spirituality",
    description: "關於自我探索、冥想與靈性提升的深度文章。",
  },
  {
    name: "最新消息 (News)",
    slug: "news",
    description: "網站公告、新功能發布與活動資訊。",
  },
];

async function main() {
  console.log("開始建立預設分類...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log(`已建立分類: ${cat.name}`);
  }

  console.log("所有分類建立完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
