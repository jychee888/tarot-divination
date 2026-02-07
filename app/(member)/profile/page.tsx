"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  MessageSquare,
  Save,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MoonPhaseIndicator } from "@/components/decorations/moonPhaseIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // @ts-ignore
      setNickname(session.user.nickname || "");
      // @ts-ignore
      setBio(session.user.bio || "");
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, bio }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (
          response.status === 400 &&
          data.error === "Nickname already taken"
        ) {
          throw new Error("此暱稱已被其他佔用了，請換一個試試。");
        }
        throw new Error("更新失敗");
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          nickname,
          bio,
        },
      });

      toast({
        title: "更新成功",
        description: "您的個人資料已成功保存到星象館中。",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "更新失敗",
        description: "無法連結星象館，請稍後再試。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" && !session) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
        <p className="text-amber-100/60 animate-pulse font-serif">
          正在讀取星象資料...
        </p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative pb-6 border-b border-amber-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <User className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-amber-100 font-serif tracking-tight">
            個人檔案
          </h1>
        </div>
        <p className="text-amber-100/60 mt-2 font-serif">
          塑造您在靈魂之眼的獨特印記
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Edit Form */}
        <div className="lg:col-span-3 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 bg-[#1a1414] p-8 rounded-[2rem] border border-[#C99041] shadow-xl relative overflow-hidden">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-amber-200/80 mb-1 ml-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  顯示暱稱
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="h-12 bg-black/20 border border-[#C99041] focus:border-[#C99041] focus:ring-0 text-amber-50 pl-10 transition-all rounded-full placeholder:text-amber-100/10"
                    placeholder="在此輸入您的靈魂代號"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C99041]/40 group-focus-within:text-[#C99041] transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-amber-200/80 mb-1 ml-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  自我介紹
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[160px] bg-black/20 border border-[#C99041] focus:border-[#C99041] focus:ring-0 text-amber-50 p-6 transition-all rounded-[2rem] resize-none leading-relaxed placeholder:text-amber-100/10"
                  placeholder="簡單描述您的內在旅程..."
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-amber-100/40 px-2 py-4 border-t border-amber-500/10">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  您的資料將安全地保存在星象圖書館中
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="h-11 px-8 text-amber-100/60 hover:text-amber-100 hover:bg-amber-500/10 rounded-full transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 px-10 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border border-[#C99041]/50 rounded-full shadow-[0_0_20px_rgba(201,144,65,0.15)] hover:shadow-[0_0_25px_rgba(201,144,65,0.25)] transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    寫入中...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    更新檔案
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="lg:sticky lg:top-20">
            <h2 className="text-sm font-medium text-amber-200/40 mb-4 px-1 flex items-center gap-2 uppercase tracking-widest font-serif">
              <Sparkles className="w-3 h-3" />
              實時預覽
            </h2>

            <div className="relative group">
              {/* Decorative background glow */}
              <Card className="relative bg-[#1a1414] border border-[#C99041] rounded-[2.5rem] overflow-hidden shadow-xl">
                <div className="h-24 bg-gradient-to-r from-amber-900/40 to-amber-800/40 relative rounded-t-[2.5rem] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 2px 2px, #C99041 1px, transparent 0)",
                      backgroundSize: "24px 24px",
                    }}
                  ></div>
                </div>

                <CardContent className="pt-0 pb-10 px-8 relative">
                  <div className="relative -mt-12 mb-6 w-24 h-24 mx-auto">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Preview"
                        className="w-full h-full rounded-full border-4 border-[rgb(23,17,17)] relative shadow-2xl z-10"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-gray-900 text-4xl font-bold border-4 border-[rgb(23,17,17)] relative shadow-2xl z-10">
                        {nickname?.[0]?.toUpperCase() ||
                          session.user?.name?.[0]?.toUpperCase() ||
                          "U"}
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-amber-100 font-serif truncate">
                        {nickname || session.user?.name || "神秘占卜者"}
                      </h3>
                      <p className="text-[#C99041]/60 text-[10px] flex items-center justify-center gap-1.5 font-medium uppercase tracking-[0.2em]">
                        <Mail className="w-3 h-3" />
                        {session.user?.email || "unknown@soulseye.com"}
                      </p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-[#C99041]/30 to-transparent w-full"></div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-500/60 font-medium">
                        靈魂語錄
                      </h4>
                      <p className="text-amber-100/80 text-sm leading-relaxed italic line-clamp-4 min-h-[4rem]">
                        「{bio || "此位占卜者尚未寫下他的靈魂語錄..."}」
                      </p>
                    </div>

                    <div className="pt-4 flex justify-center gap-3">
                      <div className="px-3 py-1 bg-amber-500/10 border border-[#C99041]/30 rounded-full text-[10px] text-amber-400 font-medium tracking-wide">
                        幸運值 99%
                      </div>
                      <div className="px-3 py-1 bg-amber-500/10 border border-[#C99041]/30 rounded-full text-[10px] text-amber-400 font-medium tracking-wide">
                        心靈探索者
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
