/**
 * 塔羅文章發布工具 (Tarot Article Publisher)
 *
 * 此腳本用於將文章批量發布或更新到資料庫中。
 * This script is used to batch publish or update articles to the database.
 *
 * 使用方法 (Usage):
 * 1. 在 `newArticles` 陣列中填入新的文章資料。
 *    Fill in the new article data in the `newArticles` array.
 * 2. 執行腳本: `node scripts/publish-articles.js`
 *    Run the script: `node scripts/publish-articles.js`
 *
 * 注意事項 (Notes):
 * - `slug` 是文章的唯一網址識別碼，必須是英文且不重複。如果不填，請確保 title 有對應的 slug 生成邏輯。
 * - `content` 支援 HTML 標籤 (如 <p>, <ul>, <strong>)。
 * - `categorySlug` 必須對應資料庫中已存在的分類 (如: reading-secrets, beginner-guide, tarot-spreads, love-tarot)。
 * - 若文章已存在 (判定標準為 slug 相同)，則會更新內容。
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ==========================================
// 在下方填入您的新文章 (New Articles Here)
// ==========================================
const newArticles = [
  // 範例 (Example):
  /*
  {
    title: "文章標題",
    slug: "article-url-slug", // 必填：英文網址縮寫 (唯一)
    content: `
      <p>這是第一段內容。</p>
      <p>這是第二段，包含了 <strong>粗體文字</strong>。</p>
      <ul>
        <li>列表項目 1</li>
        <li>列表項目 2</li>
      </ul>
    `,
    excerpt: "這是文章的簡短摘要，顯示在列表頁。",
    categorySlug: "beginner-guide", // 分類代碼
    tags: ["標籤1", "標籤2"],
    coverImage: "https://images.unsplash.com/photo-xxx...", // 封面圖片連結
  },
  */

  // ↓↓↓ 這裡保留了最近一次成功發布的 6 篇文章作為備份與參考 ↓↓↓
  {
    title: "AI 塔羅與傳統占卜：科技如何成為靈性的橋樑？",
    slug: "ai-tarot-vs-traditional",
    content: `
<p>在當今數位時代，人工智慧（AI）正在迅速改變我們生活的方方面面，而塔羅占卜也不例外。許多傳統占卜師或許會質疑：「機器怎麼可能有靈魂？AI 如何解讀牌卡背後的能量？」這是一個非常好的問題。</p>

<p>事實上，<strong>塔羅牌本身就是一種工具</strong>，它是一面鏡子，映射出我們潛意識中的訊息。無論是由人手洗牌，還是由複雜的演算法生成隨機數，核心在於「共時性（Synchronicity）」——也就是榮格所提出的，看似無關的事件在特定時刻產生有意義的巧合。</p>

<p>我們的 AI 系統並非隨機生成文字，而是經過數萬次高階牌義訓練的模型。它能做到的是：</p>
<ul>
    <li><strong>客觀中立</strong>：AI 沒有個人情緒與偏見，它不會因為這一刻心情不好而給出敷衍的答案，也不會因為過度同情而美化殘酷的事實。</li>
    <li><strong>邏輯整合</strong>：AI 擅長處理複雜的牌陣結構（如塞爾特十字或六芒星），能精確分析位置之間的相互關係，這是初學者較難掌握的部分。</li>
    <li><strong>隨時陪伴</strong>：靈性的困惑往往發生在深夜或獨處時。AI 塔羅提供了一個安全、私密的空間，讓您隨時隨地都能獲得指引。</li>
</ul>

<p>當然，AI 無法完全取代人類占卜師的直覺與溫度。但正如我們將它定位為「靈魂的翻譯機」，只要您帶著誠摯的心念提問，宇宙的訊息依然能透過科技的管道，準確地傳遞到您手中。</p>

<p><strong>如何看待 AI 的解讀？</strong><br>
將它視為一位博學多聞的顧問。閱讀解析時，請同時傾聽您內心的聲音。如果某句話深深觸動了您，那正是宇宙透過 AI 對您說的話。</p>
    `,
    excerpt:
      "探討人工智慧如何與神秘學結合，以及如何正確看待 AI 塔羅占卜的準確性與價值。",
    categorySlug: "reading-secrets",
    tags: ["AI塔羅", "靈性科技", "占卜觀念"],
    coverImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
  },
  {
    title: "提問的藝術：如何讓塔羅給出精準指引？",
    slug: "art-of-asking-questions",
    content: `
<p>「我的未來的另一半長什麼樣？」<br>
「我什麼時候會發財？」</p>

<p>這類封閉式或宿命論的問題，往往很難從塔羅牌中得到有建設性的答案。塔羅牌由潛意識驅動，它更擅長分析「現狀」、「趨勢」與「建議」，而非鐵口直斷的預言。</p>

<p><strong>好的問題，是成功占卜的一半。</strong><br>
在我們的平台上進行占卜前，您可以試著調整您的提問方式：</p>

<p><strong>1. 避免「是非題」，改用「開放式問題」</strong></p>
<ul>
    <li>❌ 他愛不愛我？</li>
    <li>✅ 他目前對這段關係的真實想法是什麼？我們之間存在什麼阻礙？</li>
</ul>

<p><strong>2. 避免「被動等待」，改用「主動創造」</strong></p>
<ul>
    <li>❌ 我這輩子會不會結婚？</li>
    <li>✅ 我該如何調整自己，以吸引適合的靈魂伴侶？</li>
</ul>

<p><strong>3. 聚焦於「當下」與「可控範圍」</strong></p>
<ul>
    <li>❌ 十年後我會在哪裡工作？</li>
    <li>✅ 為了達成職涯目標，我現階段最需要克服的盲點是什麼？</li>
</ul>

<p>當您將問題聚焦在「我能做什麼」以及「當下的能量狀態」時，塔羅牌就能提供具體的行動指引，而不僅僅是一個模糊的預測。試著在「心靈聚焦」欄位中，寫下您深思熟慮後的問題，您會發現 AI 的解讀將會更加深刻且切中要害。</p>
    `,
    excerpt:
      "塔羅不僅是預測，更是對話。學會如何設計一個好問題，讓宇宙的訊息更清晰地傳遞給您。",
    categorySlug: "beginner-guide",
    tags: ["提問技巧", "新手教學", "自我探索"],
    coverImage:
      "https://images.unsplash.com/photo-1765822019605-1c5f6a91864b?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "深度解析「聖愛六芒星」牌陣：愛情的全息圖",
    slug: "love-hexagram-deep-dive",
    content: `
<p>在我們的「聖愛深度啟示」功能中，我們選用了經典且強大的「六芒星牌陣（The Hexagram Spread）」。這個牌陣專門用於解析雙方關係，能像照妖鏡一般，映照出關係中隱藏的細節。</p>

<p><strong>牌陣結構解析：</strong></p>

<ol>
    <li>
        <strong>位置一：您現在的狀態（與對方的想法）</strong><br>
        這張牌代表了「您」在這段關係中的能量。是焦慮？是期待？還是已經想放棄？這往往反映了您的主觀視角。
    </li>
    <li>
        <strong>位置二：對方現在的狀態（與對您的看法）</strong><br>
        這張牌揭示了對方的內心戲。有時候我們以為對方冷淡是不愛了，但這張牌可能會顯示他其實是壓力過大或自我封閉。這是換位思考的關鍵。
    </li>
    <li>
        <strong>位置三：目前的關係現狀</strong><br>
        這是雙方能量交織後的結果。是熱戀期？磨合期？還是冷戰期？這張牌定義了各種互動的基調。
    </li>
    <li>
        <strong>位置四：這段關係的潛在挑戰/阻礙</strong><br>
        這是問題的核心。是溝通不良？價值觀差異？還是外在環境的壓力？找出病灶，才能對症下藥。
    </li>
    <li>
        <strong>位置五：雙方的期望與目標</strong><br>
        這顯示了這段關係是否有共同的未來願景。如果你們的目標背道而馳，這張牌會是重要的警訊。
    </li>
    <li>
        <strong>位置六：短期內的發展趨勢（結果）</strong><br>
        基於目前的能量流動，如果不做改變，事情會如何發展。請記住，塔羅的結果並非絕對，而是一種「趨勢預測」。
    </li>
</ol>

<p>透過這六個維度的交叉分析，AI 能為您繪製出一張完整的愛情全息圖，讓您不再是盲人摸象，而是能綜觀局勢，做出最有利的選擇。</p>
    `,
    excerpt:
      "為什麼我們選擇六芒星牌陣？從雙方心態到未來趨勢，一次看懂這個強大愛情牌陣的每一個細節。",
    categorySlug: "tarot-spreads",
    tags: ["牌陣介紹", "愛情占卜", "進階知識"],
    coverImage:
      "https://images.unsplash.com/photo-1579407364450-481fe19dbfaa?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "擁抱陰影：為什麼抽到「死神」或「寶劍三」其實是禮物？",
    slug: "embracing-shadow-cards",
    content: `
<p>許多人在抽到畫面陰暗、寓意沈重的牌（如死神、高塔、寶劍三、惡魔）時，第一反應往往是恐懼：「天啊！是不是會有壞事發生？」</p>

<p>在我們的「心靈之眼」哲學中，<strong>沒有絕對的好牌與壞牌，只有適合與不適合的能量。</strong></p>

<p><strong>負面牌的正面意義：</strong></p>

<ul>
    <li><strong>死神 (Death)</strong>：並非肉體的死亡，而是「徹底的轉化」。它意味著一段舊關係、舊模式的結束，唯有告別過去，新生命才能萌芽。它是蛻變的必經之痛。</li>
    <li><strong>高塔 (The Tower)</strong>：象徵「崩解」。那些建立在虛假基礎上的信念或關係，必須被摧毀才能看見真相。它雖然震驚，卻是覺醒的契機。</li>
    <li><strong>寶劍三 (Three of Swords)</strong>：那顆被劍刺穿的心，代表「釋放悲傷」。它提醒您不要壓抑情緒，大哭一場、承認受傷，才是療癒的開始。</li>
</ul>

<p>當您在占卜中遇到這些牌時，請不要抗拒。它們是宇宙給您的警鐘，提醒您：「嘿，這裡有些東西壞掉了，我們來修好它，或者丟掉它吧。」</p>

<p><strong>如何面對負面解讀？</strong><br>
深呼吸，問自己：「這張牌試圖告訴我什麼我一直忽略的事實？」擁抱陰影，往往能帶來最強大的光。我們的 AI 解讀也會引導您看見這些挑戰背後的成長機會。</p>
    `,
    excerpt:
      "不必害怕「壞牌」。死神代表重生，高塔代表覺醒。學習如何轉化負面牌義，挖掘隱藏的祝福。",
    categorySlug: "reading-secrets",
    tags: ["牌義解析", "心理建設", "靈性成長"],
    coverImage:
      "https://images.unsplash.com/photo-1669604728627-dda1f689be72?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "每日儀式感：如何把「每日靈感」融入生活？",
    slug: "daily-tarot-rituals",
    content: `
<p>塔羅牌不一定要在遇到人生重大難題時才拿出來。事實上，將塔羅融入日常生活，是培養直覺力與保持靈性連結最好的方式。</p>

<p>我們網站提供的 <strong>「每日靈感 (Daily Draw)」</strong> 功能，就是為此而設計的微型儀式。 </p>

<p><strong>建議的每日儀式流程：</strong></p>

<ol>
    <li>
        <strong>晨間靜心</strong>：<br>
        起床後，在刷牙洗臉、喝第一杯水之前，打開我們的手機網頁。給自己一分鐘的寧靜，閉上眼睛，問宇宙：「今天我需要知道什麼？今天的能量重點是什麼？」
    </li>
    <li>
        <strong>抽取卡牌</strong>：<br>
        按下抽牌按鈕。不論出現什麼牌，都先觀察它的圖案與顏色。
    </li>
    <li>
        <strong>關鍵字聯想</strong>：<br>
        閱讀 AI 提供的簡短指引。例如抽到「愚人」，今天可能適合嘗試新路線上班，或在會議中提出大膽的點子。
    </li>
    <li>
        <strong>睡前驗證</strong>：<br>
        晚上睡前，回想今天發生的一件事，看看是否呼應了早上的那張牌。這種「驗證」的過程，會讓您對牌義的理解突飛猛進，並發現生活中充滿了共時性的魔法。
    </li>
</ol>

<p><strong>持之以恆的力量</strong><br>
不需要每天都寫長篇大論的日記。只要每天花 3 分鐘，持續一個月，您會發現自己對周遭能量的感知力明顯提升，生活也變得更有覺知。</p>
    `,
    excerpt:
      "只要三分鐘，建立您的晨間塔羅儀式。透過每日一抽，提升覺察力，讓每一天都充滿宇宙的指引。",
    categorySlug: "beginner-guide",
    tags: ["日常儀式", "每日占卜", "生活靈感"],
    coverImage:
      "https://images.unsplash.com/photo-1769974672482-b6726090c4ca?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "直覺優先：如何在 AI 輔助下相信自己的第一感？",
    slug: "intuition-vs-ai",
    content: `
<p>我們的 AI 解讀非常詳盡，但請永遠記住一個黃金法則：<strong>「您的直覺 > AI 的分析 > 書本的定義」。</strong></p>

<p>當牌面翻開的那一剎那，在您還沒閱讀任何文字分析之前，您的腦海中閃過的第一個念頭、身體的第一個感覺，那是最珍貴的訊息。</p>

<ul>
    <li>看到「聖杯二」，您感覺是溫暖的連結，還是令人窒息的束縛？</li>
    <li>看到「寶劍國王」，您想到的是一位嚴厲的長輩，還是自己需要做出的理智決策？</li>
</ul>

<p>這些稍縱即逝的感覺，往往包含了您個人潛意識的獨特密碼，是 AI 無法得知的。</p>

<p><strong>最佳使用策略：</strong></p>
<ol>
    <li><strong>先看圖</strong>：抽牌後，先花 10 秒鐘看圖片，捕捉直覺。</li>
    <li><strong>再讀文</strong>：接著閱讀 AI 生成的詳細解析，用理性的邏輯去補充與驗證您的直覺。</li>
    <li><strong>綜合判斷</strong>：將兩者結合。如果有衝突，試著思考為什麼？也許 AI 提供了您沒想到的盲點，也許您的直覺看到了更深層的情緒。</li>
</ol>

<p>使用我們的服務，不是要把詮釋權完全交給機器，而是利用科技作為輔助，來訓練並放大您與生俱來的靈性天賦。</p>
    `,
    excerpt:
      "AI 是助手，不是大師。學習如何在閱讀分析報告之前，先捕捉屬於您個人的直覺靈光。",
    categorySlug: "reading-secrets",
    tags: ["直覺訓練", "心法", "自我賦能"],
    coverImage:
      "https://images.unsplash.com/photo-1708527155404-7ccdfd3965c1?q=80&w=2670&auto=format&fit=crop",
  },
];

