import DailyDraw from "@/components/DailyDraw";
import Header from "@/components/layout/Header";
import { DivinationBackground } from "@/components/decorations/divination-background";
import BackgroundStars from "@/components/decorations/background-stars";
import { CornerDecoration } from "@/components/decorations/corner-decoration";

export default function DailyPage() {
  return (
    <div className="relative min-h-screen bg-[#171111] text-[#F9ECDC] overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <DivinationBackground />
        <BackgroundStars />
      </div>

      {/* Golden Borders */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-2 sm:inset-4 border border-[#C99041] rounded-3xl"></div>
        <div className="absolute inset-4 sm:inset-8 border border-[#C99041] rounded-xl"></div>
        <CornerDecoration
          position="top-left"
          className="top-2 left-2 sm:top-4 sm:left-4"
        />
        <CornerDecoration
          position="top-right"
          className="top-2 right-2 sm:top-4 sm:right-4"
        />
        <CornerDecoration
          position="bottom-right"
          className="bottom-2 left-2 sm:bottom-4 sm:left-4 scale-x-[-1]"
        />
        <CornerDecoration
          position="bottom-left"
          className="bottom-2 right-2 sm:bottom-4 sm:right-4 scale-y-[-1]"
        />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-8 pt-24 relative z-10 min-h-screen flex items-center justify-center">
        <DailyDraw />
      </main>
    </div>
  );
}
