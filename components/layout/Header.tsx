'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthStatus } from '../auth-status';

interface HeaderProps {
  className?: string;
  logoText?: string;
}

export default function Header({ 
  className = '',
  logoText = "Soul's Eye" 
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true when scrolled past 12 (3rem)
      setIsScrolled(window.scrollY > 12);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <header 
      className={`fixed left-0 right-0 z-50 flex items-center justify-between py-4 px-16 transition-all duration-300 ${
        isScrolled 
          ? 'top-0' 
          : 'top-12'
      } ${className}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <span className="im-fell-english-regular text-2xl text-amber-100 tracking-wider">
          {logoText}
        </span>
      </Link>
    
      {/* User Profile */}
      <div className="flex justify-end">
        <AuthStatus />
      </div>
    </header>
  );
}
