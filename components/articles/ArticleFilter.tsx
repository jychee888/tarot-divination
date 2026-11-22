"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Layers,
  BookOpen,
  Flame,
  Droplets,
  Sword,
  Coins,
  Compass,
  LayoutGrid,
  Eye,
  Search,
  ChevronDown,
  Check,
  X,
  Filter,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

interface ArticleFilterProps {
  categories: Category[];
  currentCategory?: string;
}

// 根據分類 slug 匹配對應的神祕學符號圖標
function getCategoryIcon(slug: string) {
  switch (slug) {
    case "major-arcana":
      return Layers;
    case "minor-arcana":
      return BookOpen;
    case "suit-of-wands":
      return Flame;
    case "suit-of-cups":
      return Droplets;
    case "suit-of-swords":
      return Sword;
    case "suit-of-pentacles":
      return Coins;
    case "beginner-guide":
      return Compass;
    case "tarot-spreads":
      return LayoutGrid;
    case "reading-secrets":
      return Eye;
    case "case-studies":
      return Search;
    default:
      return Sparkles;
  }
}

// 解析中英文名稱
function parseCategoryName(fullName: string) {
  if (fullName.includes(" (") && fullName.endsWith(")")) {
    const parts = fullName.split(" (");
    return {
      chinese: parts[0],
      english: parts[1].slice(0, -1),
    };
  }
  return { chinese: fullName, english: "" };
}

