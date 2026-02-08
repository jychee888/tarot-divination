const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const articles = [
  // --- 大阿爾克那 ---
  {
    title: "1. 魔術師 (The Magician) - 掌握命運的創造者",
    slug: "the-magician-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1596706062103-3a6d71f78082?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "魔術師象徵著將夢想化為現實的力量。他擁有了四大元素的工具，只需要專注的意志，就能創造奇蹟。",
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
    tags: ["大阿爾克那", "魔術師", "創造力", "顯化"],
  },
  {
    title: "2. 女祭司 (The High Priestess) - 傾聽內在的神秘直覺",
    slug: "the-high-priestess-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "女祭司守護著潛意識的秘密，她不採取行動，而是靜靜地等待智慧的浮現。她是直覺與夢境的守護者。",
    content: `
      <h2>2. 女祭司 (The High Priestess)</h2>
      <p>女祭司端坐在黑與白的柱子之間，象徵著二元性的平衡。她手中的卷軸TORA代表著深奧的律法，但部分被遮擋，意味著真理只向準備好的人顯現。</p>
      
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
    tags: ["大阿爾克那", "女祭司", "直覺", "潛意識"],
  },
  {
    title: "3. 皇后 (The Empress) - 豐盛與慈愛的母親",
    slug: "the-empress-guide",
    categorySlug: "major-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "皇后是大地的母親，象徵著生命的誕生、豐收與感官的享受。她提醒我們去愛護自己，並感受世界的美好。",
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
    tags: ["大阿爾克那", "皇后", "豐盛", "愛"],
  },

  // --- 小阿爾克那 / 新手教學 ---
  {
    title: "寶劍一 (Ace of Swords) - 思想的突破與決斷",
    slug: "ace-of-swords-guide",
    categorySlug: "minor-arcana",
    coverImage:
      "https://images.unsplash.com/photo-1598556885312-e5659850559e?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "一把利劍劃破雲層，象徵著思緒的清晰與真理的顯現。這是一個新的想法、新的計畫誕生的時刻。",
    content: `
      <h2>寶劍一 (Ace of Swords)</h2>
      <p>寶劍組代表風元素，關乎思考、理智與溝通。這張牌是一切的起點，代表著一股強大而純粹的心智力量。</p>
      
      <h3>關鍵字：</h3>
      <ul>
        <li><strong>正位：</strong>清晰的思考、突破、新計畫、真理、決斷力、勝利。</li>
        <li><strong>逆位：</strong>思緒混亂、誤解、計畫受阻、言語暴力、過度分析。</li>
      </ul>

      <h3>牌面解析：</h3>
      <p>雲中伸出的手緊握寶劍，劍尖上有皇冠與橄欖枝，象徵著理智帶來的榮耀與和平。但也提醒我們，劍是雙面刃，語言與思想若使用不當，也可能造成傷害。</p>
      
      <h3>給您的指引：</h3>
      <p>您可能會有一個靈光一閃的時刻，或是終於看清了某件事的真相。這是一個利用理智去切斷混亂、做出決定的好時機。</p>
    `,
    tags: ["小阿爾克那", "寶劍", "風元素", "突破"],
  },
  {
    title: "塔羅新手必看：如何進行這輩子第一次抽牌？",
    slug: "first-tarot-reading-tutorial",
    categorySlug: "beginner-guide",
    coverImage:
      "https://images.unsplash.com/photo-1632517594917-1941c5304620?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "別擔心記不住牌義！只要跟著這 5 個簡單步驟，您也能開啟與塔羅牌的第一次對話，感受直覺的引導。",
    content: `
      <h2>第一次抽牌的儀式感</h2>
      <p>很多人拿到第一副塔羅牌時，會急著想要背下書上的解釋。但其實，塔羅牌更像是一位老朋友，重點在於「交流」。</p>

      <h3>步驟一：淨化與連結</h3>
      <p>找一個安靜的空間，深呼吸。您可以試著洗牌，感受牌在手中的觸感。心裡默念：「請給予我指引。」</p>

      <h3>步驟二：設定問題</h3>
      <p>初學者最好的問題通常是開放式的，例如：</p>
      <ul>
        <li>「我今天需要注意什麼？」</li>
        <li>「關於這件事，我有什麼沒看到的盲點？」</li>
      </ul>
      <p>避免問「是或否」的問題，這會限制牌的回答空間。</p>

      <h3>步驟三：直覺解讀</h3>
      <p>抽出一張牌後，<strong>先不要看書！</strong></p>
      <p>看著牌面，問自己：</p>
      <ol>
        <li>這個畫面給我什麼感覺？（溫暖？恐懼？平靜？）</li>
        <li>哪個顏色或符號最吸引我？</li>
        <li>如果畫中的人物會說話，他會對我說什麼？</li>
      </ol>
      <p>這個直覺的答案，往往比書上的標準答案更適合當下的您。</p>
    `,
    tags: ["新手教學", "儀式", "直覺訓練"],
  },
  {
    title: "時間之流牌陣：過去、現在與未來的對話",
    slug: "three-card-spread-guide",
    categorySlug: "tarot-spreads",
    coverImage:
      "https://images.unsplash.com/photo-1519543886566-68b3d6872594?auto=format&fit=crop&q=80&w=2070",
    excerpt:
      "最經典也最實用的三張牌陣。透過簡單的三個位置，釐清事件的脈絡，找出問題的根源與可能的發展方向。",
    content: `
      <h2>時間之流 (Time Flow Spread)</h2>
      <p>這是塔羅占卜中最基礎，卻能應對 80% 問題的萬用牌陣。它不只能看時間軸，也能轉化為「原因、現況、建議」。</p>

      <h3>牌陣位置：</h3>
      <ol>
        <li>
            <strong>左邊 (過去/原因)：</strong>
            <p>代表導致目前情況發生的根源，或是已經發生的影響力。</p>
        </li>
        <li>
            <strong>中間 (現在/現況)：</strong>
            <p>代表當下的能量狀態，或是您正在面對的核心課題。</p>
        </li>
        <li>
            <strong>右邊 (未來/結果)：</strong>
            <p>代表如果在不改變現狀的情況下，事情可能會發展的方向。記得，未來是可以改變的，這張牌更像是一個趨勢預測。</p>
        </li>
      </ol>

      <h3>進階應用：身心靈牌陣</h3>
      <p>同樣的三張牌，您也可以將其定義為：</p>
      <ul>
        <li><strong>身：</strong>現實層面的狀況、健康、行動。</li>
        <li><strong>心：</strong>情緒感受、人際關係、內在渴望。</li>
        <li><strong>靈：</strong>高我的指引、靈魂的學習課題。</li>
      </ul>
    `,
    tags: ["牌陣", "教學", "時間之流", "三張牌"],
  },
];

async function main() {
  console.log("正在為您填充精彩內容...");

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
        published: true, // 全部預設發布！
      },
    });

    console.log(`✅ 已發布: ${postData.title}`);
  }

  console.log("🎉 內容填充完成！現在網站看起來非常豐富了。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
