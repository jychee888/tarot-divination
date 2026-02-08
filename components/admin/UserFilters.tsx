"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 內部狀態
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const debouncedQuery = useDebounce(query, 500);
  const isInitialMount = useRef(true);

  // 監聽狀態變化並更新 URL
  useEffect(() => {
    // 第一次加載不執行，避免複寫 URL
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    // 更新參數
    if (debouncedQuery) params.set("q", debouncedQuery);
    else params.delete("q");

    if (role) params.set("role", role);
    else params.delete("role");

    if (status) params.set("status", status);
    else params.delete("status");

    const newSearch = params.toString();
    const currentSearch = searchParams.toString();

    if (newSearch !== currentSearch) {
      router.push(`/admin/users${newSearch ? `?${newSearch}` : ""}`);
    }
  }, [debouncedQuery, role, status, router]); // 這裡拿掉 searchParams 依賴，防止迴圈

  const clearFilters = () => {
    setQuery("");
    setRole("");
    setStatus("");
    router.push("/admin/users");
  };

  const hasFilters = query || role || status;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold rounded-lg border border-slate-700 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          重置
        </button>
      )}

      {/* Role Filter */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 cursor-pointer appearance-none"
      >
        <option value="">所有權限</option>
        <option value="user">一般使用者 (User)</option>
        <option value="admin">管理員 (Admin)</option>
      </select>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 cursor-pointer appearance-none"
      >
        <option value="">所有狀態</option>
        <option value="active">使用中 (Active)</option>
        <option value="blocked">已封鎖 (Blocked)</option>
      </select>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋 Email, 姓名..."
          className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 w-72 pl-10"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
