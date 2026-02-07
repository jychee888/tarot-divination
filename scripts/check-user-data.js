// Script to check if user profile data is being saved to database
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkUserData() {
  try {
    // Get all users with their profile data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        nickname: true,
        bio: true,
        birthday: true,
        birthTime: true,
        gender: true,
      },
    });

    console.log("=== 用戶資料檢查 ===\n");

    if (users.length === 0) {
      console.log("資料庫中沒有用戶");
      return;
    }

    users.forEach((user, index) => {
      console.log(`用戶 ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  名稱: ${user.name || "未設置"}`);
      console.log(`  Email: ${user.email || "未設置"}`);
      console.log(`  暱稱: ${user.nickname || "未設置"}`);
      console.log(`  自我介紹: ${user.bio || "未設置"}`);
      console.log(`  生日: ${user.birthday || "未設置"}`);
      console.log(`  出生時間: ${user.birthTime || "未設置"}`);
      console.log(`  性別: ${user.gender || "未設置"}`);
      console.log("---\n");
    });

    console.log(`總共 ${users.length} 位用戶`);
  } catch (error) {
    console.error("檢查失敗:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserData();
