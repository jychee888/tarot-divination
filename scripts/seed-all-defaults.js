/**
 * 聖愛塔羅 - 全站預設資料注入腳本 (Seed All Defaults Script)
 * 
 * 執行方式:
 *   npm run db:seed
 *   或 node scripts/seed-all-defaults.js
 * 
 * 功能:
 *   將 10 大標準分類、精選牌義與教學文章、系統偏好設定、預設標籤
 *   同步注入到目前專案連接的資料庫 (MongoDB Atlas 或 PostgreSQL) 中。
 */

const { PrismaClient } = require("@prisma/client");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

const CATEGORIES = [
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
    description: "象徵風元素，與思維、溝通、衝突與決策有關的牌組。",
  },
  {
    name: "錢幣組 (Pentacles)",
    slug: "suit-of-pentacles",
    description: "象徵土元素，與物質財富、工作、健康及現實生活有關的牌組。",
  },
];

const ARTICLES = [
  {
    title: "1. 魔術師 (The Magician) - 掌握命運的創造者",
    slug: "the-magician-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1612323272388-34fe470bedad?auto=format&fit=crop&q=80&w=1200",
    excerpt:
      "魔術師象徵著將夢想化為現實的力量。他擁有了四大元素的工具，只需要專注的意志，就能創造奇蹟。",
    tags: ["大阿爾克那", "魔術師", "創造力", "顯化"],
    content: `
      <h2>1. 魔術師 (The Magician)</h2>
      <p>魔術師高舉權杖指向天空，另一手指地，象徵著「如其在下，如其在上」的古老智慧。他不僅是表演者，更是連接天地能量的導體。</p>
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>創造力、行動力、專注、顯化、技能嫻熟、自信。</li>
        <li><strong>逆位：</strong>意志力薄弱、被動、錯失良機、欺騙、才能被埋沒。</li>
      </ul>
      <h3>牌面解析：</h3>
      <p>在牌桌上，擺放著象徵風、火、水、土四大元素的寶劍、權杖、聖杯與錢幣。這代表魔術師已經具備了所有必要的資源，現在只需要他的意志力來啟動這一切。</p>
      <h3>給您的指引：</h3>
      <p>現在是採取行動的絕佳時刻！您已經準備好了，不要再猶豫。相信自己的能力，您可以將腦海中的想法轉化為現實的成果。</p>
    `,
  },
  {
    title: "2. 女祭司 (The High Priestess) - 傾聽內在的神秘直覺",
    slug: "the-high-priestess-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "女祭司守護著潛意識的秘密，她不採取行動，而是靜靜地等待智慧的浮現。她是直覺與夢境的守護者。",
    tags: ["大阿爾克那", "女祭司", "直覺", "潛意識"],
    content: `
      <h2>2. 女祭司 (The High Priestess)</h2>
      <p>女祭司端坐在黑與白的柱子之間，象徵著二元性的平衡。她手中的卷軸 TORA 代表著深奧的律法，但部分被遮擋，意味著真理只向準備好的人顯現。</p>
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>直覺、潛意識、神秘、內在智慧、靜心、等待。</li>
        <li><strong>逆位：</strong>忽視直覺、情緒壓抑、膚淺、隱藏的敵人、秘密被揭穿。</li>
      </ul>
      <h3>牌面解析：</h3>
      <p>她背後的石榴布幔象徵著豐富的女性能量與多產的潛意識。月亮在她腳下，代表著潮汐與情緒的流動。這張牌提醒我們，有時候「不做」比「做」更有力量。</p>
      <h3>給您的指引：</h3>
      <p>暫時放下理性的分析，去傾聽內心微弱的聲音。您的夢境或突如其來的靈感，正試圖告訴您重要的訊息。保持耐心，答案會自然浮現。</p>
    `,
  },
  {
    title: "3. 皇后 (The Empress) - 豐盛與慈愛的母親",
    slug: "the-empress-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "皇后是大地的母親，象徵著生命的誕生、豐收與感官的享受。她提醒我們去愛護自己，並感受世界的美好。",
    tags: ["大阿爾克那", "皇后", "豐盛", "愛"],
    content: `
      <h2>3. 皇后 (The Empress)</h2>
      <p>皇后坐在舒適的軟墊上，四周環繞著森林與河流，象徵著大自然的滋養。她代表著陰性能量的極致展現——包容、孕育與創造。</p>
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>豐盛、母愛、懷孕、感官享受、美、自然、創造力。</li>
        <li><strong>逆位：</strong>依賴、奢侈、過度保護、創造力受阻、家庭問題。</li>
      </ul>
      <h3>牌面解析：</h3>
      <p>她手中的權杖象徵著生命的權力，頭上的十二星冠代表著與宇宙週期的連結。皇后告訴我們，生活不只是生存，更是要懂得享受與體驗。</p>
      <h3>給您的指引：</h3>
      <p>去接觸大自然，或是做一些讓自己感到舒適的事情。無論是享受美食、藝術創作，還是照顧盆栽，讓自己沉浸在「美」的事物中，會為您帶來力量。</p>
    `,
  },
  {
    title: "4. 皇帝 (The Emperor) - 穩固的結構與父權力量",
    slug: "the-emperor-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "皇帝坐在石椅上，象徵著世俗的權力、紀律與秩序。他提醒我們建立穩固基礎與承擔責任的重要性。",
    tags: ["大阿爾克那", "皇帝", "權力", "結構"],
    content: `
      <h2>4. 皇帝 (The Emperor)</h2>
      <p>皇帝身穿紅色戰袍，象徵著行動力與熱情。他手中的權杖與金球代表著對世界的掌控。他是社會結構與規則的守護者。</p>
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>權力、結構、父親形象、權威、穩固、保護、邏輯。</li>
        <li><strong>逆位：</strong>濫用權力、固執、缺乏紀律、暴君、不成熟的男性。</li>
      </ul>
      <h3>牌面解析：</h3>
      <p>背後的荒山象徵著嚴苛的環境，但皇帝依然穩坐其中，代表他在挑戰中建立了秩序。這張牌鼓勵我們要理性思考，採取務實的行動。</p>
      <h3>給您的指引：</h3>
      <p>這是一個需要展現領導力與魄力的時刻。將您的計畫具體化，建立規則，並堅定地執行。不要感情用事，用邏輯與結構來解決問題。</p>
    `,
  },
  {
    title: "6. 戀人 (The Lovers) - 愛的抉擇與和諧",
    slug: "the-lovers-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "戀人牌不僅代表愛情，更象徵著人生的重大抉擇。在天使的祝福下，我們學習整合內在的對立面。",
    tags: ["大阿爾克那", "戀人", "愛情", "選擇"],
    content: `
      <h2>6. 戀人 (The Lovers)</h2>
      <p>亞當與夏娃站在伊甸園中，大天使拉斐爾在上方給予祝福。這張牌充滿了愛與和諧的能量，但也暗示著誘惑與選擇。</p>
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>愛、和諧、關係、選擇、價值觀契合、合作。</li>
        <li><strong>逆位：</strong>不和諧、分離、錯誤的選擇、誘惑、關係破裂。</li>
      </ul>
      <h3>牌面解析：</h3>
      <p>夏娃背後的蛇代表誘惑與智慧，亞當背後的火則代表熱情。戀人牌的核心在於「選擇」——選擇您真正所愛，並為此負責。</p>
      <h3>給您的指引：</h3>
      <p>這是一個關於關係的重要時刻，不一定是愛情，也可能是合作夥伴。傾聽您的心，選擇那條讓您感到充滿愛與熱情的道路。</p>
    `,
  },
  {
    title: "AI 塔羅與傳統占卜：科技如何成為靈性的橋樑？",
    slug: "ai-tarot-vs-traditional",
    categorySlug: "reading-secrets",
    coverImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
    excerpt:
      "探討人工智慧如何與神秘學結合，以及如何正確看待 AI 塔羅占卜的準確性與價值。",
    tags: ["AI塔羅", "靈性科技", "占卜觀念"],
    content: `
      <p>在當今數位時代，人工智慧（AI）正在迅速改變我們生活的方方面面，而塔羅占卜也不例外。許多傳統占卜師或許會質疑：「機器怎麼可能有靈魂？AI 如何解讀牌卡背後的能量？」這是一個非常好的問題。</p>
      <p>事實上，<strong>塔羅牌本身就是一種工具</strong>，它是一面鏡子，映射出我們潛意識中的訊息。核心在於「共時性（Synchronicity）」——也就是榮格所提出的，看似無關的事件在特定時刻產生有意義的巧合。</p>
      <p>我們的 AI 系統經過嚴格的塔羅哲理訓練：</p>
      <ul>
        <li><strong>客觀中立</strong>：AI 沒有個人情緒偏見，誠實反映能量趨勢。</li>
        <li><strong>邏輯整合</strong>：精確剖析多張牌陣（如六芒星）之間的位置關係。</li>
        <li><strong>隨時陪伴</strong>：隨時為深夜面臨困境的心靈提供指引。</li>
      </ul>
    `,
  },
  {
    title: "提問的藝術：如何讓塔羅給出精準指引？",
    slug: "art-of-asking-questions",
    categorySlug: "beginner-guide",
    coverImage:
      "https://images.unsplash.com/photo-1765822019605-1c5f6a91864b?q=80&w=2670&auto=format&fit=crop",
    excerpt:
      "塔羅不僅是預測，更是對話。學會如何設計一個好問題，讓宇宙的訊息更清晰地傳遞給您。",
    tags: ["提問技巧", "新手教學", "自我探索"],
    content: `
      <p>「我什麼時候會發財？」「他到底愛不愛我？」這類封閉式的提問，往往很難得到具建設性的回饋。</p>
      <h3>好問題的三大原則：</h3>
      <ol>
        <li><strong>避免是非題，改用開放式問題</strong>：詢問「現狀與阻礙」，而非單純的「會不會」。</li>
        <li><strong>避免被動等待，改為主動創造</strong>：詢問「我能如何調整自己以改善現況」。</li>
        <li><strong>聚焦於當下與可控範圍</strong>：把力量收回自己身上。</li>
      </ol>
    `,
  },
  {
    title: "深度解析「聖愛六芒星」牌陣：愛情的全息圖",
    slug: "love-hexagram-deep-dive",
    categorySlug: "tarot-spreads",
    coverImage:
      "https://images.unsplash.com/photo-1579407364450-481fe19dbfaa?q=80&w=2670&auto=format&fit=crop",
    excerpt:
      "為什麼我們選擇六芒星牌陣？從雙方心態到未來趨勢，一次看懂這個強大愛情牌陣的每一個細節。",
    tags: ["牌陣介紹", "愛情占卜", "進階知識"],
    content: `
      <p>六芒星牌陣專門用於深入剖析雙方情感關係，六個位置分別對應：</p>
      <ul>
        <li><strong>位置一：</strong>您的現狀與對對方的想法</li>
        <li><strong>位置二：</strong>對方的現狀與對您的看法</li>
        <li><strong>位置三：</strong>雙方關係的現階段互動基調</li>
        <li><strong>位置四：</strong>這段關係的核心挑戰與潛在阻礙</li>
        <li><strong>位置五：</strong>雙方潛在的期盼與未來目標</li>
        <li><strong>位置六：</strong>短期內的發展趨勢與指引</li>
      </ul>
    `,
  },
  {
    title: "擁抱陰影：為什麼抽到「死神」或「寶劍三」其實是禮物？",
    slug: "embracing-shadow-cards",
    categorySlug: "reading-secrets",
    coverImage:
      "https://images.unsplash.com/photo-1669604728627-dda1f689be72?q=80&w=2670&auto=format&fit=crop",
    excerpt:
      "不必害怕「壞牌」。死神代表重生，高塔代表覺醒。學習如何轉化負面牌義，挖掘隱藏的祝福。",
    tags: ["牌義解析", "心理建設", "靈性成長"],
    content: `
      <p>在塔羅中，沒有絕對的壞牌。死神象徵「蛻變與重生」，高塔代表「打破虛妄的假象」，寶劍三則是「允許悲傷釋放與自我療癒」。</p>
      <p>學會正視陰影牌，往往是人生覺醒與邁向新階段的最強契機。</p>
    `,
  },
  {
    title: "每日儀式感：如何把「每日靈感」融入生活？",
    slug: "daily-tarot-rituals",
    categorySlug: "beginner-guide",
    coverImage:
      "https://images.unsplash.com/photo-1769974672482-b6726090c4ca?q=80&w=2670&auto=format&fit=crop",
    excerpt:
      "只要三分鐘，建立您的晨間塔羅儀式。透過每日一抽，提升覺察力，讓每一天都充滿宇宙的指引。",
    tags: ["日常儀式", "每日占卜", "生活靈感"],
    content: `
      <p>每天早晨只需花 3 分鐘：</p>
      <ol>
        <li><strong>晨間靜心</strong>：深呼吸，詢問今日焦點。</li>
        <li><strong>抽出一張牌</strong>：觀察圖案與色調感受。</li>
        <li><strong>睡前覆盤</strong>：回顧一天的生活共時性。</li>
      </ol>
    `,
  },
];

