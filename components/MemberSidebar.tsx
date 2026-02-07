"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, Clock, LogOut, Home } from "lucide-react";
import Image from "next/image";
import type { Session } from "next-auth";

const navigation = [
  { name: "返回首頁", href: "/", icon: Home },
  { name: "個人資料", href: "/profile", icon: User },
  { name: "占卜歷史", href: "/history", icon: Clock },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface MemberSidebarProps {
  session: Session;
}

export default function MemberSidebar({ session }: MemberSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="lg:w-56 flex-shrink-0 mb-8 lg:mb-0">
      <div className="lg:sticky lg:top-20 space-y-6">
        {/* User Profile Summary */}
        <div className="bg-[#1a1414] backdrop-blur-md p-6 rounded-[2rem] border border-[#C99041] shadow-xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-4 w-20 h-20">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={80}
                  height={80}
                  priority
                  unoptimized
                  className="w-full h-full rounded-full object-cover border border-[#C99041]/40 relative z-10"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-amber-900/20 flex items-center justify-center text-amber-200 text-2xl font-bold border border-[#C99041]/40 relative z-10">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-amber-100 mb-1 truncate w-full">
              {session?.user?.name || "神秘占卜者"}
            </h3>
            <p className="text-amber-100/60 text-xs truncate w-full italic">
              {session?.user?.email}
            </p>

            {/* Membership Badge */}
            <div className="mt-4 px-3 py-1 bg-[#C99041]/5 border border-[#C99041]/20 rounded-full flex items-center gap-1.5 transition-colors">
              <div className="w-1.5 h-1.5 bg-[#C99041]/40 rounded-full"></div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C99041]/80">
                靈魂守護者
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="bg-[#1a1414]/50 backdrop-blur-xl rounded-2xl border border-[#C99041] p-2 shadow-lg">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isActive
                    ? "bg-amber-500/20 text-white border-[#C99041]/40 shadow-[inset_0_0_15px_rgba(201,144,65,0.1)]"
                    : "text-amber-100/70 hover:bg-amber-500/5 hover:text-white border-transparent",
                  "group flex items-center px-6 py-3.5 text-sm font-medium rounded-full transition-all duration-300 border mb-2 last:mb-0",
                )}
              >
                <item.icon
                  className={classNames(
                    isActive
                      ? "text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]"
                      : "text-amber-500/40 group-hover:text-amber-400",
                    "mr-3 h-5 w-5 transition-all duration-300",
                  )}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                )}
              </Link>
            );
          })}

          <div className="my-2 border-t border-[#C99041]/10 mx-4"></div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="group flex items-center w-full px-6 py-3.5 text-sm font-medium rounded-full transition-all duration-300 border border-transparent hover:border-red-500/30 hover:bg-red-500/10 text-amber-100/50 hover:text-red-300"
          >
            <LogOut className="mr-3 h-5 w-5 text-amber-500/30 group-hover:text-red-400 transition-colors" />
            登出
          </button>
        </nav>
      </div>
    </aside>
  );
}
