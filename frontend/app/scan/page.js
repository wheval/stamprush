"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Wifi } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"


export default function ScanPage() {
  const [scanState, setScanState] = useState("initial")
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  // Simulate NFC scanning process
  const handleStartScanning = () => {
    setScanState("scanning")

    // Simulate NFC detection after 2 seconds
    setTimeout(() => {
      setScanState("creating")

      // Simulate stamp creation progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setScanState("success")
            // Redirect to new stamp after success
            setTimeout(() => {
              router.push("/stamps/1")
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
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md">
          {/* Initial State - TAP HERE */}
          {scanState === "initial" && (
            <div className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] rounded-3xl py-12 px-8 text-center">
              <div className="mb-10 sm:mb-20">
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping"></div>
                  <div className="absolute inset-2 bg-green-400 rounded-full opacity-40 animate-ping animation-delay-75"></div>
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Wifi className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTapHere}
                className="bg-green-400 hover:bg-green-600 text-black text-2xl font-bold py-6 px-12 mb-6 border-0"
              >
                TAP HERE
              </Button>

              <p className="text-gray-400 text-sm">Hold near NFC tag</p>
            </div>
          )}

          {/* Ready to Scan State */}
          {scanState === "ready" && (
            <div className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] rounded-3xl p-12 text-center">
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-600 rounded-full opacity-80"></div>
                  <div className="absolute inset-4 bg-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wifi className="w-12 h-12 text-green-400" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-green-400 mb-4">Ready to Scan</h2>
              <p className="text-gray-400 text-lg mb-8">Hold your phone near the NFC tag to create your stamp</p>

              <Button
                onClick={handleStartScanning}
                className="bg-green-400 text-black hover:from-green-500 hover:to-blue-600 font-semibold py-3 px-8 rounded-full mb-8"
              >
                <Wifi className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            </div>
          )}

          {/* Scanning State */}
          {scanState === "scanning" && (
            <div className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] rounded-3xl p-12 text-center">
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-600 rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute inset-4 bg-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wifi className="w-12 h-12 text-green-400 animate-pulse" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-green-400 mb-4">Scanning...</h2>
              <p className="text-gray-400 text-lg">Keep your phone near the NFC tag</p>
            </div>
          )}

          {/* Creating Stamp State */}
          {scanState === "creating" && (
            <div className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] rounded-3xl p-12 text-center">
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full opacity-80"></div>
                  <div className="absolute inset-4 bg-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 text-purple-400">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 text-purple-400">✕</div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-green-400 mb-4">Creating Your Stamp</h2>
              <p className="text-gray-400 text-lg mb-8">Minting your proof-of-contact on Starknet...</p>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${progress > 0 ? "bg-green-400" : "bg-gray-600"}`}></div>
                <div className={`w-3 h-3 rounded-full ${progress > 33 ? "bg-purple-400" : "bg-gray-600"}`}></div>
                <div className={`w-3 h-3 rounded-full ${progress > 66 ? "bg-pink-400" : "bg-gray-600"}`}></div>
              </div>
            </div>
          )}

          {/* Success State */}
          {scanState === "success" && (
            <div className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] rounded-3xl p-12 text-center">
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-80"></div>
                  <div className="absolute inset-4 bg-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 text-green-400">
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

              <h2 className="text-3xl font-bold text-green-400 mb-4">Stamp Created!</h2>
              <p className="text-gray-400 text-lg">
                Your proof-of-contact has been successfully minted on the blockchain.
              </p>
            </div>
          )}

          {/* NFC Warning */}
          {scanState === "ready" && (
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
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
