'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // This effect runs only once on mount to initialize the form with session data.
  useEffect(() => {
    if (session?.user) {
      // @ts-ignore
      setNickname(session.user.nickname || '');
      // @ts-ignore
      setBio(session.user.bio || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]); // Depend on a stable property like user.id to run only once per user session.

  // This effect handles redirection based on auth status.
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, bio }),
      })

      if (!response.ok) {
        throw new Error('更新失敗')
      }

      // Manually update the session to reflect the changes immediately
      await update({
        ...session,
        user: {
          ...session?.user,
          nickname,
          bio,
        },
      })

      alert('個人資料已更新！')
    } catch (error) {
      console.error(error)
      alert('更新時發生錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  // Only show the full-page loader on initial load when session is not yet available
  if (status === 'loading' && !session) {
    return <p className="text-1xl animate-pulse">載入中...</p>
  }

  // In the unlikely event that session is null after the initial loading, render nothing.
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-amber-400/30 pb-4">
        <h1 className="text-2xl font-medium text-amber-100">個人資料</h1>
        <p className="text-amber-100/60 text-sm mt-1">更新您的個人資料和偏好設定</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label htmlFor="nickname" className="block text-sm font-medium text-amber-100/80">
            暱稱
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-2 bg-amber-900/30 border border-amber-400/30 rounded-md 
                     text-amber-100 placeholder-amber-400/50 
                     focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50
                     hover:border-amber-400/50
                     transition-all duration-300"
            placeholder="請輸入您的暱稱"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-amber-100/80">
            自我介紹
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 bg-amber-900/30 border border-amber-400/30 rounded-md 
                     text-amber-100 placeholder-amber-400/50 
                     focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50
                     hover:border-amber-400/50
                     transition-all duration-300"
            placeholder="簡單介紹一下自己..."
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-amber-400/30 text-amber-100 rounded-md 
                     hover:bg-amber-500/10 hover:border-amber-400/50
                     focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-amber-900/50
                     transition-all duration-200"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-amber-500/30 border border-amber-400/60 text-amber-100 rounded-md 
                     hover:bg-amber-500/40 hover:shadow-[0_0_10px_rgba(251,191,36,0.2)]
                     focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-amber-900/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                更新中...
              </>
            ) : '更新資料'}
          </button>
        </div>
      </form>
    </div>
  )
}
