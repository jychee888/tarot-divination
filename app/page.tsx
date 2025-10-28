import Link from 'next/link';
import { Sparkles, Moon, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CornerDecoration } from '@/components/decorations/corner-decoration';
import BackgroundStars from '@/components/decorations/background-stars';
import { EyeIcon } from '@/components/decorations/eye-icon';
import { TarotVisual } from '@/components/decorations/tarot-visual';
import { SunIcon } from '@/components/decorations/sun-icon';
import { MoonIcon } from '@/components/decorations/moon-icon';
import { DivinationBackground } from '@/components/decorations/divination-background';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[rgb(23,17,17)] text-[#F9ECDC] relative overflow-hidden">
      <DivinationBackground />
      
      {/* Header Section */}
      <Header />

      <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none z-10">
        <div className="relative w-[8%] left-[8%] h-auto">
          <SunIcon className="w-full h-auto" />
        </div>
        <div className="relative w-[8%] right-[8%] h-auto">
          <MoonIcon className="w-full h-auto" />
        </div>
      </div>
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
      <div className="absolute w-full h-full inset-0 px-10 flex flex-col justify-center items-center text-center">
        {/* Title Section */}
        <div className="relative z-30 w-full">
          <div className="flex flex-col items-center justify-center mb-6 space-y-2 w-full">
            <h2 className="chinese-title-bakudai text-[3vw] relative z-20">心靈之眼</h2>
            <div className="relative flex items-center justify-center w-full">
              <EyeIcon className="absolute top-0 left-[20%] z-20"/>
              <h1 className="im-fell-english-regular text-[6vw] leading-none relative">
                Soul's Eye
              </h1>
              <EyeIcon mirror className="absolute top-0 right-[20%] z-20"/>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center">
            <Link href="/divination">
              <Button className="chinese-title-bakudai border-2 border-amber-400 bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                開始占卜 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tarot Visual */}
        <div className="relative -mt-[10%] z-20">
          <TarotVisual />
        </div>
        
        {/* Description and Buttons */}
        <div className="relative z-30"> 
          <p className="chinese-title-bakudai text-2xl mt-[2%] mb-10 max-w-3xl mx-auto">
            開啟你的內在智慧<br />讓塔羅牌指引你找到生命的答案
          </p>
        </div>
      </div>
      
    </div>
  );
}
