/**
 * 聖愛塔羅 - 全站 30 篇文章標籤規範化與批量更新腳本
 * 
 * 執行方式:
 *   node scripts/update-all-post-tags.js
 */

const { PrismaClient } = require("@prisma/client");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

// 30 篇文章的高關聯度精確標籤對照表
const ARTICLE_TAG_UPDATES = [
  // 1. 魔術師
  {
    slug: "the-magician-guide",
    tags: ["大阿爾克那", "魔術師", "牌義解析", "創造力", "顯化法則"],
  },
  // 2. 女祭司
  {
    slug: "the-high-priestess-guide",
    tags: ["大阿爾克那", "女祭司", "牌義解析", "直覺引導", "潛意識"],
  },
  // 3. 皇后
  {
    slug: "the-empress-guide",
    tags: ["大阿爾克那", "皇后", "牌義解析", "豐盛孕育", "無條件的愛"],
  },
  // 4. 皇帝
  {
    slug: "the-emperor-guide",
    tags: ["大阿爾克那", "皇帝", "牌義解析", "權力領導", "秩序邊界"],
  },
  // 5. 戀人
  {
    slug: "the-lovers-guide",
    tags: ["大阿爾克那", "戀人", "牌義解析", "愛情占卜", "心靈契約"],
  },
  // 6. AI 塔羅
  {
    slug: "ai-tarot-vs-traditional",
    tags: ["AI塔羅", "占卜觀念", "靈性科技", "心法秘訣", "自我對話"],
  },
  // 7. 提問的藝術
  {
    slug: "art-of-asking-questions",
    tags: ["提問技巧", "新手教學", "精準占卜", "思維引導", "自我探索"],
  },
  // 8. 聖愛六芒星牌陣
  {
    slug: "love-hexagram-deep-dive",
    tags: ["聖愛六芒星", "牌陣教學", "愛情占卜", "關係全息圖", "深度解析"],
  },
  // 9. 擁抱陰影
  {
    slug: "embracing-shadow-cards",
    tags: ["陰影牌卡", "牌義解析", "心理建設", "靈性轉化", "死神與寶劍"],
  },
  // 10. 每日儀式感
  {
    slug: "daily-tarot-rituals",
    tags: ["每日占卜", "日常儀式", "生活靈感", "晨間冥想", "直覺鍛鍊"],
  },
  // 11. 他到底喜不喜歡我
  {
    slug: "does-he-like-me-5-tarot-cards",
    tags: ["曖昧心態", "愛情占卜", "心理投射", "心意透視", "牌義解析"],
  },
  // 12. 該放手還是繼續等
  {
    slug: "let-go-or-wait-toxic-relationship",
    tags: ["感情挽回", "情感內耗", "斷捨離", "案例復盤", "及時止損"],
  },
  // 13. 抽到愚人是真愛還是玩玩
  {
    slug: "the-fool-true-love-or-player",
    tags: ["浪子心理", "海王特徵", "感情避坑", "牌義解析", "兩性博弈"],
  },
  // 14. 鏡像關係
  {
    slug: "mirror-relationship-tarot-blind-spots",
    tags: ["親密關係", "鏡像投射", "心理學", "盲點覺察", "自我療癒"],
  },
  // 15. 塔羅新手如何挑選第一副牌
  {
    slug: "how-to-choose-first-tarot-deck",
    tags: ["選牌指南", "萊德偉特", "新手教學", "自學塔羅", "牌卡系統"],
  },
  // 16. 初學者最常犯的 5 大迷思
  {
    slug: "5-common-tarot-myths-debunked",
    tags: ["破除迷信", "新手教學", "能量心理", "占卜觀念", "科學視角"],
  },
  // 17. 掌握數字學＋四元素
  {
    slug: "master-78-cards-numerology-elements",
    tags: ["四元素", "數字學", "小阿爾克那", "速記技巧", "進階解牌"],
  },
  // 18. 時間之流牌陣
  {
    slug: "three-card-spread-past-present-future",
    tags: ["時間之流", "三張牌陣", "牌陣教學", "實戰解牌", "高頻實用"],
  },
  // 19. 愚人 Major Arcana
  {
    slug: "the-fool-major-arcana-guide",
    tags: ["大阿爾克那", "愚人", "牌義解析", "歸零勇氣", "冒險精神"],
  },
  // 20. 戰車 Major Arcana
  {
    slug: "the-chariot-major-arcana-guide",
    tags: ["大阿爾克那", "戰車", "牌義解析", "自我掌控", "意志力"],
  },
  // 21. 斷聯期他在想什麼
  {
    slug: "no-contact-what-is-he-thinking-tarot",
    tags: ["斷聯心態", "復聯時機", "冷戰心理", "愛情解答", "對方心理"],
  },
  // 22. 前任還會主動聯絡我嗎
  {
    slug: "will-my-ex-contact-me-reconciliation-tarot",
    tags: ["復合機率", "前任聯絡", "舊情復燃", "案例復盤", "愛情解答"],
  },
  // 23. 他的心裡只有我嗎
  {
    slug: "is-there-someone-else-third-party-tarot",
    tags: ["第三者徵兆", "感情背叛", "曖昧辨析", "愛情解答", "心法秘訣"],
  },
  // 24. 他是我的正緣嗎
  {
    slug: "is-he-my-soulmate-or-karmic-lesson",
    tags: ["正緣命定", "靈魂伴侶", "業力關係", "愛情解答", "神聖連結"],
  },
  // 25. 他為什麼突然對我冷淡
  {
    slug: "why-is-he-acting-cold-suddenly-tarot",
    tags: ["男人冷淡", "洞穴期", "情感心理", "兩性溝通", "案例復盤"],
  },
  // 26. 我們會走到最後嗎
  {
    slug: "will-we-last-long-term-love-future",
    tags: ["走向婚姻", "長久感情", "牌陣檢核", "未來預測", "關係基石"],
  },
  // 27. 沒有說出口的再見
  {
    slug: "closure-without-goodbye-spiritual-meaning",
    tags: ["無疾而終", "斷捨離", "自我療癒", "靈性心法", "內在和解"],
  },
  // 28. 我什麼時候能脫單
  {
    slug: "when-will-i-find-love-singles-tarot",
    tags: ["脫單預測", "桃花運勢", "單身必讀", "牌陣分析", "吸引力法則"],
  },
  // 29. 如何讓他主動奔向你
  {
    slug: "how-to-attract-him-queen-energy-tarot",
    tags: ["高能量女王", "吸引力法則", "兩性博弈", "高價值女人", "心法秘訣"],
  },
  // 30. 從瀕臨分手到甜蜜升溫
  {
    slug: "hexagram-saved-relationship-real-case",
    tags: ["聖愛六芒星", "真實案例", "關係修復", "實戰解牌", "愛情解答"],
  },
];

