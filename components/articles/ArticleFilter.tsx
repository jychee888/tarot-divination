"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";

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

export default function ArticleFilter({
  categories,
  currentCategory,
}: ArticleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // 計算所有文章總數（將各分類文章數加總，若分類有重複文章則 fallback 或準確呈現）
  const totalPostsCount = categories.reduce(
    (sum, c) => sum + (c._count?.posts || 0),
    0
  );

  // 當選中特定分類時，自動平滑滾動讓該 Tab 保持在可視區域中
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentCategory]);

  const handleSelect = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/articles?${params.toString()}`, { scroll: false });
  };

  return (
    <nav
      className="relative mb-10 w-full"
      aria-label="文章分類導航"
    >
      {/* 奢華金色下劃線導航容器 */}
      <div className="relative border-b border-[#C99041]/20">
        {/* 左側滾動淡出遮罩（僅在有更多內容時平滑過渡） */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[rgb(23,17,17)] to-transparent z-10 md:hidden" />
        
        {/* 右側滾動淡出遮罩 */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[rgb(23,17,17)] to-transparent z-10 md:hidden" />

        {/* 橫向單行頁籤列表（遵從 Modern Web Guidance 規範：保持單行滾動，不折行） */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="塔羅專欄分類"
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth px-2 sm:px-4 pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "inline proximity" }}
        >
          {/* 所有文章 Tab */}
          <button
            type="button"
            role="tab"
            ref={!currentCategory ? activeTabRef : null}
            aria-selected={!currentCategory}
            onClick={() => handleSelect(null)}
            className={`group relative flex-none flex items-center gap-2 pb-3.5 pt-1 text-sm font-medium transition-all cursor-pointer border-b-2 ${
              !currentCategory
                ? "text-[#C99041] border-[#C99041] font-bold shadow-[0_2px_12px_rgba(201,144,65,0.4)]"
                : "text-[#F9ECDC]/60 hover:text-[#F9ECDC] border-transparent hover:border-[#C99041]/30"
            }`}
            style={{ scrollSnapAlign: "start" }}
          >
            <span className="tracking-wide">所有文章</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors ${
                !currentCategory
                  ? "bg-[#C99041] text-[#171111] font-bold"
                  : "bg-[#C99041]/15 text-[#C99041]/70 group-hover:bg-[#C99041]/25 group-hover:text-[#C99041]"
              }`}
            >
              {totalPostsCount > 0 ? totalPostsCount : "全部"}
            </span>
          </button>

          {/* 各個獨立分類 Tab */}
          {categories.map((category) => {
            const isSelected = currentCategory === category.slug;
            const count = category._count?.posts ?? 0;

            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                ref={isSelected ? activeTabRef : null}
                aria-selected={isSelected}
                onClick={() => handleSelect(category.slug)}
                className={`group relative flex-none flex items-center gap-2 pb-3.5 pt-1 text-sm font-medium transition-all cursor-pointer border-b-2 ${
                  isSelected
                    ? "text-[#C99041] border-[#C99041] font-bold shadow-[0_2px_12px_rgba(201,144,65,0.4)]"
                    : "text-[#F9ECDC]/60 hover:text-[#F9ECDC] border-transparent hover:border-[#C99041]/30"
                }`}
                style={{ scrollSnapAlign: "start" }}
              >
                <span className="tracking-wide">{category.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors ${
                    isSelected
                      ? "bg-[#C99041] text-[#171111] font-bold"
                      : "bg-[#C99041]/15 text-[#C99041]/70 group-hover:bg-[#C99041]/25 group-hover:text-[#C99041]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
