"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link";
import { useState } from "react"

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="StampRush" width={200} height={200} />
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {isLoggedIn ? (
          // Logged-in user navigation
          <>
            <Link href="/stamps" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Stamps
            </Link>
            <Link href="/my-stamps" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              My Stamps
            </Link>
            <Link href="/leaderboard" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Leaderboard
            </Link>
            <Link href="/explore" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Explore
            </Link>
            <Link href="/scan" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Scan
            </Link>
          </>
        ) : (
          // Non-logged-in user navigation
          <>
            <a href="#features" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              How it works
            </a>
            <Link href="/leaderboard" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Leaderboard
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button (for future mobile implementation) */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="text-[#FF6F00] hover:bg-[#FF6F00]/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>

      {/* Show "Get Started" if not logged in, else show user actions */}
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-[#FF6F00] hover:bg-[#FF6F00]/10 border border-[#FF6F00]/20 playful-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Button>
          <Link href="/profile">
            <div className="w-8 h-8 bg-gradient-to-r from-[#9C27B0] to-[#00C9A7] rounded-full flex items-center justify-center cursor-pointer hover:from-[#9C27B0]/80 hover:to-[#00C9A7]/80 transition-all duration-300 vibrant-shadow-purple playful-hover">
              <span className="text-sm font-semibold text-white">A</span>
            </div>
          </Link>
          {/* Temporary button to toggle login state for demo */}
          <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)} className="border-[#FF6F00]/30 text-[#FF6F00] hover:bg-[#FF6F00]/10 playful-hover">
            Log out
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/stamps">
            <Button variant="outline" className="border-[#FF6F00]/30 text-[#FF6F00] hover:bg-[#FF6F00]/10 playful-hover">
              Explore Stamps
            </Button>
          </Link>
          <Button className="bg-[#FF6F00] hover:bg-[#FF6F00]/90 text-white font-semibold px-6 rounded-full vibrant-shadow playful-hover" onClick={() => setIsLoggedIn(true)}>
            Get Started
          </Button>
        </div>
      )}

      
    </nav>
  )
} 