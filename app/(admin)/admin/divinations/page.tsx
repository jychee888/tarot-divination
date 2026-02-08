import { prisma } from "@/lib/prisma";
import {
  Sparkles,
  History,
  Calendar,
  User,
  ExternalLink,
  Search,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

async function getDivinationRecords() {
  const records = await prisma.divinationRecord.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    take: 50, // Limit to last 50 for safety
  });
  return records as any[];
}

export default async function AdminDivinationsPage() {
  const records = await getDivinationRecords();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-100 tracking-wider">
            占卜紀錄彙整
          </h1>
          <p className="text-amber-200/40 mt-1 font-serif">
            監控全系統的占卜活動、問題與 AI 解讀品質
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜尋問題或內容..."
            className="bg-[#171111] border border-amber-900/30 rounded-full px-6 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-500/50 w-64 pl-12"
          />
          <Search className="w-4 h-4 text-amber-500/50 absolute left-5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-[#171111] border border-amber-900/30 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/20 transition-all flex flex-col md:flex-row"
          >
            {/* Left Info Bar */}
            <div className="w-full md:w-64 bg-black/40 p-6 border-b md:border-b-0 md:border-r border-amber-900/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-amber-500/30 overflow-hidden bg-black/60">
                    {record.user.image ? (
                      <img
                        src={record.user.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-amber-700" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-amber-100 text-xs font-bold truncate">
                      {record.user.name || "匿名用戶"}
                    </p>
                    <p className="text-amber-200/30 text-[10px] truncate">
                      {record.user.email}
                    </p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20 block w-fit">
                    {record.theme === "love_tarot" ? "聖愛塔羅" : record.theme}
                  </span>
                  <p className="text-amber-200/40 text-[10px] font-serif flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.createdAt).toLocaleString("zh-TW")}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-amber-900/20">
                <button className="text-amber-500/60 hover:text-amber-400 text-[10px] font-serif flex items-center gap-1 transition-colors group">
                  查看完整資料{" "}
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-amber-500/40 text-[10px] font-serif uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  提問內容
                </h3>
                <p className="text-amber-100 font-serif text-lg leading-relaxed italic border-l-2 border-amber-500/20 pl-4 bg-amber-500/5 py-2 rounded-r-lg">
                  「{record.question || "未提供提問內容"}」
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-amber-500/40 text-[10px] font-serif uppercase tracking-widest flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  AI 解讀片段
                </h3>
                <div className="text-amber-200/80 text-sm font-serif line-clamp-3 overflow-hidden mask-fade-bottom">
                  <ReactMarkdown>
                    {record.aiReading || "無 AI 解讀內容"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}

        {records.length === 0 && (
          <div className="py-20 text-center border border-dashed border-amber-900/30 rounded-3xl bg-black/20">
            <p className="text-amber-200/20 font-serif italic text-lg">
              目前尚無任何占卜紀錄
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
