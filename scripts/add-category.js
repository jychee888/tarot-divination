/**
 * 新增分類腳本 (Add Category Script)
 *
 * 使用方法 (Usage):
 * node scripts/add-category.js "分類名稱" "category-slug" "分類描述"
 *
 * 範例 (Example):
 * node scripts/add-category.js "新手入門指南" "beginner-guide" "第一次接觸塔羅？從如何洗牌、抽牌到建立儀式感的完整教學。"
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log("❌ 使用方法: node scripts/add-category.js \"分類名稱\" \"category-slug\" \"分類描述\"");
    console.log("範例: node scripts/add-category.js \"新手入門指南\" \"beginner-guide\" \"第一次接觸塔羅？從如何洗牌、抽牌到建立儀式感的完整教學。\"");
    process.exit(1);
  }

  const [name, slug, description = ""] = args;

  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || undefined,
      },
    });

    console.log(`✅ 分類新增成功！`);
    console.log(`   名稱: ${category.name}`);
    console.log(`   代碼: ${category.slug}`);
    console.log(`   描述: ${category.description || "無"}`);
  } catch (error) {
    if (error.code === "P2002") {
      console.error(`❌ 錯誤: 分類代碼 "${slug}" 或名稱 "${name}" 已存在`);
    } else {
      console.error(`❌ 錯誤:`, error.message);
    }
    process.exit(1);
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
