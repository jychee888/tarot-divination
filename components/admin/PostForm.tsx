"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/actions/post";
import { getCategories } from "@/app/actions/classification";
import { generatePostDraft } from "@/app/actions/post-ai";
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
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { RichTextEditor } from "./RichTextEditor";

interface PostFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const CATEGORY_TEMPLATES: Record<
  string,
  { title: string; content: string; excerpt: string; tags: string[] }
> = {
  "major-arcana": {
    title: "【大阿爾克那】牌名 - 靈魂核心課題與智慧啟示",
    excerpt: "深入解析大阿爾克那卡牌的神話象徵、正逆位牌義與人生階段指引。",
    tags: ["大阿爾克那", "牌義解析", "靈魂成長"],
    content: `<h2>1. 牌面主題與核心象徵</h2>
<p>在此描述卡牌的畫面細節、主要人物與背景符號象徵...</p>
<h3>關鍵字速查：</h3>
<ul>
  <li><strong>正位：</strong>關鍵字1、關鍵字2、關鍵字3、正向發展</li>
  <li><strong>逆位：</strong>盲點提防、能量受阻、過度執著、轉化契機</li>
</ul>
<h3>深度牌面解析：</h3>
<p>詳細解析畫面中的色彩、神秘學符號與潛意識的投射寓意...</p>
<h3>給提問者的靈魂指引：</h3>
<p>在實際生活或情感抉擇中，這張牌帶給你的具體行動建議與心態轉念法...</p>`,
  },
  "minor-arcana": {
    title: "【小阿爾克那】牌名 - 日常情境與實戰指引",
    excerpt: "探討四大元素在現實生活、人際關係與職場發展中的具體展現。",
    tags: ["小阿爾克那", "生活應用", "牌義解析"],
    content: `<h2>小阿爾克那解析：元素與數字能量</h2>
<p>本張牌組所對應的四大元素（火/水/風/土）與日常生活情境...</p>
<h3>關鍵含義：</h3>
<ul>
  <li><strong>正位：</strong>順應能量、掌握時機、行動策略</li>
  <li><strong>逆位：</strong>調整步伐、溝通障礙、內在反思</li>
</ul>
<h3>實戰情境應用：</h3>
<p>針對事業工作、情感互動或個人財務的具體解讀示範...</p>`,
  },
  "beginner-guide": {
    title: "【新手入門】必學指引：從零建立你的塔羅直覺",
    excerpt: "第一次接觸塔羅牌？帶你掌握正確洗牌、抽牌心態與提問藝術的完整教學。",
    tags: ["新手教學", "自學塔羅", "直覺練習"],
    content: `<h2>新手入門：建立專注與神聖連結</h2>
<p>學習塔羅牌並不是死記硬背，而是學會與自己的潛意識對話...</p>
<h3>三大核心學習步驟：</h3>
<ol>
  <li><strong>步驟一：</strong>建立專屬的靜心儀式與提問意圖</li>
  <li><strong>步驟二：</strong>觀察畫面氛圍大於文字解釋</li>
  <li><strong>步驟三：</strong>在日記中記錄抽牌結果與生活驗證</li>
</ol>
<h3>常見初學者誤區與避坑心法：</h3>
<p>避免過度依賴命運論，將焦點放在「我現在能做什麼」的主動力量上...</p>`,
  },
  "tarot-spreads": {
    title: "【經典牌陣】牌陣名稱 - 結構剖析與實戰解牌",
    excerpt: "詳解牌陣排列方式、每個位置所代表的能量與實戰解讀順序。",
    tags: ["牌陣介紹", "實戰解牌", "高階技巧"],
    content: `<h2>牌陣設計背景與適用時機</h2>
<p>說明此牌陣最適合處理哪一種類型的問題（例如愛情抉擇、職涯轉換或深度自我探索）...</p>
<h3>牌陣結構與位置含義：</h3>
<ul>
  <li><strong>位置一：</strong>當事人目前的能量現狀與內在期待</li>
  <li><strong>位置二：</strong>外在環境因素、他人視角或潛在阻礙</li>
  <li><strong>位置三：</strong>深層核心挑戰或未被看見的盲點</li>
  <li><strong>位置四：</strong>未來的發展趨勢與宇宙給予的指引建議</li>
</ul>
<h3>解牌串聯邏輯示範：</h3>
<p>如何將多個位置的牌面呼應串聯成一個完整的故事，給出有深度且具體的建議...</p>`,
  },
  "reading-secrets": {
    title: "【解牌心法】突破瓶頸：超越牌義直達本質的解讀秘訣",
    excerpt: "不只是看圖說故事！掌握元素生剋、人物視線與靈性共鳴的高階解牌技術。",
    tags: ["解牌心法", "直覺訓練", "靈性導師"],
    content: `<h2>解牌心法：讓直覺成為你的第一語言</h2>
<p>許多人在自學過程中常遇到「背了很多牌義卻串不起來」的困擾，關鍵在於心法的轉換...</p>
<h3>高階解牌三大思維：</h3>
<ul>
  <li><strong>元素動態平衡：</strong>火水相剋還是風土相生？從元素流動看局勢走向。</li>
  <li><strong>人物視線與空間距離：</strong>卡牌中人物的面向往往透露出關係中的疏離或渴望。</li>
  <li><strong>共時性直覺捕捉：</strong>第一眼閃過的感覺往往是最核心的關鍵訊號。</li>
</ul>
<h3>實用修煉法：</h3>
<p>如何在日常占卜中訓練自己的靈性能量感知與表達技巧...</p>`,
  },
};

