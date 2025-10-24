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
    return <p className="text-2xl animate-pulse">載入歷史紀錄中...</p>
  }

  return (
    <div>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">我的占卜紀錄</h1>
          <p className="text-purple-200">回顧你的每一次探索</p>
        </header>

        {history.length === 0 ? (
          <div className="text-center text-purple-200 py-16">
            <p className="text-lg mb-4">你還沒有任何占卜紀錄。</p>
            <Link href="/" className="inline-block px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              開始第一次占卜
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {history.map((record) => (
              <div key={record.id} className="bg-slate-900/70 border border-purple-500/30 text-white rounded-lg p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="capitalize font-bold text-lg">{record.theme} - {record.spreadType}</h3>
                  <p className="text-sm text-purple-300">
                    {new Date(record.createdAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 flex-grow">
                  {record.cards.map((card, index) => (
                    <span key={index} className={`px-2 py-1 text-xs font-semibold rounded-full ${card.isReversed ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {card.name} {card.isReversed ? '(逆)' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
