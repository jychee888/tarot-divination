const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const slugToCheck = "three-card-spread-guide";
  console.log(`Checking for slug: "${slugToCheck}"`);

  const post = await prisma.post.findUnique({
    where: { slug: slugToCheck },
  });

  if (post) {
    console.log("Found post:", post.title);
    console.log("Slug:", post.slug);
    console.log("Published:", post.published);
  } else {
    console.log("Post NOT found with exact slug.");

    // List all slugs to see what we have
    const allPosts = await prisma.post.findMany({
      select: { title: true, slug: true },
    });
    console.log("\nAll existing slugs:");
    allPosts.forEach((p) => console.log(`- ${p.slug} (${p.title})`));
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
