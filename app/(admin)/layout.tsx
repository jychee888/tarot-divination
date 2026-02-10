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
  Library,
  Search,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";

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
    <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col fixed inset-y-0 z-50">
        <div className="h-16 px-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">管理中心</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium group"
          >
            <LayoutDashboard className="w-4 h-4 group-hover:text-blue-400 shrink-0" />
            統計總覽
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium group"
          >
            <Users className="w-4 h-4 group-hover:text-blue-400 shrink-0" />
            使用者管理
          </Link>
          <Link
            href="/admin/divinations"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium group"
          >
            <History className="w-4 h-4 group-hover:text-blue-400 shrink-0" />
            占卜紀錄彙整
          </Link>
          <Link
            href="/admin/posts"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium group"
          >
            <Library className="w-4 h-4 group-hover:text-blue-400 shrink-0" />
            文章內容管理
          </Link>

          <div className="pt-4 pb-2 px-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              系統設定
            </span>
          </div>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium group"
          >
            <Settings className="w-4 h-4 group-hover:text-blue-400 shrink-0" />
            偏好設定
          </Link>

          <div className="pt-6 pb-2 px-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              外部數據工具
            </span>
          </div>

          <a
            href="https://search.google.com/search-console?resource_id=https%3A%2F%2Ftarot-divination.zipffdigital.com%2F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium group"
          >
            <Search className="w-4 h-4 group-hover:text-amber-400 shrink-0" />
            Search Console
            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="https://analytics.google.com/analytics/web/?hl=zh-tw#/a383755504p523706249/realtime/overview?params=_u..nav%3Dmaui"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium group"
          >
            <BarChart3 className="w-4 h-4 group-hover:text-emerald-400 shrink-0" />
            Google Analytics
            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/50">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium group"
          >
            <Home className="w-4 h-4 group-hover:text-blue-400 shrink-0" />
            返回前台
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>後台管理系統</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">目前的頁面</span>
          </div>

          <div className="flex items-center gap-4">
            <AdminUserMenu user={session.user} />
          </div>
        </header>

        <main className="p-8 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
