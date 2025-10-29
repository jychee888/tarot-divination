import React from 'react';

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CornerDecorationProps {
  position: CornerPosition;
  className?: string;
}

const rotationMap = {
  'top-left': 'rotate-90',
  'top-right': 'rotate-180',
  'bottom-right': 'rotate-90',
  'bottom-left': 'rotate-180',
};

export function CornerDecoration({ position, className = '' }: CornerDecorationProps) {
  return (
    <div className={`absolute ${position.replace('-', '-left-')} ${rotationMap[position]} ${className} w-8 h-8 sm:w-12 sm:h-12`}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M8.60763 0.666684C19.1956 11.2547 19.1956 28.4213 8.60763 39.0107C-1.98037 28.4213 -1.98037 11.2547 8.60763 0.666684Z" fill="#171111" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M46.9509 39.01C36.3629 49.598 19.1963 49.598 8.60693 39.01C19.1963 28.422 36.3629 28.422 46.9509 39.01Z" fill="#171111" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M46.9509 39.01H8.60693" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.60754 0.666684V39.0107" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M35.7204 11.8972C35.7204 26.8706 23.5817 39.0106 8.60706 39.0106C8.60706 24.0359 20.7471 11.8972 35.7204 11.8972Z" fill="#171111" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M35.7204 11.8972L8.60706 39.0106" stroke="#F5AD4F" strokeWidth="1.33333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