async function seed() {
  console.log("\n🌱 開始注入聖愛塔羅全站預設資料...\n");

  // 1. 注入分類 (Categories)
  console.log("📂 正在建立/更新分類...");
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categoryMap[cat.slug] = record.id;
    console.log(`  ✅ 分類: ${cat.name}`);
  }

  // 2. 注入預設文章 (Posts)
  console.log("\n📝 正在建立/更新預設精選文章...");
  for (const art of ARTICLES) {
    const categoryId = categoryMap[art.categorySlug];
    await prisma.post.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        content: art.content.trim(),
        excerpt: art.excerpt,
        coverImage: art.coverImage,
        categoryId: categoryId || null,
        tags: art.tags,
        published: true,
      },
      create: {
        title: art.title,
        slug: art.slug,
        content: art.content.trim(),
        excerpt: art.excerpt,
        coverImage: art.coverImage,
        categoryId: categoryId || null,
        tags: art.tags,
        published: true,
      },
    });
    console.log(`  ✅ 文章: ${art.title}`);
  }

  // 3. 注入系統設定 (SystemSettings)
  console.log("\n⚙️ 正在更新系統偏好設定...");
  const settings = [
    { key: "site_title", value: "聖愛塔羅 - 靈性 AI 占卜" },
    { key: "site_description", value: "探索宇宙的奧秘，透過 AI 靈性導師為您解讀塔羅牌義。" },
    { key: "site_keywords", value: "塔羅牌, AI 占卜, 靈性, 命運, 解夢" },
    { key: "ga_id", value: "G-EQE2XFKCJD" },
    { key: "ai_prompt_prefix", value: "你是一位資深的靈性導師，請用溫暖且具啟發性的口吻回答..." },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
    console.log(`  ✅ 設定: ${s.key}`);
  }

  // 4. 設定預設管理員 (User)
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "jychee888@gmail.com";
  console.log(`\n👤 確保管理員權限: ${superAdminEmail}`);
  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { role: "admin", status: "active" },
    create: {
      email: superAdminEmail,
      name: "James 正元",
      role: "admin",
      status: "active",
      nickname: "心靈之眼導師",
      bio: "專注於結合人工智慧與古典塔羅哲學，指引靈魂走向覺察與自我實現。",
    },
  });
  console.log(`  ✅ 管理員帳號已就緒: ${superAdminEmail}`);

  console.log("\n🎉 全站預設資料注入完成！");
  console.log("👉 前往後台查看文章列表: /admin/posts\n");
}

seed()
  .catch((e) => {
    console.error("❌ 注入資料失敗:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
