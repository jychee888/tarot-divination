const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.upsert({
    where: { slug: "the-fool-introduction" },
    update: {},
    create: {
      title: "0. 愚者 (The Fool) - 開放與無限可能的靈魂旅程",
      slug: "the-fool-introduction",
      excerpt:
        "愚者（The Fool）是塔羅牌大阿爾克那中的第 0 張牌，象徵著新的開始、冒險的精神以及對未知的全然信任。",
      content: `
        <h2>0. 愚者 (The Fool)</h2>
        <p>愚者是塔羅旅程的起點，也是終點。這張牌代表著一個純真、無畏的靈魂，正站在懸崖邊準備邁出生命中的第一步。</p>
        
        <h3>關鍵字：</h3>
        <ul>
          <li><strong>正位：</strong>新開始、冒險、純真、勇氣、潛力、自由、信任宇宙。</li>
          <li><strong>逆位：</strong>魯莽、不負責任、猶豫、錯失良機、混亂、盲目冒險。</li>
        </ul>

        <h3>圖像象徵：</h3>
        <p>在大多數的塔羅牌面中，我們可以看到一名年輕人揹著小包袱，毫不在意地望向天空，腳步邁向懸崖。這象徵著他並不被物質世界的恐懼所束縛，而是追隨內心的直覺。他手中的白玫瑰代表純潔的心靈，而跟隨在後的小狗則代表忠誠與本能的守護。</p>
        
        <h3>給您的指引：</h3>
        <p>當愚者出現時，這是一個信號，告訴您現在是放下過往負擔、勇敢嘗試新事物的時機。不要害怕別人的眼光，也不要過度分析風險。有時候，最偉大的智慧就是擁有一顆像孩子般好奇的心。</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?q=80&w=2070&auto=format&fit=crop",
      category: "Tarot Cards",
      tags: ["大阿爾克那", "愚者", "教學"],
      published: true, // 為了示範，先設為 True
    },
  });

  console.log("已創建示範文章:", post.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
