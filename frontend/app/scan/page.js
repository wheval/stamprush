"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Wifi } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Confetti from "@/components/Confetti"

export default function ScanPage() {
  const [scanState, setScanState] = useState("initial")
  const [progress, setProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const router = useRouter()

  // Simulate NFC scanning process
  const handleStartScanning = () => {
    setScanState("scanning")

    // Simulate NFC detection after 2 seconds
    setTimeout(() => {
      setScanState("creating")
      setProgress(0)

      // Simulate stamp creation progress
      const interval = setInterval(() => {
        setProgress((prev) => {
                  if (prev >= 100) {
          clearInterval(interval)
          setScanState("success")
          setShowConfetti(true)
          // Redirect to new stamp after success
          setTimeout(() => {
            router.push("/my-stamps/1")
          }, 2000)
          return 100
        }
          return prev + 10
        })
      }, 200)
    }, 2000)
  }

  const handleTapHere = () => {
    setScanState("ready")
  }

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      <Confetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md">
          {/* Initial State - TAP HERE */}
          {scanState === "initial" && (
            <div className="bg-white border border-[#FF6F00]/30 rounded-3xl py-12 px-8 text-center vibrant-shadow">
              <div className="mb-10 sm:mb-20">
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-[#00C9A7] rounded-full opacity-20 animate-ping"></div>
                  <div className="absolute inset-2 bg-[#00C9A7] rounded-full opacity-40 animate-ping animation-delay-75"></div>
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Wifi className="w-8 h-8 text-[#00C9A7]" />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTapHere}
                className="bg-[#FF6F00] hover:bg-[#FF6F00]/90 text-white text-2xl font-bold py-6 px-12 mb-6 vibrant-shadow transition-all duration-300 playful-hover"
              >
                TAP HERE
              </Button>

              <p className="text-gray-600 text-sm">Hold near NFC tag</p>
            </div>
          )}

          {/* Ready to Scan State */}
          {scanState === "ready" && (
            <div className="bg-white border border-[#FF6F00]/30 rounded-3xl p-12 text-center vibrant-shadow">
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6F00] to-[#9C27B0] rounded-full opacity-80"></div>
                  <div className="absolute inset-4 bg-white rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wifi className="w-12 h-12 text-[#00C9A7]" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#FF6F00] mb-4">Ready to Scan</h2>
              <p className="text-gray-600 text-lg mb-8">Hold your phone near the NFC tag to create your stamp</p>

              <Button
                onClick={handleStartScanning}
                className="bg-[#FF6F00] text-white hover:bg-[#FF6F00]/90 font-semibold py-3 px-8 rounded-full mb-8 vibrant-shadow transition-all duration-300 playful-hover"
              >
                <Wifi className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            </div>
          )}

          {/* Scanning State */}
          {scanState === "scanning" && (
            <div className="bg-white border border-[#FF6F00]/30 rounded-3xl p-12 text-center vibrant-shadow">
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6F00] to-[#9C27B0] rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute inset-4 bg-white rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wifi className="w-12 h-12 text-[#00C9A7] animate-pulse" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#FF6F00] mb-4">Scanning...</h2>
              <p className="text-gray-600 text-lg">Keep your phone near the NFC tag</p>
            </div>
          )}

          {/* Creating Stamp State */}
          {scanState === "creating" && (
            <div className="bg-white border border-[#9C27B0]/30 rounded-3xl p-12 text-center vibrant-shadow-purple">
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9C27B0] to-[#00C9A7] rounded-full opacity-80"></div>
                  <div className="absolute inset-4 bg-white rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 text-[#FF6F00]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 text-[#00C9A7]">✕</div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#9C27B0] mb-4">Creating Your Stamp</h2>
              <p className="text-gray-600 text-lg mb-8">Minting your proof-of-contact on Starknet...</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-[#00C9A7] to-[#FF6F00] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-[#00C9A7] text-sm font-semibold">{progress}%</p>
            </div>
          )}

          {/* Success State */}
          {scanState === "success" && (
            <div className="bg-white border border-[#00C9A7]/30 rounded-3xl p-12 text-center vibrant-shadow-aqua">
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00C9A7] to-[#FF6F00] rounded-full opacity-80"></div>
                  <div className="absolute inset-4 bg-white rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 text-[#9C27B0]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="w-full h-full"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#00C9A7] mb-4">Stamp Created!</h2>
              <p className="text-gray-600 text-lg">
                Your proof-of-contact has been successfully minted on the blockchain.
              </p>
            </div>
          )}

          {/* NFC Warning */}
          {scanState === "ready" && (
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-[#00C9A7] font-medium">
                <span className="text-lg">💡</span>
                <span className="text-sm">Make sure NFC is enabled in your phone settings</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