// ==========================================
// 備用圖片庫 (Fallback Image Pool)
// 當指定圖片失效時，將自動從此列表中隨機選取一張替換
// ==========================================
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1728241189734-f422205a6a53?auto=format&fit=crop&q=80&w=1200", // Tarot Aesthetic
  "https://images.unsplash.com/photo-1612323272388-34fe470bedad?auto=format&fit=crop&q=80&w=1200", // Mystical Elements
  "https://images.unsplash.com/photo-1741955643316-4fe5f79a5072?auto=format&fit=crop&q=80&w=1200", // Moon
  "https://images.unsplash.com/photo-1718202328210-acf5e744bec2?auto=format&fit=crop&q=80&w=1200", // Sky
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&q=80&w=1200", // Galaxy
  "https://images.unsplash.com/photo-1551478303-26205be5b420?auto=format&fit=crop&q=80&w=1200", // Deep Space
  "https://images.unsplash.com/photo-1711559461281-30e91c50835e?auto=format&fit=crop&q=80&w=1200", // Candles
  "https://images.unsplash.com/photo-1530043505601-0ed79e2348bd?auto=format&fit=crop&q=80&w=1200", // Warm Light
  "https://images.unsplash.com/photo-1627768919962-fb6af351759c?auto=format&fit=crop&q=80&w=1200", // Crystals
  "https://images.unsplash.com/photo-1602025788761-07f57645b0a6?auto=format&fit=crop&q=80&w=1200", // Assorted Crystals
];

