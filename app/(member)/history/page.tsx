"use client";

import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Calendar,
  SortDesc,
  SortAsc,
  Trash2,
  ChevronRight,
  X,
  Sparkles,
  AlertCircle,
  Search,
} from "lucide-react";
import tarotCards from "@/data/tarot-cards";
import Pagination from "@/components/Pagination";
import ModalPortal from "@/components/ui/ModalPortal";
import { Button } from "@/components/ui/button";
import { MoonPhaseIndicator } from "@/components/decorations/moonPhaseIndicator";

interface Card {
  id?: string;
  cardId?: string;
  name: string;
  isReversed: boolean;
  meaning: string;
}

interface DivinationRecord {
  id: string;
  theme: string;
  spreadType: string;
  question?: string;
  aiReading?: string;
  userContext?: {
    birthday?: string;
    birthTime?: string;
    gender?: string;
  };
  cards: Card[];
  createdAt: string;
}

export default function HistoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<DivinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReading, setSelectedReading] =
    useState<DivinationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Filter and sort states
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month" | "year"
  >("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Mappings for Chinese display
  const themeMap: Record<string, string> = {
    love: "愛情",
    career: "事業",
    relationship: "人際",
    health: "健康",
    "self-exploration": "自我探索",
    每日靈感: "每日靈感",
  };

  const spreadMap: Record<string, string> = {
    single: "單張牌",
    three: "三張牌",
    "celtic-cross": "十字牌",
    "daily-draw": "每日靈感",
  };

  const getThemeLabel = (theme: string) => themeMap[theme] || theme;
  const getSpreadLabel = (spread: string) => spreadMap[spread] || spread;

  // Filter and sort the history
  const filteredAndSortedHistory = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let filtered = [...history];

    if (dateFilter !== "all") {
      let startDate = new Date(today);
      switch (dateFilter) {
        case "today":
          break;
        case "week":
          startDate.setDate(today.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(today.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter(
        (record) => new Date(record.createdAt) >= startDate,
      );
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [history, dateFilter, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, sortOrder]);

  const totalItems = filteredAndSortedHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredAndSortedHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = useCallback(async (id: string) => {
    setDeleteError(null);
    try {
      const response = await fetch(`/api/divinations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("刪除失敗");
      setHistory((prev) => prev.filter((record) => record.id !== id));
      setIsDeleteConfirmOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "刪除失敗");
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    if (status === "authenticated") {
      const fetchHistory = async () => {
        try {
          const response = await fetch("/api/divinations");
          if (!response.ok) throw new Error("Failed to fetch");
          const data = await response.json();
          setHistory(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [status, router]);

  return (
    <div className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative pb-6 border-b border-[#C99041] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Clock className="w-6 h-6 text-[#C99041]/60" />
            </div>
            <h1 className="text-2xl font-bold text-amber-100 font-serif tracking-tight">
              占卜歷史
            </h1>
          </div>
          <p className="text-amber-100/60 mt-2 font-serif uppercase tracking-widest text-xs">
            回顧過去，洞見未來
          </p>
        </div>

        {/* Filters and Sorting Controls */}
        <div className="flex flex-col sm:items-end gap-3 min-w-0">
          <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-[#C99041]">
            {(["all", "today", "week", "month"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className={`px-4 py-1.5 text-xs rounded-full transition-all duration-300 font-medium ${
                  dateFilter === f
                    ? "bg-[#C99041]/20 text-amber-50"
                    : "text-amber-100/40 hover:text-amber-100 hover:bg-white/5"
                }`}
              >
                {f === "all"
                  ? "全部"
                  : f === "today"
                    ? "今日"
                    : f === "week"
                      ? "本週"
                      : "本月"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
              }
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-amber-950/40 border border-[#C99041]/20 text-amber-100/60 hover:text-amber-100 hover:border-[#C99041]/50 rounded-full transition-all font-serif"
            >
              {sortOrder === "newest" ? (
                <SortDesc className="w-3.5 h-3.5" />
              ) : (
                <SortAsc className="w-3.5 h-3.5" />
              )}
              {sortOrder === "newest" ? "最新優先" : "由舊到新"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-amber-900/5 border border-amber-500/5 animate-pulse overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>
          ))}
        </div>
      ) : totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-amber-900/5 border border-dashed border-amber-500/20 rounded-3xl">
          <div className="p-5 bg-amber-500/5 rounded-full ring-1 ring-amber-500/10">
            <Search className="w-10 h-10 text-amber-500/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-amber-100/80 font-serif">
              尚未發現星象紀錄
            </h3>
            <p className="text-amber-100/40 max-w-xs mx-auto text-sm leading-relaxed">
              您的命運之書目前尚為空白。現在就開啟您的第一次靈魂對話吧。
            </p>
          </div>
          <Link href="/divination">
            <Button className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border border-[#C99041]/50 rounded-full px-8 h-12 shadow-lg transition-all group">
              <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              立即開始占卜
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((record) => (
              <div
                key={record.id}
                className="group relative bg-[#1a1414] border border-[#C99041] rounded-2xl p-6 hover:bg-[#251c1c] hover:border-[#F5AD4F] hover:shadow-[0_0_30px_rgba(201,144,65,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg"
                onClick={() => {
                  setSelectedReading(record);
                  setIsModalOpen(true);
                }}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-base font-bold text-amber-50 group-hover:text-amber-300 transition-colors tracking-tight font-serif">
                        {getThemeLabel(record.theme)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#C99041] font-bold uppercase tracking-[0.15em]">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.createdAt).toLocaleDateString("zh-TW")}
                      </div>
                    </div>
                    <button
                      className="p-2 text-red-500/40 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecordToDelete(record.id);
                        setIsDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {record.cards.slice(0, 3).map((card, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1 rounded-full text-[10px] border font-bold ${card.isReversed ? "bg-red-500/10 border-red-500/40 text-red-400" : "bg-amber-500/10 border-[#C99041]/40 text-amber-200"}`}
                      >
                        {card.name}
                        {card.isReversed && "(逆)"}
                      </div>
                    ))}
                    {record.cards.length > 3 && (
                      <span className="text-[10px] text-amber-100/30 flex items-center">
                        +{record.cards.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-500/5 flex items-center justify-between">
                  <span className="text-[10px] text-[#C99041] font-serif font-medium tracking-wider uppercase">
                    {getSpreadLabel(record.spreadType)}
                  </span>
                  <div className="p-1 px-4 flex items-center gap-1.5 text-[10px] text-amber-200 bg-amber-500/20 rounded-full border border-[#C99041]/50 font-bold group-hover:bg-[#C99041] group-hover:text-amber-950 transition-all">
                    詳細啟示
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Reading Details Modal */}
      {isModalOpen && selectedReading && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div
              className="relative w-full max-w-5xl h-[90vh] bg-amber-950/95 border border-[#C99041]/20 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 md:px-8 md:py-5 border-b border-[#C99041]/10 flex items-center justify-between bg-gradient-to-b from-amber-900/10 to-transparent">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-bold text-amber-100 font-serif tracking-tight">
                    {getThemeLabel(selectedReading.theme)}
                  </h2>
                  <div className="flex items-center gap-4 text-[10px] text-amber-500/60 font-medium tracking-widest uppercase border-l border-[#C99041]/20 pl-6">
                    <span className="bg-amber-500/10 px-2 py-0.5 rounded text-amber-400">
                      {getSpreadLabel(selectedReading.spreadType)}
                    </span>
                    <span className="text-amber-100/40 hidden sm:inline">
                      {new Date(selectedReading.createdAt).toLocaleString(
                        "zh-TW",
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-amber-100/30 hover:text-amber-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="grid grid-cols-1 gap-10">
                  {selectedReading.cards.map((card, index) => {
                    const cardData =
                      tarotCards.find(
                        (t) => t.id === card.id || t.name === card.name,
                      ) || ({} as any);
                    const meanings = cardData?.meanings || {};
                    const themeKey =
                      Object.keys(meanings).find(
                        (key) => key === selectedReading.theme,
                      ) || Object.keys(meanings)[0];
                    const meaning = themeKey ? meanings[themeKey] : {};
                    const isCardReversed = card.isReversed;

                    return (
                      <Fragment key={index}>
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 animate-in slide-in-from-bottom-8 duration-700 delay-100 group">
                          {/* Card Side */}
                          <div className="w-full md:w-56 shrink-0 flex flex-col items-center gap-4">
                            <div
                              className={`relative aspect-[2/3.5] w-full max-w-[200px] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105 border-2 ${isCardReversed ? "border-red-500/40" : "border-amber-500/40"}`}
                            >
                              <img
                                src={cardData?.image || "/images/card-back.svg"}
                                alt={card.name}
                                className={`w-full h-full object-cover ${isCardReversed ? "rotate-180" : ""}`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="text-center space-y-1">
                              <h3 className="text-xl font-bold text-amber-100 font-serif">
                                {card.name}
                              </h3>
                              <p
                                className={`text-xs font-bold uppercase tracking-tighter ${isCardReversed ? "text-red-400" : "text-amber-500"}`}
                              >
                                {isCardReversed ? "✦ 逆位 ✦" : "✦ 正位 ✦"}
                              </p>
                            </div>
                          </div>

                          {/* Text Side */}
                          <div className="flex-1 space-y-8">
                            <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-amber-500/50 text-[10px] font-bold uppercase tracking-[0.3em] font-serif">
                                <div className="w-8 h-px bg-amber-500/30"></div>
                                星象解讀
                              </h4>
                              <p className="text-amber-100/90 text-lg md:text-xl leading-relaxed font-serif italic">
                                {isCardReversed
                                  ? meaning?.reversed?.summary || "暫無逆位解釋"
                                  : meaning?.upright?.summary || "暫無解釋"}
                              </p>
                            </div>

                            <div className="space-y-6">
                              <h4 className="flex items-center gap-2 text-amber-500/50 text-[10px] font-bold uppercase tracking-[0.3em] font-serif">
                                <div className="w-8 h-px bg-amber-500/30"></div>
                                核心啟示
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {(isCardReversed
                                  ? meaning?.reversed?.details
                                  : meaning?.upright?.details
                                )?.map((detail: string, i: number) => (
                                  <div
                                    key={i}
                                    className="flex gap-4 bg-amber-900/10 p-5 rounded-2xl border border-amber-500/10 hover:border-amber-500/30 transition-all duration-500 group/item"
                                  >
                                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-1 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                                    <span className="text-[15px] text-amber-100/80 leading-relaxed font-serif">
                                      {detail}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < selectedReading.cards.length - 1 && (
                          <div className="pt-10 border-b border-amber-900/20 w-full" />
                        )}
                      </Fragment>
                    );
                  })}
                </div>

                {/* AI Reading Section in History */}
                {selectedReading.aiReading && (
                  <div className="mt-12 pt-10 border-t border-[#C99041]/10 space-y-8 mb-6">
                    <div className="bg-[#C99041]/5 border border-[#C99041]/30 rounded-[2rem] p-8 md:p-10 shadow-inner relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-24 h-24 text-[#C99041]" />
                      </div>

                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#C99041]/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-[#C99041]" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-amber-100 font-serif tracking-tight">
                              星辰啟讀報告
                            </h4>
                            {selectedReading.question && (
                              <p className="text-xs text-amber-500/60 font-medium tracking-wide mt-1">
                                核心焦點：{selectedReading.question}
                              </p>
                            )}
                            {selectedReading.userContext && (
                              <p className="text-[10px] text-amber-500/40 font-medium tracking-widest mt-0.5 uppercase">
                                靈魂簽名：
                                {selectedReading.userContext.birthday ||
                                  "未知誕辰"}
                                {selectedReading.userContext.birthTime
                                  ? ` ${selectedReading.userContext.birthTime}`
                                  : ""}{" "}
                                /{" "}
                                {selectedReading.userContext.gender === "male"
                                  ? "陽性能量"
                                  : selectedReading.userContext.gender ===
                                      "female"
                                    ? "陰性能量"
                                    : selectedReading.userContext.gender ===
                                        "non-binary"
                                      ? "多元能量"
                                      : "宇宙能量"}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-amber-50/90 leading-relaxed font-serif whitespace-pre-wrap border-l-2 border-[#C99041]/20 pl-6">
                          {selectedReading.aiReading}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Blur Gradient Footer */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-amber-950 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
          <div className="bg-amber-950 border border-red-500/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-amber-100 font-serif">
                  確定要抹除記錄嗎？
                </h3>
                <p className="text-sm text-amber-100/40 font-serif">
                  這筆星象紀錄將永遠從您的命運之書中消失，此動作無法復原。
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col space-y-3">
              <Button
                onClick={() => recordToDelete && handleDelete(recordToDelete)}
                className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-xl h-12 font-medium transition-all"
              >
                確認抹除
              </Button>
              <Button
                onClick={() => setIsDeleteConfirmOpen(false)}
                variant="ghost"
                className="w-full text-amber-100/40 hover:text-amber-100 hover:bg-white/5 rounded-xl h-12"
              >
                保留記錄
              </Button>
            </div>

            {deleteError && (
              <p className="mt-4 text-red-500 text-xs text-center">
                {deleteError}
              </p>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
