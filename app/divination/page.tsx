"use client"

// React & Next.js
import { useState, useRef, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CardBack from "@/components/CardBack"
import CardFront from "@/components/CardFront"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"

// Icons
import { Sparkles, Moon, Heart, Briefcase, Users, Activity, Eye } from "lucide-react"

// Custom Hooks
import { useToast } from "@/hooks/use-toast"

// Data
import tarotCards from "@/data/tarot-cards"

// Custom Components - Decorations
import { DecorativeCorner } from "@/components/decorations/decorative-corner"
import { MoonPhaseIndicator } from '@/components/decorations/moonPhaseIndicator'
import { CloudDecoration } from '@/components/decorations/CloudDecoration'
import { MoonFaceDecoration } from '@/components/decorations/MoonFaceDecoration'
import { Start01decoration } from '@/components/decorations/Start01decoration'
import { CornerDecoration } from "@/components/decorations/corner-decoration"
import { TarotDecorativeElements } from "@/components/decorations/decorative-elements"
import LeftSideDecorations from "@/components/decorations/LeftSideDecorations"
import RightSideDecorations from "@/components/decorations/RightSideDecorations"

type DivinationTheme = "love" | "career" | "relationship" | "health" | "self-exploration"
type SpreadType = "single" | "three" | "celtic-cross"

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
]

const spreads = [
  { id: "single" as SpreadType, label: "單張牌", count: 1 },
  { id: "three" as SpreadType, label: "三張牌", count: 3 },
  { id: "celtic-cross" as SpreadType, label: "十字牌", count: 10 },
]

