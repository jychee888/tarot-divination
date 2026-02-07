import React from "react";

interface CrystalBallProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CrystalBall({ className = "", size = "md" }: CrystalBallProps) {
  // Size mapping
  const containerSize = {
    sm: "w-24 h-24",
    md: "w-36 h-36",
    lg: "w-48 h-48",
  };

  const orbSize = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={`relative ${containerSize[size]} flex items-center justify-center ${className}`}
    >
      {/* External "Fireworks" / Rays - Rotating Light Fields (Softened) */}
      <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_0deg,transparent_0,rgba(251,191,36,0.2)_20deg,transparent_40deg,rgba(251,191,36,0.2)_60deg,transparent_80deg,transparent_360deg)] animate-[spin_8s_linear_infinite] blur-xl opacity-50"></div>
      <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_180deg,transparent_0,rgba(245,158,11,0.15)_30deg,transparent_60deg,transparent_360deg)] animate-[spin_12s_linear_infinite_reverse] blur-xl opacity-40"></div>
      <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-2xl animate-pulse"></div>

      {/* Core Orb */}
      <div
        className={`relative ${orbSize[size]} rounded-full overflow-hidden shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] ring-1 ring-white/10 bg-gradient-to-b from-amber-100/10 to-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center`}
      >
        {/* Internal Mystic Essence - Active Swirls */}
        <div className="absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent,rgba(217,119,6,0.2),transparent)] animate-[spin_8s_linear_infinite] blur-md"></div>
        <div className="absolute inset-[-60%] bg-[conic-gradient(from_180deg,transparent,rgba(251,191,36,0.2),transparent)] animate-[spin_12s_linear_infinite_reverse] blur-md mix-blend-plus-lighter"></div>

        {/* Nebula Clouds */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.15),transparent_50%)] animate-[pulse_4s_ease-in-out_infinite_reverse]"></div>

        {/* Orbiting Particles / Stardust */}
        <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-100 rounded-full blur-[1px] opacity-60"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full blur-[1px] opacity-40"></div>
        </div>
        <div className="absolute inset-0 animate-[spin_15s_linear_infinite_reverse]">
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-200 rounded-full blur-[0.5px] opacity-50"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-violet-200 rounded-full blur-[1px] opacity-30"></div>
          <div className="absolute top-2/3 left-1/5 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
        </div>

        {/* Deep Core Energy */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay animate-[spin_60s_linear_infinite]"></div>

        {/* Glass Shine/Reflection - Enhanced & Repositioned */}
        <div className="absolute top-4 left-5 w-8 h-4 bg-gradient-to-br from-white/40 to-transparent rounded-[100%] rotate-[-45deg] blur-[2px] opacity-80 animate-pulse"></div>
        <div className="absolute bottom-5 right-6 w-3 h-3 bg-amber-400/20 rounded-full blur-[2px]"></div>

        {/* Optional: Subtle Moving Glint */}
        <div className="absolute top-1/2 left-1/2 w-[120%] h-[20%] bg-white/5 rotate-45 blur-lg animate-[spin_6s_linear_infinite] opacity-30 pointer-events-none"></div>
      </div>
    </div>
  );
}
