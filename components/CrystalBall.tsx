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
      className={`relative ${containerSize[size]} flex items-center justify-center animate-mystic ${className}`}
    >
      {/* External Divine Glow / God Rays */}
      <div className="absolute inset-[-40%] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.15)_0%,transparent_70%)] animate-pulse blur-3xl"></div>
      <div className="absolute inset-[-20%] rounded-full bg-[conic-gradient(from_0deg,transparent_0,rgba(251,191,36,0.2)_20deg,transparent_40deg,rgba(251,191,36,0.2)_60deg,transparent_80deg,transparent_360deg)] animate-[spin_10s_linear_infinite] blur-2xl opacity-40"></div>

      {/* Core Orb Container - Rich Honey Convex Glass Style */}
      <div
        className={`relative ${orbSize[size]} rounded-full animate-shimmer overflow-hidden 
          bg-gradient-to-tr from-amber-950/60 via-amber-600/20 to-amber-300/10
          backdrop-blur-[12px] z-10 flex items-center justify-center
          shadow-[inset_0_12px_24px_rgba(251,191,36,0.35),inset_0_-12px_24px_rgba(0,0,0,0.8),0_20px_40px_-5px_rgba(0,0,0,0.7),0_0_50px_rgba(251,191,36,0.2)]
          ring-[1.5px] ring-amber-400/40`}
      >
        {/* Internal Core Energy - Deep Golden Glow */}
        <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.3)_0%,transparent_75%)] mix-blend-screen animate-pulse"></div>

        {/* Orbiting Stardust - Layer 1: Sharp & Distant */}
        <div className="absolute inset-[-10%] animate-[spin_15s_linear_infinite]">
          <div className="absolute top-[15%] left-[15%] w-[1.5px] h-[1.5px] bg-white rounded-full shadow-[0_0_8px_white]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[1px] h-[1px] bg-amber-200 rounded-full shadow-[0_0_4px_amber]"></div>
          <div className="absolute top-[60%] right-[20%] w-[0.5px] h-[0.5px] bg-white rounded-full opacity-100"></div>
        </div>

        {/* Orbiting Stardust - Layer 2: Medium & Mystic */}
        <div className="absolute inset-[5%] animate-[spin_25s_linear_infinite_reverse]">
          <div className="absolute top-[30%] right-[30%] w-[4px] h-[4px] bg-amber-300/30 rounded-full blur-[2px]"></div>
          <div className="absolute bottom-[40%] left-[25%] w-[2px] h-[2px] bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute top-[10%] left-[40%] w-[1px] h-[1px] bg-amber-100 rounded-full shadow-[0_0_3px_amber]"></div>
        </div>

        {/* Orbiting Stardust - Layer 3: Large & Diffuse (Nebula Nodes) */}
        <div className="absolute inset-[15%] animate-[spin_40s_linear_infinite]">
          <div className="absolute top-[50%] left-[50%] w-[8px] h-[8px] bg-amber-500/10 rounded-full blur-[6px]"></div>
          <div className="absolute bottom-[15%] right-[35%] w-[5px] h-[5px] bg-white/10 rounded-full blur-[4px]"></div>
          <div className="absolute top-[20%] right-[10%] w-[2px] h-[2px] bg-white rounded-full opacity-60"></div>
        </div>

        {/* Orbiting Stardust - Layer 4: Chaotic Glitter */}
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite_reverse]">
          <div className="absolute top-[45%] left-[20%] w-[0.8px] h-[0.8px] bg-amber-200 rounded-full opacity-100 shadow-[0_0_2px_white]"></div>
          <div className="absolute bottom-[10%] right-[45%] w-[1.5px] h-[1.5px] bg-white rounded-full blur-[0.3px] animate-pulse"></div>
          <div className="absolute top-[80%] left-[10%] w-[1px] h-[1px] bg-amber-400 rounded-full shadow-[0_0_5px_amber]"></div>
        </div>

        {/* Orbiting Stardust - Layer 5: Deep Soft Nebula (Large & Faded) */}
        <div className="absolute inset-[-25%] animate-[spin_55s_linear_infinite]">
          <div className="absolute top-[25%] left-[35%] w-[15px] h-[15px] bg-amber-400/5 rounded-full blur-[12px]"></div>
          <div className="absolute bottom-[30%] right-[40%] w-[10px] h-[10px] bg-white/5 rounded-full blur-[8px]"></div>
        </div>

        {/* HIGH-GLOSS CONVEX LAYERING - Golden Tints */}

        {/* 1. The 'Aqua' Bulge Top Reflection (Toned down white) */}
        <div className="absolute top-[-5%] left-[10%] w-[80%] h-[50%] bg-gradient-to-b from-amber-100/20 to-transparent rounded-[100%] pointer-events-none"></div>

        {/* 2. Primary 45-degree Specular (Golden Shine) */}
        <div className="absolute top-[16%] left-[22%] w-[15%] h-[8%] bg-amber-100/60 rounded-[100%] rotate-[-45deg] blur-[0.6px] shadow-[0_0_12px_rgba(251,191,36,0.3)] pointer-events-none"></div>

        {/* 3. Bottom Refraction Glow (Rich light pass-through) */}
        <div className="absolute bottom-[10%] left-[25%] w-[55%] h-[22%] bg-gradient-to-t from-amber-600/40 to-transparent rounded-[100%] blur-[10px]"></div>

        {/* Global Reflective Sweep */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(251,191,36,0.15)_0%,transparent_65%)] pointer-events-none"></div>
      </div>

      {/* Base Light Cast */}
      <div className="absolute -bottom-4 w-[60%] h-2 bg-amber-500/20 blur-xl rounded-[100%] animate-pulse"></div>
    </div>
  );
}