export function PostForm({ initialData, isEdit = false }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiForm, setAiForm] = useState({
    topic: "",
    tone: "溫暖、務實、可行動",
    audience: "新手",
    length: "medium" as "short" | "medium" | "long",
    keywords: "",
  });
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

  const handleGenerateDraft = async () => {
    if (!formData.categoryId) {
      toast.error("請先選擇一個分類");
      return;
    }
    // 主題改為選填，若為空則由 AI 根據分類生成

    setAiLoading(true);
    try {
      const result = await generatePostDraft({
        topic: aiForm.topic,
        tone: aiForm.tone,
        audience: aiForm.audience,
        length: aiForm.length,
        keywords: aiForm.keywords,
        categoryId: formData.categoryId,
      });

      if (!result.success) {
        toast.error(result.error || "AI 生成失敗");
        return;
      }

      const draft = result.data;

      setFormData((prev) => ({
        ...prev,
        title: draft.title,
        slug: draft.slug,
        excerpt: draft.excerpt,
        coverImage: draft.coverImage,
        tags: draft.tags,
        content: draft.content,
        published: false, // 預設草稿，避免誤發
      }));

      toast.success("AI 草稿已生成並回填到表單（預設為草稿）");
      setAiOpen(false);
    } catch (e) {
      toast.error("AI 生成時發生未知錯誤");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyTemplate = () => {
    const selectedCat = categories.find((c) => c.id === formData.categoryId);
    const slug = selectedCat?.slug || "";
    const template =
      CATEGORY_TEMPLATES[slug] || CATEGORY_TEMPLATES["major-arcana"];

    if (!template) {
      toast.info("此分類尚無預設範本");
      return;
    }

    if (
      formData.content &&
      !window.confirm(
        "這將會把此分類的預設範本內容覆蓋到當前編輯器中，確定要套用嗎？",
      )
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      title: prev.title || template.title,
      excerpt: prev.excerpt || template.excerpt,
      tags: prev.tags.length > 0 ? prev.tags : template.tags,
      content: template.content,
    }));
    toast.success(`已套用「${selectedCat?.name || "預設"}」的文章架構範本！`);
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
        <div className="flex items-center gap-2">
          {!isEdit && (
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold transition-all active:scale-95 text-sm border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              AI 生成草稿
            </button>
          )}
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
      </div>

      {aiOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => (aiLoading ? null : setAiOpen(false))}
          />
          <div className="relative w-[95vw] max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                  AI 生成文章草稿
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  生成後會回填到表單。您可以輸入主題，或留空讓 AI 根據分類自動發揮。
                </p>
              </div>
              <button
                type="button"
                disabled={aiLoading}
                onClick={() => setAiOpen(false)}
                className="text-slate-500 hover:text-slate-200 disabled:opacity-40"
                title="關閉"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  主題（選填，留空則自動生成）
                </label>
                <input
                  value={aiForm.topic}
                  onChange={(e) =>
                    setAiForm((p) => ({ ...p, topic: e.target.value }))
                  }
                  placeholder="例如：塔羅新手如何從牌面圖像開始解讀（留空則由 AI 擬定）"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    語氣/風格
                  </label>
                  <input
                    value={aiForm.tone}
                    onChange={(e) =>
                      setAiForm((p) => ({ ...p, tone: e.target.value }))
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    目標讀者
                  </label>
                  <input
                    value={aiForm.audience}
                    onChange={(e) =>
                      setAiForm((p) => ({ ...p, audience: e.target.value }))
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    長度
                  </label>
                  <select
                    value={aiForm.length}
                    onChange={(e) =>
                      setAiForm((p) => ({
                        ...p,
                        length: e.target.value as any,
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none text-sm appearance-none"
                  >
                    <option value="short">短（約 600-800 字）</option>
                    <option value="medium">中（約 900-1200 字）</option>
                    <option value="long">長（約 1400-1800 字）</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    關鍵字（可選）
                  </label>
                  <input
                    value={aiForm.keywords}
                    onChange={(e) =>
                      setAiForm((p) => ({ ...p, keywords: e.target.value }))
                    }
                    placeholder="例如：洗牌、心念、正逆位、共時性"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() => setAiOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-bold disabled:opacity-40"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={handleGenerateDraft}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  生成並回填
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <button
                type="button"
                onClick={handleApplyTemplate}
                className="w-full mt-2 py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-blue-500/20 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                套用此分類預設範本內容
              </button>
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
