import { prisma } from "@/lib/prisma";
import {
  Sparkles,
  Calendar,
  User,
  ExternalLink,
  Search,
  Clock,
  Layout,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import tarotCards from "@/data/tarot-cards";
import LogDetailsButton from "./LogDetailsDialog";

async function getDivinationRecords(searchEmail?: string) {
  const records = await prisma.divinationRecord.findMany({
    where: searchEmail
      ? {
          user: {
            email: {
              contains: searchEmail,
            },
          },
        }
      : {},
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
    take: 50,
  });
  return records as any[];
}

export default async function AdminDivinationsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const searchEmail = searchParams.email;
  const records = await getDivinationRecords(searchEmail);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            占卜紀錄彙整
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {searchEmail
              ? `正在檢視使用者 ${searchEmail} 的紀錄`
              : "全系統求問問題與 AI 響應品質監控日誌"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {searchEmail && (
            <a
              href="/admin/divinations"
              className="text-xs text-blue-500 hover:text-blue-400 font-bold border-b border-blue-500/30"
            >
              清除過濾
            </a>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="搜尋 Email 或 問題..."
              defaultValue={searchEmail || ""}
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 w-64 pl-10"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col md:flex-row group"
          >
            {/* Sidebar Label */}
            <div className="w-full md:w-60 bg-slate-950/50 p-5 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-slate-800 overflow-hidden bg-slate-900 shadow-inner">
                    {record.user.image ? (
                      <img
                        src={record.user.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-slate-200 text-xs font-bold truncate">
                      {record.user.name || "Anon."}
                    </p>
                    <p className="text-slate-500 text-[10px] truncate">
                      {record.user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">
                    {record.theme === "love_tarot"
                      ? "LOVE_TAROT"
                      : record.theme}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-medium">
                    <Clock className="w-3 h-3" />
                    {new Date(record.createdAt).toLocaleString("zh-TW", {
                      hour12: false,
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/50">
                <LogDetailsButton record={record} />
              </div>
            </div>

            {/* Content Display */}
            <div className="flex-1 p-6 space-y-5 bg-gradient-to-br from-slate-900 to-slate-950">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <Layout className="w-3 h-3" />
                  Query Context
                </div>
                <div className="text-slate-100 text-sm font-medium leading-relaxed bg-slate-800/40 p-4 rounded-lg border border-slate-800/50">
                  {record.question || "No prompt provided."}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    Model Result Payload
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    MD_RENDERED
                  </span>
                </div>
                <div className="text-slate-300 text-[13px] leading-relaxed max-h-64 overflow-y-auto bg-slate-950/80 p-5 rounded-lg border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{record.aiReading || "N/A"}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Cards Display */}
              {record.cards && Array.isArray(record.cards) && record.cards.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <Layout className="w-3 h-3" />
                    Drawn Cards
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {record.cards.map((card: any, idx: number) => (
                      <div key={idx} className="bg-slate-800/30 border border-slate-800/50 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                           {(card.image || tarotCards.find(t => t.name === card.name)?.image) ? (
                             <img 
                               src={card.image || tarotCards.find(t => t.name === card.name)?.image} 
                               alt="" 
                               className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} 
                             />
                           ) : (
                             'CARD'
                           )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-slate-200 text-xs font-bold truncate">{card.name}</p>
                          <p className={`text-[10px] font-medium ${card.isReversed ? 'text-red-400/80' : 'text-blue-400/80'}`}>
                            {card.isReversed ? 'REVERSED' : 'UPRIGHT'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {records.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
            <p className="text-slate-600 font-bold text-sm uppercase tracking-widest">
              No Data Records Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
