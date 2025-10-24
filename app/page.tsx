import Link from 'next/link';
import { Sparkles, Moon, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CornerDecoration } from '@/components/corner-decoration';
import BackgroundStars from '@/components/background-stars';
import { EyeIcon } from '@/components/eye-icon';
import { TarotVisual } from '@/components/tarot-visual';

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(23,17,17)] text-white relative overflow-hidden">
      <BackgroundStars />
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
      <div className="container mx-auto px-10 py-24 text-center relative">
        {/* Title Section */}
        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center mb-6 space-y-2 w-full">
            <h2 className="chinese-title-bakudai text-[3vw] relative z-20">心靈之眼</h2>
            <div className="relative flex items-center justify-center w-full">
              <EyeIcon className="absolute top-0 left-[10%] z-20"/>
              <h1 className="im-fell-english-regular text-[7vw] leading-none relative z-20">
                Soul's Eye
              </h1>
              <EyeIcon mirror className="absolute top-0 right-[10%] z-20"/>
            </div>
          </div>
        </div>

        {/* Tarot Visual */}
        <div className="relative -mt-[10%] z-10">
          <TarotVisual />
        </div>
        
        {/* Description and Buttons */}
        <div className="relative z-10"> 
          <p className="chinese-title-bakudai text-2xl mt-[100px] mb-10 max-w-3xl mx-auto">
            開啟你的內在智慧<br />讓塔羅牌指引你找到生命的答案
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/divination">
              <Button className="chinese-title-bakudai border-2 border-amber-400 bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105">
                開始占卜 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10">
        <div className="container mx-auto px-4 text-center text-white mb-[100px]">
          <p className="text-sm">© {new Date().getFullYear()} 心靈之眼 - 塔羅牌占卜</p>
          <p className="text-sm mt-2 text-white">本網站僅供娛樂參考，請勿過度依賴占卜結果</p>
        </div>
      </footer>
    </div>
  );
}
