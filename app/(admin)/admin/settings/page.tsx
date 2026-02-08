"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Globe,
  BarChart3,
  Sparkles,
  Loader2,
  CheckCircle2,
  Info,
  ExternalLink,
} from "lucide-react";
import {
  getSystemSettings,
  updateSystemSettings,
} from "@/app/actions/settings";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    site_title: "聖愛塔羅 - 靈性 AI 占卜",
    site_description: "探索宇宙的奧秘，透過 AI 靈性導師為您解讀塔羅牌義。",
    site_keywords: "塔羅牌, AI 占卜, 靈性, 命運, 解夢",
    ga_id: "",
    ai_prompt_prefix: "你是一位資深的靈性導師，請用溫暖且具啟發性的口吻回答...",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        console.log("[Settings] Fetching from server...");
        const result = await getSystemSettings();
        if (result.success && result.data) {
          console.log("[Settings] Data received:", result.data);
          setSettings((prev) => ({ ...prev, ...result.data }));
        } else if (!result.success) {
          console.error("[Settings] Fetch error:", result.error);
          toast.error("讀取設定失敗：" + result.error);
        }
      } catch (e: any) {
        console.error("[Settings] Connection error:", e);
        toast.error("連線伺服器失敗，請確認網路與權限");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSystemSettings(settings);
      if (result.success) {
        toast.success("設定已成功儲存並套用全站");
      } else {
        toast.error("儲存失敗：" + result.error);
      }
    } catch (error) {
      toast.error("發生錯誤，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            偏好設定
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            建立網站的 SEO 定義、第三方追蹤碼與 AI 邏輯參數
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          儲存變更
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* SEO & Global Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
              SEO 與 站點資訊
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                網站標題 (Site Title)
                <Info className="w-3 h-3 text-slate-600" />
              </label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => handleChange("site_title", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                placeholder="例如：聖愛塔羅 - 靈性 AI 占卜"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                網站描述 (Meta Description)
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) =>
                  handleChange("site_description", e.target.value)
                }
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none"
                placeholder="輸入簡短的網站介紹，這會顯示在 Google 搜尋結果中"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                關鍵字 (Keywords, 用逗號分隔)
              </label>
              <input
                type="text"
                value={settings.site_keywords}
                onChange={(e) => handleChange("site_keywords", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                placeholder="塔羅, 占卜, AI"
              />
            </div>
          </div>
        </div>

        {/* Analytics & Tracking */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
              追蹤與數據分析
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Google Analytics (GA4) ID
                </label>
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  className="text-[10px] text-emerald-500 hover:text-emerald-400 flex items-center gap-1 font-bold"
                >
                  前往後台 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="text"
                value={settings.ga_id}
                onChange={(e) => handleChange("ga_id", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all"
                placeholder="格式如：G-XXXXXXXXXX"
              />
              <p className="text-[10px] text-slate-600 mt-1 italic">
                * 留空則不啟用追蹤。設定後約需 24 小時在 Google 後台產生數據。
              </p>
            </div>
          </div>
        </div>

        {/* AI Persona Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
              AI 靈性調教 (Persona)
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                AI 前置引導語 (System Prompt Prefix)
              </label>
              <textarea
                value={settings.ai_prompt_prefix}
                onChange={(e) =>
                  handleChange("ai_prompt_prefix", e.target.value)
                }
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500/40 transition-all resize-none"
                placeholder="定義 AI 的身分與回答規則..."
              />
              <p className="text-[10px] text-slate-600 mt-1 italic">
                * 這段文字會附夾在每一次占卜請求的前端，用來維持 AI
                的回答品質與性格。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-2 text-slate-600 text-[11px] justify-center pt-4">
        <CheckCircle2 className="w-3.5 h-3.5" />
        所有設定均已加密儲存於資料庫，修改後立即生效。
      </div>
    </div>
  );
}
