'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>;
  }

  return (
    <div className="flex items-center space-x-2">
      {session ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="mr-2 text-white hidden sm:inline">歡迎 ：{session.user?.name}</span>
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-400 hover:ring-2  transition-all"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold hover:ring-2 hover:ring-amber-400 transition-all">
                  {session.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              className="min-w-[180px] bg-[rgba(23, 17, 17, 0.2)] backdrop-blur-md rounded-md p-1 border border-amber-500/50 shadow-lg z-[100]"
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Item className="outline-none">
                <Link 
                  href="/profile" 
                  className="w-full text-white hover:bg-amber-500/20 rounded px-3 py-2 text-sm flex items-center"
                >
                  個人資料
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="outline-none">
                <Link 
                  href="/history" 
                  className="w-full text-white hover:bg-amber-500/20 rounded px-3 py-2 text-sm flex items-center"
                >
                  占卜歷史
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-amber-500/30 m-1" />
              <DropdownMenu.Item className="outline-none">
                <button
                  onClick={() => signOut()}
                  className="w-full text-left text-white hover:bg-amber-500/20 rounded px-3 py-2 text-sm"
                >
                  登出
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Arrow className="fill-amber-500/50" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="chinese-title-bakudai border border-[#C99041] bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 px-8 py-2 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
          登入
        </button>
      )}
    </div>
  );
}
