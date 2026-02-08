import { getPostBySlug } from "@/app/actions/post";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import { Calendar, Tag, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { DivinationBackground } from "@/components/decorations/divination-background";
import BackgroundStars from "@/components/decorations/background-stars";
import { CornerDecoration } from "@/components/decorations/corner-decoration";
import { getPreviousAndNextPosts } from "@/app/actions/post";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const result = await getPostBySlug(params.slug);
  if (!result.success || !result.data) return { title: "文章未找到" };
  const post = result.data;
  return {
    title: `${post.title} | 心靈之眼 Soul's Eye`,
    description: post.excerpt,
  };
}

export default async function ArticleDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const result = await getPostBySlug(params.slug);
  const navigation = await getPreviousAndNextPosts(params.slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;
  const { previous, next } =
    navigation.success && navigation.data
      ? navigation.data
      : { previous: null, next: null };

  return (
    <div className="relative min-h-screen bg-[rgb(23,17,17)] text-[#F9ECDC] overflow-hidden">
      <BackgroundStars />

      {/* Golden Borders */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 border-[18px] border-[rgb(23,17,17)] rounded-3xl opacity-100"></div>
        <div className="absolute inset-2 sm:inset-4 border border-[#C99041] rounded-3xl opacity-50"></div>
        <div className="absolute inset-4 sm:inset-8 border border-[#C99041] rounded-xl opacity-50"></div>
        <CornerDecoration
          position="top-left"
          className="top-2 left-2 sm:top-4 sm:left-4"
        />
        <CornerDecoration
          position="top-right"
          className="top-2 right-2 sm:top-4 sm:right-4"
        />
        <CornerDecoration
          position="bottom-right"
          className="bottom-2 right-2 sm:bottom-4 sm:right-4 scale-x-[-1]"
        />
        <CornerDecoration
          position="bottom-left"
          className="bottom-2 left-2 sm:bottom-4 sm:left-4 scale-y-[-1]"
        />
      </div>

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 animate-in fade-in duration-1000">
        <div className="mb-12 space-y-6">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-[#F9ECDC]/60 hover:text-[#C99041] transition-colors text-sm font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            所有內容
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[10px] text-[#C99041] font-bold uppercase tracking-[0.2em]">
              <span className="px-2 py-0.5 bg-[#C99041]/10 rounded border border-[#C99041]/20">
                {post.category?.name || "未分類"}
              </span>
              <span className="flex items-center gap-1.5 text-[#F9ECDC]/60">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F9ECDC] leading-[1.15] tracking-tight im-fell-english-regular">
              {post.title}
            </h1>
          </div>
        </div>

        {post.coverImage && (
          <div className="mb-16 aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-[#C99041]/30 shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#171111] via-transparent to-transparent opacity-60 z-10" />
            <img
              src={post.coverImage}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt=""
            />
          </div>
        )}

        <article className="prose prose-invert prose-amber max-w-none prose-headings:font-bold prose-headings:text-[#F9ECDC] prose-headings:im-fell-english-regular prose-p:text-[#F9ECDC]/80 prose-p:leading-relaxed prose-p:text-lg prose-li:text-[#F9ECDC]/80 prose-strong:text-[#C99041]">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-20 pt-10 border-t border-[#C99041]/20 flex flex-wrap gap-3">
          {post.tags?.map((tag: string) => (
            <span
              key={tag}
              className="px-4 py-1.5 bg-[#C99041]/10 rounded-full text-xs text-[#C99041] border border-[#C99041]/20"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Navigation Links (Previous/Next) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-[#C99041]/20">
          {previous ? (
            <Link
              href={`/articles/${previous.slug}`}
              className="group flex flex-col items-start p-6 rounded-2xl border border-[#C99041]/20 hover:border-[#C99041]/50 bg-[#C99041]/5 hover:bg-[#C99041]/10 transition-all text-left"
            >
              <span className="text-xs font-bold text-[#C99041] mb-2 uppercase tracking-wider flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                上一篇
              </span>
              <span className="text-[#F9ECDC] font-bold group-hover:text-[#C99041] transition-colors line-clamp-2">
                {previous.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/articles/${next.slug}`}
              className="group flex flex-col items-end p-6 rounded-2xl border border-[#C99041]/20 hover:border-[#C99041]/50 bg-[#C99041]/5 hover:bg-[#C99041]/10 transition-all text-right"
            >
              <span className="text-xs font-bold text-[#C99041] mb-2 uppercase tracking-wider flex items-center gap-1">
                下一篇
                <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[#F9ECDC] font-bold group-hover:text-[#C99041] transition-colors line-clamp-2">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-24 p-10 bg-[#1a1414]/80 backdrop-blur-md border border-[#C99041]/30 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#C99041]/5 to-transparent pointer-events-none" />
          <div className="w-16 h-16 bg-[#C99041] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(201,144,65,0.3)] relative z-10">
            <BookOpen className="w-8 h-8 text-[#171111]" />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-[#F9ECDC] tracking-wide">
              想了解更多生命的啟示嗎？
            </h3>
            <p className="text-[#F9ECDC]/60 text-sm">
              點擊下方按鈕，開啟您的專屬 AI 塔羅占卜之旅。
            </p>
          </div>
          <Link
            href="/divination"
            className="relative z-10 px-8 py-3 bg-[#C99041] text-[#171111] font-bold rounded-full hover:bg-[#F9ECDC] transition-all shadow-xl active:scale-95 duration-300"
          >
            立即開始占卜
          </Link>
        </div>
      </main>
    </div>
  );
}
