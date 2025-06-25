"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import Link from "next/link"
import todayStamp from "@/mock/today"

export default function TodayStampPage() {
  const [timeLeft, setTimeLeft] = useState(todayStamp.initialTimeLeft)
  const [hasClaimed, setHasClaimed] = useState(false)
  const [claimsRemaining, setClaimsRemaining] = useState(todayStamp.initialClaimsRemaining)

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClaim = () => {
    if (!hasClaimed && claimsRemaining > 0) {
      setHasClaimed(true)
      setClaimsRemaining((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#FF6F00]">{"Today's Stamp"}</h1>

        {/* Stamp Card */}
        <div className="bg-white border border-[#FF6F00]/20 rounded-3xl p-12 mb-8 flex items-center justify-center vibrant-shadow">
          <div className="relative">
            {/* Stamp Circle */}
            <div className="w-80 h-80 bg-gradient-to-br from-white to-gray-50 rounded-full shadow-xl flex items-center justify-center relative border-4 border-[#00C9A7]/20">
              {/* Botanical Illustration */}
              <div className="w-64 h-64 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  {/* Main stem */}
                  <path d="M100 180 L100 20" />

                  {/* Left side branches and leaves */}
                  <path d="M100 40 Q80 35 70 45 Q75 55 85 50 Q95 45 100 40" />
                  <path d="M100 60 Q75 55 65 65 Q70 75 80 70 Q95 65 100 60" />
                  <path d="M100 80 Q70 75 60 85 Q65 95 75 90 Q95 85 100 80" />
                  <path d="M100 100 Q65 95 55 105 Q60 115 70 110 Q95 105 100 100" />
                  <path d="M100 120 Q70 115 60 125 Q65 135 75 130 Q95 125 100 120" />
                  <path d="M100 140 Q75 135 65 145 Q70 155 80 150 Q95 145 100 140" />
                  <path d="M100 160 Q80 155 70 165 Q75 175 85 170 Q95 165 100 160" />

                  {/* Right side branches and leaves */}
                  <path d="M100 40 Q120 35 130 45 Q125 55 115 50 Q105 45 100 40" />
                  <path d="M100 60 Q125 55 135 65 Q130 75 120 70 Q105 65 100 60" />
                  <path d="M100 80 Q130 75 140 85 Q135 95 125 90 Q105 85 100 80" />
                  <path d="M100 100 Q135 95 145 105 Q140 115 130 110 Q105 105 100 100" />
                  <path d="M100 120 Q130 115 140 125 Q135 135 125 130 Q105 125 100 120" />
                  <path d="M100 140 Q125 135 135 145 Q130 155 120 150 Q105 145 100 140" />
                  <path d="M100 160 Q120 155 130 165 Q125 175 115 170 Q105 165 100 160" />

                  {/* Top decorative elements */}
                  <path d="M100 20 Q90 15 85 25 Q90 35 95 30 Q100 25 100 20" />
                  <path d="M100 20 Q110 15 115 25 Q110 35 105 30 Q100 25 100 20" />

                  {/* Small decorative dots/berries */}
                  <circle cx="130" cy="50" r="2" fill="currentColor" />
                  <circle cx="135" cy="70" r="2" fill="currentColor" />
                  <circle cx="140" cy="90" r="2" fill="currentColor" />
                  <circle cx="70" cy="50" r="2" fill="currentColor" />
                  <circle cx="65" cy="70" r="2" fill="currentColor" />
                  <circle cx="60" cy="90" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stamp Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] bg-clip-text text-transparent">{todayStamp.name}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {todayStamp.description}
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-white border border-[#FF6F00]/20 rounded-2xl px-6 py-4 text-center min-w-[100px] vibrant-shadow">
            <div className="text-3xl font-bold text-[#FF6F00]">{timeLeft.hours.toString().padStart(2, "0")}</div>
            <div className="text-gray-500 text-sm">Hours</div>
          </div>
          <div className="bg-white border border-[#9C27B0]/20 rounded-2xl px-6 py-4 text-center min-w-[100px] vibrant-shadow-purple">
            <div className="text-3xl font-bold text-[#9C27B0]">{timeLeft.minutes.toString().padStart(2, "0")}</div>
            <div className="text-gray-500 text-sm">Minutes</div>
          </div>
          <div className="bg-white border border-[#00C9A7]/20 rounded-2xl px-6 py-4 text-center min-w-[100px] vibrant-shadow-aqua">
            <div className="text-3xl font-bold text-[#00C9A7]">{timeLeft.seconds.toString().padStart(2, "0")}</div>
            <div className="text-gray-500 text-sm">Seconds</div>
          </div>
        </div>

        {/* Claim Button */}
        <div className="text-center mb-6">
          <Button
            onClick={handleClaim}
            disabled={hasClaimed}
            className={`px-12 py-3 text-lg font-semibold rounded-full transition-all duration-300 playful-hover ${
              hasClaimed 
                ? "bg-gray-400 cursor-not-allowed text-white" 
                : "bg-[#FF6F00] hover:bg-[#FF6F00]/90 text-white vibrant-shadow"
            }`}
          >
            {hasClaimed ? "Claimed" : "Claim"}
          </Button>
        </div>

        {/* Claims Info */}
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-2 font-medium">{claimsRemaining} claims remaining</p>
          {hasClaimed && <p className="text-gray-500">{"You've"} already claimed this stamp</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            asChild
            variant="outline"
            className="border-[#9C27B0]/30 text-[#9C27B0] hover:bg-[#9C27B0]/10 px-8 py-3 rounded-full transition-all duration-300 playful-hover"
          >
            <Link href="/stamps">My Stamps</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#00C9A7]/30 text-[#00C9A7] hover:bg-[#00C9A7]/10 px-8 py-3 rounded-full transition-all duration-300 playful-hover"
          >
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
