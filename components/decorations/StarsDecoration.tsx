import React from 'react';

interface StarsDecorationProps {
  className?: string;
  position?: 'left' | 'right';
}

export const StarsDecoration: React.FC<StarsDecorationProps> = ({
  className = '',
  position = 'left',
}) => {
  const positionClass = position === 'left' ? 'left-0' : 'right-0';
  
  return (
    <div className={`fixed top-0 h-full w-1/5 pointer-events-none z-0 ${positionClass} ${className}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 200 1000" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <g fill="#F9ECDC">
          <circle cx="30" cy="150" r="1.5" opacity="0.8" filter="url(#star-glow)" />
          <circle cx="50" cy="250" r="0.8" opacity="0.6" filter="url(#star-glow)" />
          <circle cx="20" cy="350" r="1.2" opacity="0.9" filter="url(#star-glow)" />
          <circle cx="40" cy="500" r="1" opacity="0.7" filter="url(#star-glow)" />
          <circle cx="15" cy="600" r="1.5" opacity="0.8" filter="url(#star-glow)" />
          <circle cx="45" cy="700" r="1.2" opacity="0.6" filter="url(#star-glow)" />
          <circle cx="25" cy="800" r="1.8" opacity="0.7" filter="url(#star-glow)" />
        </g>
        
        <defs>
          <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default StarsDecoration;
