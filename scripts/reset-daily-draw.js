const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function resetDailyDraw() {
  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0); // Reset to beginning of UTC day

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

    console.log(
      `Searching for daily draw records between ${startOfDay.toISOString()} and ${endOfDay.toISOString()}`,
    );

    const records = await prisma.divinationRecord.findMany({
      where: {
        spreadType: "daily-draw",
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    console.log(`Found ${records.length} records to delete.`);

    if (records.length > 0) {
      const deleteResult = await prisma.divinationRecord.deleteMany({
        where: {
          spreadType: "daily-draw",
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });
      console.log(`Deleted ${deleteResult.count} records.`);
    } else {
      console.log("No records found for today.");
    }
  } catch (error) {
    console.error("Error resetting daily draw:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDailyDraw();
