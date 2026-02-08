"use client";

import { signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User as UserIcon, Mail, Shield } from "lucide-react";

interface AdminUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function AdminUserMenu({ user }: AdminUserMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="outline-none group">
          <div className="w-9 h-9 rounded-full border border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center shrink-0 ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all shadow-md shadow-black/20">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Admin"}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[240px] bg-slate-900 rounded-xl p-2 border border-slate-800 shadow-xl shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-200"
          sideOffset={5}
          align="end"
        >
          {/* User Info Header */}
          <div className="px-3 py-3 border-b border-slate-800 mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-100 text-sm truncate max-w-[140px]">
                {user.name || "Admin User"}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-tighter">
                {user.role || "ADMIN"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Mail className="w-3 h-3" />
              <span className="truncate max-w-[180px]">{user.email}</span>
            </div>
          </div>

          <DropdownMenu.Item className="outline-none group cursor-pointer">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              安全登出
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow
            className="fill-slate-800"
            width={16}
            height={8}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
