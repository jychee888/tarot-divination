"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthStatus } from "../auth-status";
import { useSession } from "next-auth/react";

interface HeaderProps {
  className?: string;
  logoText?: string;
}

export default function Header({
  className = "",
  logoText = "Soul's Eye",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true when scrolled past 12 (3rem)
      setIsScrolled(window.scrollY > 12);
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      className={`fixed left-0 right-0 z-[100] flex items-center justify-between sm:py-4 py-2 sm:px-16 px-8 transition-all duration-300 ${
        isScrolled ? "top-0" : "sm:top-12 top-6"
      } ${className}`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <span className="im-fell-english-regular text-2xl text-amber-100 tracking-wider">
          {logoText}
        </span>
      </Link>

      {/* Navigation & Profile */}
      <div className="flex items-center gap-6">
        <Link
          href="/articles"
          className="im-fell-english-regular text-lg text-[#F9ECDC]/80 hover:text-[#C99041] transition-colors relative group"
        >
          Tarot Meanings
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C99041] transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {session?.user?.role === "admin" && (
          <Link
            href="/admin"
            className="im-fell-english-regular text-lg text-amber-500/80 hover:text-amber-400 transition-colors relative group"
          >
            Admin Panel
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        )}

        <AuthStatus />
      </div>
    </header>
  );
}
