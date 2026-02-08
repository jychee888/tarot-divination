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
        <div className="p-8 rounded-[2.5rem] relative overflow-hidden group bg-card/40 border border-border shadow-2xl backdrop-blur-sm">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-6">
              {/* Avatar Glow Ring */}
              <div className="absolute inset-[-12px] rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={96}
                  height={96}
                  priority
                  unoptimized
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary/30 relative z-10 shadow-2xl shadow-primary/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/30 relative z-10 shadow-2xl">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-1 font-serif tracking-tight">
              {session?.user?.name || "神秘占卜者"}
            </h3>
            <p className="text-primary/40 text-[10px] uppercase tracking-[0.2em] font-medium">
              {session?.user?.email}
            </p>

            {/* Membership Badge */}
            <div className="mt-5 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(245,173,79,0.6)]"></div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-primary/80">
                靈魂守護者
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isActive
                    ? "bg-amber-500/10 text-amber-100 border-[#C99041]/30"
                    : "text-amber-100/40 hover:bg-white/5 hover:text-amber-100 border-transparent",
                  "group relative flex items-center px-6 py-4 text-sm font-medium rounded-2xl transition-all duration-300 border overflow-hidden",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
                )}

                <item.icon
                  className={classNames(
                    isActive
                      ? "text-amber-400"
                      : "text-amber-500/20 group-hover:text-amber-500/60",
                    "mr-4 h-5 w-5 transition-colors",
                  )}
                />
                <span className="tracking-widest font-serif">{item.name}</span>
              </Link>
            );
          })}

          <div className="my-4 border-t border-[#C99041]/5 mx-6"></div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="group flex items-center w-full px-6 py-4 text-sm font-medium rounded-2xl transition-all duration-300 border border-transparent hover:bg-red-500/5 text-amber-100/20 hover:text-red-400"
          >
            <LogOut className="mr-4 h-5 w-5 text-amber-500/10 group-hover:text-red-500/40 transition-colors" />
            <span className="tracking-widest font-serif">安全登出</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
