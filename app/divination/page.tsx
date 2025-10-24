"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Moon, Heart, Briefcase, Users, Activity, Eye } from "lucide-react"
import { TarotCardData, tarotCards } from "../data/tarot-cards"

type DivinationTheme = "love" | "career" | "relationship" | "health" | "self-exploration"
type SpreadType = "single" | "three" | "celtic-cross"

// Extend the imported TarotCard type with local state properties
type LocalTarotCard = TarotCardData & {
  isReversed: boolean;
  isRevealed: boolean;
  meaning: { summary: string; details: string[] };
}

const themes = [
  { id: "love" as DivinationTheme, label: "愛情", icon: Heart },
  { id: "career" as DivinationTheme, label: "事業", icon: Briefcase },
  { id: "relationship" as DivinationTheme, label: "人際", icon: Users },
  { id: "health" as DivinationTheme, label: "健康", icon: Activity },
  { id: "self-exploration" as DivinationTheme, label: "自我探索", icon: Eye },
]

function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-white animate-pulse">驗證中...</div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/profile" className="text-sm text-purple-200 hover:text-white hover:underline">
          歡迎, {session.user?.name}
        </Link>
        <Button
          onClick={() => signOut()}
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:text-white"
        >
          登出
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => signIn("google")}
      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      size="sm"
    >
      使用 Google 登入
    </Button>
  )
}

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
  const [cards, setCards] = useState<LocalTarotCard[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { toast } = useToast()

  const startDivination = () => {
    const spreadCount = spreads.find((s) => s.id === selectedSpread)?.count || 3
    const newCards: LocalTarotCard[] = []
    
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
        image: selectedCard.image,
        type: selectedCard.type,
        meanings: selectedCard.meanings,
      });
    }

    setCards(newCards)
    setIsReading(true)
    setShowResults(false)
    setIsSaved(false) // Reset save status for new divination
  }

  const revealCard = (cardId: string) => {
    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isRevealed: true } : card)))

    // 檢查是否所有牌都翻開了
    // 這部分邏輯可以在 setCards 的回調中完成，以避免狀態更新延遲問題
    // 但為保持最小改動，暫時保留。更好的做法是在 useEffect 中處理。
    const currentlyRevealed = cards.filter(c => c.isRevealed || c.id === cardId).length;
    if (currentlyRevealed === cards.length) {
      setTimeout(() => setShowResults(true), 500)
    }
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
          cards: cards.map(c => ({
            id: c.id,
            name: c.name,
            image: c.image,
            type: c.type,
            meanings: c.meanings,
            isReversed: c.isReversed,
            isRevealed: c.isRevealed,
            meaning: c.meaning
          })),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <AuthStatus />
        </div>
        {/* 頁面標題區域 */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Moon className="w-8 h-8 text-purple-400 mr-3 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">心靈之眼</h1>
            <Sparkles className="w-8 h-8 text-purple-400 ml-3 animate-pulse" />
          </div>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-6">開啟內在智慧之窗，讓塔羅牌指引你找到心靈的答案</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-transparent mx-auto mb-6 rounded-full"></div>
        </header>

        {!isReading ? (
          /* 設定區塊 */
          <main>
            <Card className="max-w-4xl mx-auto bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">✨ 開啟心靈之眼 ✨</CardTitle>
                <CardDescription className="text-purple-200 text-center">選擇占卜主題和牌陣，讓塔羅牌為你揭示隱藏的訊息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 占卜主題選擇 */}
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4">占卜主題</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {themes.map((theme) => {
                      const Icon = theme.icon
                      return (
                        <Button
                          key={theme.id}
                          variant={selectedTheme === theme.id ? "default" : "outline"}
                          className={`h-20 flex-col gap-2 transition-all duration-200 ${
                            selectedTheme === theme.id
                              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg scale-105"
                              : "bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:text-white hover:scale-105"
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

                <Separator className="bg-purple-500/30" />

                {/* 牌陣選擇 */}
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4">牌陣選擇</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {spreads.map((spread) => (
                      <Button
                        key={spread.id}
                        variant={selectedSpread === spread.id ? "default" : "outline"}
                        className={`h-16 transition-all duration-200 ${
                          selectedSpread === spread.id
                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg scale-105"
                            : "bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:text-white hover:scale-105"
                        }`}
                        onClick={() => setSelectedSpread(spread.id)}
                        aria-pressed={selectedSpread === spread.id}
                      >
                        <div className="text-center">
                          <div className="font-semibold">{spread.label}</div>
                          <div className="text-sm opacity-80">{spread.count} 張牌</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </section>

                {/* 開始占卜按鈕 */}
                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    onClick={startDivination}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    開始占卜
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        ) : (
          <main className="max-w-6xl mx-auto space-y-8">
            {/* 抽牌區塊 */}
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">
                  {themes.find((t) => t.id === selectedTheme)?.label} -{" "}
                  {spreads.find((s) => s.id === selectedSpread)?.label}
                </CardTitle>
                <CardDescription className="text-purple-200 text-center">點擊卡片來揭示你的命運</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid ${getSpreadLayout()} max-w-4xl mx-auto`}>
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
                      <div
                        className={`
                        relative w-32 h-[240px] md:w-40 md:h-[320px] mx-auto
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
                          bg-gradient-to-br from-purple-800 to-indigo-900
                          border-2 border-purple-400/50 rounded-lg
                          flex items-center justify-center
                          transition-opacity duration-300
                          ${card.isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"}
                        `}
                          style={{
                            backfaceVisibility: "hidden",
                          }}
                        >
                          <div className="text-center">
                            <Moon className="w-8 h-8 text-purple-300 mx-auto mb-2 animate-pulse" />
                            <div className="text-purple-300 text-sm font-medium">塔羅牌</div>
                          </div>
                        </div>

                        {/* 卡片正面 */}
                        <div
                          className={`
                          absolute inset-0 w-full h-full
                          bg-white border-2 border-amber-400 rounded-lg
                          flex flex-col items-center justify-between p-2
                          transition-opacity duration-300 overflow-hidden
                          ${card.isRevealed ? "opacity-100" : "opacity-0 pointer-events-none"}
                        `}
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <div className="text-center w-full">
                            <h3 className="font-bold text-amber-900 text-sm truncate px-1">
                              {card.name}
                            </h3>
                            <Badge variant={card.isReversed ? "destructive" : "default"} className="text-xs mb-1">
                              {card.isReversed ? "逆位" : "正位"}
                            </Badge>
                          </div>
                          <div className="relative w-full h-full overflow-hidden">
                            <div className="absolute inset-0 flex items-end justify-center">
                              <img 
                                src={card.image} 
                                alt={card.name}
                                className={`h-full w-auto ${card.isReversed ? 'transform scale-y-[-1]' : ''}`}
                                style={{ maxWidth: '100%' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 解牌區塊 */}
            {showResults && (
              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm animate-in fade-in duration-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white text-center">占卜結果</CardTitle>
                  <CardDescription className="text-purple-200 text-center">以下是你的塔羅牌解讀</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cards.map((card, index) => (
                    <article
                      key={card.id}
                      className="bg-slate-700/30 rounded-lg p-6 animate-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <header className="flex items-center gap-4 mb-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-white">{card.name}</h3>
                        <Badge variant={card.isReversed ? "destructive" : "default"} className="ml-auto">
                          {card.isReversed ? "逆位" : "正位"}
                        </Badge>
                      </header>
                      <div className="text-purple-200 space-y-3">
                        <p className="leading-relaxed font-semibold">{card.meaning.summary}</p>
                        {card.meaning.details && card.meaning.details.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                            {card.meaning.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    {session && (
                      <Button onClick={saveDivination} disabled={isSaving || isSaved} variant="outline" className="bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:text-white flex-1 transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSaving ? "儲存中..." : (isSaved ? "已儲存" : "儲存本次占卜")}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:text-white flex-1 transition-all duration-200 hover:scale-105"
                      size="lg"
                      onClick={resetReading}
                    >
                      重新占卜
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        )}
      </div>
    </div>
  )
}
