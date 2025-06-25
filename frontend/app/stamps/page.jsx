"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Clock, Zap, MapPin, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { stampEvents } from "@/mock/rush"
import todayStamp from "@/mock/today"
import Confetti from "@/components/Confetti"

export default function StampsPage() {
  // Today's stamp state
  const [timeLeft, setTimeLeft] = useState(todayStamp.initialTimeLeft)
  const [hasClaimed, setHasClaimed] = useState(false)
  const [claimsRemaining, setClaimsRemaining] = useState(todayStamp.initialClaimsRemaining)
  const [showTodayConfetti, setShowTodayConfetti] = useState(false)

  // Rush events state
  const [events, setEvents] = useState(stampEvents || [])
  const [showRushConfetti, setShowRushConfetti] = useState(false)

  // Countdown timer effect for today's stamp
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

  // Update rush event timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prevEvents) =>
        prevEvents && prevEvents.length > 0 ? prevEvents.map((event) => {
          let { hours, minutes, seconds } = event.initialTime

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

          return {
            ...event,
            initialTime: { hours, minutes, seconds },
          }
        }) : []
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleTodayClaim = () => {
    if (!hasClaimed && claimsRemaining > 0) {
      setHasClaimed(true)
      setClaimsRemaining((prev) => prev - 1)
      setShowTodayConfetti(true)
    }
  }

  const handleRushClaim = (eventId) => {
    setEvents((prevEvents) => prevEvents.map((event) => (event.id === eventId ? { ...event, claimed: true } : event)))
    setShowRushConfetti(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <Confetti 
        show={showTodayConfetti || showRushConfetti} 
        onComplete={() => {
          setShowTodayConfetti(false)
          setShowRushConfetti(false)
        }} 
      />
      
      {/* Main Content */}
      <main className="px-6 py-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-4">
            Stamps
          </h1>
          <p className="text-gray-600 text-lg">
            Claim today's featured stamp and discover limited-time stamps in real-time!
          </p>
        </div>

        {/* Today's Stamp Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-7 h-7 text-orange-500" />
            <h2 className="text-4xl font-bold text-gray-800">Today's Featured Stamp</h2>
          </div>

          <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-lg shadow-orange-100/50 overflow-hidden">
            {/* Stamp Image */}
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-orange-400 via-purple-500 to-teal-400 flex items-center justify-center">
              <div className="text-white text-6xl sm:text-8xl opacity-90">
                🌿
              </div>
              
              {/* Time Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-gray-800">
                  {timeLeft.hours.toString().padStart(2, "0")}:
                  {timeLeft.minutes.toString().padStart(2, "0")}:
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{todayStamp.name}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{todayStamp.description}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl border border-teal-200">
                    <MapPin className="w-5 h-5 text-teal-500" />
                    <span className="font-semibold text-gray-800">{todayStamp.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl border border-orange-200">
                      <div className="text-2xl font-bold text-orange-500">{claimsRemaining}</div>
                      <div className="text-sm text-gray-600 font-medium">Claims Left</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl border border-purple-200">
                      <div className="text-2xl font-bold text-purple-500">{todayStamp.totalClaimed}</div>
                      <div className="text-sm text-gray-600 font-medium">Total Claimed</div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Action */}
                <div className="space-y-6">
                  {/* Claim Button */}
                  <div className="space-y-4">
                    <Button
                      onClick={handleTodayClaim}
                      disabled={hasClaimed}
                      className={`w-full py-6 text-xl font-bold rounded-xl transition-all duration-300 ${
                        hasClaimed
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transform hover:scale-105"
                      }`}
                    >
                      {hasClaimed ? "Claimed ✅" : "Claim Today's Stamp 🌟"}
                    </Button>

                    {/* Claims Info */}
                    <div className="text-center space-y-2">
                      <p className="text-gray-600 mb-2 font-medium">{claimsRemaining} claims remaining</p>
                      {hasClaimed && <p className="text-gray-500">{"You've"} already claimed this stamp</p>}
                    </div>
                  </div>

                  {/* Community Activity */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Recent Claims
                    </h4>
                    <div className="space-y-2">
                      {todayStamp.recentClaims.map((claim, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{claim.user.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800">{claim.user}</span>
                            <span className="text-gray-600 text-sm ml-2">{claim.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rush Events Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-7 h-7 text-orange-500" />
            <h2 className="text-4xl font-bold text-gray-800">Limited-Time Stamps</h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Hurry! These exclusive stamps won't last long. Claim them before time runs out!
          </p>

          <div className="space-y-8">
            {events && events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg shadow-orange-100/50 overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Event Image */}
                    <div className="lg:w-80 w-full lg:h-auto h-48">
                      <div className="relative overflow-hidden rounded-l-2xl lg:rounded-l-2xl lg:rounded-r-none rounded-r-2xl lg:rounded-tr-none lg:rounded-br-none h-full">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover w-full h-full"
                          sizes="(max-width: 1024px) 100vw, 320px"
                        />
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 p-8">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-orange-500 font-medium mb-2">
                          <Clock className="w-4 h-4" />
                          Expires in
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{event.title}</h3>
                        <p className="text-gray-600 text-lg">{event.description}</p>
                      </div>

                      {/* Countdown Timer */}
                      <div className="flex gap-4 mb-6">
                        <div className="bg-gradient-to-r from-orange-50 to-purple-50 border-2 border-orange-200 rounded-xl px-4 py-3 text-center min-w-[80px]">
                          <div className="text-2xl font-bold text-orange-500">
                            {event.initialTime.hours.toString().padStart(2, "0")}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">Hours</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-teal-50 border-2 border-purple-200 rounded-xl px-4 py-3 text-center min-w-[80px]">
                          <div className="text-2xl font-bold text-purple-500">
                            {event.initialTime.minutes.toString().padStart(2, "0")}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">Minutes</div>
                        </div>
                        <div className="bg-gradient-to-r from-teal-50 to-orange-50 border-2 border-teal-200 rounded-xl px-4 py-3 text-center min-w-[80px]">
                          <div className="text-2xl font-bold text-teal-500">
                            {event.initialTime.seconds.toString().padStart(2, "0")}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">Seconds</div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleRushClaim(event.id)}
                        disabled={event.claimed}
                        className={`px-8 py-3 text-lg font-bold rounded-xl transition-all duration-300 ${
                          event.claimed
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transform hover:scale-105"
                        }`}
                      >
                        {event.claimed ? "Claimed ✅" : "Claim Now 🚀"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No limited-time stamps available right now.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
