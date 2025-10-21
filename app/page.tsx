"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Sparkles, Moon, Heart, Briefcase, Users, Activity, Eye } from "lucide-react"
import { tarotCards } from "./data/tarot-cards"

type DivinationTheme = "love" | "career" | "relationship" | "health" | "self-exploration"
type SpreadType = "single" | "three" | "celtic-cross"

interface TarotCard {
  id: number
  name: string
  isReversed: boolean
  isRevealed: boolean
  meaning: string
  image: string
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
  const [selectedTheme, setSelectedTheme] = useState<DivinationTheme>("love")
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>("three")
  const [isReading, setIsReading] = useState(false)
  const [cards, setCards] = useState<TarotCard[]>([])
  const [showResults, setShowResults] = useState(false)

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

      newCards.push({
        id: i,
        name: selectedCard.name,
        isReversed,
        isRevealed: false,
        meaning: isReversed ? selectedCard.meanings[selectedTheme].reversed : selectedCard.meanings[selectedTheme].upright,
        image: selectedCard.image
      })
    }

    setCards(newCards)
    setIsReading(true)
    setShowResults(false)
  }

  const revealCard = (cardId: number) => {
    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isRevealed: true } : card)))

    // 檢查是否所有牌都翻開了
    const updatedCards = cards.map((card) => (card.id === cardId ? { ...card, isRevealed: true } : card))

    if (updatedCards.every((card) => card.isRevealed)) {
      setTimeout(() => setShowResults(true), 500)
    }
  }

  const resetReading = () => {
    setIsReading(false)
    setShowResults(false)
    setCards([])
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

  const downloadPDF = async () => {
    // 使用 React 19 的新特性 - 更好的異步處理
    try {
      // 這裡可以集成 PDF 生成邏輯
      console.log("正在生成 PDF...")
      // 模擬 PDF 生成
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("PDF 生成完成")
    } catch (error) {
      console.error("PDF 生成失敗:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* 頁面標題區域 */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Moon className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">線上塔羅占卜</h1>
            <Sparkles className="w-8 h-8 text-purple-400 ml-3" />
          </div>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">選擇你的問題與牌陣，啟動內心的直覺</p>
        </header>

        {!isReading ? (
          /* 設定區塊 */
          <main>
            <Card className="max-w-4xl mx-auto bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">開始你的占卜之旅</CardTitle>
                <CardDescription className="text-purple-200 text-center">選擇占卜主題和牌陣類型</CardDescription>
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
                              : "bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:scale-105"
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
                      <p className="text-purple-200 leading-relaxed">{card.meaning}</p>
                    </article>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white flex-1 transition-all duration-200 hover:scale-105"
                      size="lg"
                      onClick={downloadPDF}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      下載結果 PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 flex-1 transition-all duration-200 hover:scale-105"
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
