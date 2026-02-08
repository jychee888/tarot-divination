"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/actions/post";
import { getCategories } from "@/app/actions/classification";
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Type,
  FileText,
  Hash,
  AlertCircle,
  Loader2,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { RichTextEditor } from "./RichTextEditor";

interface PostFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function PostForm({ initialData, isEdit = false }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    coverImage: initialData?.coverImage || "",
    categoryId: initialData?.categoryId || "",
    tags: initialData?.tags || [],
    published: initialData?.published || false,
  });

  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories();
      if (result.success) {
        setCategories(result.data);
        // 如果是新增模式且有分類，預設選第一個
        if (!isEdit && result.data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: result.data[0].id }));
        }
      }
    }
    loadCategories();
  }, [isEdit, formData.categoryId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as any;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      const newData = { ...prev, [name]: val };
      if (name === "title" && !isEdit) {
        newData.slug = value
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      }
      return newData;
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("請選擇一個分類");
      return;
    }
    setLoading(true);

    try {
      const result = isEdit
        ? await updatePost(initialData.id, formData)
        : await createPost(formData);

      if (result.success) {
        toast.success(isEdit ? "更新成功！" : "文章已創建！");
        router.push("/admin/posts");
        router.refresh();
      } else {
        toast.error(`操作失敗: ${result.error}`);
      }
    } catch (error) {
      toast.error("發生未知錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between sticky top-20 z-30 bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-800/50">
        <Link
          href="/admin/posts"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEdit ? "更新文章" : "發布文章"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Type className="w-3 h-3 text-blue-400" />
                文章標題
              </label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="例如：0. 愚者 (The Fool) - 開放與無限可能"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3 h-3 text-emerald-400" />
                網址代碼 (Slug)
              </label>
              <div className="flex items-center">
                <span className="bg-slate-800 text-slate-500 px-3 py-3 rounded-l-xl border border-r-0 border-slate-800 text-xs font-mono">
                  /articles/
                </span>
                <input
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="the-fool-guide"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-r-xl px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3 text-purple-400" />
                文章內容 (圖文編輯器)
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(html: string) =>
                  setFormData((prev) => ({ ...prev, content: html }))
                }
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-3 h-3 text-orange-400" />
                封面圖片位址
              </label>
              <input
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none text-xs"
              />
              {formData.coverImage && (
                <div className="mt-2 rounded-lg border border-slate-800 p-1 bg-slate-950 overflow-hidden aspect-video relative">
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  文章分類
                </label>
                <Link
                  href="/admin/posts"
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  管理分類
                </Link>
              </div>
              <select
                required
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none text-sm appearance-none"
              >
                <option value="" disabled>
                  選擇分類...
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                短摘要 (Excerpt)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                placeholder="簡短描述文章內容..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                標籤管理 (Enter 新增)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20 group"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="輸入標籤後按 Enter..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none text-xs pl-8"
                />
                <PlusCircle className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-md border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/20"
                />
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                    公開發布
                  </p>
                  <p className="text-[10px] text-slate-500">
                    選中後，文章將會顯示在公開列表與 Sitemap
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-[11px] text-blue-400/80 leading-relaxed">
              <strong>提示：</strong> 您目前的發布狀態為{" "}
              {formData.published ? "「公開」" : "「私密」"}。 分類與標籤有助於
              SEO 搜尋引擎優化。
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
