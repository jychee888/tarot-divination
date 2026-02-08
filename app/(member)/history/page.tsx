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
import ReactMarkdown from "react-markdown";

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
    relationshipStatus?: string;
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
  const [themeFilter, setThemeFilter] = useState<
    "all" | "love_tarot" | "daily_draw" | "others"
  >("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Mappings for Chinese display
  const themeMap: Record<string, string> = {
    love: "愛情占卜",
    career: "事業發展",
    relationship: "人際關係",
    health: "健康運勢",
    "self-exploration": "自我探索",
    love_tarot: "聖愛深度啟示",
    "love-tarot": "聖愛深度啟示",
    "daily-draw": "每日靈感",
    每日靈感: "每日靈感",
  };

  const spreadMap: Record<string, string> = {
    single: "單張直覺",
    three: "三張時空",
    "celtic-cross": "塞爾特十字",
    "daily-draw": "每日引導",
    LOVE_SIX_CARDS: "聖愛六芒星",
    love_six_cards: "聖愛六芒星",
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

    if (themeFilter !== "all") {
      filtered = filtered.filter((record) => {
        const t = record.theme;
        if (themeFilter === "love_tarot")
          return t === "love_tarot" || t === "love-tarot";
        if (themeFilter === "daily_draw")
          return t === "daily-draw" || t === "每日靈感";
        if (themeFilter === "others")
          return ![
            "love_tarot",
            "love-tarot",
            "daily-draw",
            "每日靈感",
          ].includes(t);
        return true;
      });
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [history, dateFilter, themeFilter, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, themeFilter, sortOrder]);

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
    <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative pb-2 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center shadow-inner">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-serif tracking-widest uppercase">
                占卜歷史
              </h1>
              <p className="text-primary/40 font-serif text-[10px] uppercase tracking-[0.4em] mt-1">
                Records of Fate & Starry Insight
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Category/Theme Filters */}
          <div className="flex p-1 bg-background/50 backdrop-blur-md rounded-full border border-border w-fit">
            {(["all", "love_tarot", "daily_draw", "others"] as const).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setThemeFilter(t)}
                  className={`px-5 py-2 text-[10px] rounded-full transition-all duration-500 font-bold uppercase tracking-widest ${
                    themeFilter === t
                      ? "bg-primary/20 text-primary shadow-inner"
                      : "text-foreground/30 hover:text-foreground hover:bg-primary/5"
                  }`}
                >
                  {t === "all"
                    ? "全部類型"
                    : t === "love_tarot"
                      ? "聖愛啟示"
                      : t === "daily_draw"
                        ? "每日靈感"
                        : "塔羅運勢"}
                </button>
              ),
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Date Filters */}
            <div className="flex p-1 bg-background/50 backdrop-blur-md rounded-full border border-border">
              {(["all", "today", "week", "month"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`px-5 py-2 text-[10px] rounded-full transition-all duration-500 font-bold uppercase tracking-widest ${
                    dateFilter === f
                      ? "bg-primary/20 text-primary shadow-inner"
                      : "text-foreground/30 hover:text-foreground hover:bg-primary/5"
                  }`}
                >
                  {f === "all"
                    ? "全部時間"
                    : f === "today"
                      ? "今日"
                      : f === "week"
                        ? "本週"
                        : "本月"}
                </button>
              ))}
            </div>

            {/* Sort Order */}
            <div className="p-1 bg-background/50 backdrop-blur-md rounded-full border border-border">
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                }
                className="flex items-center gap-2 px-5 py-2 text-[10px] font-bold bg-primary/20 text-primary shadow-inner rounded-full transition-all uppercase tracking-widest font-serif"
              >
                {sortOrder === "newest" ? (
                  <SortDesc className="w-3.5 h-3.5" />
                ) : (
                  <SortAsc className="w-3.5 h-3.5" />
                )}
                {sortOrder === "newest" ? "最新優先" : "時光回溯"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-primary/5 border border-primary/5 animate-pulse overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>
          ))}
        </div>
      ) : totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-primary/5 border border-dashed border-primary/20 rounded-3xl">
          <div className="p-5 bg-primary/5 rounded-full ring-1 ring-primary/10">
            <Search className="w-10 h-10 text-primary/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-amber-100/80 font-serif">
              尚未發現星象紀錄
            </h3>
            <p className="text-foreground/40 max-w-xs mx-auto text-sm leading-relaxed">
              您的命運之書目前尚為空白。現在就開啟您的第一次靈魂對話吧。
            </p>
          </div>
          <Link href="/divination">
            <Button className="bg-primary/20 hover:bg-primary/30 text-foreground border border-primary/50 rounded-full px-8 h-12 shadow-lg transition-all group">
              <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              立即開始占卜
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map((record) => (
              <div
                key={record.id}
                className="group relative bg-card/10 border border-border rounded-[2.5rem] p-8 hover:bg-primary/10 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(245,173,79,0.1)] transition-all duration-700 cursor-pointer overflow-hidden backdrop-blur-sm"
                onClick={() => {
                  setSelectedReading(record);
                  setIsModalOpen(true);
                }}
              >
                {/* Subtle background glow effect on hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors font-serif tracking-widest italic">
                          {getThemeLabel(record.theme)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-primary/40 font-bold uppercase tracking-[0.2em]">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.createdAt).toLocaleDateString("zh-TW")}
                      </div>

                      {record.question && (
                        <p className="mt-3 text-xs text-foreground/70 font-serif leading-relaxed line-clamp-2">
                          {record.question}
                        </p>
                      )}
                    </div>

                    <button
                      className="p-2 text-red-500/20 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecordToDelete(record.id);
                        setIsDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8 flex-1">
                    {record.cards.slice(0, 3).map((card, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-xl text-[10px] border font-bold tracking-tight ${
                          card.isReversed
                            ? "bg-red-500/5 border-red-500/20 text-red-400/80"
                            : "bg-primary/5 border-primary/20 text-primary/80"
                        }`}
                      >
                        {card.name}
                        {card.isReversed && "(逆)"}
                      </div>
                    ))}
                    {record.cards.length > 3 && (
                      <span className="text-[10px] text-primary/40 flex items-center px-1 font-bold">
                        +{record.cards.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] text-primary/40 font-serif font-bold tracking-[0.2em] uppercase">
                      {getSpreadLabel(record.spreadType)}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-widest group-hover:text-primary/80 transition-colors">
                      詳細解讀
                      <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all">
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
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
              className="relative w-full max-w-5xl h-[90vh] bg-background border border-border rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative background glow */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
              </div>
              {/* Modal Header */}
              <div className="px-6 py-4 md:px-8 md:py-5 border-b border-border/50 flex items-center justify-between bg-card/90">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-bold text-foreground font-serif tracking-tight">
                    {getThemeLabel(selectedReading.theme)}
                  </h2>
                  <div className="flex items-center gap-4 text-[10px] text-primary/60 font-medium tracking-widest uppercase border-l border-border/50 pl-6">
                    <span className="bg-primary/10 px-2 py-0.5 rounded text-primary">
                      {getSpreadLabel(selectedReading.spreadType)}
                    </span>
                    <span className="text-foreground/40 hidden sm:inline">
                      {new Date(selectedReading.createdAt).toLocaleString(
                        "zh-TW",
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-foreground/30 hover:text-foreground"
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
                              className={`relative aspect-[2/3.5] w-full max-w-[200px] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105 border-2 ${isCardReversed ? "border-red-500/40" : "border-primary/40"}`}
                            >
                              <img
                                src={cardData?.image || "/images/card-back.svg"}
                                alt={card.name}
                                className={`w-full h-full object-cover ${isCardReversed ? "rotate-180" : ""}`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="text-center space-y-1">
                              <h3 className="text-xl font-bold text-foreground font-serif">
                                {card.name}
                              </h3>
                              <p
                                className={`text-xs font-bold uppercase tracking-tighter ${isCardReversed ? "text-red-400" : "text-primary"}`}
                              >
                                {isCardReversed ? "✦ 逆位 ✦" : "✦ 正位 ✦"}
                              </p>
                            </div>
                          </div>

                          {/* Text Side */}
                          <div className="flex-1 space-y-8">
                            <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-primary/50 text-[10px] font-bold uppercase tracking-[0.3em] font-serif">
                                <div className="w-8 h-px bg-primary/30"></div>
                                星象解讀
                              </h4>
                              <p className="text-foreground/90 text-lg md:text-xl leading-relaxed font-serif italic">
                                {isCardReversed
                                  ? meaning?.reversed?.summary || "暫無逆位解釋"
                                  : meaning?.upright?.summary || "暫無解釋"}
                              </p>
                            </div>

                            <div className="space-y-6">
                              <h4 className="flex items-center gap-2 text-primary/50 text-[10px] font-bold uppercase tracking-[0.3em] font-serif">
                                <div className="w-8 h-px bg-primary/30"></div>
                                核心啟示
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {(isCardReversed
                                  ? meaning?.reversed?.details
                                  : meaning?.upright?.details
                                )?.map((detail: string, i: number) => (
                                  <div
                                    key={i}
                                    className="flex gap-4 bg-white/5 p-5 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500 group/item"
                                  >
                                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-1 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                                    <span className="text-[15px] text-foreground/80 leading-relaxed font-serif">
                                      {detail}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < selectedReading.cards.length - 1 && (
                          <div className="pt-10 border-b border-white/5 w-full" />
                        )}
                      </Fragment>
                    );
                  })}
                </div>

                {/* AI Reading Section in History */}
                {selectedReading.aiReading && (
                  <div className="mt-12 pt-10 border-t border-border/50 space-y-8 mb-6">
                    <div className="bg-primary/5 border border-primary/30 rounded-[3rem] p-10 animate-in fade-in zoom-in duration-1000 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden min-h-[400px]">
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

                      <div className="flex flex-col items-center justify-center gap-4 mb-10">
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                          <Sparkles className="w-6 h-6 text-primary" />
                          <h4 className="text-2xl font-bold text-foreground font-serif tracking-widest text-center">
                            {selectedReading.theme === "love_tarot"
                              ? "聖愛深度啟示錄"
                              : "命運深度啟示錄"}
                          </h4>
                          <Sparkles className="w-6 h-6 text-primary" />
                          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                        </div>

                        {selectedReading.question && (
                          <div className="text-center space-y-1 mt-1">
                            <p className="text-sm text-primary/80 font-bold tracking-wide">
                              求問事項：{selectedReading.question}
                            </p>
                          </div>
                        )}

                        {selectedReading.userContext && (
                          <div className="text-[10px] text-primary/50 font-medium tracking-widest mt-2 uppercase flex flex-col items-center gap-1">
                            {/* Display Relationship Status for Love Tarot */}
                            {selectedReading.userContext.relationshipStatus && (
                              <span className="bg-primary/10 px-2 py-0.5 rounded text-primary/80">
                                關係對象：
                                {selectedReading.userContext
                                  .relationshipStatus === "crush"
                                  ? "曖昧對象"
                                  : selectedReading.userContext
                                        .relationshipStatus === "ex"
                                    ? "前任"
                                    : selectedReading.userContext
                                          .relationshipStatus === "current"
                                      ? "現任"
                                      : selectedReading.userContext
                                          .relationshipStatus}
                              </span>
                            )}

                            {/* Display User Profile Info */}
                            {(selectedReading.userContext.birthday ||
                              selectedReading.userContext.gender) && (
                              <span>
                                靈魂簽名：
                                {selectedReading.userContext.birthday ||
                                  "未知誕辰"}
                                {selectedReading.userContext.birthTime
                                  ? ` ${selectedReading.userContext.birthTime}`
                                  : ""}
                                {selectedReading.userContext.gender && (
                                  <>
                                    {" / "}
                                    {selectedReading.userContext.gender ===
                                    "male"
                                      ? "陽性能量"
                                      : selectedReading.userContext.gender ===
                                          "female"
                                        ? "陰性能量"
                                        : selectedReading.userContext.gender ===
                                            "non-binary"
                                          ? "多元能量"
                                          : "宇宙能量"}
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="prose prose-invert max-w-none text-md text-foreground/90 leading-[2.2] font-serif tracking-wide text-justify transition-all duration-1000">
                        <ReactMarkdown
                          components={{
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-2xl font-bold text-foreground my-8 flex items-center gap-3 border-l-4 border-primary/40 pl-4 bg-primary/5 py-2 rounded-r-xl"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-xl font-bold text-primary mt-12 mb-8 flex items-center gap-3 border-b border-primary/20 pb-4 font-serif tracking-widest italic"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p
                                className="mb-10 drop-shadow-sm leading-[2.4]"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong
                                className="text-primary font-bold drop-shadow-[0_0_10px_rgba(245,173,79,0.4)] px-1"
                                {...props}
                              />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-4 border-primary/40 pl-8 py-6 my-12 italic text-primary/90 bg-primary/5 rounded-r-3xl border-double"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {selectedReading.aiReading}
                        </ReactMarkdown>
                      </div>

                      <div className="mt-12 flex justify-center">
                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Blur Gradient Footer */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-red-500/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground font-serif">
                  確定要抹除記錄嗎？
                </h3>
                <p className="text-sm text-foreground/40 font-serif">
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
                className="w-full text-foreground/40 hover:text-foreground hover:bg-white/5 rounded-xl h-12"
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
