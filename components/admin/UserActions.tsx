"use client";

import {
  MoreVertical,
  UserMinus,
  Download,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  History,
  UserCheck,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { updateUserRole, updateUserStatus } from "@/app/actions/user";

interface UserActionsProps {
  userId: string;
  userEmail: string;
  userStatus: string;
  isSuperAdmin?: boolean; // New prop to avoid hardcoding
}

export function UserActions({
  userId,
  userEmail,
  userStatus,
  isSuperAdmin = false,
}: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const isBlocked = userStatus === "blocked";

  // 點擊外部關閉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsRoleModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (label: string) => {
    alert(`[系統訊息] ${label} 功能正在串接中...\n對象：${userEmail}`);
    setIsOpen(false);
  };

  const handleRoleUpdate = async (newRole: string) => {
    if (isSuperAdmin) {
      alert("安全系統限制：無法修改最高管理員的權限。");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setIsRoleModalOpen(false);
      } else {
        alert(`更新失敗: ${result.error}`);
      }
    } catch (error) {
      alert("發生錯誤，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (isSuperAdmin && newStatus === "blocked") {
      alert("安全系統限制：無法封鎖最高管理員。");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserStatus(userId, newStatus);
      if (result.success) {
        setIsOpen(false);
      } else {
        alert(`狀態更新失敗: ${result.error}`);
      }
    } catch (error) {
      alert("發生錯誤，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 relative">
      <div className="relative">
        <button
          onClick={() => !isSuperAdmin && setIsRoleModalOpen(!isRoleModalOpen)}
          disabled={isSuperAdmin}
          className={`px-2 py-1 text-[10px] font-bold rounded border transition-all flex items-center gap-1 ${
            isSuperAdmin
              ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30"
          }`}
        >
          <ShieldCheck className="w-3 h-3" />
          權限設定
        </button>

        {isRoleModalOpen && (
          <div
            ref={modalRef}
            className="absolute right-0 bottom-full mb-2 w-40 bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl z-[200] py-1 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                選取身分角色
              </p>
            </div>

            <button
              onClick={() => handleRoleUpdate("user")}
              disabled={isLoading}
              className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                一般使用者
              </div>
              {isLoading && (
                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
              )}
            </button>

            <button
              onClick={() => handleRoleUpdate("admin")}
              disabled={isLoading}
              className="w-full text-left px-3 py-2 text-xs text-blue-400 hover:bg-blue-500/10 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                管理員 (Admin)
              </div>
              {isLoading && (
                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
              )}
            </button>
          </div>
        )}
      </div>

      <Link
        href={`/admin/divinations?email=${userEmail}`}
        className="px-2 py-1 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 hover:border-emerald-500/30 text-[10px] font-bold text-slate-400 rounded border border-slate-700 transition-all flex items-center gap-1"
      >
        <History className="w-3 h-3" />
        活動日誌
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-md transition-all ${isOpen ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-200 hover:bg-slate-800"}`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 border border-slate-700/50 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[200] py-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                進階管理
              </p>
            </div>

            <button
              onClick={() =>
                handleStatusUpdate(isBlocked ? "active" : "blocked")
              }
              disabled={isLoading}
              className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${
                isBlocked
                  ? "text-emerald-400 hover:bg-emerald-500/10"
                  : "text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              {isBlocked ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  解除封鎖
                </>
              ) : (
                <>
                  <UserMinus className="w-3.5 h-3.5" />
                  封鎖該使用者
                </>
              )}
              {isLoading && (
                <Loader2 className="w-3 h-3 animate-spin ml-auto" />
              )}
            </button>

            <button
              onClick={() => handleAction("資料匯出")}
              className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              匯出用戶資料 (.json)
            </button>

            <div className="border-t border-slate-800 mt-1 pt-1 text-center bg-slate-950/30">
              <p className="text-[9px] text-slate-600 py-1">
                UID: {userId.slice(-12)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
