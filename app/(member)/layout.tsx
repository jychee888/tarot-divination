'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { User, Clock, LogOut, Home } from 'lucide-react'
import { CornerDecoration } from '@/components/decorations/corner-decoration'
import BackgroundStars from '@/components/decorations/background-stars'
import { SunIcon } from '@/components/decorations/sun-icon'
import { MoonIcon } from '@/components/decorations/moon-icon'

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
    <div className="relative p-[50px] min-h-screen bg-[rgb(23,17,17)] text-[#F9ECDC] relative overflow-hidden">
      
      {/* Outer Border */}
      <div className="absolute z-50 inset-2 sm:inset-4 border border-[#C99041] rounded-3xl pointer-events-none"></div>
      {/* Inner Border */}
      <div className="absolute z-50 inset-4 sm:inset-8 border border-[#C99041] rounded-xl pointer-events-none"></div>
      <div className="absolute z-10 inset-0 sm:inset-0 sm:border-[40px] border-[20px] border-[#171111] rounded-xl pointer-events-none"></div>
      {/* Corner Decorations */}
      <CornerDecoration position="top-left" className="z-50 top-2 left-2 sm:top-4 sm:left-4" />
      <CornerDecoration position="top-right" className="z-50 top-2 right-2 sm:top-4 sm:right-4" />
      <CornerDecoration position="bottom-right" className="z-50 bottom-2 left-2 sm:bottom-4 sm:left-4 scale-x-[-1]" />
      <CornerDecoration position="bottom-left" className="z-50 bottom-2 right-2 sm:bottom-4 sm:right-4 scale-y-[-1]" />


      <div className="container mx-auto p-2 relative z-20">
        <div className="md:flex md:gap-8">
          <aside className="md:w-64 mb-8 md:mb-0 flex-shrink-0">
            <div className="bg-amber-900/20 backdrop-blur-sm p-6 rounded-lg border border-[#C99041]/20 shadow-lg">
              <h2 className="text-xl font-medium text-amber-100 mb-6 flex items-center">
                <span className="w-2 h-6 bg-amber-400 mr-3 rounded-full"></span>
                會員中心
              </h2>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-amber-500/20 text-amber-100 border-[#C99041]'
                        : 'text-amber-100/80 hover:bg-amber-500/10 hover:text-amber-100 border-transparent',
                      'group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all border'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-amber-400" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='group flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-all border border-transparent hover:border-[#C99041]/30 hover:bg-amber-500/10 text-amber-100/80 hover:text-amber-100 mt-4'
                >
                  <LogOut className="mr-3 h-5 w-5 text-amber-400" />
                  登出
                </button>
              </nav>
            </div>
          </aside>
          <main className="flex-1 bg-amber-900/10 backdrop-blur-sm p-8 rounded-lg border border-[#C99041]/20 shadow-lg">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
