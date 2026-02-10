# Soul's Eye - AI 塔羅占卜系統 (Tarot Divination System)

這是一個基於 AI 技術驅動的現代塔羅牌占卜平台，結合了傳統神祕學與尖端的人工智慧（Google Gemini），提供使用者深度、個性化的靈性啟示。

## 🚀 技術棧 (Technical Stack)

### 核心框架 (Core)

- **Next.js 16 (App Router)**: 使用最新的 Next.js 版本，利用伺服器組件 (Server Components) 實現高效能開發。
- **React 19**: 最新的 React 核心庫。
- **TypeScript**: 全站強類型開發，確保代碼健壯性。

### 人工智慧 (AI Integration)

- **Google Gemini API**: 整合 `@google/generative-ai`，用於動態生成塔羅牌義解讀與靈魂對話。

### 資料庫與認證 (Auth & Database)

- **Prisma ORM**: 現代化的資料庫操作模型。
- **MongoDB**: 作為底層非關係型資料庫，儲存用戶資料、占卜紀錄與文章內容。
- **NextAuth.js**: 安全的身份驗證系統，支援 Google 第三方登入。

### 前端 UI 與 動效 (Frontend & Animation)

- **Tailwind CSS**: 響應式、高度自定義的樣式框架。
- **Framer Motion**: 實現優美的卡牌翻轉、淡入淡出等微交互動畫。
- **Radix UI**: 提供無障礙 (Accessibility) 的基層 UI 組件庫。
- **Lucide React**: 現代簡約的圖標庫。
- **Recharts**: 用於管理後台的數據可視化統計圖表。

### 編輯器與文字處理 (Content & Markdown)

- **Tiptap**: 強大的富文本編輯器，用於管理後台文章撰寫。
- **React Markdown**: 用於渲染 AI 生成的 Markdown 格式解讀內容。

## ✨ 核心功能 (Key Features)

- **AI 聖愛深度解讀**: 針對愛情關係（曖昧、執迷、現任）提供六芒星牌陣的 AI 深度剖析。
- **每日靈感指引**: 使用者每日可抽取一張專屬塔羅牌，獲取當日的靈魂建議。
- **年度運勢占卜**: 提供多種主題（事業、健康、人際）的年度趨勢預測。
- **內容管理系統 (CMS)**: 完整的文章發布、分類篩選與標籤管理後台。
- **個人中心**: 使用者可查看歷史占卜紀錄與管理個人基本資料（靈魂參數）。
- **管理後台**: 包含用戶統計、占卜量分析以及與 Google Search Console/Analytics 的快速鏈結。

## 📁 目錄結構 (Directory Structure)

- `app/`: Next.js App Router 路由與頁面定義
  - `(admin)/`: 管理員專屬後台路由
  - `(member)/`: 會員專屬功能路由
  - `api/`: 後端 API 接口（AI 解讀、資料操作）
- `components/`: 可複用的 React 組件
  - `ui/`: 基於 Shadcn UI 的基礎組件
  - `decorations/`: 網站視覺裝飾組件（月相、雲朵等）
- `lib/`: 核心庫配置（Prisma, Auth, AI）
- `prisma/`: 資料庫模型定義 (Schema)
- `public/`: 靜態資源（圖片、字體）
- `data/`: 靜態資料（塔羅牌義庫）

## 🛠️ 開發與部署 (Setup & Deployment)

### 環境變數配置

請於 `.env` 檔案中配置以下 key：

```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# AI Service
GOOGLE_GENERATIVE_AI_API_KEY="..."

# Admin
SUPER_ADMIN_EMAIL="..."
```

### 開發指令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 生成 Prisma 客戶端
npx prisma generate

# 構建生產版本
npm run build
```

## 📈 SEO 與 數據分析

- 自動化 `sitemap.xml` 與 `robots.txt` 生成。
- 管理後台整合 **Google Search Console** 與 **Google Analytics** 快速查閱。
