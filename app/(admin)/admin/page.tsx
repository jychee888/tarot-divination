import { prisma } from "@/lib/prisma";
import {
  Users,
  Sparkles,
  Calendar,
  TrendingUp,
  Heart,
  Moon,
} from "lucide-react";

async function getStats() {
  const userCount = await prisma.user.count();
  const recordCount = await prisma.divinationRecord.count();

  // Here we could add more specific stats like daily readings, etc.
  return {
    userCount,
    recordCount,
    activeToday: 5, // Mock data
    growthRate: "+12%", // Mock data
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
    },
    {
      label: "總占卜紀錄",
      value: stats.recordCount,
      icon: Sparkles,
      icon2: Moon,
      color: "text-amber-400",
    },
    {
      label: "今日活躍",
      value: stats.activeToday,
      icon: TrendingUp,
      color: "text-green-400",
    },
    { label: "聖愛主題率", value: "68%", icon: Heart, color: "text-pink-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-100 tracking-wider">
            數據總覽
          </h1>
          <p className="text-amber-200/40 mt-1 font-serif">
            監控系統運行狀態與靈性流量數據
          </p>
        </div>
        <div className="text-sm text-amber-500/60 font-serif flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#171111] border border-amber-900/30 p-6 rounded-2xl shadow-xl hover:border-amber-500/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-amber-200/50 text-sm font-serif mb-1">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-amber-50 tracking-tight">
                  {card.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-black/40 ${card.color} group-hover:scale-110 transition-transform`}
              >
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-green-400 text-xs font-bold">+5%</span>
              <span className="text-amber-200/20 text-xs font-serif italic">
                vs 上週數據
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placeholder for charts/recent activity */}
        <div className="bg-[#171111] border border-amber-900/30 rounded-2xl p-8 min-h-[400px]">
          <h2 className="text-xl font-serif font-bold text-amber-100 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            流量趨勢分析
          </h2>
          <div className="flex items-center justify-center h-[300px] border border-dashed border-amber-900/30 rounded-xl bg-black/20">
            <p className="text-amber-200/20 font-serif italic">
              數據圖表載入中...
            </p>
          </div>
        </div>

        <div className="bg-[#171111] border border-amber-900/30 rounded-2xl p-8 min-h-[400px]">
          <h2 className="text-xl font-serif font-bold text-amber-100 mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            近期系統活動
          </h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex gap-4 items-start border-b border-amber-900/20 pb-4 last:border-0 hover:bg-amber-500/5 transition-colors p-2 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
                <div>
                  <p className="text-amber-100 text-sm">
                    系統偵測到新的占卜請求 (聖愛塔羅)
                  </p>
                  <p className="text-amber-200/30 text-xs mt-1 font-serif">
                    15 分鐘前 ·{" "}
                    <span className="text-amber-500/50">User_ID: 6986...</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function History({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
