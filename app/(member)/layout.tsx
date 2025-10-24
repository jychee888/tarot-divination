'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { User, Clock, LogOut, Home } from 'lucide-react'

const navigation = [
  { name: '返回首頁', href: '/', icon: Home },
  { name: '個人資料', href: '/profile', icon: User },
  { name: '占卜歷史', href: '/history', icon: Clock },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="md:flex md:gap-8">
          <aside className="md:w-64 mb-8 md:mb-0 flex-shrink-0">
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-purple-600/30 text-white'
                        : 'text-purple-200 hover:bg-purple-600/20 hover:text-white',
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-purple-300" />
                    {item.name}
                  </Link>
                ))}
                 <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className='group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors text-purple-200 hover:bg-purple-600/20 hover:text-white'
                  >
                    <LogOut className="mr-3 h-5 w-5 text-purple-300" />
                    登出
                  </button>
              </nav>
            </div>
          </aside>
          <main className="flex-1 bg-slate-800/50 p-8 rounded-lg">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
