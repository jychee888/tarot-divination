'use client';

import { useEffect, useMemo, CSSProperties } from 'react';

// Extend CSSProperties to include CSS custom properties
interface CustomCSSProperties extends CSSProperties {
  '--duration': string;
  '--delay': string;
  '--rotation': string;
}

const DynamicStarBackground = () => {
  // Generate random stars with different properties
  const stars = useMemo(() => {
    const count = 120; // Increased total number of stars
    const stars = [];
    
    // Function to check if a point is in the center 20% area (smaller center area)
    const isInCenter = (x: number, y: number) => {
      const centerX = 50; // Center of the viewport (0-100%)
      const centerY = 50;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      return distance < 10; // 20% of the viewport radius (smaller center)
    };
    
    // Generate stars with 10% larger size
    for (let i = 0; i < count; i++) {
      // Generate position (strongly biased towards edges)
      let x, y, inCenter;
      
      // 90% chance to be in outer area (90% of stars in 80% of area)
      if (Math.random() < 0.9) {
        // Generate in outer area
        do {
          // Bias towards edges more strongly
          x = Math.pow(Math.random(), 0.7) * 100;
          if (Math.random() > 0.5) x = 100 - x;
          
          y = Math.pow(Math.random(), 0.7) * 100;
          if (Math.random() > 0.5) y = 100 - y;
          
          inCenter = isInCenter(x, y);
        } while (inCenter);
      } else {
        // Generate in center area (only 10% of stars)
        do {
          x = Math.random() * 100;
          y = Math.random() * 100;
          inCenter = isInCenter(x, y);
        } while (!inCenter);
      }
      
      // Create different size groups (10% larger than before)
      const sizeGroup = Math.random();
      let size, opacity, speed, rotation;
      
      if (sizeGroup < 0.6) {
        // 60% small stars (55-110px) - 10% larger
        size = Math.random() * 55 + 55;
        opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8
        speed = Math.random() * 2 + 2; // 2-4s
      } else if (sizeGroup < 0.9) {
        // 30% medium stars (110-220px) - 10% larger
        size = Math.random() * 110 + 110;
        opacity = Math.random() * 0.4 + 0.2; // 0.2-0.6
        speed = Math.random() * 3 + 3; // 3-6s
      } else {
        // 10% large stars (220-330px) - 10% larger
        size = Math.random() * 110 + 220;
        opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
        speed = Math.random() * 4 + 4; // 4-8s
      }
      
      // Generate random rotation (0-359 degrees)
      rotation = Math.floor(Math.random() * 360);
      
      stars.push({
        id: i,
        size,
        x,
        y,
        opacity,
        animationDuration: `${speed}s`,
        animationDelay: `${Math.random() * 5}s`,
        rotation,
        isFilled: Math.random() > 0.5
      });
    }
    
    return stars;
  }, []);

  // Add animation keyframes dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { 
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% { 
          opacity: 1;
          transform: scale(1.2);
        }
      }
      
      .star {
        position: absolute;
        pointer-events: none;
        z-index: 0;
        will-change: transform, opacity;
        /* Add subtle glow effect */
        filter: drop-shadow(0 0 4px rgba(245, 173, 79, 0.5));
        transform-origin: center;
        transform-box: fill-box;
        transition: transform 0.3s ease-in-out;
      }
      
      .star svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-10 overflow-hidden">
      {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              '--duration': star.animationDuration,
              '--delay': star.animationDelay,
              '--rotation': `${star.rotation}deg`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
              animation: 'twinkle var(--duration) infinite var(--delay) ease-in-out',
            } as CustomCSSProperties}
          >
            <svg 
              viewBox="0 0 160 180" 
              fill={star.isFilled ? "#F5AD4F" : "none"} 
              stroke="#F5AD4F" 
              strokeWidth="1.33333" 
              strokeMiterlimit="10" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              preserveAspectRatio="xMidYMid meet"
              style={{
                transform: `rotate(${star.rotation}deg)`,
                transformOrigin: 'center',
                transformBox: 'fill-box'
              }}
            >
              <path d="M74.3003 155.207L75.071 161.297L70.491 165.385L76.5216 166.534L78.9936 172.153L81.9496 166.773L88.0563 166.158L83.8536 161.683L85.1563 155.685L79.603 158.299L74.3003 155.207Z" />
            </svg>
          </div>
        ))}
    </div>
  );
};

export default DynamicStarBackground;
