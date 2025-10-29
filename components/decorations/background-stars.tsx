'use client';

import React, { useState, useEffect } from 'react';

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  depth: number;
  type: 'filled' | 'outlined';
  rotation: number;
}

const BackgroundStars = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Check if mobile on component mount and window resize
  useEffect(() => {
    setMounted(true);
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const stars = React.useMemo(() => {
    if (!mounted) return [];
    
    const starCount = isMobile ? 70 : 100;
    const baseSize = isMobile ? 3 : 6;
    const sizeRange = isMobile ? 9 : 18;
    const stars: Star[] = [];
    
    // Get viewport dimensions
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const aspectRatio = viewportWidth / viewportHeight;
    
    // Calculate grid size based on viewport aspect ratio
    const gridCols = Math.ceil(Math.sqrt(starCount * aspectRatio));
    const gridRows = Math.ceil(starCount / gridCols);
    const cellWidth = 100 / gridCols;
    const cellHeight = 100 / gridRows;
    
    let generated = 0;
    while (generated < starCount) {
      for (let i = 0; i < gridCols && generated < starCount; i++) {
        for (let j = 0; j < gridRows && generated < starCount; j++) {
          const depth = Math.random();
          const type = Math.random() > 0.5 ? 'filled' : 'outlined';
          const rotation = Math.floor(Math.random() * 360);
          
          stars.push({
            id: `star-${generated}`,
            x: (i * cellWidth) + (Math.random() * cellWidth * 0.8 + cellWidth * 0.1),
            y: (j * cellHeight) + (Math.random() * cellHeight * 0.8 + cellHeight * 0.1),
            size: baseSize + Math.random() * sizeRange,
            delay: Math.random() * 5,
            duration: 2 + Math.random() * 4,
            depth: depth,
            type: type,
            rotation: rotation
          });
          generated++;
        }
      }
    }
    return stars;
  }, [isMobile]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Calculate movement with mobile adjustment
  const getMovement = (value: number, depth: number) => {
    const baseMovement = isMobile ? 10 : 20;
    return (value - 0.5) * baseMovement * depth;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0.5, y: 0.5 })}
    >
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .star-svg {
          position: absolute;
          transform-origin: center;
          transition: transform 0.1s ease-out;
          pointer-events: none;
        }
      `}</style>

      {stars.map((star) => {
        const moveX = getMovement(mousePosition.x, star.depth);
        const moveY = getMovement(mousePosition.y, star.depth);
        const size = star.size;
        const halfSize = size / 2;
        
        if (!mounted) {
          return null; // Don't render anything during SSR
        }

        return (
          <svg
            key={star.id}
            className="star-svg"
            style={{
              left: `calc(${star.x}% - ${halfSize}px)`,
              top: `calc(${star.y}% - ${halfSize}px)`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.3 + (star.depth * 0.7),
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              transform={`rotate(${star.rotation} 5 5)`}
              d="M5,0.5 L6.5,3.5 L10,4 L7.5,6.5 L8,10 L5,8.5 L2,10 L2.5,6.5 L0,4 L3.5,3.5 Z"
              fill={star.type === 'filled' ? '#F5AD4F' : 'none'}
              stroke="#F5AD4F"
              strokeWidth={star.type === 'outlined' ? '1' : '0.1'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        );
      })}
    </div>
  );
};

export default BackgroundStars;