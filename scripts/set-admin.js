const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = "jychee888@gmail.com";
  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });
  console.log("成功將使用者更新為管理員:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
