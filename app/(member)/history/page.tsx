'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import tarotCards from '@/data/tarot-cards'

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
  const [selectedReading, setSelectedReading] = useState<DivinationRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to reset body overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

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
  }, [status, router, isModalOpen])

  if (isLoading || status === 'loading') {
    return <p className="text-1xl animate-pulse">載入歷史紀錄中...</p>
  }

  return (
    <div className="relative ">
      <div className="border-b border-[#C99041]/30 pb-4">
        <h1 className="text-2xl font-medium text-amber-100">我的占卜紀錄</h1>
        <p className="text-amber-100/60 text-sm mt-1">回顧你的每一次探索與啟示</p>
      </div>

      {/* Reading Details Modal */}
      {isModalOpen && selectedReading && (
        <div className="fixed top-0 inset-0 z-[99] flex justify-center  bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div 
            className="relative w-full max-w-[70%] mt-[100px] h-[600px] flex flex-col bg-amber-900/95 border border-amber-700/50 rounded-xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-shrink-0 p-6 pb-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-amber-100 mb-1">{selectedReading.theme}</h2>
                  <p className="text-amber-300/80 text-sm">{selectedReading.spreadType} • {new Date(selectedReading.createdAt).toLocaleString('zh-TW')}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                  className="text-amber-200 hover:text-white transition-colors p-1 -m-1"
                  aria-label="關閉"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="space-y-6 pb-2">
                {selectedReading.cards.map((card, index) => {
                  const cardData = tarotCards.find(t => t.name === card.name);
                  const meaning = cardData?.meanings[selectedReading.theme] || cardData?.meanings['default'];
                  
                  return (
                    <div key={index} className="bg-amber-900/50 rounded-lg p-4 border border-amber-800/50">
                      <div className="flex flex-col md:flex-row gap-4 mb-3">
                        <div className="w-full md:w-1/6">
                          <div className={`relative aspect-[2.5/4.5] rounded-lg overflow-hidden border-2 ${card.isReversed ? 'border-red-500/50' : 'border-amber-500/50'}`}>
                            <img 
                              src={cardData?.image || '/images/card-back.jpg'} 
                              alt={card.name}
                              className={`w-full h-full object-cover ${card.isReversed ? 'transform rotate-180' : ''}`}
                            />
                            {card.isReversed && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <span className="bg-red-500/80 text-white text-xs px-2 py-1 rounded">逆位</span>
                              </div>
                            )}
                          </div>
                          <h3 className="mt-2 text-center font-medium text-amber-100">
                            {card.name}
                            {card.isReversed && <span className="text-red-400 ml-1">(逆位)</span>}
                          </h3>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-amber-100 mb-2">牌義解讀</h4>
                          <p className="text-amber-200/90 text-sm mb-3">
                            {card.isReversed ? (meaning?.reversed?.summary || '暫無逆位解釋') : (meaning?.upright?.summary || '暫無解釋')}
                          </p>
                          
                          <h4 className="font-medium text-amber-100 mb-2">詳細含義</h4>
                          <ul className="space-y-1.5 text-sm text-amber-200/80">
                            {(card.isReversed ? meaning?.reversed?.details : meaning?.upright?.details)?.map((detail, i) => (
                              <li key={i} className="flex">
                                <span className="text-amber-400 mr-2">•</span>
                                <span>{detail}</span>
                              </li>
                            )) || <li className="text-amber-400/70">暫無詳細解釋</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                        hover:bg-amber-900/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]
                        cursor-pointer"
              onClick={() => {
                setSelectedReading(record);
                setIsModalOpen(true);
              }}
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
