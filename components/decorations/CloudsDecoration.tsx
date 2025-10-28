import React from 'react';

interface CloudsDecorationProps {
  className?: string;
  position?: 'left' | 'right';
  opacity?: number;
}

export const CloudsDecoration: React.FC<CloudsDecorationProps> = ({
  className = '',
  position = 'left',
  opacity = 0.4,
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
        <g fill="#C99041" opacity={opacity}>
          <path d="M30,200c0-5.5,4.5-10,10-10c1.2,0,2.4,0.2,3.5,0.6c-0.8-1.1-2.1-1.8-3.5-1.8c-2.8,0-5,2.2-5,5s2.2,5,5,5h10c2.8,0,5-2.2,5-5s-2.2-5-5-5c-1.4,0-2.7,0.6-3.5,1.6c-1.1-0.4-2.3-0.6-3.5-0.6C34.5,190,30,194.5,30,200z" />
          <path d="M50,400c0-4,3.3-7.2,7.2-7.2c0.9,0,1.7,0.2,2.5,0.4c-0.6-0.8-1.5-1.3-2.5-1.3c-1.9,0-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5h7.7c1.9,0,3.5-1.6,3.5-3.5s-1.6-3.5-3.5-3.5c-1,0-1.9,0.5-2.5,1.2c-0.8-0.3-1.7-0.4-2.5-0.4C53.3,392.8,50,396.1,50,400z" opacity="0.75" />
          <path d="M20,650c0-5.5,4.5-10,10-10c1.2,0,2.4,0.2,3.5,0.6c-0.8-1.1-2.1-1.8-3.5-1.8c-2.8,0-5,2.2-5,5s2.2,5,5,5h10c2.8,0,5-2.2,5-5s-2.2-5-5-5c-1.4,0-2.7,0.6-3.5,1.6c-1.1-0.4-2.3-0.6-3.5-0.6C24.5,640,20,644.5,20,650z" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default CloudsDecoration;
