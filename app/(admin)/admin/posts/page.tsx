import { getPosts } from "@/app/actions/post";
import PostManager from "@/components/admin/PostManager";

export default async function AdminPostsPage() {
  const result = await getPosts();
  const posts = result.success ? result.data : [];

  return <PostManager initialPosts={posts} />;
}