async function main() {
  console.log("\n🏷️ 開始為全站 30 篇文章更新標準化合適標籤...\n");

  const allUniqueTags = new Set();
  let updatedCount = 0;

  for (const item of ARTICLE_TAG_UPDATES) {
    const post = await prisma.post.findUnique({
      where: { slug: item.slug },
      select: { id: true, title: true, tags: true },
    });

    if (!post) {
      console.warn(`⚠️ 找不到文章: ${item.slug}`);
      continue;
    }

    await prisma.post.update({
      where: { id: post.id },
      data: {
        tags: item.tags,
        updatedAt: new Date(),
      },
    });

    item.tags.forEach((t) => allUniqueTags.add(t));
    updatedCount++;
    console.log(`[${updatedCount}/30] ✅ 更新標籤: ${post.title}`);
    console.log(`   🏷️  新標籤: ${item.tags.join("、")}`);
  }

  console.log(`\n📦 同步更新 Tag 系統資料表 (${allUniqueTags.size} 個標籤)...`);
  for (const tagName of allUniqueTags) {
    const tagSlug = encodeURIComponent(tagName).toLowerCase();
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        slug: tagSlug,
      },
    });
  }

  console.log(`\n🎉 全部 30 篇文章標籤更新完畢！共建立了 ${allUniqueTags.size} 個唯一標籤。`);
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error("❌ 更新失敗:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { ARTICLE_TAG_UPDATES };

