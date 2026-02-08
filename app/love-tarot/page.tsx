"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Sparkles, ArrowLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import { CornerDecoration } from "@/components/decorations/corner-decoration";
import { DecorativeCorner } from "@/components/decorations/decorative-corner";
import { MoonPhaseIndicator } from "@/components/decorations/moonPhaseIndicator";
import { CloudDecoration } from "@/components/decorations/CloudDecoration";
import { MoonFaceDecoration } from "@/components/decorations/MoonFaceDecoration";
import { Start01decoration } from "@/components/decorations/Start01decoration";
import { TarotDecorativeElements } from "@/components/decorations/decorative-elements";
import { LoveTarotDecorativeElements } from "@/components/decorations/love-decorative-elements";
import CardBack from "@/components/CardBack";
import CardFront from "@/components/CardFront";
import ReactMarkdown from "react-markdown";
import tarotCards from "@/data/tarot-cards";
import { useToast } from "@/hooks/use-toast";

type RelationshipStatus = "crush" | "ex" | "current" | null;

interface DrawnCard {
  id: string;
  name: string;
  position: number;
  positionMeaning: string;
  image: string;
  isRevealed: boolean;
  isReversed?: boolean;
}

const LoveTarotCard = ({
  card,
  onClick,
  isSummary = false,
}: {
  card: DrawnCard;
  onClick?: () => void;
  isSummary?: boolean;
}) => {
  const isRevealed = isSummary ? true : card.isRevealed;

  return (
    <div
      className={`relative group ${!isRevealed ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div
        className={`mb-3 text-center transition-opacity duration-500 h-16 flex flex-col items-center justify-end ${isRevealed ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <h3 className="font-bold pb-2 text-amber-100 text-sm truncate px-1 font-serif">
          {card.name}
        </h3>
        <Badge
          variant={card.isReversed ? "destructive" : "default"}
          className={`text-[9px] px-2.5 py-0.5 h-5 font-serif border text-xs mb-1 ${
            card.isReversed
              ? "bg-red-900/40 text-red-100 border-red-500/50"
              : "bg-amber-700/80 text-amber-50 border-amber-600"
          }`}
        >
          {card.isReversed ? "逆位" : "正位"}
        </Badge>
      </div>

      <div
        className="relative w-full max-w-[200px] mx-auto"
        style={{ perspective: "1000px" }}
      >
        <div
          className={`relative aspect-[2/3] w-full transform transition-all duration-700 ${isRevealed ? "rotate-y-180" : "hover:scale-105 shadow-2xl"}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <CardBack />

          <div
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-2xl shadow-amber-500/20"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <img
              src={card.image}
              alt={card.name}
              className={`h-[90%] w-auto rounded-md shadow-inner ${card.isReversed ? "rotate-180" : ""}`}
            />
            <div className="absolute inset-0 w-full h-full -z-10">
              <CardFront />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] text-amber-500/80 font-serif uppercase tracking-widest h-4 leading-tight">
        {card.positionMeaning}
      </p>
    </div>
  );
};

const CARD_POSITIONS = [
  "你對Ta的想法",
  "Ta對你的想法",
  "你對目前關係的看法",
  "Ta對目前關係的看法",
  "你對未來關係的期待",
  "Ta對未來關係的期待",
];

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  crush: [
    "我們未來的發展趨勢如何？",
    "對方現在對我的真實感覺？",
    "我們之間存在什麼樣的阻礙？",
    "我該如何推動這段關係？",
  ],
  ex: [
    "我們之間還有複合的可能嗎？",
    "這段關係結束的修課與意義？",
    "對方現在是如何看待我的？",
    "我該如何放下並重新開始？",
  ],
  current: [
    "我們未來的感情走向如何？",
    "彼此在關係中潛在的問題？",
    "如何讓現有的感情更加溫？",
    "對方對這段關係的長遠想法？",
  ],
  default: [
    "我們未來的發展趨勢如何？",
    "目前關係中潛在的挑戰是什麼？",
    "該如何提升彼此的感情？",
    "對方的真實心意與想法？",
  ],
};

export default function LoveTarotPage() {
  const { data: session } = useSession();
  const [relationshipStatus, setRelationshipStatus] =
    useState<RelationshipStatus>(null);
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiReading, setAiReading] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [showReadingInput, setShowReadingInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const currentSuggestedQuestions = relationshipStatus
    ? SUGGESTED_QUESTIONS[relationshipStatus]
    : SUGGESTED_QUESTIONS.default;

  const statusOptions = [
    { id: "crush" as RelationshipStatus, label: "曖昧對象", icon: "💗" },
    { id: "ex" as RelationshipStatus, label: "前任", icon: "💔" },
    { id: "current" as RelationshipStatus, label: "現任", icon: "❤️" },
  ];

  const handleStatusSelect = (status: RelationshipStatus) => {
    setRelationshipStatus(status);
  };

  const handleSuggestedQuestion = (q: string) => {
    setQuestion(q);
  };

  const startDivination = () => {
    if (!relationshipStatus) return;

    setIsDrawing(true);
    setIsReading(true);

    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 6).map((card, index) => ({
      id: `${card.id}-${index}`,
      name: card.name,
      position: index + 1,
      positionMeaning: CARD_POSITIONS[index],
      image: card.image,
      isRevealed: false,
      isReversed: Math.random() > 0.5,
    }));

    setDrawnCards(selected);
    setIsDrawing(false);
  };

  const handleCardReveal = (cardId: string) => {
    setDrawnCards((prev) => {
      const updated = prev.map((card) =>
        card.id === cardId ? { ...card, isRevealed: true } : card,
      );

      const allRevealed = updated.every((card) => card.isRevealed);
      if (allRevealed) {
        // Wait for the last flip animation to complete before showing input
        setTimeout(() => {
          setShowReadingInput(true);
        }, 1000);
      }
      return updated;
    });
  };

  const fetchAiReading = async () => {
    if (!question.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/love-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationshipStatus,
          question,
          cards: drawnCards.map((c) => ({
            name: c.name,
            position: c.position,
            positionMeaning: c.positionMeaning,
          })),
        }),
      });

      const data = await response.json();
      if (data.reading) {
        setAiReading(data.reading);
      }
    } catch (error) {
      console.error("AI reading error:", error);
      setAiReading("無法連接到AI服務，請稍後再試。");
    } finally {
      setIsAiLoading(false);
    }
  };

  const goBack = () => {
    setIsReading(false);
    setDrawnCards([]);
    setAiReading("");
    setShowReadingInput(false);
  };

  const resetReading = () => {
    setIsReading(false);
    setRelationshipStatus(null);
    setQuestion("");
    setDrawnCards([]);
    setAiReading("");
    setShowReadingInput(false);
    setIsSaved(false);
    setIsSaving(false);
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
          theme: "love_tarot",
          spreadType: "love_six_cards",
          cards: drawnCards.map((c) => ({
            name: c.name,
            isReversed: c.isReversed,
            meaning: c.positionMeaning,
          })),
          question: question,
          aiReading: aiReading || null,
          userContext: { relationshipStatus },
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

  useEffect(() => {
    if (showReadingInput) {
      const timer = setTimeout(() => {
        const element = document.getElementById("ai-input-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showReadingInput]);

  return (
    <div className="relative min-h-screen bg-[#171111] text-[#F9ECDC] overflow-hidden p-4 pb-24">
      <div className="absolute z-50 inset-2 sm:inset-4 border border-[#C99041] rounded-3xl pointer-events-none"></div>
      <div className="absolute z-50 inset-4 sm:inset-8 border border-[#C99041] rounded-xl pointer-events-none"></div>
      <div className="absolute z-10 inset-0 sm:inset-0 sm:border-[40px] border-[20px] border-[#171111] rounded-xl pointer-events-none"></div>

      <CornerDecoration
        position="top-left"
        className="z-50 top-2 left-2 sm:top-4 sm:left-4 pointer-events-none"
      />
      <CornerDecoration
        position="top-right"
        className="z-50 top-2 right-2 sm:top-4 sm:right-4 pointer-events-none"
      />
      <CornerDecoration
        position="bottom-right"
        className="z-50 bottom-2 left-2 sm:bottom-4 sm:left-4 scale-x-[-1] pointer-events-none"
      />
      <CornerDecoration
        position="bottom-left"
        className="z-50 bottom-2 right-2 sm:bottom-4 sm:right-4 scale-y-[-1] pointer-events-none"
      />

      <Header />

      <div className="container mx-auto px-4 py-8 relative">
        <LoveTarotDecorativeElements className="absolute w-[200%] sm:w-full sm:top-0 top-[20px] h-full mb-20 -left-1/2 sm:left-0 pointer-events-none" />

        <div className="max-w-2xl mx-auto relative">
          {!isReading ? (
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
                    你想了解誰？
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {statusOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleStatusSelect(option.id)}
                        className={`font-serif sm:text-md text-[14px] border transition-all duration-300 transform flex items-center justify-center sm:py-3 py-2 rounded-full focus:outline-none ${
                          relationshipStatus === option.id
                            ? "scale-105 bg-amber-500/20 border-amber-400 text-amber-50 shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:bg-amber-500/30 hover:text-amber-50"
                            : "bg-transparent border-[#C99041] text-amber-300 hover:text-amber-100 hover:bg-amber-500/10 hover:scale-105"
                        }`}
                      >
                        <span className="text-lg mr-1">{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="sm:text-3xl text-[16px] font-bold text-amber-100 mb-6 text-center font-serif tracking-wider">
                    心靈聚焦
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentSuggestedQuestions.map((q: string, idx: number) => (
                      <Button
                        key={idx}
                        variant={question === q ? "default" : "outline"}
                        className={`font-serif sm:text-sm text-[12px] text-left justify-start px-6 py-6 h-auto whitespace-normal text-amber-100/80 hover:text-amber-100 bg-transparent hover:bg-amber-500/10 border border-[#C99041]/30 hover:border-[#C99041] rounded-xl transition-all duration-300 ${question === q ? "bg-[#C99041]/10 border-[#C99041] text-amber-100 shadow-[0_0_10px_rgba(201,144,65,0.1)]" : ""}`}
                        onClick={() => handleSuggestedQuestion(q)}
                        disabled={!relationshipStatus}
                      >
                        <Sparkles
                          className={`w-3.5 h-3.5 mr-2 shrink-0 ${question === q ? "text-amber-400" : "text-amber-400/30"}`}
                        />
                        {q}
                      </Button>
                    ))}
                  </div>
                </section>

                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    onClick={startDivination}
                    disabled={!relationshipStatus || isDrawing}
                    className={`font-serif sm:text-md text-[14px] text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border-2 border-[#C99041] sm:py-8 sm:px-12 rounded-full shadow-[0_0_20px_rgba(201,144,65,0.2)] transition-all duration-300 transform ${!relationshipStatus ? "opacity-40 cursor-not-allowed" : "hover:scale-105 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(201,144,65,0.4)]"}`}
                  >
                    <Sparkles
                      className={`w-5 h-5 mr-2 ${relationshipStatus ? "text-amber-300" : "text-amber-300/30"}`}
                    />
                    <span className="drop-shadow-sm font-bold tracking-widest text-lg">
                      {isDrawing
                        ? "召喚卡片中..."
                        : relationshipStatus
                          ? "啟動聖愛占卜"
                          : "請先選擇關係狀態"}
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
          ) : (
            <div className="space-y-6">
              {!isAiLoading && !aiReading && (
                <button
                  onClick={goBack}
                  className="mb-4 text-amber-200/60 hover:text-amber-100 hover:bg-amber-500/10 px-4 py-2 rounded-lg flex items-center transition-colors font-serif"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回重選
                </button>
              )}

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
                  className="w-full -mt-4 hidden sm:block"
                  position="top"
                  size="md"
                />
                <DecorativeCorner
                  position="top-left"
                  className="left-0 top-0"
                />
                <DecorativeCorner
                  position="top-right"
                  className="right-0 top-0"
                />

                <CardContent className="p-8 mt-4 mb-8 space-y-8">
                  <CardHeader className="text-center sm:mt-[50px] mt-[10px] p-0 mb-8">
                    <CardTitle className="text-2xl md:text-3xl text-amber-100 font-serif tracking-wider">
                      聖愛塔羅 - 六芒星牌陣
                    </CardTitle>
                    <CardDescription className="text-amber-200/90 text-sm md:text-base mt-2">
                      <span className="inline-block border-b border-[#C99041]/50 pb-1 font-serif text-amber-200">
                        點擊卡片來揭示你的命運
                      </span>
                    </CardDescription>
                  </CardHeader>

                  {isAiLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center animate-in fade-in duration-1000">
                      {/* Premium Crystal Ball Loading State */}
                      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                        {/* External rotating light fields */}
                        <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_0deg,transparent_0,rgba(251,191,36,0.3)_20deg,transparent_40deg,rgba(251,191,36,0.3)_60deg,transparent_80deg,transparent_360deg)] animate-[spin_4s_linear_infinite] blur-2xl opacity-60"></div>
                        <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_180deg,transparent_0,rgba(236,72,153,0.2)_30deg,transparent_60deg,transparent_360deg)] animate-[spin_6s_linear_infinite_reverse] blur-2xl opacity-50"></div>
                        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-3xl animate-pulse"></div>

                        {/* Core Orb */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-[0_0_60px_-10px_rgba(251,191,36,0.7)] ring-2 ring-white/20 bg-gradient-to-b from-amber-100/20 to-black/80 backdrop-blur-[4px] z-10 flex items-center justify-center">
                          {/* Internal Active Swirls */}
                          <div className="absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent,rgba(217,119,6,0.4),transparent)] animate-[spin_3s_linear_infinite] blur-lg"></div>
                          <div className="absolute inset-[-60%] bg-[conic-gradient(from_180deg,transparent,rgba(251,191,36,0.4),transparent)] animate-[spin_5s_linear_infinite_reverse] blur-lg mix-blend-plus-lighter"></div>

                          {/* Pulsing Nebula */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.2),transparent_70%)] animate-pulse"></div>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1),transparent_80%)] animate-[pulse_2s_ease-in-out_infinite]"></div>

                          {/* Fast Particles */}
                          <div className="absolute inset-0 animate-[spin_2s_linear_infinite]">
                            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-amber-100 rounded-full blur-[1px]"></div>
                            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white rounded-full blur-[1px]"></div>
                          </div>

                          <div className="absolute top-6 left-8 w-12 h-6 bg-gradient-to-br from-white/50 to-transparent rounded-[100%] rotate-[-45deg] blur-[3px] opacity-90 animate-pulse"></div>
                        </div>
                      </div>

                      <div className="text-center space-y-4 relative z-20">
                        <h3 className="text-3xl text-amber-100 font-serif tracking-[0.3em] font-bold animate-pulse">
                          正在感應聖愛能量...
                        </h3>
                        <p className="text-amber-200/60 font-serif tracking-[0.2em] italic">
                          塔羅靈魂球正在為您翻譯命運的低語
                        </p>
                      </div>
                    </div>
                  ) : aiReading ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {drawnCards.map((card) => (
                          <LoveTarotCard
                            key={card.id}
                            card={card}
                            isSummary={true}
                          />
                        ))}
                      </div>

                      <div className="bg-[#C99041]/5 border border-[#C99041]/30 rounded-[3rem] p-10 animate-in fade-in zoom-in duration-1000 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden min-h-[400px]">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>

                        <div className="flex items-center justify-center gap-4 mb-10">
                          <div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full"></div>
                          <Sparkles className="w-6 h-6 text-amber-400" />
                          <h4 className="text-2xl font-bold text-amber-100 font-serif tracking-widest text-center">
                            聖愛深度啟示錄
                          </h4>
                          <Sparkles className="w-6 h-6 text-amber-400" />
                          <div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full"></div>
                        </div>

                        <div className="prose prose-invert max-w-none text-md text-amber-50/90 leading-[2.2] font-serif tracking-wide text-justify transition-all duration-1000">
                          <ReactMarkdown
                            components={{
                              h2: ({ node, ...props }) => (
                                <h2
                                  className="text-2xl font-bold text-amber-100 my-8 flex items-center gap-3 border-l-4 border-amber-500/40 pl-4 bg-amber-500/5 py-2 rounded-r-xl"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-xl font-bold text-amber-300 mt-12 mb-8 flex items-center gap-3 border-b border-amber-500/20 pb-4 font-serif tracking-widest italic"
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

                      <div className="flex flex-col sm:flex-row gap-4 pt-10 w-full justify-center">
                        {session && (
                          <button
                            onClick={saveDivination}
                            disabled={isSaving || isSaved}
                            className={`min-w-[180px] border-2 border-amber-500/30 bg-transparent text-amber-200 text-md px-8 py-3.5 rounded-full transition-all hover:bg-amber-500/10 hover:border-amber-400 hover:text-amber-100 transform hover:scale-105 font-serif ${isSaved ? "opacity-60 cursor-default" : ""}`}
                          >
                            {isSaving
                              ? "紀錄典藏中..."
                              : isSaved
                                ? "已納入私人秘藏"
                                : "儲存本次啟示"}
                          </button>
                        )}
                        <button
                          onClick={resetReading}
                          className="min-w-[180px] border-2 border-amber-500/30 bg-transparent text-amber-200 text-md px-8 py-3.5 rounded-full transition-all hover:bg-amber-500/10 hover:border-amber-400 hover:text-amber-100 transform hover:scale-105 font-serif"
                        >
                          全新的聖愛尋索
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {drawnCards.map((card) => (
                          <LoveTarotCard
                            key={card.id}
                            card={card}
                            onClick={() =>
                              !card.isRevealed && handleCardReveal(card.id)
                            }
                          />
                        ))}
                      </div>

                      {showReadingInput && (
                        <div
                          id="ai-input-section"
                          className="space-y-8 pt-12 border-t border-[#C99041]/30 animate-in fade-in slide-in-from-bottom duration-1000"
                        >
                          <section className="text-center">
                            <h3 className="text-2xl text-amber-100 font-serif mb-4 flex items-center justify-center">
                              <Sparkles className="w-6 h-6 mr-3 text-amber-400" />
                              凝聚靈感，開啟解讀
                            </h3>
                            <p className="text-amber-200/60 text-sm mb-6 max-w-md mx-auto">
                              牌陣已現。在此刻，您可以再次閉上眼睛，感受您的問題，然後請
                              AI 為您翻譯命運的訊息。
                            </p>
                            <div className="relative">
                              <Textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="請描述您的問題，或直接使用先前的建議主題..."
                                className="bg-black/50 border-[#C99041] text-amber-50 font-serif min-h-[140px] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 text-lg p-6 rounded-xl"
                              />
                            </div>
                          </section>
                          <div className="text-center">
                            <button
                              onClick={fetchAiReading}
                              disabled={!question.trim()}
                              className="w-full bg-amber-500/5 hover:bg-amber-500/10 text-amber-200 border border-[#C99041]/40 rounded-[2rem] py-10 h-auto flex flex-col items-center group transition-all duration-700 hover:border-amber-400 hover:text-amber-100 shadow-inner relative overflow-hidden focus:outline-none disabled:opacity-30"
                            >
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                              <div className="flex flex-col items-center relative z-10 transition-transform duration-700 group-hover:scale-105">
                                {/* Divine Crystal Ball Animation */}
                                <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
                                  {/* External rays */}
                                  <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_0deg,transparent_0,rgba(251,191,36,0.2)_20deg,transparent_40deg,rgba(251,191,36,0.2)_60deg,transparent_80deg,transparent_360deg)] animate-[spin_8s_linear_infinite] blur-xl opacity-50"></div>
                                  <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_180deg,transparent_0,rgba(245,158,11,0.15)_30deg,transparent_60deg,transparent_360deg)] animate-[spin_12s_linear_infinite_reverse] blur-xl opacity-40"></div>
                                  <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-2xl animate-pulse"></div>

                                  {/* Core Orb */}
                                  <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] ring-1 ring-white/10 bg-gradient-to-b from-amber-100/10 to-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                    {/* Internal Mystic Essence */}
                                    <div className="absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent,rgba(217,119,6,0.2),transparent)] animate-[spin_8s_linear_infinite] blur-md"></div>
                                    <div className="absolute inset-[-60%] bg-[conic-gradient(from_180deg,transparent,rgba(251,191,36,0.2),transparent)] animate-[spin_12s_linear_infinite_reverse] blur-md mix-blend-plus-lighter"></div>

                                    {/* Nebula Clouds */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(236,72,153,0.1),transparent_50%)] animate-pulse"></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.15),transparent_50%)] animate-[pulse_4s_ease-in-out_infinite_reverse]"></div>

                                    {/* Orbiting Stardust */}
                                    <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                                      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-100 rounded-full blur-[1px] opacity-60"></div>
                                      <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full blur-[1px] opacity-40"></div>
                                    </div>

                                    {/* Glass Reflection */}
                                    <div className="absolute top-4 left-5 w-8 h-4 bg-gradient-to-br from-white/40 to-transparent rounded-[100%] rotate-[-45deg] blur-[2px] opacity-80 animate-pulse"></div>
                                  </div>
                                </div>
                                <span className="text-md font-serif tracking-[0.2em] mb-4 text-amber-100 font-bold">
                                  啟動 AI 聖愛深度解讀
                                </span>
                                <span className="text-xs text-amber-100/40 font-serif uppercase tracking-[0.3em] group-hover:text-amber-100/60">
                                  需登入以連結您的獨特聖愛印記
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
