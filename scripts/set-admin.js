const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || process.argv[2];

  if (!email) {
    console.error("請提供 Email 或是設定 SUPER_ADMIN_EMAIL 環境變數");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    console.log(
      "成功將使用者更新為管理員:",
      user.email,
      "目前角色:",
      user.role,
    );
  } catch (error) {
    console.error("更新失敗，可能該 Email 不存在於資料庫中。");
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
