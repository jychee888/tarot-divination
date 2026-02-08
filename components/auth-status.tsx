"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {session ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              {/* <span className="mr-2 text-white hidden sm:inline">歡迎 ：{session.user?.name}</span> */}
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-400 hover:ring-2  transition-all"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold hover:ring-2 hover:ring-amber-400 transition-all">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-[#171111] backdrop-blur-xl rounded-2xl p-2 border border-[#C99041]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] animate-in fade-in zoom-in-95 duration-200"
              sideOffset={12}
              align="end"
            >
              <DropdownMenu.Item className="outline-none group">
                <Link
                  href="/profile"
                  className="relative w-full text-amber-100/60 hover:text-amber-100 hover:bg-amber-500/10 rounded-xl px-4 py-3 text-sm flex items-center transition-all duration-300 border border-transparent hover:border-[#C99041]/20"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-amber-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                  <span className="tracking-widest font-serif ml-2">
                    個人資料
                  </span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="outline-none group">
                <Link
                  href="/history"
                  className="relative w-full text-amber-100/60 hover:text-amber-100 hover:bg-amber-500/10 rounded-xl px-4 py-3 text-sm flex items-center transition-all duration-300 border border-transparent hover:border-[#C99041]/20"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-amber-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                  <span className="tracking-widest font-serif ml-2">
                    占卜歷史
                  </span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-[#C99041]/10 m-2" />
              <DropdownMenu.Item className="outline-none group">
                <button
                  onClick={() => signOut()}
                  className="relative w-full text-left text-amber-100/20 hover:text-red-400 hover:bg-red-500/5 rounded-xl px-4 py-3 text-sm flex items-center transition-all duration-300 border border-transparent"
                >
                  <span className="tracking-widest font-serif ml-2">
                    安全登出
                  </span>
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="chinese-title-bakudai border border-[#C99041] bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 px-8 py-2 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
        >
          登入
        </button>
      )}
    </div>
  );
}
