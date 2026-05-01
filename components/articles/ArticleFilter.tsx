"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleFilterProps {
  categories: Category[];
  currentCategory?: string;
}

export default function ArticleFilter({ categories, currentCategory }: ArticleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find(c => c.slug === currentCategory);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/articles?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-12 flex justify-center" ref={dropdownRef}>
      <div className="flex items-center gap-4">
        <label className="text-[#C99041]/60 text-xs font-bold uppercase tracking-widest hidden sm:block">
          篩選專欄：
        </label>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-8 px-6 py-3 bg-[#1a1414]/80 backdrop-blur-md border border-[#C99041]/30 rounded-full hover:border-[#C99041] transition-all min-w-[200px] group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_25px_rgba(201,144,65,0.15)]"
        >
          <div className="flex items-center gap-3">
            <Filter className={`w-4 h-4 ${isOpen ? 'text-[#C99041]' : 'text-[#C99041]/60'} transition-colors`} />
            <span className="text-sm font-bold text-[#F9ECDC] tracking-wide">
              {selectedCategory ? selectedCategory.name : "所有文章"}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#C99041]/60 group-hover:text-[#C99041] transition-all ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-3 w-64 bg-[#1a1414]/95 backdrop-blur-xl border border-[#C99041]/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="py-2">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors hover:bg-[#C99041]/10 ${!currentCategory ? 'text-[#C99041]' : 'text-[#F9ECDC]/70'}`}
            >
              <span>所有文章</span>
              {!currentCategory && <Check className="w-4 h-4" />}
            </button>
            <div className="h-px bg-[#C99041]/10 mx-4 my-1" />
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelect(category.slug)}
                className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors hover:bg-[#C99041]/10 ${currentCategory === category.slug ? 'text-[#C99041]' : 'text-[#F9ECDC]/70'}`}
              >
                <span>{category.name}</span>
                {currentCategory === category.slug && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
