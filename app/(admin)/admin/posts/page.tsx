import { getPosts } from "@/app/actions/post";
import { getCategories } from "@/app/actions/classification";
import PostManager from "@/components/admin/PostManager";

export default async function AdminPostsPage() {
  const [postsResult, categoriesResult] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);
  const posts = postsResult.success ? postsResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return <PostManager initialPosts={posts} allCategories={categories} />;
}

