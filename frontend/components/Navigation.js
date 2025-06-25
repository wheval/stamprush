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

      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
          How it works
        </a>
        {/* <a href="#" className="hover:text-[#00C9A7] transition-colors">
           My Stamps 
        </a>
        <a href="#" className="hover:text-[#00C9A7] transition-colors">
          Leaderboard
        </a> */}
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
        <div className="flex items-center gap-2">
          <Button className="bg-[#FF6F00] hover:bg-[#FF6F00]/90 text-white font-semibold px-6 rounded-full vibrant-shadow playful-hover" onClick={() => setIsLoggedIn(true)}>
            Get Started
          </Button>
        </div>
      )}

      
    </nav>
  )
} 