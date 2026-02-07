"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Lock, ArrowRight, Quote } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MoonPhaseIndicator } from "@/components/decorations/moonPhaseIndicator";
import { CloudDecoration } from "@/components/decorations/CloudDecoration";
import { Start01decoration } from "@/components/decorations/Start01decoration";
import { MoonFaceDecoration } from "@/components/decorations/MoonFaceDecoration";
import { CornerDecoration as DecorativeCorner } from "@/components/decorations/corner-decoration";
import CardBack from "@/components/CardBack";

interface DailyDrawData {
  hasDrawn: boolean;
  reading?: string;
  card?: {
    name: string;
    image: string;
    isReversed: boolean;
  };
}

export default function DailyDraw() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [data, setData] = useState<DailyDrawData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/daily-draw")
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error("Failed to check daily draw", err));
    }
  }, [session]);

  const handleDraw = async () => {
    if (!session) {
      signIn();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/daily-draw", { method: "POST" });
      const newData = await res.json();

      if (newData.error) throw new Error(newData.error);

      setData(newData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "抽取失敗",
        description: "無法連接到命運之輪，請稍後再試。",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (status === "loading") return null;

  return (
    <section className="relative w-full max-w-5xl mx-auto my-10 px-4">
      <div className="relative bg-[#171111] border border-[#C99041] p-6 md:p-10 min-h-[500px] flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Decorations */}
        <MoonPhaseIndicator position="top" />
        <CloudDecoration
          className="w-full hidden sm:block opacity-50"
          position="top"
        />
        <Start01decoration
          className="w-full hidden sm:block opacity-70"
          position="top"
        />
        <MoonFaceDecoration
          className="w-full hidden sm:block opacity-30 -mt-10"
          position="top"
          size="md"
        />

        <DecorativeCorner position="top-left" className="-top-3 -left-3" />
        <DecorativeCorner position="top-right" className="-top-3 -right-3" />
        <DecorativeCorner
          position="bottom-right"
          className="-bottom-3 -right-3 scale-x-[-1] scale-y-[-1]"
        />
        <DecorativeCorner
          position="bottom-left"
          className="-bottom-3 -left-3 scale-y-[-1]"
        />

        <div className="relative z-10 w-full flex flex-col items-center">
          <header className="text-center mb-6 mt-4">
            <h2 className="text-3xl md:text-4xl font-serif text-amber-100 tracking-[0.2em] mb-4 flex items-center justify-center gap-4">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              每日靈感指引
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </h2>
            <p className="text-amber-500/60 font-serif tracking-widest text-sm uppercase">
              每天一次，領取宇宙給你的專屬訊息
            </p>
          </header>

          <AnimatePresence mode="wait">
            {!session ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-8 py-10"
              >
                <div className="w-24 h-36 bg-amber-950/30 border-2 border-dashed border-amber-500/30 rounded-xl mx-auto flex items-center justify-center animate-pulse">
                  <Lock className="w-8 h-8 text-amber-500/50" />
                </div>
                <div className="space-y-4">
                  <p className="text-amber-100/80 max-w-md mx-auto font-serif tracking-wide leading-loose">
                    命運之門已為你敞開，但你需要一把鑰匙。
                    <br />
                    <span className="text-amber-400">登入帳號</span>
                    ，領取今日的靈魂指引。
                  </p>
                </div>
                <Button
                  onClick={() => signIn()}
                  className="bg-amber-600 hover:bg-amber-500 text-amber-50 px-10 py-6 rounded-full font-serif text-lg tracking-widest shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all hover:scale-105 border border-amber-400/30"
                >
                  登入開啟
                </Button>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center justify-center gap-8 py-10"
              >
                <div className="relative w-40 h-64 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-amber-400 shadow-[0_0_40px_rgba(217,119,6,0.4)] animate-[spin_3s_linear_infinite_reverse] style={{ transformStyle: 'preserve-3d' }}">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-amber-200 animate-pulse" />
                  </div>
                </div>
                <p className="text-amber-200 font-serif animate-pulse tracking-[0.2em] text-lg">
                  宇宙正在洗牌...
                </p>
              </motion.div>
            ) : data?.hasDrawn && data.card ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 gap-8 items-start w-full max-w-4xl"
              >
                {/* Card Display */}
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative w-[210px] h-[369px] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden border border-amber-500/40 group"
                  >
                    <img
                      src={data.card.image}
                      alt={data.card.name}
                      className={`w-full h-full object-cover transition-transform duration-700 scale-105  ${data.card.isReversed ? "rotate-180" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0  transition-opacity duration-300 pointer-events-none" />
                  </motion.div>

                  <div className="text-center space-y-3">
                    <h3 className="text-3xl font-bold text-amber-100 font-serif tracking-widest drop-shadow-md">
                      {data.card.name}
                    </h3>
                    <span
                      className={`inline-block text-sm tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border backdrop-blur-sm ${
                        data.card.isReversed
                          ? "border-red-500/30 text-red-200 bg-red-950/30 shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                          : "border-green-500/30 text-green-200 bg-green-950/30 shadow-[0_0_10px_rgba(21,128,61,0.2)]"
                      }`}
                    >
                      {data.card.isReversed
                        ? "逆位 · 內在課題"
                        : "正位 · 外在顯化"}
                    </span>
                  </div>
                </div>

                {/* Reading Display */}
                <div className="flex flex-col h-full justify-between text-left relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent hidden md:block" />

                  <div className="bg-amber-950/20 p-8 rounded-lg border border-amber-500/10 relative overflow-hidden group hover:bg-amber-950/30 transition-colors duration-500">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-amber-500/10" />

                    <h4 className="text-xl font-bold text-amber-200 font-serif border-b border-amber-500/20 pb-4 mb-6 flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      今日指引
                    </h4>

                    <div className="prose prose-invert text-amber-100/90 leading-loose font-serif tracking-wide text-justify text-md">
                      {data.reading?.split("\n").map((line, i) => (
                        <p key={i} className="mb-4 last:mb-0 drop-shadow-sm">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-amber-500/10">
                    <div className="flex items-center justify-between text-xs text-amber-500/50 uppercase tracking-widest px-2">
                      <Link
                        href="/history"
                        className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer group/link"
                      >
                        <Lock className="w-3 h-3 group-hover/link:text-amber-300 transition-colors" />
                        <span className="border-b border-transparent group-hover/link:border-amber-300/50">
                          已儲存至您的歷史紀錄
                        </span>
                      </Link>
                      <span>{new Date().toLocaleDateString("zh-TW")}</span>
                    </div>

                    <Link href="/divination" className="block w-full group">
                      <Button className="w-full bg-transparent border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:text-amber-100 hover:border-amber-400 transition-all duration-300 py-6 font-serif tracking-widest text-lg group-hover:shadow-[0_0_20px_rgba(217,119,6,0.15)]">
                        <span className="mr-2">開啟深度牌陣占卜</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="draw"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-center space-y-8 py-4"
              >
                <div
                  className="relative w-[210px] h-[320px] mx-auto group cursor-pointer perspective-1000"
                  onClick={handleDraw}
                >
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-amber-500/20 blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-full" />

                  {/* Card Stack Effect */}
                  <div className="absolute inset-0 bg-amber-900 rounded-xl transform rotate-6 translate-x-4 translate-y-2 opacity-40 border border-amber-500/30 group-hover:translate-x-6 group-hover:translate-y-4 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-amber-800 rounded-xl transform -rotate-3 -translate-x-3 -translate-y-1 opacity-60 border border-amber-500/30 group-hover:-translate-x-5 group-hover:-translate-y-3 transition-transform duration-500"></div>

                  {/* Main Card Back */}
                  <div className="relative w-full h-full bg-[#171111] rounded-xl border border-amber-500/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_50px_rgba(251,191,36,0.4)] group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center overflow-hidden z-10">
                    <CardBack />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                  </div>

                  <div className="absolute -bottom-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <span className="text-amber-200/80 text-xs tracking-[0.3em] font-serif uppercase bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-amber-500/20">
                      點擊卡牌翻開
                    </span>
                  </div>
                </div>
                <div className="space-y-4 max-w-lg mx-auto pt-4">
                  <h3 className="text-2xl text-amber-100 font-serif tracking-widest mb-3">
                    準備好接收宇宙的訊息了嗎？
                  </h3>
                  <p className="text-amber-200/60 font-serif leading-relaxed text-md tracking-wide">
                    深呼吸，靜下心來，專注於當下的感受。
                    <br />
                    當你準備好時，點擊下方的按鈕。
                  </p>
                </div>

                <Button
                  onClick={handleDraw}
                  className="bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white px-8 py-6 rounded-full font-serif text-sm tracking-[0.2em] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] border border-amber-400/20"
                >
                  <Sparkles className="w-3 h-3 mr-3 animate-spin-slow" />
                  抽取今日靈感
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <MoonPhaseIndicator position="bottom" />
      </div>
    </section>
  );
}
