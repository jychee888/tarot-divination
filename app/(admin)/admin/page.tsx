"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Sparkles,
  TrendingUp,
  Activity,
  Clock,
  PieChart as PieChartIcon,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { getAdminStats } from "@/app/actions/stats";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      const result = await getAdminStats();
      if (result.success) {
        setStats(result.data);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          數據概覽
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          即時掌握網站活動、使用者成長與占卜分析
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="累計註冊用戶"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-5 h-5" />}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="累計占卜次數"
          value={stats?.totalDivinations || 0}
          icon={<Sparkles className="w-5 h-5" />}
          color="purple"
          trend="+18%"
        />
        <StatCard
          title="今日占卜量"
          value={stats?.todayDivinations || 0}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          trend="當前數據"
        />
        <StatCard
          title="24h 活躍用戶"
          value={stats?.activeUsers24h || 0}
          icon={<Activity className="w-5 h-5" />}
          color="orange"
          trend={`實時用戶: ${stats?.gaMock?.realtime}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              近七日活動趨勢
            </h3>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> 占卜數
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-700" /> 訪問量 (GA
                模擬)
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.trendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#f1f5f9" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#334155"
                  strokeWidth={1}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Popular Themes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-200 flex items-center gap-2 mb-6">
            <PieChartIcon className="w-4 h-4 text-purple-400" />
            熱門占卜主題
          </h3>
          <div className="space-y-5">
            {stats?.themeCounts?.map((theme: any, index: number) => (
              <div key={theme.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    {theme.name}
                  </span>
                  <span className="text-slate-500">{theme.value} 次</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${(theme.value / stats.totalDivinations) * 100 || 0}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
            {(!stats?.themeCounts || stats.themeCounts.length === 0) && (
              <div className="h-48 flex items-center justify-center text-slate-600 text-xs italic">
                暫無數據
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  平均停留
                </p>
                <p className="text-sm font-bold text-slate-200">
                  {stats?.gaMock?.avgSessionDuration}
                </p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  跳出率
                </p>
                <p className="text-sm font-bold text-slate-200">
                  {stats?.gaMock?.bounceRate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }: any) {
  const colorClasses: any = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-700 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
          {trend}
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
          {title}
        </p>
        <h4 className="text-2xl font-bold text-slate-100 mt-1 tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h4>
      </div>
    </div>
  );
}
