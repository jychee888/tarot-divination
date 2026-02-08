const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const gaId = "G-EQE2XFKCJD";

  await prisma.systemSettings.upsert({
    where: { key: "ga_id" },
    update: { value: gaId },
    create: { key: "ga_id", value: gaId },
  });

  console.log(`Successfully updated GA ID to: ${gaId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
