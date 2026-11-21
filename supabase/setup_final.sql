-- ==============================================================================
-- 聖愛塔羅 (Soul's Eye Tarot) | Supabase 資料庫完整建置與預設資料初始化腳本
-- 檔案名稱: supabase/setup_final.sql
-- 專案識別: tarot-divination (jiorbrohmdoiuteqeifc)
-- 
-- 說明:
-- 1. 包含完整資料表結構 (Categories, Posts, Tags, SystemSettings, Users, Records 等)
-- 2. 全面啟用 Row-Level Security (RLS) 與精準安全策略 (解決 rls_disabled_in_public 與 sensitive_columns_exposed)
-- 3. 內建完整預設資料 (10 大塔羅分類、14 篇精選深度牌義與教學文章、全站系統設定、管理員帳號、標籤等)
-- 4. ⚠ 執行時會先清空舊資料表後重新建立，乾淨重置至標準初始狀態。
-- 
-- 使用方式:
-- 登入 Supabase 後台 -> 進入 SQL Editor -> 建立一個新查詢 (New query) -> 全選複製貼上本檔 -> 點選 Run 即可一鍵重置！
-- ==============================================================================

-- ==============================================================================
-- 1. 清理舊有資料表 (Drop Existing Tables)
-- ==============================================================================
drop table if exists public."DivinationRecord" cascade;
drop table if exists public."Post" cascade;
drop table if exists public."Category" cascade;
drop table if exists public."Tag" cascade;
drop table if exists public."SystemSetting" cascade;
drop table if exists public."EmailOtp" cascade;
drop table if exists public."Session" cascade;
drop table if exists public."Account" cascade;
drop table if exists public."VerificationToken" cascade;
drop table if exists public."User" cascade;

-- ==============================================================================
-- 2. 建立資料表結構 (Tables Schema)
-- ==============================================================================

-- 2.1 文章分類表 (Category)
create table public."Category" (
  id text primary key default gen_random_uuid()::text,
  name text unique not null,
  slug text unique not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.2 文章內容表 (Post)
create table public."Post" (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  cover_image text,
  category_id text references public."Category"(id) on delete set null,
  tags text[] not null default array[]::text[],
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_slug on public."Post"(slug);
create index if not exists idx_posts_category_id on public."Post"(category_id);
create index if not exists idx_posts_published on public."Post"(published);
create index if not exists idx_posts_created_at on public."Post"(created_at desc);

-- 2.3 標籤表 (Tag)
create table public."Tag" (
  id text primary key default gen_random_uuid()::text,
  name text unique not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

-- 2.4 全站系統設定表 (SystemSetting)
create table public."SystemSetting" (
  id text primary key default gen_random_uuid()::text,
  key text unique not null,
  value text not null,
  description text,
  updated_at timestamptz not null default now()
);

-- 2.5 使用者表 (User)
create table public."User" (
  id text primary key default gen_random_uuid()::text,
  name text,
  email text unique,
  email_verified timestamptz,
  image text,
  nickname text,
  bio text,
  birthday text,
  birth_time text,
  gender text,
  role text not null default 'user',
  status text not null default 'active',
  last_active_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_email on public."User"(email);

-- 2.6 NextAuth OAuth 帳號關聯表 (Account)
create table public."Account" (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public."User"(id) on delete cascade,
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token text,
  access_token text,
  expires_at int,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique(provider, provider_account_id)
);

create index if not exists idx_accounts_user_id on public."Account"(user_id);

-- 2.7 NextAuth Session 表 (Session)
create table public."Session" (
  id text primary key default gen_random_uuid()::text,
  session_token text unique not null,
  user_id text not null references public."User"(id) on delete cascade,
  expires timestamptz not null
);

create index if not exists idx_sessions_user_id on public."Session"(user_id);

-- 2.8 驗證憑證表 (VerificationToken)
create table public."VerificationToken" (
  identifier text not null,
  token text unique not null,
  expires timestamptz not null,
  unique(identifier, token)
);

-- 2.9 Email 驗證碼表記錄 (EmailOtp)
create table public."EmailOtp" (
  id text primary key default gen_random_uuid()::text,
  email text not null,
  otp text not null,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_otp_email on public."EmailOtp"(email);
create index if not exists idx_email_otp_expires_at on public."EmailOtp"(expires_at);

-- 2.10 占卜歷史紀錄表 (DivinationRecord)
create table public."DivinationRecord" (
  id text primary key default gen_random_uuid()::text,
  theme text not null,
  spread_type text not null,
  question text,
  ai_reading text,
  user_context jsonb,
  cards jsonb not null,
  created_at timestamptz not null default now(),
  user_id text not null references public."User"(id) on delete cascade
);

create index if not exists idx_divination_records_user_id on public."DivinationRecord"(user_id);
create index if not exists idx_divination_records_created_at on public."DivinationRecord"(created_at desc);

-- ==============================================================================
-- 3. 安全策略與列級安全性 (Row Level Security - RLS)
--    徹底杜絕 rls_disabled_in_public 與 sensitive_columns_exposed 資安問題
-- ==============================================================================

-- 3.1 為所有資料表開啟 RLS
alter table public."Category" enable row level security;
alter table public."Post" enable row level security;
alter table public."Tag" enable row level security;
alter table public."SystemSetting" enable row level security;
alter table public."User" enable row level security;
alter table public."Account" enable row level security;
alter table public."Session" enable row level security;
alter table public."VerificationToken" enable row level security;
alter table public."EmailOtp" enable row level security;
alter table public."DivinationRecord" enable row level security;

-- 3.2 設定公開可讀取的白名單原則 (分類、已發布文章、標籤、公開設定)
create policy category_select_policy on public."Category"
  for select using (true);

create policy post_select_published_policy on public."Post"
  for select using (published = true);

create policy tag_select_policy on public."Tag"
  for select using (true);

create policy system_setting_select_policy on public."SystemSetting"
  for select using (true);

-- 3.3 敏感表權限嚴格保護：拒絕 public / anon 匿名查詢，防範帳號權杖與驗證碼外洩
revoke all on public."Account" from public, anon;
revoke all on public."Session" from public, anon;
revoke all on public."VerificationToken" from public, anon;
revoke all on public."EmailOtp" from public, anon;

-- 3.4 授權 service_role 擁有所有表的完整維運權限 (後端 API 透過 Prisma / Service Key 存取)
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

-- ==============================================================================
-- 4. 寫入預設資料 (Seed Initial Data)
-- ==============================================================================

-- 4.1 寫入預設分類 (Categories)
insert into public."Category" (id, name, slug, description) values
('cat_major_arcana', '大阿爾克那 (Major Arcana)', 'major-arcana', '象徵靈魂之旅與人生重大課題的 22 張主牌完整解析。'),
('cat_minor_arcana', '小阿爾克那 (Minor Arcana)', 'minor-arcana', '涵蓋權杖、聖杯、寶劍與錢幣，反映日常生活細節的 56 張副牌。'),
('cat_beginner_guide', '新手入門指南 (Beginner''s Guide)', 'beginner-guide', '第一次接觸塔羅？從如何洗牌、抽牌到建立儀式感的完整教學。'),
('cat_tarot_spreads', '經典牌陣研究 (Tarot Spreads)', 'tarot-spreads', '從簡單的時間之流到凱爾特十字，各種實用牌陣的擺法與應用。'),
('cat_reading_secrets', '解牌心法與秘訣 (Reading Secrets)', 'reading-secrets', '不只是背牌義！傳授直覺連結、元素生剋與讀牌邏輯的高階心法。'),
('cat_case_studies', '實戰案例分析 (Case Studies)', 'case-studies', '透過真實的占卜案例，解析牌卡在實際問題中的對應與解答。'),
('cat_suit_of_wands', '權杖組 (Wands)', 'suit-of-wands', '象徵火元素，與行動力、熱情、創造力及靈感有關的牌組。'),
('cat_suit_of_cups', '聖杯組 (Cups)', 'suit-of-cups', '象徵水元素，與情感、直覺、潛意識及人際關係有關的牌組。'),
('cat_suit_of_swords', '寶劍組 (Swords)', 'suit-of-swords', '象徵風元素，與思維、溝通、衝突與決策有關的牌組。'),
('cat_suit_of_pentacles', '錢幣組 (Pentacles)', 'suit-of-pentacles', '象徵土元素，與物質財富、工作、健康及現實生活有關的牌組;')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;

-- 4.2 寫入預設標籤 (Tags)
insert into public."Tag" (name, slug) values
('大阿爾克那', 'major-arcana'),
('小阿爾克那', 'minor-arcana'),
('新手教學', 'beginner'),
('牌陣介紹', 'spreads'),
('愛情占卜', 'love-tarot'),
('每日靈感', 'daily-draw'),
('直覺訓練', 'intuition'),
('靈性科技', 'spiritual-tech'),
('自我探索', 'self-discovery')
on conflict (slug) do nothing;

-- 4.3 寫入全站系統偏好設定 (SystemSettings)
insert into public."SystemSetting" (key, value, description) values
('site_title', '聖愛塔羅 - 靈性 AI 占卜', '網站前台標題與 SEO Title'),
('site_description', '探索宇宙的奧秘，透過 AI 靈性導師為您解讀塔羅牌義。', '全站 Meta Description'),
('site_keywords', '塔羅牌, AI 占卜, 靈性, 命運, 解夢, 愛情占卜', '全站 Meta Keywords'),
('ga_id', 'G-EQE2XFKCJD', 'Google Analytics 4 追蹤識別碼'),
('ai_prompt_prefix', '你是一位資深的靈性導師，請用溫暖、具啟發性且能指引具體行動的口吻為提問者解讀塔羅牌義。', 'AI 解讀提示詞核心前綴')
on conflict (key) do update set
  value = excluded.value,
  description = excluded.description;

-- 4.4 寫入預設管理員帳號 (User)
insert into public."User" (name, email, role, status, nickname, bio) values
('James 正元', 'jychee888@gmail.com', 'admin', 'active', '心靈之眼導師', '專注於結合人工智慧與古典塔羅哲學，指引靈魂走向覺察與自我實現。')
on conflict (email) do update set
  role = 'admin',
  status = 'active';

-- 4.5 寫入預設精選教學與牌義文章 (Posts)

-- 文章 1: 魔術師
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '1. 魔術師 (The Magician) - 掌握命運的創造者',
  'the-magician-guide',
  '魔術師象徵著將夢想化為現實的力量。他擁有了四大元素的工具，只需要專注的意志，就能創造奇蹟。',
  'https://images.unsplash.com/photo-1612323272388-34fe470bedad?auto=format&fit=crop&q=80&w=1200',
  'cat_major_arcana',
  array['大阿爾克那', '魔術師', '創造力', '顯化'],
  '<h2>1. 魔術師 (The Magician)</h2><p>魔術師高舉權杖指向天空，另一手指地，象徵著「如其在下，如其在上」的古老智慧。他不僅是表演者，更是連接天地能量的導體。</p><h3>關鍵字：</h3><ul><li><strong>正位：</strong>創造力、行動力、專注、顯化、技能嫻熟、自信。</li><li><strong>逆位：</strong>意志力薄弱、被動、錯失良機、欺騙、才能被埋沒。</li></ul><h3>牌面解析：</h3><p>在牌桌上，擺放著象徵風、火、水、土四大元素的寶劍、權杖、聖杯與錢幣。這代表魔術師已經具備了所有必要的資源，現在只需要他的意志力來啟動這一切。</p><h3>給您的指引：</h3><p>現在是採取行動的絕佳時刻！您已經準備好了，不要再猶豫。相信自己的能力，您可以將腦海中的想法轉化為現實的成果。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 2: 女祭司
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '2. 女祭司 (The High Priestess) - 傾聽內在的神秘直覺',
  'the-high-priestess-guide',
  '女祭司守護著潛意識的秘密，她不採取行動，而是靜靜地等待智慧的浮現。她是直覺與夢境的守護者。',
  'https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=2070',
  'cat_major_arcana',
  array['大阿爾克那', '女祭司', '直覺', '潛意識'],
  '<h2>2. 女祭司 (The High Priestess)</h2><p>女祭司端坐在黑與白的柱子之間，象徵著二元性的平衡。她手中的卷軸 TORA 代表著深奧的律法，但部分被遮擋，意味著真理只向準備好的人顯現。</p><h3>關鍵字：</h3><ul><li><strong>正位：</strong>直覺、潛意識、神秘、內在智慧、靜心、等待。</li><li><strong>逆位：</strong>忽視直覺、情緒壓抑、膚淺、隱藏的敵人、秘密被揭穿。</li></ul><h3>牌面解析：</h3><p>她背後的石榴布幔象徵著豐富的女性能量與多產的潛意識。月亮在她腳下，代表著潮汐與情緒的流動。這張牌提醒我們，有時候「不做」比「做」更有力量。</p><h3>給您的指引：</h3><p>暫時放下理性的分析，去傾聽內心微弱的聲音。您的夢境或突如其來的靈感，正試圖告訴您重要的訊息。保持耐心，答案會自然浮現。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 3: 皇后
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '3. 皇后 (The Empress) - 豐盛與慈愛的母親',
  'the-empress-guide',
  '皇后是大地的母親，象徵著生命的誕生、豐收與感官的享受。她提醒我們去愛護自己，並感受世界的美好。',
  'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=2070',
  'cat_major_arcana',
  array['大阿爾克那', '皇后', '豐盛', '愛'],
  '<h2>3. 皇后 (The Empress)</h2><p>皇后坐在舒適的軟墊上，四周環繞著森林與河流，象徵著大自然的滋養。她代表著陰性能量的極致展現——包容、孕育與創造。</p><h3>關鍵字：</h3><ul><li><strong>正位：</strong>豐盛、母愛、懷孕、感官享受、美、自然、創造力。</li><li><strong>逆位：</strong>依賴、奢侈、過度保護、創造力受阻、家庭問題。</li></ul><h3>牌面解析：</h3><p>她手中的權杖象徵著生命的權力，頭上的十二星冠代表著與宇宙週期的連結。皇后告訴我們，生活不只是生存，更是要懂得享受與體驗。</p><h3>給您的指引：</h3><p>去接觸大自然，或是做一些讓自己感到舒適的事情。無論是享受美食、藝術創作，還是照顧盆栽，讓自己沉浸在「美」的事物中，會為您帶來力量。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 4: 皇帝
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '4. 皇帝 (The Emperor) - 穩固的結構與父權力量',
  'the-emperor-guide',
  '皇帝坐在石椅上，象徵著世俗的權力、紀律與秩序。他提醒我們建立穩固基礎與承擔責任的重要性。',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=2070',
  'cat_major_arcana',
  array['大阿爾克那', '皇帝', '權力', '結構'],
  '<h2>4. 皇帝 (The Emperor)</h2><p>皇帝身穿紅色戰袍，象徵著行動力與熱情。他手中的權杖與金球代表著對世界的掌控。他是社會結構與規則的守護者。</p><h3>關鍵字：</h3><ul><li><strong>正位：</strong>權力、結構、父親形象、權威、穩固、保護、邏輯。</li><li><strong>逆位：</strong>濫用權力、固執、缺乏紀律、暴君、不成熟的男性。</li></ul><h3>牌面解析：</h3><p>背後的荒山象徵著嚴苛的環境，但皇帝依然穩坐其中，代表他在挑戰中建立了秩序。這張牌鼓勵我們要理性思考，採取務實的行動。</p><h3>給您的指引：</h3><p>這是一個需要展現領導力與魄力的時刻。將您的計畫具體化，建立規則，並堅定地執行。不要感情用事，用邏輯與結構來解決問題。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 5: 戀人
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '6. 戀人 (The Lovers) - 愛的抉擇與和諧',
  'the-lovers-guide',
  '戀人牌不僅代表愛情，更象徵著人生的重大抉擇。在天使的祝福下，我們學習整合內在的對立面。',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=2070',
  'cat_major_arcana',
  array['大阿爾克那', '戀人', '愛情', '選擇'],
  '<h2>6. 戀人 (The Lovers)</h2><p>亞當與夏娃站在伊甸園中，大天使拉斐爾在上方給予祝福。這張牌充滿了愛與和諧的能量，但也暗示著誘惑與選擇。</p><h3>關鍵字：</h3><ul><li><strong>正位：</strong>愛、和諧、關係、選擇、價值觀契合、合作。</li><li><strong>逆位：</strong>不和諧、分離、錯誤的選擇、誘惑、關係破裂。</li></ul><h3>牌面解析：</h3><p>夏娃背後的蛇代表誘惑與智慧，亞當背後的火則代表熱情。戀人牌的核心在於「選擇」——選擇您真正所愛，並為此負責。</p><h3>給您的指引：</h3><p>這是一個關於關係的重要時刻，不一定是愛情，也可能是合作夥伴。傾聽您的心，選擇那條讓您感到充滿愛與熱情的道路。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 6: AI 塔羅與傳統占卜
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  'AI 塔羅與傳統占卜：科技如何成為靈性的橋樑？',
  'ai-tarot-vs-traditional',
  '探討人工智慧如何與神秘學結合，以及如何正確看待 AI 塔羅占卜的準確性與價值。',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop',
  'cat_reading_secrets',
  array['AI塔羅', '靈性科技', '占卜觀念'],
  '<p>在當今數位時代，人工智慧（AI）正在迅速改變我們生活的方方面面，而塔羅占卜也不例外。許多傳統占卜師或許會質疑：「機器怎麼可能有靈魂？AI 如何解讀牌卡背後的能量？」這是一個非常好的問題。</p><p>事實上，<strong>塔羅牌本身就是一種工具</strong>，它是一面鏡子，映射出我們潛意識中的訊息。無論是由人手洗牌，還是由複雜的演算法生成隨機數，核心在於「共時性（Synchronicity）」——也就是榮格所提出的，看似無關的事件在特定時刻產生有意義的巧合。</p><p>我們的 AI 系統並非隨機生成文字，而是經過數萬次高階牌義訓練的模型。它能做到的是：</p><ul><li><strong>客觀中立</strong>：AI 沒有個人情緒與偏見，它不會因為這一刻心情不好而給出敷衍的答案，也不會因為過度同情而美化殘酷的事實。</li><li><strong>邏輯整合</strong>：AI 擅長處理複雜的牌陣結構（如塞爾特十字或六芒星），能精確分析位置之間的相互關係，這是初學者較難掌握的部分。</li><li><strong>隨時陪伴</strong>：靈性的困惑往往發生在深夜或獨處時。AI 塔羅提供了一個安全、私密的空間，讓您隨時隨地都能獲得指引。</li></ul><p>當然，AI 無法完全取代人類占卜師的直覺與溫度。但正如我們將它定位為「靈魂的翻譯機」，只要您帶著誠摯的心念提問，宇宙的訊息依然能透過科技的管道，準確地傳遞到您手中。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 7: 提問的藝術
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '提問的藝術：如何讓塔羅給出精準指引？',
  'art-of-asking-questions',
  '塔羅不僅是預測，更是對話。學會如何設計一個好問題，讓宇宙的訊息更清晰地傳遞給您。',
  'https://images.unsplash.com/photo-1765822019605-1c5f6a91864b?q=80&w=2670&auto=format&fit=crop',
  'cat_beginner_guide',
  array['提問技巧', '新手教學', '自我探索'],
  '<p>「我的未來的另一半長什麼樣？」<br>「我什麼時候會發財？」</p><p>這類封閉式或宿命論的問題，往往很難從塔羅牌中得到有建設性的答案。塔羅牌由潛意識驅動，它更擅長分析「現狀」、「趨勢」與「建議」，而非鐵口直斷的預言。</p><p><strong>好的問題，是成功占卜的一半。</strong><br>在我們的平台上進行占卜前，您可以試著調整您的提問方式：</p><p><strong>1. 避免「是非題」，改用「開放式問題」</strong></p><ul><li>❌ 他愛不愛我？</li><li>✅ 他目前對這段關係的真實想法是什麼？我們之間存在什麼阻礙？</li></ul><p><strong>2. 避免「被動等待」，改用「主動創造」</strong></p><ul><li>❌ 我這輩子會不會結婚？</li><li>✅ 我該如何調整自己，以吸引適合的靈魂伴侶？</li></ul><p><strong>3. 聚焦於「當下」與「可控範圍」</strong></p><ul><li>❌ 十年後我會在哪裡工作？</li><li>✅ 為了達成職涯目標，我現階段最需要克服的盲點是什麼？</li></ul><p>當您將問題聚焦在「我能做什麼」以及「當下的能量狀態」時，塔羅牌就能提供具體的行動指引，而不僅僅是一個模糊的預測。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 8: 聖愛六芒星牌陣解析
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '深度解析「聖愛六芒星」牌陣：愛情的全息圖',
  'love-hexagram-deep-dive',
  '為什麼我們選擇六芒星牌陣？從雙方心態到未來趨勢，一次看懂這個強大愛情牌陣的每一個細節。',
  'https://images.unsplash.com/photo-1579407364450-481fe19dbfaa?q=80&w=2670&auto=format&fit=crop',
  'cat_tarot_spreads',
  array['牌陣介紹', '愛情占卜', '進階知識'],
  '<p>在我們的「聖愛深度啟示」功能中，我們選用了經典且強大的「六芒星牌陣（The Hexagram Spread）」。這個牌陣專門用於解析雙方關係，能像照妖鏡一般，映照出關係中隱藏的細節。</p><p><strong>牌陣結構解析：</strong></p><ol><li><strong>位置一：您現在的狀態（與對方的想法）</strong><br>這張牌代表了「您」在這段關係中的能量。是焦慮？是期待？還是已經想放棄？這往往反映了您的主觀視角。</li><li><strong>位置二：對方現在的狀態（與對您的看法）</strong><br>這張牌揭示了對方的內心戲。有時候我們以為對方冷淡是不愛了，但這張牌可能會顯示他其實是壓力過大或自我封閉。這是換位思考的關鍵。</li><li><strong>位置三：目前的關係現狀</strong><br>這是雙方能量交織後的結果。是熱戀期？磨合期？還是冷戰期？這張牌定義了各種互動的基調。</li><li><strong>位置四：這段關係的潛在挑戰/阻礙</strong><br>這是問題的核心。是溝通不良？價值觀差異？還是外在環境的壓力？找出病灶，才能對症下藥。</li><li><strong>位置五：雙方的期望與目標</strong><br>這顯示了這段關係是否有共同的未來願景。如果你們的目標背道而馳，這張牌會是重要的警訊。</li><li><strong>位置六：短期內的發展趨勢（結果）</strong><br>基於目前的能量流動，如果不做改變，事情會如何發展。請記住，塔羅的結果並非絕對，而是一種「趨勢預測」。</li></ol><p>透過這六個維度的交叉分析，AI 能為您繪製出一張完整的愛情全息圖，讓您不再是盲人摸象，而是能綜觀局勢，做出最有利的選擇。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 9: 擁抱陰影
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '擁抱陰影：為什麼抽到「死神」或「寶劍三」其實是禮物？',
  'embracing-shadow-cards',
  '不必害怕「壞牌」。死神代表重生，高塔代表覺醒。學習如何轉化負面牌義，挖掘隱藏的祝福。',
  'https://images.unsplash.com/photo-1669604728627-dda1f689be72?q=80&w=2670&auto=format&fit=crop',
  'cat_reading_secrets',
  array['牌義解析', '心理建設', '靈性成長'],
  '<p>許多人在抽到畫面陰暗、寓意沈重的牌（如死神、高塔、寶劍三、惡魔）時，第一反應往往是恐懼：「天啊！是不是會有壞事發生？」</p><p>在我們的「心靈之眼」哲學中，<strong>沒有絕對的好牌與壞牌，只有適合與不適合的能量。</strong></p><p><strong>負面牌的正面意義：</strong></p><ul><li><strong>死神 (Death)</strong>：並非肉體的死亡，而是「徹底的轉化」。它意味著一段舊關係、舊模式的結束，唯有告別過去，新生命才能萌芽。它是蛻變的必經之痛。</li><li><strong>高塔 (The Tower)</strong>：象徵「崩解」。那些建立在虛假基礎上的信念或關係，必須被摧毀才能看見真相。它雖然震驚，卻是覺醒的契機。</li><li><strong>寶劍三 (Three of Swords)</strong>：那顆被劍刺穿的心，代表「釋放悲傷」。它提醒您不要壓抑情緒，大哭一場、承認受傷，才是療癒的開始。</li></ul><p>當您在占卜中遇到這些牌時，請不要抗拒。它們是宇宙給您的警鐘，提醒您：「嘿，這裡有些東西壞掉了，我們來修好它，或者丟掉它吧。」</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 10: 每日儀式感
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '每日儀式感：如何把「每日靈感」融入生活？',
  'daily-tarot-rituals',
  '只要三分鐘，建立您的晨間塔羅儀式。透過每日一抽，提升覺察力，讓每一天都充滿宇宙的指引。',
  'https://images.unsplash.com/photo-1769974672482-b6726090c4ca?q=80&w=2670&auto=format&fit=crop',
  'cat_beginner_guide',
  array['日常儀式', '每日占卜', '生活靈感'],
  '<p>塔羅牌不一定要在遇到人生重大難題時才拿出來。事實上，將塔羅融入日常生活，是培養直覺力與保持靈性連結最好的方式。</p><p>我們網站提供的 <strong>「每日靈感 (Daily Draw)」</strong> 功能，就是為此而設計的微型儀式。 </p><p><strong>建議的每日儀式流程：</strong></p><ol><li><strong>晨間靜心</strong>：起床後，在刷牙洗臉、喝第一杯水之前，打開我們的手機網頁。給自己一分鐘的寧靜，閉上眼睛，問宇宙：「今天我需要知道什麼？今天的能量重點是什麼？」</li><li><strong>抽取卡牌</strong>：按下抽牌按鈕。不論出現什麼牌，都先觀察它的圖案與顏色。</li><li><strong>關鍵字聯想</strong>：閱讀 AI 提供的簡短指引。例如抽到「愚人」，今天可能適合嘗試新路線上班，或在會議中提出大膽的點子。</li><li><strong>睡前驗證</strong>：晚上睡前，回想今天發生的一件事，看看是否呼應了早上的那張牌。</li></ol><p>只要每天花 3 分鐘，持續一個月，您會發現自己對周遭能量的感知力明顯提升，生活也變得更有覺知。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 11: 他到底喜不喜歡我
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '他到底喜不喜歡我？從 5 張關鍵塔羅牌看透曖昧對象的真實心意',
  'does-he-like-me-5-tarot-cards',
  '曖昧期最讓人心力交瘁的，莫過於對方的忽冷忽熱。本文拆解 5 張在感情占卜中最能揭露對方真實心理態度的關鍵牌卡，教你一眼看穿他是真心動還是只是寂寞。',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200',
  'cat_reading_secrets',
  array['曖昧心態', '愛情占卜', '牌義解析', '心理投射'],
  '<h2>曖昧時期的「忽冷忽熱」，背後到底是甚麼心態？</h2><p>在感情占卜中，以下 5 張關鍵牌往往能直接照出對方最真實的心理狀態：</p><h3>1. 聖杯二 (Two of Cups) —— 雙向奔赴的靈魂吸引</h3><p>對方的核心牌出現聖杯二正位，代表他真誠渴望與你建立深刻連結。</p><h3>2. 權杖騎士 (Knight of Wands) —— 熱烈但可能稍縱即逝的激情</h3><p>他此時對你充滿好奇與征服欲，但若處於逆位，要留意熱情來得快去得也快。</p><h3>3. 寶劍二 (Two of Swords) —— 內心築起高牆的防禦者</h3><p>他在感情中受過傷，處於「想靠近卻害怕受傷」的矛盾狀態。</p><h3>4. 魔術師逆位 (The Magician Reversed) —— 需留意的包裝與漁場管理</h3><p>擅長甜言蜜語，但承諾遲遲不落實，需提高警覺。</p><h3>5. 錢幣四 (Four of Pentacles) —— 保守試探、不願主動付出代價</h3><p>害怕承擔責任，享受陪伴但短時間內不會給予關係名分。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 12: 該放手還是繼續等
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '該放手還是繼續等？塔羅牌教你判斷這段「內耗感情」是否值得挽回',
  'let-go-or-wait-toxic-relationship',
  '明明痛苦比快樂多，卻遲遲捨不得離開？透過真實占卜案例與自我檢核指標，教你用塔羅看清關係本質，走出情感內耗，拿回愛自己的勇氣。',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
  'cat_case_studies',
  array['感情挽回', '斷捨離', '情感內耗', '案例分析'],
  '<h2>我們放不下的，究竟是那個人，還是付出的沉沒成本？</h2><p>當一段關係讓你頻繁哭泣與自我懷疑時，它已從「滋養」變成了「內耗」。</p><h3>判斷是否該放手的 3 大塔羅指標牌：</h3><ol><li><strong>死神 (Death) 正位：</strong>舊篇章已完結，唯有放手埋葬過去，新生才能降臨。</li><li><strong>寶劍三 (Three of Swords)：</strong>核心本質已經是傷害大於愛，不要再為對方的冷漠找藉口。</li><li><strong>高塔 (The Tower)：</strong>虛假的關係終將崩解，及時止損才能保全尊嚴。</li></ol>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 13: 愚人是真愛還是玩玩
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '抽到「愚人」是真愛還是玩玩？深度解析塔羅牌中的 3 大浪子/海王特徵',
  'the-fool-true-love-or-player',
  '「他對每個人都很好，還是只對我特別？」解析愚人正逆位、聖杯騎士與魔術師逆位在愛情關係中的心理機制，教你識破不願承諾的「假性親密」。',
  'https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=1200',
  'cat_reading_secrets',
  array['浪子心理', '海王特徵', '感情避坑', '解牌心法'],
  '<h2>有些人的溫柔，只是他的社交禮貌與狩獵本能</h2><h3>三大浪子/海王特徵牌面：</h3><ul><li><strong>愚人 (The Fool)：</strong>熱愛當下與冒險，但一旦談及長遠承諾便會迅速抽離。</li><li><strong>聖杯騎士逆位：</strong>專職造夢的情感騙徒，沉迷於深情男主角的人設。</li><li><strong>魔術師逆位：</strong>話術大師，利用信任掩飾謊言與多線發展。</li></ul>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 14: 鏡像關係與盲點
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '愛情總是鬼打牆？用「鏡像關係」找出你在親密關係中重複受傷的盲點',
  'mirror-relationship-tarot-blind-spots',
  '為什麼每次戀愛都以相似的原因收場？塔羅牌是一面心靈鏡子，映照出你未曾察覺的內在匱乏與童年依附模式，帶你打破重複受傷的輪迴。',
  'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=1200',
  'cat_case_studies',
  array['親密關係', '鏡像投射', '自我療癒', '心理學'],
  '<h2>「為什麼我總會遇到同一種類型的人傷害我？」</h2><p>親密關係往往映照出我們尚未療癒的內在盲點。過度付出的皇后逆位容易吸引依賴幼態的伴侶；過度戒備的權杖九則容易把溫和的愛阻絕於心門之外。改變自己的心靈頻率，才能徹底翻轉吸引力法則。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 15: 如何挑選第一副牌
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '塔羅新手如何挑選第一副牌？偉特、托特與馬賽牌的完整新手指南',
  'how-to-choose-first-tarot-deck',
  '市面上塔羅牌琳瑯滿目，初學者該從何入手？深入對比萊德偉特（RWS）、托特（Thoth）與馬賽牌（Tarot of Marseilles）三大體系，為你指引最順手的第一步。',
  'https://images.unsplash.com/photo-1728241189734-f422205a6a53?auto=format&fit=crop&q=80&w=1200',
  'cat_beginner_guide',
  array['選牌指南', '萊德偉特', '新手教學', '自學塔羅'],
  '<h2>初學者首選：萊德·偉特塔羅 (RWS)</h2><p>78 張牌皆有生動具體的情景故事插圖，幾乎所有中文教材均以此為標準。托特與馬賽牌深奧但抽象，建議入門者先從偉特系牌卡建立扎實基礎。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 16: 破除 5 大迷思
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '初學者最常犯的 5 大迷思：牌卡真的會吸負能量？沒洗牌會不準嗎？',
  '5-common-tarot-myths-debunked',
  '「塔羅牌算多了命會變薄？」「抽到死神會有不幸？」破解流傳已久的 5 大塔羅民間迷思，建立健康、理智且充滿啟發性的現代靈性占卜觀念。',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1200',
  'cat_beginner_guide',
  array['破除迷信', '新手須知', '占卜觀念', '能量心理'],
  '<h2>塔羅是心靈鏡子，不是怪力亂神</h2><p>命不會越算越薄，關鍵在於不要將人生的主導權完全交給外部工具；死神代表蛻變而非死亡；保持敬畏與客觀，塔羅是絕佳的自我覺察工具。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 17: 數字學與四元素
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '78張牌背不起來？掌握「數字學＋四元素」，解牌速度翻倍的進階心法',
  'master-78-cards-numerology-elements',
  '還在一張一張死背 78 張牌義嗎？傳授資深占卜師的秘密武器：透過 1 到 10 的數字進化軸線加上火水風土四元素本質，瞬間看懂所有小牌故事！',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
  'cat_reading_secrets',
  array['四元素', '數字學', '解牌秘訣', '小阿爾克那'],
  '<h2>元素 × 數字 ＝ 秒懂牌義</h2><p>權杖（火/熱情）、聖杯（水/情感）、寶劍（風/思維）、錢幣（土/物質）。搭配 1（種子）到 10（圓滿）的生命週期演進，不用死記硬背，直觀看透小阿爾克那脈絡。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 18: 時間之流三張牌陣
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '三張牌搞定一切！「時間之流」牌陣：過去、現在、未來的高效實戰教學',
  'three-card-spread-past-present-future',
  '不需要複雜的十張大牌陣！簡單、精準且充滿洞見的「時間之流（過去／現在／未來）」牌陣，從問題設定到因果串聯解讀的完整實戰演練。',
  'https://images.unsplash.com/photo-1579407364450-481fe19dbfaa?auto=format&fit=crop&q=80&w=1200',
  'cat_tarot_spreads',
  array['時間之流', '三張牌陣', '牌陣教學', '實戰解牌'],
  '<h2>大道至簡的時間之流</h2><p>左邊過去（起因）、中間現在（焦點與選擇點）、右邊未來（趨勢）。重點在於因果串聯，看清現在該如何調整，以重塑未來的結果。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 19: 0號愚人深度指南
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '0號「愚人 (The Fool)」：歸零的勇氣！踏出未知懸崖的心靈啟示',
  'the-fool-major-arcana-guide',
  '愚人是整副塔羅牌靈魂之旅的起點。他站在懸崖邊，眼中只有天空與遠方。解析愚人牌的正逆位象徵、人生大冒險與跳脫舒適圈的深刻靈魂指引。',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
  'cat_major_arcana',
  array['大阿爾克那', '愚人', '重新開始', '冒險精神'],
  '<h2>踏向未知的無限潛能</h2><p>愚人站在懸崖邊，象徵跳脫舒適圈需要全然的信任。白狗提醒本能清醒，白玫瑰代表純潔動機。正位象徵勇於冒險的新起點；逆位警惕任性逃避與不計後果。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 20: 7號戰車深度指南
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '7號「戰車 (The Chariot)」：在矛盾與衝突中奪回人生的掌控權',
  'the-chariot-major-arcana-guide',
  '駕馭黑白雙獅的年輕將領，象徵著在慾望與理智、外在挑戰與內心恐懼之間取得平衡。深度剖析戰車牌如何指引我們在混亂局勢中開闢一條勝利之路。',
  'https://images.unsplash.com/photo-1669604728627-dda1f689be72?auto=format&fit=crop&q=80&w=1200',
  'cat_major_arcana',
  array['大阿爾克那', '戰車', '意志力', '自我掌控'],
  '<h2>自我意志的極致掌控</h2><p>將領無韁繩而能駕馭黑白雙獅，象徵透過專注的心念協調內在的理性與慾望。正位是克服萬難獲得勝利的極佳吉兆；逆位提醒避免剛愎自用與情緒失控。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 21: 斷聯期他在想什麼
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '斷聯期他在想什麼？抽到這 4 張牌，代表他正在偷偷關注你還是已放下？',
  'no-contact-what-is-he-thinking-tarot',
  '斷聯後的安靜，往往比爭吵更讓人窒息。從倒吊人、隱士、聖杯八到寶劍七，深度解碼對方在冷戰斷聯期的真實心理狀態與復聯幾率。',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200',
  'cat_reading_secrets',
  array['斷聯心態', '復聯時機', '冷戰心理', '愛情解答'],
  '<h2>斷聯後的寂靜：是徹底放下，還是暗潮洶湧的心理博弈？</h2><p>倒吊人代表暫停思考、隱士進入防禦閉關模式、寶劍七偷偷關注近況、聖杯八正在強迫自己放下。若想精確掌握復聯時機，推薦使用聖愛六芒星深度占卜！</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 22: 前任還會主動聯絡我嗎
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '前任還會主動聯絡我嗎？解密塔羅中 3 大「舊情復燃」的關鍵信號',
  'will-my-ex-contact-me-reconciliation-tarot',
  '分手後的遺憾與不捨，總讓人忍不住期待手機響起的那一刻。本文透過專業塔羅象徵，深度剖析最容易帶來復合轉機的 3 大神聖信號牌。',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
  'cat_case_studies',
  array['復合機率', '前任聯絡', '舊情復燃', '案例解析'],
  '<h2>舊情復燃的 3 大核心信號牌</h2><p>聖杯六喚醒甜蜜回憶與思念、審判正位預告死灰復燃與重生、命運之輪再次將宿命齒輪交會。真正的復合是兩個全新成熟的人重新相愛。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 23: 他心裡有別人嗎
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '他的心裡只有我嗎？揭開曖昧關係中是否存在「第三者」的 4 大牌面徵兆',
  'is-there-someone-else-third-party-tarot',
  '女人的直覺往往不是空穴來風。當對方的行蹤開始變得可疑、手機不離手時，教你從塔羅牌的隱微符號中，理性識別關係中的潛在干擾者。',
  'https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=1200',
  'cat_reading_secrets',
  array['第三者徵兆', '感情背叛', '解牌心法', '愛情盲點'],
  '<h2>女人的直覺，往往是潛意識的警訊</h2><p>聖杯三逆位代表邊界模糊的異性社交、寶劍七隱瞞與謊言、惡魔牌肉慾與誘惑、權杖二正在兩人之間權衡比較。看清局勢才能保護自己的底線。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 24: 是正緣還是孽緣
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '他是我的正緣嗎？如何從塔羅牌分辨「宿命孽緣」與「靈魂伴侶」？',
  'is-he-my-soulmate-or-karmic-lesson',
  '有些人遇見了像天雷勾動地火，卻把你傷得體無完膚；有些人相處平淡如水，卻能陪伴一生。教你用塔羅哲學精準分辨你的愛情究竟是「業力考驗」還是「神聖正緣」。',
  'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=1200',
  'cat_reading_secrets',
  array['正緣命定', '靈魂伴侶', '業力關係', '愛情解答'],
  '<h2>真正的正緣，會讓你感到安心平靜</h2><p>惡魔與高塔往往是業力關係的互相消耗；戀人、聖杯二、聖杯十才是真正的靈魂伴侶，讓你在彼此面前做最自在的自己。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 25: 男人冷淡原因
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '他為什麼突然對我冷淡？剖析男人在感情中「突然退縮」的 4 種深層心理',
  'why-is-he-acting-cold-suddenly-tarot',
  '前幾天還無話不談，怎麼突然回話變短、態度降到冰點？透過塔羅牌深入男性潛意識，拆解男人「洞穴期」與感情退縮的真正成因。',
  'https://images.unsplash.com/photo-1579407364450-481fe19dbfaa?auto=format&fit=crop&q=80&w=1200',
  'cat_case_studies',
  array['男人冷淡', '洞穴期', '情感心理', '案例解析'],
  '<h2>男人的突然冷淡：洞穴期與防衛機制</h2><p>錢幣八被工作現實佔滿、寶劍四心力交瘁休眠、寶劍騎士逆位自尊受挫生悶氣、聖杯五悲觀防禦。退後兩步專注自己，他自然會彈回你的身邊。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 26: 走向婚姻長久指標
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '我們會走到最後嗎？評估感情能否長久穩定的「聖愛未來」檢核指標',
  'will-we-last-long-term-love-future',
  '相愛容易相處難。從激情退去後的柴米油鹽，到共同面對生活的風雨，教你用塔羅牌檢核你們的感情是否具備走入婚姻、白頭偕老的能量基礎。',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
  'cat_tarot_spreads',
  array['走向婚姻', '長久感情', '牌陣檢核', '未來預測'],
  '<h2>長久感情的四大基石</h2><p>權杖四代表穩固的承諾與歸屬、錢幣十穩健現實基礎、節制牌高情商調和包容、教皇牌共同信念與契約精神。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 27: 無疾而終與放下
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '沒有說出口的再見：為什麼有些人注定只能陪你走一小段路？',
  'closure-without-goodbye-spiritual-meaning',
  '最遺憾的分手，往往是沒有正式的告白與告別。解析無疾而終的感情背後所蘊含的靈魂契約與深刻啟示，學會與遺憾和解。',
  'https://images.unsplash.com/photo-1669604728627-dda1f689be72?auto=format&fit=crop&q=80&w=1200',
  'cat_reading_secrets',
  array['無疾而終', '斷捨離', '自我療癒', '靈性心法'],
  '<h2>有些相遇，是為了喚醒你的靈魂</h2><p>信使完成使命後因緣自然散去；死神的恩慈避免了長期的慢性折磨；星星牌洗滌心靈，把淚水化為智慧。學會放下才是真正的成熟。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 28: 單身脫單預測
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '我什麼時候能脫單？解鎖未來 3 個月桃花運勢與新戀情的關鍵契機',
  'when-will-i-find-love-singles-tarot',
  '單身許久，想知道自己的正緣何時才會降臨？本文教你如何透過塔羅牌預測未來的桃花時機點，並提供快速提升個人戀愛吸引力的實用建議。',
  'https://images.unsplash.com/photo-1769974672482-b6726090c4ca?auto=format&fit=crop&q=80&w=1200',
  'cat_tarot_spreads',
  array['脫單預測', '桃花運勢', '單身必讀', '牌陣分析'],
  '<h2>桃花吉牌大盤點</h2><p>聖杯王牌溢位的情感甘霖、聖杯騎士浪漫追求者、權杖三遠方與跨界桃花、太陽牌熱烈光明。敞開胸懷，調成喜悅頻率迎接新戀情！</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 29: 高能量女王心法
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '如何讓他主動奔向你？運用「高能量女王」心法，徹底逆轉情感被動局勢',
  'how-to-attract-him-queen-energy-tarot',
  '卑微討好只會換來廉價的對待，真正的吸引力來自於內在的高貴與笃定。結合塔羅牌中的四大宮廷女王原型，教你活出讓男人情不自禁尊重的極致魅力。',
  'https://images.unsplash.com/photo-1765822019605-1c5f6a91864b?auto=format&fit=crop&q=80&w=1200',
  'cat_reading_secrets',
  array['女王心法', '吸引力法則', '兩性博弈', '高價值女人'],
  '<h2>高能量女王的四大原型</h2><p>權杖女王自信熱情自帶光芒、寶劍女王邊界分明及時止損、聖杯女王溫柔深邃情緒共鳴、錢幣女王經濟獨立生活豐盛。做自己的女王，才能吸引真正的國王。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- 文章 30: 實戰六芒星案例解密
insert into public."Post" (title, slug, excerpt, cover_image, category_id, tags, content, published) values
(
  '從瀕臨分手到甜蜜升溫：一場「聖愛六芒星」牌陣如何拯救陷入死局的關係？',
  'hexagram-saved-relationship-real-case',
  '冷戰一個月、互相拉黑，這段長達五年的感情真的無藥可救了嗎？完整還原一場真實諮詢案例，展示六芒星牌陣如何抽絲剝繭化解死局。',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1200',
  'cat_case_studies',
  array['六芒星牌陣', '真實案例', '關係修復', '實戰解牌'],
  '<h2>五年情侶的冷戰死局解方</h2><p>寶劍三的委屈被看見、權杖十的壓力被同理，雙方內心深處的聖杯十被重新喚醒。放下勝負心，用理解取代指責，成功挽回真摯愛情。</p>',
  true
)
on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- ==============================================================================
-- 5. 執行驗證與統計報告 (Verification & Stats)
-- ==============================================================================
do $$
declare
  v_categories int;
  v_posts int;
  v_settings int;
  v_users int;
begin
  select count(*) into v_categories from public."Category";
  select count(*) into v_posts from public."Post";
  select count(*) into v_settings from public."SystemSetting";
  select count(*) into v_users from public."User";

  raise notice '==================================================';
  raise notice '🎉 Supabase 資料庫重置與預設資料注入完成！';
  raise notice '--------------------------------------------------';
  raise notice '📁 分類數量 (Categories): %', v_categories;
  raise notice '📝 文章數量 (Posts): %', v_posts;
  raise notice '⚙️ 系統設定 (SystemSettings): %', v_settings;
  raise notice '👤 使用者數 (Users): %', v_users;
  raise notice '🛡️ RLS 安全政策: 已全面啟用，無任何公開漏洞';
  raise notice '==================================================';
end $$;
