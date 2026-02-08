const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const articles = [
  // --- 大阿爾克那 ---
  {
    title: "4. 皇帝 (The Emperor) - 穩固的結構與父權力量",
    slug: "the-emperor-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "皇帝坐在石椅上，象徵著世俗的權力、紀律與秩序。他提醒我們建立穩固基礎與承擔責任的重要性。",
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
    tags: ["大阿爾克那", "皇帝", "權力", "結構"],
  },
  {
    title: "5. 教皇 (The Hierophant) - 傳統價值與精神指引",
    slug: "the-hierophant-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1519681393798-3828fb4090bb?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "教皇是精神世界的導師，他傳遞著傳統的智慧與信仰。這張牌象徵著群體認同與既定的社會規範。",
    content: `
      <h2>5. 教皇 (The Hierophant)</h2>
      <p>教皇舉起右手祝福，左手持有象徵神聖的三重十字權杖。他腳下的兩把鑰匙代表開啟智慧的大門。他連結了神性與人性。</p>
      
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>傳統、信仰、教育、團體歸屬、婚姻、心靈導師。</li>
        <li><strong>逆位：</strong>打破傳統、標新立異、盲目迷信、被群體排擠、尋找新的道路。</li>
      </ul>

      <h3>牌面解析：</h3>
      <p>與女祭司的個人直覺不同，教皇代表的是「被社會認可的知識」與「集體的信仰」。他通常與學校、教會或大型機構有關。</p>
      
      <h3>給您的指引：</h3>
      <p>您可能需要尋求長輩或專業人士的建議。或者是加入某個學習團體，透過系統化的方式來獲取知識。尊重傳統，但也別忘了保持獨立思考。</p>
    `,
    tags: ["大阿爾克那", "教皇", "傳統", "教育"],
  },
  {
    title: "6. 戀人 (The Lovers) - 愛的抉擇與和諧",
    slug: "the-lovers-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "戀人牌不僅代表愛情，更象徵著人生的重大抉擇。在天使的祝福下，我們學習整合內在的對立面。",
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
    tags: ["大阿爾克那", "戀人", "愛情", "選擇"],
  },

  // --- 小阿爾克那 ---
  {
    title: "聖杯二 (Two of Cups) - 靈魂伴侶的相遇",
    slug: "two-of-cups-guide",
    categorySlug: "minor-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "兩個人舉杯對飲，象徵著平等、尊重與互相吸引的關係。這是塔羅牌中最美的相遇之一。",
    content: `
      <h2>聖杯二 (Two of Cups)</h2>
      <p>聖杯組代表水元素，與情感有關。聖杯二描繪了一男一女交換誓言的場景，獅鷲獸與赫密斯之杖象徵著這種結合是神聖且受保護的。</p>
      
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>合作、靈魂伴侶、平等的愛、吸引力、和解。</li>
        <li><strong>逆位：</strong>不平衡、誤會、分離、依賴、溝通不良。</li>
      </ul>

      <h3>牌面解析：</h3>
      <p>這張牌強調的是「平等」與「交流」。不像戀人牌那樣強調重大的抉擇，聖杯二更側重於兩個人之間那種心有靈犀的連結。</p>
      
      <h3>給您的指引：</h3>
      <p>您可能會遇到一位與您非常契合的人，無論是戀人還是合作夥伴。敞開心扉，真誠地交流，這段關係將為雙方帶來成長。</p>
    `,
    tags: ["小阿爾克那", "聖杯", "水元素", "愛情"],
  },
  {
    title: "權杖八 (Eight of Wands) - 迅雷不及掩耳的變化",
    slug: "eight-of-wands-guide",
    categorySlug: "minor-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "八根權杖在天空中疾飛，沒有任何阻礙。象徵著事情將會快速發展，訊息的傳遞與旅行的機會。",
    content: `
      <h2>權杖八 (Eight of Wands)</h2>
      <p>這這是少數沒有人物出現的牌之一，強調純粹的「速度」能量。代表火元素的權杖正在快速移動，目標明確。</p>
      
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>速度、行動、旅行、好消息、即將發生、效率。</li>
        <li><strong>逆位：</strong>延遲、混亂、衝動、失去方向、錯過時機。</li>
      </ul>

      <h3>牌面解析：</h3>
      <p>權杖八預示著一段忙碌且充滿活力的時期。之前的阻礙將會消除，事情會像箭一樣直飛目標。</p>
      
      <h3>給您的指引：</h3>
      <p>準備好迎接快速的變化！現在不是猶豫的時候，抓住機會，順勢而為。您期待已久的消息可能很快就會傳來。</p>
    `,
    tags: ["小阿爾克那", "權杖", "火元素", "速度"],
  },
  {
    title: "錢幣十 (Ten of Pentacles) - 家族傳承與物質豐盛",
    slug: "ten-of-pentacles-guide",
    categorySlug: "minor-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "一個富裕的家庭在庭院中享受生活，象徵著物質的極致成就與家族的傳承。這是一種長久且穩定的財富。",
    content: `
      <h2>錢幣十 (Ten of Pentacles)</h2>
      <p>錢幣十展現了一個三代同堂的畫面，老人在拱門下看著兒孫。這張牌代表的不僅是金錢，更是家族的榮耀與傳統。</p>
      
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>財富、遺產、家族、安全感、長期成功、傳統。</li>
        <li><strong>逆位：</strong>家庭糾紛、財務損失、傳統的束縛、孤立、失去根基。</li>
      </ul>

      <h3>牌面解析：</h3>
      <p>牆上的家徽與兩隻獵犬象徵著守護與忠誠。這張牌告訴我們，真正的財富是可以分享並傳承給下一代的。</p>
      
      <h3>給您的指引：</h3>
      <p>關注您的家庭與長期的財務規劃。您的努力將會為未來打下堅實的基礎。這也是一個享受豐盛果實的時刻。</p>
    `,
    tags: ["小阿爾克那", "錢幣", "土元素", "財富"],
  },

  // --- 教學 ---
  {
    title: "每日一抽：如何建立與直覺的日常連結？",
    slug: "daily-draw-practice",
    categorySlug: "beginner-guide",
    coverImage:
      "https://images.unsplash.com/photo-1507415492521-937f102798f0?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "不需要複雜的儀式，每天只需 5 分鐘。透過「每日一抽」的練習，您可以大幅提升解牌的準確度與自信。",
    content: `
      <h2>為什麼要練習每日一抽？</h2>
      <p>就像學習語言需要每天開口說一樣，學習塔羅也需要每天與牌對話。每日一抽是最簡單也最有效的學習方式。</p>

      <h3>練習步驟：</h3>
      <ol>
        <li><strong>早晨儀式：</strong>起床後，洗牌並問：「今天的主要能量是什麼？」抽出一張牌。</li>
        <li><strong>記錄當下：</strong>不要急著翻書！先寫下您對這張牌的第一印象與感覺。</li>
        <li><strong>晚間回顧：</strong>睡前再看一次這張牌，回想今天發生的事情，看看牌義與現實生活如何呼應。</li>
      </ol>

      <h3>小秘訣：</h3>
      <p>準備一本專屬的「塔羅日記」。幾個月後回頭看，您會驚訝於自己的進步與牌卡的準確性。這也是建立個人牌義庫的最佳方法。</p>
    `,
    tags: ["新手教學", "每日一抽", "直覺訓練", "練習"],
  },
  {
    title: "二擇一牌陣：面臨兩難抉擇時的最佳幫手",
    slug: "two-paths-spread",
    categorySlug: "tarot-spreads",
    coverImage:
      "https://images.unsplash.com/photo-1549313861-33587f3d2956?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "向左走還是向右走？當您站在人生的十字路口，這個牌陣能幫助您預見不同選擇的可能發展。",
    content: `
      <h2>二擇一牌陣 (Two Paths Spread)</h2>
      <p>當您面臨 A 方案與 B 方案的抉擇，卻猶豫不決時，這個牌陣能清晰地展示兩條路徑的優缺點。</p>

      <h3>牌陣位置：</h3>
      <ul>
        <li><strong>位置 1 (現況/核心)：</strong>代表您目前的狀態或問題的核心。</li>
        <li><strong>位置 2 & 4 (選擇 A)：</strong>位置 2 代表選擇 A 的過程/短期狀況，位置 4 代表選擇 A 的可能結果。</li>
        <li><strong>位置 3 & 5 (選擇 B)：</strong>位置 3 代表選擇 B 的過程/短期狀況，位置 5 代表選擇 B 的可能結果。</li>
      </ul>

      <h3>解讀重點：</h3>
      <p>比較兩條路徑的「結果牌」（位置 4 與 5）。哪一張牌更符合您長遠的目標與價值觀？別忘了也要考慮過程中的挑戰（位置 2 與 3）。</p>
    `,
    tags: ["牌陣", "教學", "選擇", "二擇一"],
  },
];

async function main() {
  console.log("正在為您填充更多精選內容...");

  for (const article of articles) {
    const { categorySlug, tags, ...postData } = article;

    // 1. 查找 Category ID
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.warn(
        `⚠️ 找不到分類 ${categorySlug}，跳過文章: ${postData.title}`,
      );
      continue;
    }

    // 2. 建立 Post
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {
        ...postData,
        categoryId: category.id,
        tags: tags,
      },
      create: {
        ...postData,
        categoryId: category.id,
        tags: tags,
        published: true, // 全部預設發布
      },
    });

    console.log(`✅ 已發布: ${postData.title}`);
  }

  console.log("🎉 8 篇新文章已成功加入！內容庫更加豐富了。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
