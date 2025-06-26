"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link";
import { useStarknet } from "@/lib/starknet-provider"
import WalletConnect from "./wallet-connect"
import { useState } from "react"

export default function Navigation() {
  const { isConnected, address } = useStarknet()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // For demo purposes, you can set this based on actual admin logic
  const isAdmin = address && address.toLowerCase().includes('admin') // Replace with actual admin check

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto relative">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="StampRush" width={200} height={200} />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {isConnected ? (
          // Connected wallet navigation
          <>
            <Link href="/stamps" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Stamps
            </Link>
            <Link href="/my-stamps" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              My Stamps
            </Link>
            <Link href="/explore" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Explore
            </Link>
            <Link href="/scan" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Scan
            </Link>
            <Link href="/leaderboard" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Leaderboard
            </Link>

            {isAdmin && (
              <Link href="/admin" className="hover:text-[#9C27B0] transition-colors text-[#9C27B0] font-medium border border-[#9C27B0]/30 px-3 py-1 rounded-lg">
                Admin
              </Link>
            )}
          </>
        ) : (
          // Non-connected wallet navigation
          <>
            <a href="#features" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              How it works
            </a>
            <Link href="/explore" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Explore
            </Link>
            <Link href="/leaderboard" className="hover:text-[#00C9A7] transition-colors text-[#FF6F00] font-medium">
              Leaderboard
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-[#FF6F00] hover:bg-[#FF6F00]/10"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>

      {/* Show wallet connection and user actions */}
      {isConnected ? (
        <div className="hidden md:flex items-center gap-4">

          <Link href="/profile">
            <div className="w-8 h-8 bg-gradient-to-r from-[#9C27B0] to-[#00C9A7] rounded-full flex items-center justify-center cursor-pointer hover:from-[#9C27B0]/80 hover:to-[#00C9A7]/80 transition-all duration-300 vibrant-shadow-purple playful-hover">
              <span className="text-sm font-semibold text-white">
                {address ? address.slice(2, 4).toUpperCase() : "U"}
              </span>
            </div>
          </Link>
          <WalletConnect />
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-4">
          <Link href="/stamps">
            <Button variant="outline" className="border-[#FF6F00]/30 text-[#FF6F00] hover:bg-[#FF6F00]/10 playful-hover">
              Explore Stamps
            </Button>
          </Link>
          <WalletConnect />
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 md:hidden z-50">
          <div className="p-4 space-y-4">
            {isConnected ? (
              <>
                <Link 
                  href="/stamps" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Stamps
                </Link>
                <Link 
                  href="/my-stamps" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Stamps
                </Link>
                <Link 
                  href="/explore" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link 
                  href="/scan" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Scan
                </Link>
                <Link 
                  href="/leaderboard" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="block py-2 text-[#9C27B0] font-medium hover:text-[#9C27B0]/80 transition-colors border-t border-gray-200 pt-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-3">
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="w-8 h-8 bg-gradient-to-r from-[#9C27B0] to-[#00C9A7] rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {address ? address.slice(2, 4).toUpperCase() : "U"}
                        </span>
                      </div>
                    </Link>
                    <WalletConnect />
                  </div>
                </div>
              </>
            ) : (
              <>
                <a 
                  href="#features" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How it works
                </a>
                <Link 
                  href="/explore" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link 
                  href="/leaderboard" 
                  className="block py-2 text-[#FF6F00] font-medium hover:text-[#00C9A7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <div className="border-t border-gray-200 pt-4">
                  <Link href="/stamps" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-[#FF6F00]/30 text-[#FF6F00] hover:bg-[#FF6F00]/10 mb-3">
                      Explore Stamps
                    </Button>
                  </Link>
                  <WalletConnect />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 