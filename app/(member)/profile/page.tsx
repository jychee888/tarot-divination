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
    return <p className="text-2xl animate-pulse">載入中...</p>
  }

  // In the unlikely event that session is null after the initial loading, render nothing.
  if (!session) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">個人資料</h1>
      <div className="max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <img src={session.user?.image || ''} alt="User avatar" className="w-20 h-20 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold">{session.user?.name}</h2>
              <p className="text-purple-300">{session.user?.email}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-purple-200 mb-2">暱稱</label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-slate-900/70 border border-purple-500/30 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-purple-200 mb-2">個人簡介</label>
              <textarea
                id="bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-900/70 border border-purple-500/30 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors disabled:opacity-50">
                {isLoading ? '儲存中...' : '儲存變更'}
              </button>
            </div>
          </form>
        </div>
    </div>
  )
}
