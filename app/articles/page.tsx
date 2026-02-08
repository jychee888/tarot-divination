import { getPosts } from "@/app/actions/post";
import Link from "next/link";
import { BookOpen, Calendar, Tag, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import BackgroundStars from "@/components/decorations/background-stars";
import { CornerDecoration } from "@/components/decorations/corner-decoration";

export const metadata = {
  title: "塔羅牌義介紹 | 心靈之眼 Soul's Eye",
  description: "深入了解 78 張塔羅牌的象徵意義、關鍵字與正逆位解釋。",
};

export default async function ArticlesPage() {
  const result = await getPosts(true); // Only published
  const posts = result.success ? result.data : [];

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

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 animate-in fade-in duration-1000">
        <div className="space-y-4 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C99041]/10 border border-[#C99041]/20 text-[#C99041] text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            知識庫
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F9ECDC] tracking-tight im-fell-english-regular">
            塔羅牌義全解析
          </h1>
          <p className="text-[#F9ECDC]/60 max-w-2xl mx-auto leading-relaxed">
            探索塔羅牌的神秘世界，從大阿爾克那到小阿爾克那，為您的直覺尋找最深層的指引。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link
              href={`/articles/${post.slug}`}
              key={post.id}
              className="group bg-[#1a1414]/60 backdrop-blur-sm border border-[#C99041]/20 rounded-[2rem] overflow-hidden hover:border-[#C99041]/50 transition-all hover:shadow-[0_0_30px_rgba(201,144,65,0.1)] flex flex-col"
            >
              <div className="aspect-[16/10] bg-[#1a1414] relative overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#C99041]/40 font-bold italic text-2xl im-fell-english-regular bg-[#C99041]/5">
                    Soul's Eye
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#171111]/90 backdrop-blur-md rounded-full text-[10px] font-bold text-[#C99041] border border-[#C99041]/30 shadow-lg">
                    {post.category?.name || "未分類"}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-[10px] text-[#F9ECDC]/50 mb-4 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C99041]/70" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#C99041]/70" />
                    {post.tags?.[0] || "General"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#F9ECDC] group-hover:text-[#C99041] transition-colors mb-3 leading-snug im-fell-english-regular line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-[#F9ECDC]/60 text-sm line-clamp-2 leading-relaxed mb-6 flex-1 theme-transition">
                  {post.excerpt ||
                    "點擊閱讀更多關於這張塔羅牌的深度解析與引導思考。"}
                </p>

                <div className="flex items-center gap-2 text-[#C99041] text-xs font-bold group-hover:translate-x-1 transition-transform tracking-widest uppercase">
                  閱讀全文
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-40 text-center space-y-4">
            <div className="w-16 h-16 bg-[#C99041]/10 rounded-full flex items-center justify-center mx-auto border border-[#C99041]/20">
              <BookOpen className="w-8 h-8 text-[#C99041]" />
            </div>
            <p className="text-[#F9ECDC]/60 italic">
              目前尚未發布任何內容，敬請期待。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
