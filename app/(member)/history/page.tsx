'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Card {
    name: string;
    isReversed: boolean;
    meaning: string;
}

interface DivinationRecord {
  id: string
  theme: string
  spreadType: string
  cards: Card[]
  createdAt: string
}

export default function HistoryPage() {
  const { status } = useSession()
  const router = useRouter()
  const [history, setHistory] = useState<DivinationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }

    if (status === 'authenticated') {
      const fetchHistory = async () => {
        try {
          const response = await fetch('/api/divinations')
          if (!response.ok) {
            throw new Error('Failed to fetch history')
          }
          const data = await response.json()
          setHistory(data)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchHistory()
    }
  }, [status, router])

  if (isLoading || status === 'loading') {
    return <p className="text-1xl animate-pulse">載入歷史紀錄中...</p>
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#C99041]/30 pb-4">
        <h1 className="text-2xl font-medium text-amber-100">我的占卜紀錄</h1>
        <p className="text-amber-100/60 text-sm mt-1">回顧你的每一次探索與啟示</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 rounded-lg border-2 border-dashed border-[#C99041]/20 bg-amber-900/10">
          <div className="max-w-md mx-auto
          ">
            <div className="text-amber-400/50 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-amber-100 mb-2">尚未有占卜紀錄</h3>
            <p className="text-amber-100/60 mb-6">開始你的第一次占卜，記錄下重要的時刻</p>
            <Link 
              href="/divination" 
              className="inline-flex items-center px-6 py-2.5 bg-amber-500/30 border border-[#C99041]/60 text-amber-100 rounded-md 
                      hover:bg-amber-500/40 hover:shadow-[0_0_10px_rgba(251,191,36,0.2)]
                      focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-amber-900/50
                      transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              開始占卜
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((record) => (
            <div 
              key={record.id} 
              className="group relative bg-amber-900/10 border border-[#C99041]/20 rounded-lg p-5 hover:border-[#C99041]/40 
                        hover:bg-amber-900/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-amber-100 capitalize">{record.theme}</h3>
                  <p className="text-xs text-amber-400/60">{record.spreadType}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-amber-400/10 text-amber-400/80 rounded-full">
                  {new Date(record.createdAt).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {record.cards.map((card, index) => (
                  <span 
                    key={index} 
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      card.isReversed 
                        ? 'bg-red-500/10 text-red-300 border border-red-500/20' 
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {card.name}{card.isReversed && <span className="opacity-80"> (逆)</span>}
                  </span>
                ))}
              </div>
              
              <div className="text-xs text-amber-100/60 mt-3 pt-3 border-t border-[#C99041]/10">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(record.createdAt).toLocaleTimeString('zh-TW', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false
                  })}
                </div>
              </div>
              
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#C99041]/30"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