export default function TarotDivination() {
  const { data: session } = useSession()
  const [selectedTheme, setSelectedTheme] = useState<DivinationTheme>("love")
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>("three")
  const [isReading, setIsReading] = useState(false)
  const [cards, setCards] = useState<TarotCard[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const resultsTitleRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const startDivination = () => {
    const spreadCount = spreads.find((s) => s.id === selectedSpread)?.count || 3
    const newCards: TarotCard[] = []
    
    // Create a copy of the tarot cards array to avoid mutating the original
    const availableCards = [...tarotCards]
    
    for (let i = 0; i < spreadCount && availableCards.length > 0; i++) {
      // Get a random index from the remaining cards
      const randomIndex = Math.floor(Math.random() * availableCards.length)
      const selectedCard = availableCards.splice(randomIndex, 1)[0]
      const isReversed = Math.random() > 0.5

            // 安全地獲取主題牌義，如果不存在則提供預設值
            const themeMeaning = selectedCard.meanings[selectedTheme] || { 
              upright: { summary: '暫無牌義', details: [] }, 
              reversed: { summary: '暫無牌義', details: [] } 
            };

            const meaning = isReversed
              ? themeMeaning.reversed
              : themeMeaning.upright;

      // Ensure meaning is in the new format
      const structuredMeaning = typeof meaning === 'string' 
        ? { summary: meaning, details: [] } 
        : meaning;

      newCards.push({
        id: selectedCard.id, // 使用正確的 string ID
        name: selectedCard.name,
        isReversed,
        isRevealed: false,
        meaning: structuredMeaning,
        image: selectedCard.image
      });
    }

    setCards(newCards)
    setIsReading(true)
    setShowResults(false)
    setIsSaved(false) // Reset save status for new divination
  }

  // 當 showResults 變為 true 時，滾動邏輯已移至 revealCard 函數中

  const revealCard = (cardId: string) => {
    setCards((prev) => {
      const updatedCards = prev.map((card) => 
        card.id === cardId ? { ...card, isRevealed: true } : card
      );
      
      // 檢查是否所有牌都翻開了
      const allRevealed = updatedCards.every(card => card.isRevealed);
      if (allRevealed) {
        // 先等待翻牌動畫完成 (500ms)
        setTimeout(() => {
          setShowResults(true);
          // 再等待短暫延遲後平滑滾動到結果 (額外500ms)
          setTimeout(() => {
            if (resultsTitleRef.current) {
              const yOffset = -50; // 向上偏移50px
              const y = resultsTitleRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 1000);
        }, 1000);
      }
      
      return updatedCards;
    });
  }

  const resetReading = () => {
    setIsReading(false)
    setShowResults(false)
    setCards([])
    setIsSaved(false) // Reset save status for re-reading
  }

  const getSpreadLayout = () => {
    if (selectedSpread === "single") {
      return "grid-cols-1 place-items-center"
    } else if (selectedSpread === "three") {
      return "grid-cols-1 md:grid-cols-3 gap-6"
    } else {
      return "grid-cols-2 md:grid-cols-4 gap-4"
    }
  }

  const saveDivination = async () => {
    if (!session) {
      toast({
        title: "請先登入",
        description: "登入後才能儲存您的占卜紀錄。",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/divinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: selectedTheme,
          spreadType: selectedSpread,
          cards: cards.map(c => ({ name: c.name, isReversed: c.isReversed, meaning: c.meaning })),
        }),
      })

      if (!response.ok) {
        throw new Error('儲存失敗')
      }

      setIsSaved(true) // Mark as saved

      toast({
        title: "儲存成功！",
        description: "您的占卜紀錄已儲存。",
      })
    } catch (error) {
      console.error('Failed to save divination:', error)
      toast({
        title: "儲存失敗",
        description: "無法儲存您的占卜紀錄，請稍後再試。",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative remin-h-screen bg-[#171111] text-[#F9ECDC] relative overflow-hidden p-4">
     
      {/* Header Section */}
      <Header />

     <div className="relative w-full h-full border-2 border-amber-400/50 rounded-3xl p-4 z-[1]">
        {/* Corner Decorations */}
        <CornerDecoration position="top-left" className="top-0 left-0" />
        <CornerDecoration position="top-right" className="top-0 right-0" />
        <CornerDecoration position="bottom-right" className="bottom-0 left-0 scale-x-[-1]" />
        <CornerDecoration position="bottom-left" className="bottom-0 right-0 scale-y-[-1]" />
        <div className="w-full h-full border-2 border-amber-400/30 rounded-xl">
          <div className="container mx-auto px-4 py-8 pb-[100px] relative">
            <div className="absolute inset-0 pointer-events-none" />
              {/* 主視覺 */}
              <TarotDecorativeElements className="absolute w-full h-full mb-20" />

            {!isReading ? (
          /* 設定區塊 */
          <main>
            <div className="relative max-w-2xl mx-auto">
              {/* 占卜設定 */}
            <Card className="bg-[rgba(23, 17, 17, 0.2)] border-2 border-amber-400 backdrop-blur-sm rounded-none relative overflow-visible">
              <MoonPhaseIndicator position="top" />
              <CloudDecoration className="w-full" position="top" />
              <Start01decoration className="w-full" position="top" />
              <MoonFaceDecoration className="w-full -mt-4" position="top" size="md" />
              
              <DecorativeCorner position="top-left" className="left-0 top-0" />
              <DecorativeCorner position="top-right" className="right-0 top-0" />
              <CardContent className="space-y-8 p-8 mt-4 mb-8 relative">
                {/* 占卜主題選擇 */}
                <section>
                  <h2 className="chinese-title-bakudai text-3xl font-bold text-amber-100 mb-6 text-center font-serif tracking-wider">占卜主題</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {themes.map((theme) => {
                      const Icon = theme.icon
                      return (
                        <Button
                          key={theme.id}
                          variant={selectedTheme === theme.id ? "default" : "outline"}
                          className={`font-serif py-6 border-2 border-amber-400 bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-md transition-all duration-300 transform rounded-full ${
                            selectedTheme === theme.id 
                              ? 'scale-105 bg-amber-500/10' 
                              : 'hover:scale-105'
                          }`}
                          onClick={() => setSelectedTheme(theme.id)}
                          aria-pressed={selectedTheme === theme.id}
                        >
                          <Icon className="w-5 h-5" />
                          {theme.label}
                        </Button>
                      )
                    })}
                  </div>
                </section>

                {/* 牌陣選擇 */}
                <section>
                  <h2 className="chinese-title-bakudai text-3xl text-amber-100 mb-6 text-center font-serif tracking-wider">牌陣選擇</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {spreads.map((spread) => (
                      <Button
                        key={spread.id}
                        variant={selectedSpread === spread.id ? "default" : "outline"}
                        className={`font-serif py-6 border-2 border-amber-400 bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-md transition-all duration-300 transform rounded-full ${
                          selectedSpread === spread.id 
                            ? 'scale-105 bg-amber-500/10' 
                            : 'hover:scale-105'
                        }`}
                        onClick={() => setSelectedSpread(spread.id)}
                        aria-pressed={selectedSpread === spread.id}
                      >
                        {spread.label}
                      </Button>
                    ))}
                  </div>
                </section>

                {/* 開始占卜按鈕 */}
                <div className="text-center pt-6">
                  <Button
                    size="lg"
                    className="font-serif border-2 border-amber-400 bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-md px-10 py-6 transition-all duration-300 transform hover:scale-105 rounded-full"
                    onClick={startDivination}
                  >
                    <Sparkles className="w-5 h-5 mr-2 text-amber-200" />
                    <span className="drop-shadow-sm">開始占卜</span>
                  </Button>
                </div>
              </CardContent>
              <DecorativeCorner position="bottom-left" className="left-0 bottom-0" />
              <DecorativeCorner position="bottom-right" className="right-0 bottom-0" />
              
              <MoonPhaseIndicator position="bottom" />
            </Card>
          </div>
          </main>
        ) : (
          <main className="max-w-2xl mx-auto">
            {/* 抽牌區塊 */}
            <Card className="bg-[rgba(23, 17, 17, 0.2)] pb-[50px] border-2 border-amber-400 backdrop-blur-sm rounded-none relative ">
              <MoonPhaseIndicator position="top" />
              <CloudDecoration className="w-full" position="top" />
              <Start01decoration className="w-full" position="top" />
              <MoonFaceDecoration className="w-full" position="top" size="md" />  
              
              <DecorativeCorner position="top-left" className="left-0 top-0" />
              <DecorativeCorner position="top-right" className="right-0 top-0" />
              
              <CardHeader className="text-center mt-[50px] mb-[0px]">
                <CardTitle className="text-2xl md:text-3xl text-amber-100 font-serif tracking-wider">
                  {themes.find((t) => t.id === selectedTheme)?.label} -{" "}
                  {spreads.find((s) => s.id === selectedSpread)?.label}
                </CardTitle>
                <CardDescription className="text-amber-200/90 text-sm md:text-base mt-2">
                  <span className="inline-block border-b border-amber-400/50 pb-1">點擊卡片來揭示你的命運</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid ${getSpreadLayout()} max-w-3xl mx-auto`}>
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="relative group cursor-pointer"
                      onClick={() => !card.isRevealed && revealCard(card.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`塔羅牌 ${card.id + 1}${card.isRevealed ? ` - ${card.name}` : " - 點擊翻開"}`}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && !card.isRevealed) {
                          e.preventDefault()
                          revealCard(card.id)
                        }
                      }}
                    >
                      {/* Card Title and Badge - Only shown when revealed */}
                      <div className={`mb-1 text-center w-full z-10  ${card.isRevealed ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        <h3 className=" font-bold pb-2 text-amber-100 text-sm truncate px-1 font-serif">
                          {card.name}
                        </h3>
                        <Badge 
                          variant={card.isReversed ? "destructive" : "default"} 
                          className="text-xs mb-1 bg-amber-700 hover:bg-amber-800 text-amber-50 border-amber-600/50"
                        >
                          {card.isReversed ? "逆位" : "正位"}
                        </Badge>
                      </div>
                      <div
                        className={`
                        relative w-[200px] h-0 pb-[300px] mx-auto
                        transform transition-all duration-700 preserve-3d flex flex-col
                        ${card.isRevealed ? "rotate-y-180" : "hover:scale-105 group-hover:shadow-2xl"}
                      `}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* 卡片背面 */}
                        <div
                          className={`
                          absolute inset-0 w-full h-full
                          transition-opacity duration-300
                          ${card.isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"}
                        `}
                          style={{
                            backfaceVisibility: "hidden",
                          }}
                        >
                          <CardBack />
                        </div>

                        {/* 卡片正面 */}
                        <div
                          className={`
                          absolute inset-0 w-full h-full
                          flex flex-col items-center justify-center 
                          transition-opacity duration-300 overflow-hidden shadow-inner
                          ${card.isRevealed ? "opacity-100" : "opacity-0 pointer-events-none"}
                        `}
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                        
                            <img 
                              src={card.image} 
                              alt={card.name}
                              className={`h-[80%] w-auto ${card.isReversed ? 'transform scale-y-[-1]' : ''} rounded-lg`}
                              style={{ maxWidth: '100%' }}
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
              <DecorativeCorner position="bottom-left" className="left-0 bottom-0" />
              <DecorativeCorner position="bottom-right" className="right-0 bottom-0" />
              
              <MoonPhaseIndicator position="bottom" />
            </Card>

            {/* 解牌區塊 */}
            {showResults && (
               <Card ref={resultsTitleRef} className="bg-[rgba(23, 17, 17, 0.2)] mt-[80px] pb-[50px] border-2 border-amber-400 backdrop-blur-sm rounded-none relative">
                <MoonPhaseIndicator position="top" />
                <LeftSideDecorations />
                <RightSideDecorations />
                
                <DecorativeCorner position="top-left" className="left-0 top-0" />
                <DecorativeCorner position="top-right" className="right-0 top-0" />

                <CardHeader className="text-center mt-[50px] mb-[0px]">
                  <CardTitle className="text-2xl md:text-3xl text-amber-100 font-serif tracking-wider">占卜結果</CardTitle>
                  <CardDescription className="text-amber-200/90 text-sm md:text-base mt-1">
                    <span className="inline-block border-b border-amber-500/50 pb-1">以下是你的塔羅牌解讀</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cards.map((card, index) => (
                    <article
                      key={card.id}
                      className="p-6 animate-in slide-in-from-bottom duration-500 backdrop-blur-sm shadow-inner"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <header className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 bg-amber-400/10 hover:bg-amber-500/20 text-amber-50 border-amber-400 rounded-full flex items-center justify-center text-amber-50 font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-amber-100 font-serif tracking-wider">{card.name}</h3>
                        <Badge 
                          variant={card.isReversed ? "destructive" : "default"} 
                          className={`ml-auto font-medium transition-all duration-300 ${
                            card.isReversed 
                              ? 'bg-amber-900/50 hover:bg-amber-900/70 text-amber-300 border-amber-700/50 hover:border-amber-600/60' 
                              : 'bg-amber-500/80 hover:bg-amber-400/90 text-amber-50 border-amber-400/80 hover:border-amber-300/90 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          }`}
                        >
                          {card.isReversed ? "逆位" : "正位"}
                        </Badge>
                      </header>
                      <div className="text-amber-100 space-y-3">
                        <p className="leading-relaxed font-medium text-amber-50">{card.meaning.summary}</p>
                        {card.meaning.details && card.meaning.details.length > 0 && (
                          <ul className="list-disc list-inside space-y-2 text-sm text-amber-100/90 pl-4">
                            {card.meaning.details.map((detail, i) => (
                              <li key={i} className="relative pl-2">
                               
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full justify-center">
                    {session && (
                      <Button 
                        onClick={saveDivination} 
                        disabled={isSaving || isSaved} 
                        variant="outline" 
                        className="chinese-title-bakudai border-2 border-amber-400 bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed"
                        >
                        {isSaving ? "儲存中..." : (isSaved ? "已儲存" : "儲存本次占卜")}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="chinese-title-bakudai border-2 border-amber-400 bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                      size="lg"
                      onClick={resetReading}
                    >
                      重新占卜
                    </Button>
                  </div>
                </CardContent>

                
                <DecorativeCorner position="bottom-left" className="left-0 bottom-0" />
                <DecorativeCorner position="bottom-right" className="right-0 bottom-0" />
                
                <MoonPhaseIndicator position="bottom" />
              </Card>
            )}
          </main>
        )}
      </div>

      </div>
     </div>

    </div>
  )
}
