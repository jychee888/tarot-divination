import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  History,
  Settings,
  LogOut,
  Home,
  Sparkles,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 權限檢查：必須登入且 role 為 admin
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#0f0a0a] text-amber-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-amber-900/50 bg-[#171111] flex flex-col">
        <div className="p-6 border-b border-amber-900/50 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span className="font-serif font-bold text-xl tracking-wider text-amber-200">
            聖愛後台
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 text-sm">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-500/10 text-amber-200/80 hover:text-amber-100 transition-all font-serif"
          >
            <LayoutDashboard className="w-4 h-4" />
            統計總覽
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-500/10 text-amber-200/80 hover:text-amber-100 transition-all font-serif"
          >
            <Users className="w-4 h-4" />
            使用者管理
          </Link>
          <Link
            href="/admin/divinations"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-500/10 text-amber-200/80 hover:text-amber-100 transition-all font-serif"
          >
            <History className="w-4 h-4" />
            占卜紀錄彙整
          </Link>
          <div className="pt-4 mt-4 border-t border-amber-900/30">
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-500/10 text-amber-200/80 hover:text-amber-100 transition-all font-serif"
            >
              <Settings className="w-4 h-4" />
              系統設定
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-amber-900/50 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-500/10 text-amber-400/80 transition-all font-serif"
          >
            <Home className="w-4 h-4" />
            返回前台
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-amber-900/30 bg-[#171111]/50 backdrop-blur-md flex items-center justify-between px-8">
          <div className="text-amber-200/60 font-serif text-sm">
            管理者系統 / <span className="text-amber-200">統計總覽</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-amber-100">
                {session.user.name}
              </div>
              <div className="text-[10px] text-amber-500 uppercase tracking-widest font-serif">
                {session.user.role}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-amber-500/30 overflow-hidden shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-900 flex items-center justify-center">
                  <span className="text-amber-100">
                    {session.user.name?.[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
