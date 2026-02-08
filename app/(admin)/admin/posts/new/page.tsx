import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          撰寫新文章
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          創新的內容將會同步顯示在部落格中
        </p>
      </div>
      <PostForm />
    </div>
  );
}
