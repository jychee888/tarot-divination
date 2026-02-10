"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePost } from "@/app/actions/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FilePlus,
  Calendar,
  Tag as TagIcon,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  Library,
  FolderOpen,
  Loader2,
  Filter,
  ChevronDown,
} from "lucide-react";
import CategoryManager from "./CategoryManager";

interface PostManagerProps {
  initialPosts: any[];
}

export default function PostManager({ initialPosts }: PostManagerProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

  // 取得所有唯一的分類
  const categories = Array.from(
    new Set(
      initialPosts
        .map((p: any) => p.category?.name)
        .filter((name: string | undefined) => name !== undefined),
    ),
  ).sort() as string[];

  // 根據選擇的分類過濾文章
  const posts =
    selectedCategory === "all"
      ? initialPosts
      : initialPosts.filter((p: any) => p.category?.name === selectedCategory);

  const togglePublishStatus = async (post: any) => {
    setUpdatingId(post.id);
    try {
      const result = await updatePost(post.id, {
        published: !post.published,
        slug: post.slug, // Ensure slug is preserved
      });

      if (result.success) {
        toast.success(post.published ? "文章已轉為草稿" : "文章已發布");
        router.refresh();
      } else {
        toast.error(`更新失敗: ${result.error}`);
      }
    } catch (error) {
      toast.error("發生未知錯誤");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Library className="w-7 h-7 text-blue-400" />
            內容資產管理
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            統一管理文章、塔羅牌義、分類與標籤系統
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm"
          >
            <FilePlus className="w-4 h-4" />
            撰寫新文章
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "posts"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <FilePlus className="w-4 h-4" />
          文章列表
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "categories"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          分類管理
        </button>
      </div>

      {activeTab === "posts" ? (
        <div className="space-y-8">
          {/* Stats Mini Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                總文章數
              </p>
              <p className="text-xl font-bold text-slate-100">
                {posts?.length || 0}
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                已發布
              </p>
              <p className="text-xl font-bold text-emerald-400">
                {posts?.filter((p: any) => p.published).length || 0}
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                草稿箱
              </p>
              <p className="text-xl font-bold text-orange-400">
                {posts?.filter((p: any) => !p.published).length || 0}
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                標籤總計
              </p>
              <p className="text-xl font-bold text-purple-400">
                {
                  Array.from(new Set(posts.flatMap((p: any) => p.tags || [])))
                    .length
                }
              </p>
            </div>
          </div>

          {/* Filters & Actions Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Filter className="w-4 h-4" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-10 pr-10 py-2.5 appearance-none focus:outline-none focus:border-blue-500/50 transition-all hover:bg-slate-900"
                >
                  <option value="all">所有文章分類</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-xs text-slate-500 hover:text-blue-400 font-bold transition-colors whitespace-nowrap"
                >
                  清除篩選
                </button>
              )}
            </div>

            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
              顯示數量: {posts.length} / {initialPosts.length}
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      文章標題
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      分類與標籤
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      狀態 (點擊切換)
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      日期
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                      管理操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {posts?.map((post: any) => (
                    <tr
                      key={post.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 relative overflow-hidden flex-shrink-0">
                            {post.coverImage ? (
                              <img
                                src={post.coverImage}
                                className="object-cover w-full h-full"
                                alt=""
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-700">
                                No Img
                              </div>
                            )}
                          </div>
                          <div className="max-w-[200px] md:max-w-xs lg:max-w-md">
                            <p className="text-slate-200 text-sm font-semibold truncate group-hover:text-blue-400 transition-colors">
                              {post.title}
                            </p>
                            <p className="text-slate-500 text-[10px] truncate mt-0.5 font-mono italic">
                              /{post.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20 self-start">
                            <TagIcon className="w-2.5 h-2.5" />
                            {post.category?.name || "未分類"}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {post.tags?.map((tag: string) => (
                              <span
                                key={tag}
                                className="text-[9px] text-slate-500 bg-slate-800 px-1.5 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublishStatus(post)}
                          disabled={updatingId === post.id}
                          className={`transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                            post.published
                              ? "hover:opacity-80"
                              : "hover:opacity-80"
                          }`}
                        >
                          {updatingId === post.id ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold px-2 py-0.5 bg-slate-800 rounded-full cursor-wait">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              更新中...
                            </span>
                          ) : post.published ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                              <CheckCircle2 className="w-3 h-3" />
                              已發布
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-orange-400 font-bold px-2 py-0.5 bg-orange-500/10 rounded-full border border-orange-500/20">
                              <XCircle className="w-3 h-3" />
                              草稿箱
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-600" />
                          {new Date(post.createdAt).toISOString().split("T")[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                            title="編輯"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/articles/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                            title="預覽"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Edit3 className="w-12 h-12 text-slate-800" />
                          <p className="text-slate-500 text-sm italic">
                            尚無任何文章內容
                          </p>
                          <Link
                            href="/admin/posts/new"
                            className="text-blue-400 text-xs font-bold hover:underline"
                          >
                            去撰寫第一篇吧
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-500">
          <CategoryManager />
        </div>
      )}
    </div>
  );
}
