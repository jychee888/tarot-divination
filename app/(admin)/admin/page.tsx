import { prisma } from "@/lib/prisma";
import {
  Users,
  Sparkles,
  Calendar,
  TrendingUp,
  Heart,
  Settings,
  LogOut,
  Home,
  User,
  Clock,
  History,
  Activity,
} from "lucide-react";

async function getStats() {
  const userCount = await prisma.user.count();
  const recordCount = await prisma.divinationRecord.count();

  return {
    userCount,
    recordCount,
    activeToday: 5,
    growthRate: "+12%",
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      label: "總使用者數",
      value: stats.userCount,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      label: "總占卜紀錄",
      value: stats.recordCount,
      icon: Sparkles,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
    },
    {
      label: "今日活躍用戶",
      value: stats.activeToday,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    {
      label: "平均會話時長",
      value: "03:45",
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            儀表大盤
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            即時監控系統核心指標與運行狀態
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400">
          <Calendar className="w-4 h-4 text-blue-500" />
          {new Date().toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm hover:border-slate-700 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div
                className={`p-2 rounded-lg ${card.bg} ${card.color} border ${card.border} group-hover:scale-110 transition-transform`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs font-medium mb-1 truncate max-w-[120px]">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-slate-100 tracking-tight">
                  {card.value}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-medium">
                  較昨日
                </span>
                <span className="text-emerald-500 text-[10px] font-bold">
                  ↑ 12%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              流量趨勢
            </h2>
            <div className="flex bg-slate-950 p-1 rounded-md border border-slate-800">
              {["24H", "7D", "1M"].map((t) => (
                <button
                  key={t}
                  className={`px-3 py-1 text-[10px] font-bold rounded ${t === "7D" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-slate-800 rounded-lg bg-slate-950/50">
            <Activity className="w-8 h-8 text-slate-800 mb-2 animate-pulse" />
            <p className="text-slate-600 font-medium text-xs">
              正在獲取實時數據指標...
            </p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <History className="w-4 h-4 text-blue-500" />
            系統事件
          </h2>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 items-start group">
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <div className="overflow-hidden">
                  <p className="text-slate-300 text-xs font-medium truncate group-hover:text-blue-400 transition-colors">
                    用戶完成占卜: 聖愛塔羅
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500">14:24</span>
                    <span className="text-[10px] text-slate-600">
                      系統節點 A
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg transition-colors border border-slate-800">
            查看完整日誌
          </button>
        </div>
      </div>
    </div>
  );
}
