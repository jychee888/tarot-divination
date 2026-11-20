/**
 * 本地資料庫備份腳本 (Local Database Backup Script)
 * 
 * 執行方式:
 *   npm run db:backup
 *   或 node scripts/backup-db.js
 * 
 * 功能:
 *   將資料庫中所有主要資料表（使用者、占卜紀錄、文章、分類、系統設定等）
 *   完整匯出為 JSON 格式，儲存於本地電腦的 backups/ 目錄中。
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function backup() {
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve(__dirname, "../backups", `backup-${dateStr}`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`\n📦 開始備份資料庫到本地電腦: ${backupDir}\n`);

  const models = [
    { name: "users", fetch: () => prisma.user.findMany() },
    { name: "accounts", fetch: () => prisma.account.findMany() },
    { name: "sessions", fetch: () => prisma.session.findMany() },
    { name: "divinationRecords", fetch: () => prisma.divinationRecord.findMany() },
    { name: "posts", fetch: () => prisma.post.findMany() },
    { name: "categories", fetch: () => prisma.category.findMany() },
    { name: "tags", fetch: () => prisma.tag.findMany() },
    { name: "systemSettings", fetch: () => prisma.systemSetting.findMany() },
    { name: "emailOtps", fetch: () => prisma.emailOtp.findMany() },
    { name: "verificationTokens", fetch: () => prisma.verificationToken.findMany() },
  ];

  const summary = {
    backupDate: now.toISOString(),
    counts: {},
  };

  for (const model of models) {
    try {
      console.log(`⏳ 正在匯出 ${model.name}...`);
      const data = await model.fetch();
      const filePath = path.join(backupDir, `${model.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      summary.counts[model.name] = data.length;
      console.log(`  ✅ ${model.name}: 共 ${data.length} 筆資料已儲存`);
    } catch (err) {
      console.warn(`  ⚠️ 匯出 ${model.name} 時跳過或失敗: ${err.message}`);
      summary.counts[model.name] = "error";
    }
  }

  // 寫入摘要說明檔
  fs.writeFileSync(
    path.join(backupDir, "summary.json"),
    JSON.stringify(summary, null, 2),
    "utf-8"
  );

  console.log(`\n🎉 備份完成！`);
  console.log(`📁 備份檔案存放路徑: ${backupDir}`);
  console.log(`💡 若未來資料庫遺失，可執行 'npm run db:restore' 進行還原。\n`);
}

backup()
  .catch((err) => {
    console.error("❌ 備份過程中發生錯誤:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