export default function ArticleFilter({
  categories,
  currentCategory,
}: ArticleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((c) => c.slug === currentCategory);

  // 所有文章總數
  const totalPostsCount = categories.reduce(
    (sum, c) => sum + (c._count?.posts || 0),
    0
  );

  // 點選外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/articles?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const ActiveIcon = selectedCategory
    ? getCategoryIcon(selectedCategory.slug)
    : Sparkles;

  const activeNameInfo = selectedCategory
    ? parseCategoryName(selectedCategory.name)
    : { chinese: "全部文章", english: "All Articles" };

  return (
    <div className={`relative mb-10 w-full ${isOpen ? "z-40" : "z-20"}`}>
      {/* 整合式奢華工具列：左側統計與標籤狀態，右側精緻星象下拉觸發器 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 px-4 sm:px-6 rounded-2xl bg-[#140e0e]/90 border border-[#C99041]/25 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        
        {/* 左側：專欄統計與即時狀態 */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-2 h-2 rounded-full bg-[#C99041] animate-pulse shadow-[0_0_8px_#C99041]" />
          
          <div className="flex items-center gap-2 text-xs text-[#F9ECDC]/80">
            <span className="text-[#F9ECDC]/50 hidden sm:inline">專欄狀態：</span>
            {selectedCategory ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C99041]/15 border border-[#C99041]/30 text-[#C99041] font-bold">
                <ActiveIcon className="w-3.5 h-3.5" />
                <span>{activeNameInfo.chinese}</span>
                <span className="text-[10px] text-[#C99041]/70 font-mono">
                  ({selectedCategory._count?.posts ?? 0} 篇)
                </span>
              </span>
            ) : (
              <span className="font-medium text-[#F9ECDC]">
                已收錄全站 <strong className="text-[#C99041] font-bold">{totalPostsCount}</strong> 篇塔羅心靈指引
              </span>
            )}
          </div>

          {selectedCategory && (
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="inline-flex items-center gap-1 text-[11px] text-[#C99041]/80 hover:text-[#C99041] px-2.5 py-1 rounded-full bg-[#C99041]/10 border border-[#C99041]/20 hover:border-[#C99041]/40 transition-all hover:bg-[#C99041]/20 cursor-pointer"
              title="清除篩選，檢視所有文章"
            >
              <X className="w-3 h-3" />
              <span>瀏覽全站</span>
            </button>
          )}
        </div>

        {/* 右側：精緻星象下拉觸發按鈕 */}
        <div className="relative w-full sm:w-auto z-50" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-auto inline-flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl bg-[#1e1717] hover:bg-[#251c1c] border border-[#C99041]/35 hover:border-[#C99041] text-[#F9ECDC] text-xs font-medium transition-all shadow-[0_2px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(201,144,65,0.2)] group cursor-pointer"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#C99041]/15 border border-[#C99041]/30 flex items-center justify-center text-[#C99041]">
                <ActiveIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-[#F9ECDC] tracking-wide">
                  {selectedCategory ? activeNameInfo.chinese : "探索所有專欄"}
                </span>
                <span className="text-[10px] text-[#C99041]/70 font-mono">
                  {selectedCategory ? activeNameInfo.english : "共 10 個核心分類"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-[#C99041]/20 pl-3">
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#C99041]/20 text-[#C99041] font-mono font-bold">
                {selectedCategory ? (selectedCategory._count?.posts ?? 0) : totalPostsCount}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#C99041]/80 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#C99041]" : ""
                }`}
              />
            </div>
          </button>

          {/* 展開面板：2 欄式卡牌網格選擇器（解決單欄太長、在中間遮擋的痛點） */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-3 w-full sm:w-[480px] md:w-[540px] bg-[#140e0e]/98 backdrop-blur-2xl border border-[#C99041]/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(201,144,65,0.25)] z-[100] p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              
              {/* 頂部全覽按鈕 */}
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all mb-3 border ${
                  !currentCategory
                    ? "bg-[#C99041]/20 border-[#C99041] shadow-[0_0_15px_rgba(201,144,65,0.25)]"
                    : "bg-[#1e1717]/80 hover:bg-[#251c1c] border-[#C99041]/20 hover:border-[#C99041]/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#C99041]/20 border border-[#C99041]/40 flex items-center justify-center text-[#C99041]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#F9ECDC]">
                      全部文章 (All Articles)
                    </span>
                    <span className="text-[10px] text-[#F9ECDC]/50">
                      瀏覽全站 30 篇完整牌義、心理學與實戰解答
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#C99041] text-[#120d0d] font-bold">
                    {totalPostsCount} 篇
                  </span>
                  {!currentCategory && <Check className="w-4 h-4 text-[#C99041]" />}
                </div>
              </button>

              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-bold text-[#C99041]/70 uppercase tracking-widest font-mono">
                  ✦ 選擇專屬專欄 (10 大主題)
                </span>
                <span className="text-[10px] text-[#F9ECDC]/40">
                  點選卡片即時過濾
                </span>
              </div>

              {/* 2 欄式卡牌網格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
                {categories.map((category) => {
                  const isSelected = currentCategory === category.slug;
                  const Icon = getCategoryIcon(category.slug);
                  const nameInfo = parseCategoryName(category.name);
                  const count = category._count?.posts ?? 0;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelect(category.slug)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl transition-all border text-left cursor-pointer ${
                        isSelected
                          ? "bg-[#C99041]/20 border-[#C99041] shadow-[0_0_12px_rgba(201,144,65,0.25)]"
                          : "bg-[#1a1414]/90 hover:bg-[#231a1a] border-[#C99041]/15 hover:border-[#C99041]/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[#C99041] text-[#120d0d]"
                              : "bg-[#C99041]/10 text-[#C99041] group-hover:bg-[#C99041]/20"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-xs font-bold truncate transition-colors ${
                              isSelected
                                ? "text-[#C99041]"
                                : "text-[#F9ECDC] group-hover:text-[#C99041]"
                            }`}
                          >
                            {nameInfo.chinese}
                          </span>
                          {nameInfo.english && (
                            <span className="text-[9px] text-[#C99041]/50 font-mono truncate">
                              {nameInfo.english}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 pl-1">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                            count > 0
                              ? isSelected
                                ? "bg-[#C99041] text-[#120d0d] font-bold"
                                : "bg-[#C99041]/15 text-[#C99041] font-semibold"
                              : "text-[#F9ECDC]/30 bg-white/5"
                          }`}
                        >
                          {count}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C99041]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
