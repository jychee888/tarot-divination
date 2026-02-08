"use client";

export const dynamic = "force-dynamic";

// React & Next.js
import { useState, useRef, useEffect, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/layout/Header";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CardBack from "@/components/CardBack";
import CardFront from "@/components/CardFront";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  Sparkles,
  Heart,
  Briefcase,
  Users,
  Activity,
  Eye,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";

import { CrystalBall } from "@/components/CrystalBall";

// Custom Hooks
import { useToast } from "@/hooks/use-toast";

// Data
import tarotCards from "@/data/tarot-cards";

// Custom Components - Decorations
import { DecorativeCorner } from "@/components/decorations/decorative-corner";
import { MoonPhaseIndicator } from "@/components/decorations/moonPhaseIndicator";
import { CloudDecoration } from "@/components/decorations/CloudDecoration";
import { MoonFaceDecoration } from "@/components/decorations/MoonFaceDecoration";
import { Start01decoration } from "@/components/decorations/Start01decoration";
import { CornerDecoration } from "@/components/decorations/corner-decoration";
import { TarotDecorativeElements } from "@/components/decorations/decorative-elements";
import LeftSideDecorations from "@/components/decorations/LeftSideDecorations";
import RightSideDecorations from "@/components/decorations/RightSideDecorations";

type DivinationTheme =
  | "love"
  | "career"
  | "relationship"
  | "health"
  | "self-exploration";
type SpreadType = "single" | "three" | "celtic-cross";

interface TarotCard {
  id: string;
  name: string;
  isReversed: boolean;
  isRevealed: boolean;
  meaning: { summary: string; details: string[] };
  image?: string;
}

const themes = [
  { id: "love" as DivinationTheme, label: "愛情", icon: Heart },
  { id: "career" as DivinationTheme, label: "事業", icon: Briefcase },
  { id: "relationship" as DivinationTheme, label: "人際", icon: Users },
  { id: "health" as DivinationTheme, label: "健康", icon: Activity },
  { id: "self-exploration" as DivinationTheme, label: "自我探索", icon: Eye },
];

const spreads = [
  { id: "single" as SpreadType, label: "單張牌", count: 1 },
  { id: "three" as SpreadType, label: "三張牌", count: 3 },
];

const themeQuestions: Record<DivinationTheme, string[]> = {
  love: [
    `本年度感情整體的發展趨勢？`,
    `今年在關係中可能遇到的機會？`,
    `如何提升今年度的情感能量？`,
    `年度內的桃花與正緣契機？`,
  ],
  career: [
    `本年度事業發展的關鍵轉點？`,
    `今年事業中的財富流動方向？`,
    `年度內合適的轉職或晉升時機？`,
    `如何達成今年的事業核心目標？`,
  ],
  relationship: [
    `本年度貴人運與人脈拓展建議？`,
    `今年如何化解重要的人際摩擦？`,
    `年度內值得建立的長久合作？`,
    `如何平衡今年的社交與自我？`,
  ],
  health: [
    `本年度內在能量與身心平衡建議？`,
    `今年在生活習慣上最需調整之處？`,
    `年度內釋放壓力的最佳途徑？`,
    `如何保持整年的內在活力？`,
  ],
  "self-exploration": [
    `本年度靈魂成長的核心命題？`,
    `今年值得深入探索的潛能領域？`,
    `如何在今年達成內在與外在的統一？`,
    `年度內的智慧開啟與覺醒契機？`,
  ],
};

function DivinationContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [selectedTheme, setSelectedTheme] = useState<DivinationTheme>("love");
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>("three");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [isReading, setIsReading] = useState(false);
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [aiReading, setAiReading] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Soul Signature States
  const [birthYear, setBirthYear] = useState<string>("");
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("");
  const [birthHour, setBirthHour] = useState<string>("");
  const [birthMinute, setBirthMinute] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [showSoulSignature, setShowSoulSignature] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Derived variables for API and records
  const birthday =
    birthYear && birthMonth && birthDay
      ? `${birthYear}-${birthMonth}-${birthDay}`
      : "";
  const birthTime =
    birthHour && birthMinute ? `${birthHour}:${birthMinute}` : "";

  const resultsTitleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle URL theme parameter
  useEffect(() => {
    const themeParam = searchParams.get("theme");
    if (
      themeParam &&
      ["love", "career", "relationship", "health", "self-exploration"].includes(
        themeParam,
      )
    ) {
      setSelectedTheme(themeParam as DivinationTheme);
    }
  }, [searchParams]);

  const startDivination = () => {
    const spreadCount =
      spreads.find((s) => s.id === selectedSpread)?.count || 3;
    const newCards: TarotCard[] = [];
    const availableCards = [...tarotCards];

    for (let i = 0; i < spreadCount && availableCards.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards.splice(randomIndex, 1)[0];
      const isReversed = Math.random() > 0.5;

      const themeMeaning = selectedCard.meanings[selectedTheme] || {
        upright: { summary: "暫無牌義", details: [] },
        reversed: { summary: "暫無牌義", details: [] },
      };

      const meaning = isReversed ? themeMeaning.reversed : themeMeaning.upright;
      const structuredMeaning =
        typeof meaning === "string"
          ? { summary: meaning, details: [] }
          : meaning;

      newCards.push({
        id: selectedCard.id,
        name: selectedCard.name,
        isReversed,
        isRevealed: false,
        meaning: structuredMeaning,
        image: selectedCard.image,
      });
    }

    setCards(newCards);
    setAiReading("");
    setIsReading(true);
    setShowResults(false);
    setIsSaved(false);
  };

  useEffect(() => {
    if (session?.user) {
      // 優先從 Session 中獲取，避免額外的 API 請求
      const u = session.user as any;

      if (u.birthday) {
        const [y, m, d] = u.birthday.split("-");
        if (y) setBirthYear(y);
        if (m) setBirthMonth(m);
        if (d) setBirthDay(d);
      }
      if (u.birthTime) {
        const [h, min] = u.birthTime.split(":");
        if (h) setBirthHour(h);
        if (min) setBirthMinute(min);
      }
      if (u.gender) setGender(u.gender);

      // 如果 Session 中沒有這些資料（可能是剛登入），則進行 API 請求作為備案
      if (!u.birthday && !u.gender) {
        const fetchProfile = async () => {
          try {
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            if (data) {
              if (data.birthday) {
                const [y, m, d] = data.birthday.split("-");
                if (y) setBirthYear(y);
                if (m) setBirthMonth(m);
                if (d) setBirthDay(d);
              }
              if (data.birthTime) {
                const [h, m] = data.birthTime.split(":");
                if (h) setBirthHour(h);
                if (m) setBirthMinute(m);
              }
              if (data.gender) setGender(data.gender);
            }
          } catch (e) {
            console.warn("備案獲取失敗", e);
          }
        };
        fetchProfile();
      }
    }
  }, [session]);

  const revealCard = (cardId: string) => {
    setCards((prev) => {
      const updatedCards = prev.map((card) =>
        card.id === cardId ? { ...card, isRevealed: true } : card,
      );

      const allRevealed = updatedCards.every((card) => card.isRevealed);
      if (allRevealed) {
        setTimeout(() => {
          setShowResults(true);
          setTimeout(() => {
            if (resultsTitleRef.current) {
              const yOffset = -50;
              const y =
                resultsTitleRef.current.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }, 1000);
        }, 1000);
      }
      return updatedCards;
    });
  };

  const resetReading = () => {
    setIsReading(false);
    setShowResults(false);
    setCards([]);
    setIsSaved(false);
    setAiReading("");
  };

  const getSpreadLayout = () => {
    if (selectedSpread === "single") return "grid-cols-1 place-items-center";
    if (selectedSpread === "three") return "grid-cols-1 md:grid-cols-3 gap-6";
    return "grid-cols-2 md:grid-cols-4 gap-4";
  };

  const saveDivination = async () => {
    if (!session) {
      toast({
        title: "請先登入",
        description: "登入後才能儲存您的占卜紀錄。",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/divinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          spreadType: selectedSpread,
          cards: cards.map((c) => ({
            name: c.name,
            isReversed: c.isReversed,
            meaning: c.meaning,
          })),
          question: selectedQuestion,
          aiReading: aiReading || null,
          userContext: { birthday, birthTime, gender },
        }),
      });

      if (!response.ok) throw new Error("儲存失敗");
      setIsSaved(true);
      toast({ title: "儲存成功！", description: "您的占卜紀錄已儲存。" });
    } catch (error) {
      toast({
        title: "儲存失敗",
        description: "無法儲存您的占卜紀錄，請稍後再試。",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchAiReading = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: themes.find((t) => t.id === selectedTheme)?.label,
          spread: spreads.find((s) => s.id === selectedSpread)?.label,
          cards: cards,
          question: selectedQuestion,
          userContext: { birthday, birthTime, gender },
        }),
      });
      const data = await response.json();
      if (data.reading) {
        setAiReading(data.reading);
      } else if (data.error) {
        toast({
          title: "AI 解讀失敗",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "連線錯誤",
        description: "無法連線至 AI 伺服器",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#171111] text-[#F9ECDC] overflow-hidden p-4 pb-20">
      <div className="absolute z-50 inset-2 sm:inset-4 border border-[#C99041] rounded-3xl pointer-events-none"></div>
      <div className="absolute z-50 inset-4 sm:inset-8 border border-[#C99041] rounded-xl pointer-events-none"></div>
      <div className="absolute z-10 inset-0 sm:inset-0 sm:border-[40px] border-[20px] border-[#171111] rounded-xl pointer-events-none"></div>

      <CornerDecoration
        position="top-left"
        className="z-50 top-2 left-2 sm:top-4 sm:left-4"
      />
      <CornerDecoration
        position="top-right"
        className="z-50 top-2 right-2 sm:top-4 sm:right-4"
      />
      <CornerDecoration
        position="bottom-right"
        className="z-50 bottom-2 left-2 sm:bottom-4 sm:left-4 scale-x-[-1]"
      />
      <CornerDecoration
        position="bottom-left"
        className="z-50 bottom-2 right-2 sm:bottom-4 sm:right-4 scale-y-[-1]"
      />

      <Header />

      <div className="container mx-auto px-4 py-8 relative">
        <TarotDecorativeElements className="w-[200%] sm:w-full sm:top-0 top-[20px] h-full mb-20 -left-1/2 sm:left-0" />

        {!isReading ? (
          <main className="relative max-w-2xl mx-auto">
            <Card className="bg-[rgba(23,17,17,0.2)] border border-[#C99041] backdrop-blur-sm rounded-none relative overflow-visible shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <MoonPhaseIndicator position="top" />
              <CloudDecoration
                className="w-full hidden sm:block"
                position="top"
              />
              <Start01decoration
                className="w-full hidden sm:block"
                position="top"
              />
              <MoonFaceDecoration
                className="w-full -mt-4 hidden sm:block"
                position="top"
                size="md"
              />

              <DecorativeCorner position="top-left" className="left-0 top-0" />
              <DecorativeCorner
                position="top-right"
                className="right-0 top-0"
              />

              <CardContent className="space-y-8 p-8 mt-4 mb-8">
                <section>
                  <h2 className="sm:text-3xl text-[16px] font-bold text-amber-100 mb-6 text-center font-serif tracking-wider">
                    {new Date().getFullYear()}年度塔羅運勢
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {themes.map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <Button
                          key={theme.id}
                          variant={
                            selectedTheme === theme.id ? "default" : "outline"
                          }
                          className={`font-serif sm:text-md text-[14px] text-amber-300 hover:text-amber-200 bg-transparent hover:bg-amber-500/20 border border-[#C99041] sm:py-6 rounded-full transition-all duration-300 transform ${selectedTheme === theme.id ? "scale-105 bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : "hover:scale-105"}`}
                          onClick={() => setSelectedTheme(theme.id)}
                        >
                          <Icon className="w-5 h-5 mr-1" />
                          {theme.label}
                        </Button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h2 className="sm:text-3xl text-[16px] font-bold text-amber-100 mb-6 text-center font-serif tracking-wider">
                    牌陣選擇
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {spreads.map((spread) => (
                      <Button
                        key={spread.id}
                        variant={
                          selectedSpread === spread.id ? "default" : "outline"
                        }
                        className={`font-serif sm:text-md text-[14px] text-amber-300 hover:text-amber-200 bg-transparent hover:bg-amber-500/20 border border-[#C99041] sm:py-6 rounded-full transition-all duration-300 transform ${selectedSpread === spread.id ? "scale-105 bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : "hover:scale-105"}`}
                        onClick={() => setSelectedSpread(spread.id)}
                      >
                        {spread.label}
                      </Button>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="sm:text-3xl text-[16px] font-bold text-amber-100 mb-6 text-center font-serif tracking-wider">
                    {new Date().getFullYear()} 年度命運聚焦
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {themeQuestions[selectedTheme].map((q, idx) => (
                      <Button
                        key={idx}
                        variant={selectedQuestion === q ? "default" : "outline"}
                        className={`font-serif sm:text-sm text-[12px] text-left justify-start px-6 py-6 h-auto whitespace-normal text-amber-100/80 hover:text-amber-100 bg-transparent hover:bg-amber-500/10 border border-[#C99041]/30 hover:border-[#C99041] rounded-xl transition-all duration-300 ${selectedQuestion === q ? "bg-[#C99041]/10 border-[#C99041] text-amber-100 shadow-[0_0_10px_rgba(201,144,65,0.1)]" : ""}`}
                        onClick={() => setSelectedQuestion(q)}
                      >
                        <Sparkles
                          className={`w-3.5 h-3.5 mr-2 shrink-0 ${selectedQuestion === q ? "text-amber-400" : "text-amber-400/30"}`}
                        />
                        {q}
                      </Button>
                    ))}
                  </div>
                </section>

                <div className="text-center pt-6">
                  <Button
                    size="lg"
                    className={`font-serif sm:text-md text-[14px] text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border-2 border-[#C99041] sm:py-8 sm:px-12 rounded-full shadow-[0_0_20px_rgba(201,144,65,0.2)] transition-all duration-300 transform ${!selectedQuestion ? "opacity-40 cursor-not-allowed" : "hover:scale-105 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(201,144,65,0.4)]"}`}
                    onClick={startDivination}
                    disabled={!selectedQuestion}
                  >
                    <Sparkles
                      className={`w-5 h-5 mr-2 ${selectedQuestion ? "text-amber-300" : "text-amber-300/30"}`}
                    />
                    <span className="drop-shadow-sm font-bold tracking-widest text-lg">
                      {selectedQuestion
                        ? "開啟命運之門"
                        : `請選擇 ${new Date().getFullYear()} 年度占卜議題`}
                    </span>
                  </Button>
                </div>
              </CardContent>

              <DecorativeCorner
                position="bottom-left"
                className="left-0 bottom-0"
              />
              <DecorativeCorner
                position="bottom-right"
                className="right-0 bottom-0"
              />
              <MoonPhaseIndicator position="bottom" />
            </Card>
          </main>
        ) : (
          <main className="max-w-2xl mx-auto">
            <Card className="bg-[rgba(23,17,17,0.2)] pb-[50px] border border-[#C99041] backdrop-blur-sm rounded-none relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <MoonPhaseIndicator position="top" />
              <CloudDecoration
                className="w-full hidden sm:block"
                position="top"
              />
              <Start01decoration
                className="w-full hidden sm:block"
                position="top"
              />
              <MoonFaceDecoration
                className="w-full hidden sm:block"
                position="top"
                size="md"
              />

              <DecorativeCorner
                position="top-left"
                className="left-0 top-0 hidden sm:block"
              />
              <DecorativeCorner
                position="top-right"
                className="right-0 top-0 hidden sm:block"
              />

              <CardHeader className="text-center sm:mt-[50px] mt-[10px]">
                <CardTitle className="text-2xl md:text-3xl text-amber-100 font-serif tracking-wider">
                  {themes.find((t) => t.id === selectedTheme)?.label} -{" "}
                  {spreads.find((s) => s.id === selectedSpread)?.label}
                </CardTitle>
                <CardDescription className="text-amber-200/90 text-sm md:text-base mt-2">
                  <span className="inline-block border-b border-[#C99041]/50 pb-1">
                    點擊卡片來揭示你的命運
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className={`grid ${getSpreadLayout()} max-w-3xl mx-auto`}>
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="relative group cursor-pointer"
                      onClick={() => !card.isRevealed && revealCard(card.id)}
                    >
                      <div
                        className={`mb-1 text-center w-full z-10 transition-opacity duration-500 ${card.isRevealed ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                      >
                        <h3 className="font-bold pb-2 text-amber-100 text-sm truncate px-1 font-serif">
                          {card.name}
                        </h3>
                        <Badge
                          variant={card.isReversed ? "destructive" : "default"}
                          className="text-xs mb-1 bg-amber-700/80 text-amber-50 border-amber-600"
                        >
                          {card.isReversed ? "逆位" : "正位"}
                        </Badge>
                      </div>
                      <div
                        className={`relative w-[200px] h-[300px] mx-auto transform transition-all duration-700 ${card.isRevealed ? "rotate-y-180" : "hover:scale-105 shadow-2xl"}`}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div
                          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${card.isRevealed ? "opacity-0" : "opacity-100"}`}
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <CardBack />
                        </div>
                        <div
                          className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-300 overflow-hidden ${card.isRevealed ? "opacity-100" : "opacity-0"}`}
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <img
                            src={card.image}
                            alt={card.name}
                            className={`h-[80%] w-auto ${card.isReversed ? "transform scale-y-[-1]" : ""} rounded-lg shadow-inner`}
                          />
                          <div className="absolute inset-0 w-full h-full -z-10">
                            <CardFront />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <DecorativeCorner
                position="bottom-left"
                className="left-0 bottom-0"
              />
              <DecorativeCorner
                position="bottom-right"
                className="right-0 bottom-0"
              />
              <MoonPhaseIndicator position="bottom" />
            </Card>

            {showResults && (
              <Card
                ref={resultsTitleRef}
                className="bg-[rgba(23,17,17,0.2)] mt-[80px] pb-[50px] border-2 border-[#C99041]/50 backdrop-blur-sm rounded-none relative shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom duration-1000"
              >
                <MoonPhaseIndicator position="top" />
                <LeftSideDecorations className="hidden sm:block" />
                <RightSideDecorations className="hidden sm:block" />
                <DecorativeCorner
                  position="top-left"
                  className="left-0 top-0"
                />
                <DecorativeCorner
                  position="top-right"
                  className="right-0 top-0"
                />

                <CardHeader className="text-center sm:mt-[50px] mt-[10px]">
                  <CardTitle className="text-2xl md:text-3xl text-amber-100 font-serif tracking-wider">
                    占卜結果
                  </CardTitle>
                  <CardDescription className="text-amber-200/90 text-sm md:text-base mt-1">
                    <span className="inline-block border-b border-amber-500/50 pb-1">
                      以下是你的塔羅牌解讀
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-8 sm:px-12">
                  <div className="space-y-12">
                    {cards.map((card, index) => (
                      <article
                        key={card.id}
                        className="pb-8 border-b border-amber-500/10 last:border-0 animate-in slide-in-from-bottom duration-500"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <header className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 bg-amber-400/10 text-amber-200 border border-amber-500/30 rounded-full flex items-center justify-center font-bold font-serif shadow-inner">
                            {index + 1}
                          </div>
                          <h3 className="text-2xl font-semibold text-amber-100 font-serif tracking-wider">
                            {card.name}
                          </h3>
                          <Badge
                            variant={
                              card.isReversed ? "destructive" : "default"
                            }
                            className={`ml-auto px-3 py-1 ${card.isReversed ? "bg-amber-900/40 text-amber-400 border-amber-800" : "bg-amber-600/40 text-amber-100 border-amber-500"}`}
                          >
                            {card.isReversed ? "逆位" : "正位"}
                          </Badge>
                        </header>
                        <div className="text-amber-100/90 space-y-4 ml-2 border-l-2 border-amber-500/20 pl-6">
                          <p className="leading-relaxed font-medium text-amber-50 text-lg italic">
                            {card.meaning.summary}
                          </p>
                          {card.meaning.details &&
                            card.meaning.details.length > 0 && (
                              <ul className="list-disc list-outside space-y-3 text-sm text-amber-100/80 pl-4 py-2">
                                {card.meaning.details.map((detail, i) => (
                                  <li key={i}>{detail}</li>
                                ))}
                              </ul>
                            )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* AI 深度解讀區塊 */}
                  <div className="mt-16 pt-12 border-t border-[#C99041]/30">
                    {!aiReading ? (
                      <div className="max-w-2xl mx-auto relative">
                        {/* 靈魂簽名表單 - 只有點擊按鈕後才會「長」出來 */}
                        {showSoulSignature ? (
                          <div className="bg-amber-950/40 p-8 rounded-[2.5rem] border border-amber-500/30 shadow-[0_0_40px_rgba(0,0,0,0.4)] animate-in slide-in-from-top fade-in duration-700 mb-8 relative group">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#171111] px-4 border border-amber-500/30 rounded-full py-1 text-[10px] text-amber-500 uppercase tracking-widest font-serif">
                              Soul Signature
                            </div>

                            <h4 className="text-xl font-bold text-amber-100 mb-6 flex items-center justify-center gap-3 font-serif">
                              <Sparkles className="w-5 h-5 text-amber-400" />
                              靈魂共鳴參數
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-xs text-amber-500/70 uppercase tracking-widest ml-1 font-serif">
                                  出生日期 (選填)
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                  <Select
                                    value={birthYear}
                                    onValueChange={setBirthYear}
                                  >
                                    <SelectTrigger className="bg-black/40 border-amber-500/30 text-amber-100 rounded-2xl h-12 px-2 text-sm justify-center font-serif">
                                      <SelectValue placeholder="年" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-amber-950 border-amber-500/40 text-amber-100 max-h-[300px]">
                                      {Array.from({ length: 107 }).map(
                                        (_, i) => {
                                          const year = (2026 - i).toString();
                                          return (
                                            <SelectItem key={year} value={year}>
                                              {year}
                                            </SelectItem>
                                          );
                                        },
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={birthMonth}
                                    onValueChange={setBirthMonth}
                                  >
                                    <SelectTrigger className="bg-black/40 border-amber-500/30 text-amber-100 rounded-2xl h-12 px-2 text-sm justify-center font-serif">
                                      <SelectValue placeholder="月" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-amber-950 border-amber-500/40 text-amber-100">
                                      {Array.from({ length: 12 }).map(
                                        (_, i) => {
                                          const month = (i + 1)
                                            .toString()
                                            .padStart(2, "0");
                                          return (
                                            <SelectItem
                                              key={month}
                                              value={month}
                                            >
                                              {month}
                                            </SelectItem>
                                          );
                                        },
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={birthDay}
                                    onValueChange={setBirthDay}
                                  >
                                    <SelectTrigger className="bg-black/40 border-amber-500/30 text-amber-100 rounded-2xl h-12 px-2 text-sm justify-center font-serif">
                                      <SelectValue placeholder="日" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-amber-950 border-amber-500/40 text-amber-100 max-h-[300px]">
                                      {Array.from({ length: 31 }).map(
                                        (_, i) => {
                                          const day = (i + 1)
                                            .toString()
                                            .padStart(2, "0");
                                          return (
                                            <SelectItem key={day} value={day}>
                                              {day}
                                            </SelectItem>
                                          );
                                        },
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-amber-500/70 uppercase tracking-widest ml-1 font-serif">
                                  出生時間 (選填)
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Select
                                    value={birthHour}
                                    onValueChange={setBirthHour}
                                  >
                                    <SelectTrigger className="bg-black/40 border-amber-500/30 text-amber-100 rounded-2xl h-12 font-serif">
                                      <SelectValue placeholder="時" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-amber-950 border-amber-500/40 text-amber-100 max-h-[300px]">
                                      {Array.from({ length: 24 }).map(
                                        (_, i) => (
                                          <SelectItem
                                            key={i}
                                            value={i
                                              .toString()
                                              .padStart(2, "0")}
                                          >
                                            {i.toString().padStart(2, "0")} 時
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={birthMinute}
                                    onValueChange={setBirthMinute}
                                  >
                                    <SelectTrigger className="bg-black/40 border-amber-500/30 text-amber-100 rounded-2xl h-12 font-serif">
                                      <SelectValue placeholder="分" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-amber-950 border-amber-500/40 text-amber-100 max-h-[300px]">
                                      {Array.from({ length: 60 }).map(
                                        (_, i) => (
                                          <SelectItem
                                            key={i}
                                            value={i
                                              .toString()
                                              .padStart(2, "0")}
                                          >
                                            {i.toString().padStart(2, "0")} 分
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs text-amber-500/70 uppercase tracking-widest ml-1 font-serif">
                                  能量認同 (選填)
                                </Label>
                                <Select
                                  value={gender}
                                  onValueChange={setGender}
                                >
                                  <SelectTrigger className="bg-black/40 border-amber-500/30 text-amber-100 rounded-2xl h-12 focus:border-amber-400 font-serif">
                                    <SelectValue placeholder="請選擇您的能量屬性" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-amber-950 border-amber-500/40 text-amber-100 rounded-xl">
                                    <SelectItem value="male">
                                      陽性能量 / 男性
                                    </SelectItem>
                                    <SelectItem value="female">
                                      陰性能量 / 女性
                                    </SelectItem>
                                    <SelectItem value="non-binary">
                                      多元能量 / 非二元
                                    </SelectItem>
                                    <SelectItem value="prefer-not-to-say">
                                      宇宙能量 / 不提供
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-4">
                              <Button
                                onClick={fetchAiReading}
                                disabled={isAiLoading}
                                className="w-full bg-amber-600 hover:bg-amber-500 text-amber-50 rounded-2xl py-7 font-serif text-lg tracking-widest shadow-[0_0_20px_rgba(217,119,6,0.2)] transition-all hover:scale-[1.02] active:scale-95"
                              >
                                {isAiLoading
                                  ? "共鳴解讀中..."
                                  : "確認並啟動深度解讀"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSoulSignature(false)}
                                className="text-xs text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/5 uppercase tracking-widest font-serif transition-colors"
                              >
                                點擊收合此區塊
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* 初始按鈕狀態 */
                          <div className="flex flex-col gap-4">
                            <Button
                              onClick={() => {
                                if (session) {
                                  setShowSoulSignature(true);
                                } else {
                                  setShowLoginDialog(true);
                                }
                              }}
                              className="w-full bg-amber-500/5 hover:bg-amber-500/10 text-amber-200 border border-[#C99041]/40 rounded-[2.5rem] py-16 h-auto flex flex-col items-center group transition-all duration-700 hover:border-amber-400 hover:text-amber-100 shadow-inner relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                              <div className="flex flex-col items-center relative z-10 transition-transform duration-700 group-hover:scale-105">
                                {/* Divine Crystal Ball Animation */}
                                <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
                                  {/* External "Fireworks" / Rays - Rotating Light Fields (Softened) */}
                                  <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_0deg,transparent_0,rgba(251,191,36,0.2)_20deg,transparent_40deg,rgba(251,191,36,0.2)_60deg,transparent_80deg,transparent_360deg)] animate-[spin_8s_linear_infinite] blur-xl opacity-50"></div>
                                  <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_180deg,transparent_0,rgba(245,158,11,0.15)_30deg,transparent_60deg,transparent_360deg)] animate-[spin_12s_linear_infinite_reverse] blur-xl opacity-40"></div>
                                  <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-2xl animate-pulse"></div>

                                  {/* Core Orb */}
                                  <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] ring-1 ring-white/10 bg-gradient-to-b from-amber-100/10 to-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                    {/* Internal Mystic Essence - Active Swirls */}
                                    <div className="absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent,rgba(217,119,6,0.2),transparent)] animate-[spin_8s_linear_infinite] blur-md"></div>
                                    <div className="absolute inset-[-60%] bg-[conic-gradient(from_180deg,transparent,rgba(251,191,36,0.2),transparent)] animate-[spin_12s_linear_infinite_reverse] blur-md mix-blend-plus-lighter"></div>

                                    {/* Nebula Clouds */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse"></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.15),transparent_50%)] animate-[pulse_4s_ease-in-out_infinite_reverse]"></div>

                                    {/* Orbiting Particles / Stardust */}
                                    <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                                      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-100 rounded-full blur-[1px] opacity-60"></div>
                                      <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full blur-[1px] opacity-40"></div>
                                    </div>
                                    <div className="absolute inset-0 animate-[spin_15s_linear_infinite_reverse]">
                                      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-200 rounded-full blur-[0.5px] opacity-50"></div>
                                      <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-violet-200 rounded-full blur-[1px] opacity-30"></div>
                                      <div className="absolute top-2/3 left-1/5 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
                                    </div>

                                    {/* Deep Core Energy */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay animate-[spin_60s_linear_infinite]"></div>

                                    {/* Central Soul Spark (Removed as per user request) */}

                                    {/* Glass Shine/Reflection - Enhanced & Repositioned */}
                                    <div className="absolute top-4 left-5 w-8 h-4 bg-gradient-to-br from-white/40 to-transparent rounded-[100%] rotate-[-45deg] blur-[2px] opacity-80 animate-pulse"></div>
                                    <div className="absolute bottom-5 right-6 w-3 h-3 bg-amber-400/20 rounded-full blur-[2px]"></div>

                                    {/* Optional: Subtle Moving Glint */}
                                    <div className="absolute top-1/2 left-1/2 w-[120%] h-[20%] bg-white/5 rotate-45 blur-lg animate-[spin_6s_linear_infinite] opacity-30 pointer-events-none"></div>
                                  </div>
                                </div>
                                <span className="text-2xl font-serif tracking-[0.2em] mb-4">
                                  啟動 AI 深度靈魂解讀
                                </span>
                                <span className="text-xs text-amber-100/40 font-serif uppercase tracking-[0.3em] group-hover:text-amber-100/60">
                                  需登入以連結您的獨特靈魂印記
                                </span>
                              </div>
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* AI 結果顯示 */
                      <div className="bg-[#C99041]/5 border border-[#C99041]/30 rounded-[3rem] p-10 animate-in fade-in zoom-in duration-1000 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden min-h-[400px]">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>

                        <div className="flex items-center justify-center gap-4 mb-10">
                          <div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full"></div>
                          <Sparkles className="w-6 h-6 text-amber-400" />
                          <h4 className="text-2xl font-bold text-amber-100 font-serif tracking-widest text-center">
                            {new Date().getFullYear()} 年度命運啟示錄
                          </h4>
                          <Sparkles className="w-6 h-6 text-amber-400" />
                          <div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full"></div>
                        </div>

                        <div className="prose prose-invert max-w-none text-md text-amber-50/90 leading-[2.2] font-serif tracking-wide text-justify transition-all duration-1000">
                          <ReactMarkdown
                            components={{
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-2xl font-bold text-amber-300 mt-12 mb-8 flex items-center gap-3 border-b border-amber-500/20 pb-4 font-serif tracking-widest italic"
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p
                                  className="mb-10 drop-shadow-sm leading-[2.4]"
                                  {...props}
                                />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong
                                  className="text-amber-200 font-bold drop-shadow-[0_0_10px_rgba(251,191,36,0.4)] px-1"
                                  {...props}
                                />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className="border-l-4 border-amber-500/40 pl-8 py-6 my-12 italic text-amber-200/90 bg-amber-500/5 rounded-r-3xl border-double"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {aiReading}
                          </ReactMarkdown>
                        </div>

                        <div className="mt-12 flex justify-center">
                          <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 底部按鈕 */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-16 w-full justify-center">
                    {session && (
                      <Button
                        onClick={saveDivination}
                        disabled={isSaving || isSaved}
                        variant="outline"
                        className={`min-w-[200px] border-2 border-amber-500/40 bg-transparent text-amber-200 text-lg px-10 py-7 rounded-full transition-all hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-100 transform hover:scale-105 font-serif ${isSaved ? "opacity-60 cursor-default" : ""}`}
                      >
                        {isSaving
                          ? "紀錄典藏中..."
                          : isSaved
                            ? "已納入私人秘藏"
                            : "儲存本次啟示"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="min-w-[200px] border-2 border-amber-500/40 bg-transparent text-amber-200 text-lg px-10 py-7 rounded-full transition-all hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-100 transform hover:scale-105 font-serif"
                      onClick={resetReading}
                    >
                      再次探詢星辰
                    </Button>
                  </div>
                </CardContent>

                <DecorativeCorner
                  position="bottom-left"
                  className="left-0 bottom-0"
                />
                <DecorativeCorner
                  position="bottom-right"
                  className="right-0 bottom-0"
                />
                <MoonPhaseIndicator position="bottom" />
              </Card>
            )}
          </main>
        )}
      </div>
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-[#171111] border border-[#C99041] text-amber-50 rounded-2xl sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 mb-2">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <DialogTitle className="text-center text-2xl font-serif tracking-wider text-amber-100">
              開啟靈魂之門
            </DialogTitle>
            <DialogDescription className="text-center text-amber-200/80 leading-relaxed font-serif text-base">
              AI 深度解讀需要連結您的靈魂印記
              <br />
              請登入以開啟這段專屬於您的靈性對話
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-6">
            <Button
              onClick={() => signIn("google")}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-serif tracking-widest py-6 rounded-xl text-lg shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all transform hover:scale-[1.02]"
            >
              <Users className="w-5 h-5 mr-3" />
              使用 Google 帳號登入
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowLoginDialog(false)}
              className="mt-2 text-amber-500/60 hover:text-amber-400 hover:bg-transparent tracking-widest font-serif"
            >
              暫時不要
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function TarotDivination() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#171111] flex items-center justify-center text-amber-100">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin" />
            <p className="font-serif tracking-widest">啟動占卜儀式...</p>
          </div>
        </div>
      }
    >
      <DivinationContent />
    </Suspense>
  );
}
