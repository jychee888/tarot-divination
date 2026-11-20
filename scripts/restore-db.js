/**
 * 本地資料庫還原腳本 (Local Database Restore Script)
 * 
 * 執行方式:
 *   npm run db:restore
 *   或 node scripts/restore-db.js [備份資料夾名稱]
 * 
 * 功能:
 *   讀取 backups/ 目錄下的備份 JSON 檔案，將資料重新注入到資料庫中。
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function restore() {
  const backupsRoot = path.resolve(__dirname, "../backups");

  if (!fs.existsSync(backupsRoot)) {
    console.error("❌ 找不到 backups 目錄，請先執行備份或提供備份檔案。");
    process.exit(1);
  }

  // 取得指定的備份目錄或預設最新的一個
  const targetDirName = process.argv[2];
  let backupDir;

  if (targetDirName) {
    backupDir = path.resolve(backupsRoot, targetDirName);
  } else {
    const allDirs = fs
      .readdirSync(backupsRoot)
      .filter((name) => name.startsWith("backup-"))
      .sort()
      .reverse();

    if (allDirs.length === 0) {
      console.error("❌ backups 目錄中沒有任何備份資料夾！");
      process.exit(1);
    }

    backupDir = path.join(backupsRoot, allDirs[0]);
  }

  if (!fs.existsSync(backupDir)) {
    console.error(`❌ 指定的備份目錄不存在: ${backupDir}`);
    process.exit(1);
  }

  console.log(`\n🔄 開始從本地備份還原至資料庫...`);
  console.log(`📁 使用備份路徑: ${backupDir}\n`);

  function loadJson(name) {
    const p = path.join(backupDir, `${name}.json`);
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    }
    return null;
  }

  // 1. 還原分類 (Categories)
  const categories = loadJson("categories");
  if (categories && categories.length > 0) {
    console.log(`⏳ 還原分類 (${categories.length} 筆)...`);
    for (const item of categories) {
      await prisma.category.upsert({
        where: { slug: item.slug },
        update: item,
        create: item,
      }).catch((e) => console.warn(`  - 分類 ${item.slug} 略過: ${e.message}`));
    }
    console.log(`  ✅ 分類還原完成`);
  }

  // 2. 還原使用者 (Users)
  const users = loadJson("users");
  if (users && users.length > 0) {
    console.log(`⏳ 還原使用者 (${users.length} 筆)...`);
    for (const item of users) {
      if (item.email) {
        await prisma.user.upsert({
          where: { email: item.email },
          update: item,
          create: item,
        }).catch((e) => console.warn(`  - 使用者 ${item.email} 略過: ${e.message}`));
      }
    }
    console.log(`  ✅ 使用者還原完成`);
  }

  // 3. 還原文章 (Posts)
  const posts = loadJson("posts");
  if (posts && posts.length > 0) {
    console.log(`⏳ 還原文章 (${posts.length} 筆)...`);
    for (const item of posts) {
      await prisma.post.upsert({
        where: { slug: item.slug },
        update: item,
        create: item,
      }).catch((e) => console.warn(`  - 文章 ${item.slug} 略過: ${e.message}`));
    }
    console.log(`  ✅ 文章還原完成`);
  }

  // 4. 還原占卜紀錄 (DivinationRecords)
  const records = loadJson("divinationRecords");
  if (records && records.length > 0) {
    console.log(`⏳ 還原占卜紀錄 (${records.length} 筆)...`);
    for (const item of records) {
      await prisma.divinationRecord.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      }).catch((e) => console.warn(`  - 占卜紀錄 ${item.id} 略過: ${e.message}`));
    }
    console.log(`  ✅ 占卜紀錄還原完成`);
  }

  // 5. 還原系統設定 (SystemSettings)
  const settings = loadJson("systemSettings");
  if (settings && settings.length > 0) {
    console.log(`⏳ 還原系統設定 (${settings.length} 筆)...`);
    for (const item of settings) {
      await prisma.systemSetting.upsert({
        where: { key: item.key },
        update: item,
        create: item,
      }).catch((e) => console.warn(`  - 設定 ${item.key} 略過: ${e.message}`));
    }
    console.log(`  ✅ 系統設定還原完成`);
  }

  console.log(`\n🎉 還原程序完成！資料庫已成功回復。\n`);
}

restore()
  .catch((err) => {
    console.error("❌ 還原過程中發生錯誤:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
