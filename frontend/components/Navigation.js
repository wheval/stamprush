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
        <Image src="/logo.svg" alt="StampTag" width={200} height={200} />
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="hover:text-green-300 transition-colors">
          How it works
        </a>
        {/* <a href="#" className="hover:text-green-300 transition-colors">
          Pricing
        </a>
        <a href="#" className="hover:text-green-300 transition-colors">
          Contact
        </a> */}
      </div>

      {/* Show "Get Started" if not logged in, else show user actions */}
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Button>
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-black">A</span>
          </div>
          {/* Temporary button to toggle login state for demo */}
          <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
            Log out
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button className="bg-green-400 hover:bg-green-500 text-black font-semibold px-6 rounded-full" onClick={() => setIsLoggedIn(true)}>
            Get Started
          </Button>
        </div>
      )}

      
    </nav>
  )
} 