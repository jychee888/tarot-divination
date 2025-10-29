'use client'

import { useState, useEffect, useMemo } from 'react'
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
  const [filteredHistory, setFilteredHistory] = useState<DivinationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReading, setSelectedReading] = useState<DivinationRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({})
  
  // Filter and sort states
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  
  // Filter and sort the history
  const filteredAndSortedHistory = useMemo(() => {
    // Apply date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let filtered = [...history];
    
    if (dateFilter !== 'all') {
      let startDate = new Date(today);
      
      switch (dateFilter) {
        case 'today':
          // Already set to today
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(record => new Date(record.createdAt) >= startDate);
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [history, dateFilter, sortOrder]);
  
  // Update filteredHistory state when filteredAndSortedHistory changes
  useEffect(() => {
    setFilteredHistory(filteredAndSortedHistory);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filteredAndSortedHistory]);

  // Update modal position when modal opens/closes or window resizes
  useEffect(() => {
    if (isModalOpen) {
      const updateModalPosition = () => {
        const viewportHeight = window.innerHeight;
        const modalHeight = 600; // Modal height in pixels
        const top = Math.max(20, (viewportHeight - modalHeight) / 2);
        setModalStyle({
          position: 'fixed',
          top: `${top}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        });
      };

      // Initial position
      updateModalPosition();
      
      // Update on window resize
      window.addEventListener('resize', updateModalPosition);
      return () => window.removeEventListener('resize', updateModalPosition);
    }
  }, [isModalOpen]);

  // Calculate pagination
  const totalItems = filteredAndSortedHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredAndSortedHistory.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
          setFilteredHistory(data)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchHistory()
    }
  }, [status, router, isModalOpen])

  // Loading state is now handled within the main content

  return (
    <div className="relative ">
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b border-[#C99041]/30 pb-4">
          <h1 className="text-2xl font-medium text-amber-100">我的占卜紀錄</h1>
          <p className="text-amber-100/60 text-sm mt-1">回顧你的每一次探索與啟示</p>
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-full ${dateFilter === 'all' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50' : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30'}`}
            >
              全部時間
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 text-sm rounded-full ${dateFilter === 'today' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50' : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30'}`}
            >
              今天
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1.5 text-sm rounded-full ${dateFilter === 'week' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50' : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30'}`}
            >
              本週
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 text-sm rounded-full ${dateFilter === 'month' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50' : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30'}`}
            >
              本月
            </button>
            <button
              onClick={() => setDateFilter('year')}
              className={`px-3 py-1.5 text-sm rounded-full ${dateFilter === 'year' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50' : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30'}`}
            >
              今年
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-amber-100/70">排序：</span>
            <button
              onClick={() => setSortOrder('newest')}
              className={`px-3 py-1.5 text-sm rounded-l-full ${sortOrder === 'newest' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50' : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30 border border-amber-500/20'}`}
            >
              最新
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-3 py-1.5 text-sm rounded-r-full ${sortOrder === 'oldest' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50' : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30 border border-amber-500/20 border-l-0'}`}
            >
              最舊
            </button>
          </div>
        </div>
      </div>

      {/* Reading Details Modal */}
      {isModalOpen && selectedReading && (
        <div 
          className="fixed inset-0 z-[99] bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-[70%] h-[600px] flex flex-col bg-amber-900/95 border border-amber-700/50 rounded-xl shadow-2xl overflow-hidden"
            style={modalStyle}
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
                          <ul className="space-y-1.5 text-xs text-amber-200/80">
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
      
      {/* Main content area */}
      <div className="space-y-6">
        {/* Loading state */}
        {isLoading || status === 'loading' ? (
          <div className="text-center">
            <div className="space-y-0">
              
              {/* Additional loading cards with staggered animation */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div 
                    key={index}
                    className="h-48 bg-amber-900/5 border border-amber-800/10 rounded-lg overflow-hidden relative"
                    style={{
                      animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-[shimmer_2s_infinite]" style={{
                      transform: 'translateX(-100%)',
                      backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(251,191,36,0.05) 20%, rgba(251,191,36,0.02) 60%, rgba(255,255,255,0) 100%)',
                    }}></div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center pt-4">              
                {/* Loading dots */}
                <div className="flex space-x-2 pt-2">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 bg-amber-400/50 rounded-full"
                      style={{
                        animation: `bounce 1.5s infinite ${i * 0.2}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Add keyframes for animations */}
            <style jsx global>{`
              @keyframes shimmer {
                100% {
                  transform: translateX(100%);
                }
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
              }
              @keyframes fadeIn {
                to { opacity: 1; }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        ) : totalItems === 0 ? (
          <div className="text-center py-16 rounded-lg border-2 border-dashed border-[#C99041]/20 bg-amber-900/10">
            <div className="max-w-md mx-auto">
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
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((record) => (
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-amber-800/30">
              <div className="text-sm text-amber-100/70">
                顯示 {Math.min(startIndex + 1, totalItems)}-{Math.min(startIndex + itemsPerPage, totalItems)} 筆，共 {totalItems} 筆
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-l-md bg-amber-900/30 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &laquo;
                </button>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-amber-900/30 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &lsaquo;
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === pageNum 
                          ? 'bg-amber-500/30 text-amber-100 border border-amber-500/50' 
                          : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-amber-900/30 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &rsaquo;
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-r-md bg-amber-900/30 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  )
}
