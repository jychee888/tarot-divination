import Link from 'next/link';
import { Sparkles, Moon, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CornerDecoration } from '@/components/corner-decoration';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Golden Borders */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Outer Border */}
        <div className="absolute inset-4 border-2 border-amber-400/50 rounded-3xl"></div>
        {/* Inner Border */}
        <div className="absolute inset-8 border-2 border-amber-400/50 rounded-xl"></div>
        
        {/* Corner Decorations */}
        <CornerDecoration position="top-left" className="top-4 left-4" />
        <CornerDecoration position="top-right" className="top-4 right-4" />
        <CornerDecoration position="bottom-right" className="bottom-4 left-4 scale-x-[-1]" />
        <CornerDecoration position="bottom-left" className="bottom-4 right-4 scale-y-[-1]" />
      </div>
      {/* Hero Section */}
      <div className="container mx-auto px-10 py-24 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Moon className="w-8 h-8 text-purple-400 mr-3 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
              心靈之眼
            </h1>
            <Sparkles className="w-8 h-8 text-purple-400 ml-3 animate-pulse" />
          </div>
          
          <p className="text-xl md:text-2xl text-purple-200 mb-10 max-w-3xl mx-auto">
            開啟你的內在智慧，讓塔羅牌指引你找到生命的答案
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/divination">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105">
                開始占卜 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/divination?theme=self-exploration">
              <Button variant="outline" className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:text-white text-lg px-8 py-6 rounded-full transition-all duration-300">
                探索自我
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/50 to-slate-900/80 -z-10"></div>
        <div className="container mx-auto px-10 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
            為什麼選擇心靈之眼？
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: '專業牌陣',
                description: '多種牌陣選擇，從單張牌到凱爾特十字，滿足不同需求',
                icon: <Star className="w-8 h-8 mb-4 text-purple-400" />
              },
              {
                title: '深入解析',
                description: '詳細的牌義解釋，幫助你理解每張牌的深層含義',
                icon: <Sparkles className="w-8 h-8 mb-4 text-pink-400" />
              },
              {
                title: '隱私保護',
                description: '你的占卜記錄完全保密，只有你能查看',
                icon: <Moon className="w-8 h-8 mb-4 text-indigo-400" />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-800/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-purple-100 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-black -z-10"></div>
        <div className="max-w-3xl mx-auto px-10 relative z-10">
          <h2 className="text-3xl font-bold mb-6">準備好探索你的內心世界了嗎？</h2>
          <p className="text-xl text-purple-200 mb-8">
            讓心靈之眼成為你心靈成長的指南針，發掘潛意識中的智慧與指引。
          </p>
          <Link href="/divination">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105">
              開始我的占卜之旅 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-900 py-8">
        <div className="container mx-auto px-4 text-center text-purple-300">
          <p>© {new Date().getFullYear()} 心靈之眼 - 塔羅牌占卜</p>
          <p className="text-sm mt-2 text-purple-400">本網站僅供娛樂參考，請勿過度依賴占卜結果</p>
        </div>
      </footer>
    </div>
  );
}