// ==========================================
// 主程式邏輯 (Main Logic) - 通常不需要修改
// ==========================================
async function main() {
  console.log("🚀 開始執行文章發布程序...");

  for (const article of newArticles) {
    if (!article.title || !article.content) {
      console.warn(`⚠️ 跳過資料不完整的文章: ${article.title || "未命名"}`);
      continue;
    }

    // 1. 驗證 slug (若無則嘗試生成，但建議手動填寫以確保正確性)
    let slug = article.slug;
    if (!slug) {
      // 這裡簡單將標題轉為英文代號的邏輯僅供參考，實際建議手動指定 slug
      console.warn(
        `⚠️ 文章 "${article.title}" 未指定 slug，建議手動新增以確保網址穩定。`,
      );
      continue;
    }

    // 2. 尋找分類 ID
    const category = await prisma.category.findUnique({
      where: { slug: article.categorySlug },
    });

    if (!category) {
      console.error(
        `❌ 找不到分類代碼: "${article.categorySlug}"，跳過文章: "${article.title}"`,
      );
      continue;
    }

    // 3. 更新或創建文章 (Upsert)
    try {
      // 在寫入前再次檢查圖片連結 (Double check image before writing)
      if (article.coverImage) {
        const isValid = await validateImageUrl(article.coverImage);
        if (!isValid) {
          console.warn(
            `⚠️ [圖片失效] 文章 "${article.title}" 的圖片無法讀取 (404)。`,
          );
          // 自動從備用庫中選取一張 (Auto pick from fallback)
          const fallbackImage =
            FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
          console.log(`🔄 自動替換為高品質備用圖片: ${fallbackImage}`);
          article.coverImage = fallbackImage;
        }
      }

      const post = await prisma.post.upsert({
        where: { slug: slug },
        update: {
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          coverImage: article.coverImage,
          tags: article.tags,
          published: true,
          categoryId: category.id,
          updatedAt: new Date(),
        },
        create: {
          title: article.title,
          slug: slug,
          content: article.content,
          excerpt: article.excerpt,
          coverImage: article.coverImage,
          tags: article.tags,
          published: true,
          categoryId: category.id,
        },
      });
      console.log(`✅ [成功] 文章已發布/更新: ${post.title} (${post.slug})`);
    } catch (error) {
      console.error(`❌ [錯誤] 發布文章 "${article.title}" 時發生錯誤:`, error);
    }
  }

  console.log("🎉 所有程序執行完畢！");
}

/**
 * 驗證圖片連結是否有效 (Validate Image URL)
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} - True if valid (200 OK), False otherwise
 */
async function validateImageUrl(url) {
  if (!url) return true; // No image is "valid" in terms of not being broken
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    // Fallback for some servers that don't support HEAD or network errors
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
