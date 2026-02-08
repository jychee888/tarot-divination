import { getPostById } from "@/app/actions/post";
import { PostForm } from "@/components/admin/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const result = await getPostById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          編輯文章
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          正在修改：
          <span className="text-blue-400 font-medium">{result.data.title}</span>
        </p>
      </div>
      <PostForm initialData={result.data} isEdit />
    </div>
  );
}
