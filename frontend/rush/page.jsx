"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell } from "lucide-react"
import Link from "next/link"


const stampEvents = [
  {
    id: "tech-conference",
    title: "Tech Conference 2024",
    description: "Claim your stamp at the main stage during the keynote session.",
    image: "/placeholder.svg?height=200&width=300",
    initialTime: { hours: 1, minutes: 30, seconds: 45 },
    claimed: false,
  },
  {
    id: "art-fair",
    title: "Local Art Fair",
    description: "Find the StampTag booth near the sculpture exhibit.",
    image: "/placeholder.svg?height=200&width=300",
    initialTime: { hours: 0, minutes: 45, seconds: 20 },
    claimed: false,
  },
  {
    id: "community-cleanup",
    title: "Community Cleanup",
    description: "Claim your stamp at the registration tent.",
    image: "/placeholder.svg?height=200&width=300",
    initialTime: { hours: 2, minutes: 15, seconds: 10 },
    claimed: false,
  },
  {
    id: "book-signing",
    title: "Book Signing Event",
    description: "Claim your stamp at the author's signing table.",
    image: "/placeholder.svg?height=200&width=300",
    initialTime: { hours: 0, minutes: 55, seconds: 30 },
    claimed: false,
  },
]

export default function StampRushPage() {
  const [events, setEvents] = useState(stampEvents)

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
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
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleClaim = (eventId) => {
    setEvents((prevEvents) => prevEvents.map((event) => (event.id === eventId ? { ...event, claimed: true } : event)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-black">StampTag</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/stamps" className="text-gray-600 hover:text-black transition-colors">
            Stamps
          </Link>
          <Link href="/create" className="text-gray-600 hover:text-black transition-colors">
            Create
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-black transition-colors">
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-black">A</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Stamp Rush</h1>
          <p className="text-gray-600 text-lg">
            Discover and claim limited-time stamps in real-time. Hurry, these stamps won't last long!
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Active Stamps</h2>

          <div className="space-y-8">
            {events.map((event) => (
              <div key={event.id} className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Event Info */}
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Expires in</div>
                    <h3 className="text-xl font-bold text-black mb-2">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>

                  <Button
                    onClick={() => handleClaim(event.id)}
                    disabled={event.claimed}
                    className={`mb-6 px-8 py-2 rounded-lg font-semibold ${
                      event.claimed
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {event.claimed ? "Claimed" : "Claim"}
                  </Button>

                  {/* Countdown Timer */}
                  <div className="flex gap-4">
                    <div className="bg-gray-200 rounded-lg px-4 py-3 text-center min-w-[80px]">
                      <div className="text-2xl font-bold text-black">
                        {event.initialTime.hours.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-600">Hours</div>
                    </div>
                    <div className="bg-gray-200 rounded-lg px-4 py-3 text-center min-w-[80px]">
                      <div className="text-2xl font-bold text-black">
                        {event.initialTime.minutes.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-600">Minutes</div>
                    </div>
                    <div className="bg-gray-200 rounded-lg px-4 py-3 text-center min-w-[80px]">
                      <div className="text-2xl font-bold text-black">
                        {event.initialTime.seconds.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-600">Seconds</div>
                    </div>
                  </div>
                </div>

                {/* Event Image */}
                <div className="lg:w-80">
                  <Card className="overflow-hidden border border-gray-200">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        {event.id === "tech-conference" && (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                            <div className="bg-white/90 rounded-lg p-4 m-8 text-center">
                              <div className="text-blue-600 font-bold text-lg mb-2">Tech Conference</div>
                              <div className="text-sm text-gray-600">Keynote Session</div>
                              <div className="text-xs text-gray-500 mt-2">Main Stage</div>
                            </div>
                          </div>
                        )}
                        {event.id === "art-fair" && (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center p-4">
                            <div className="grid grid-cols-2 gap-2 w-full">
                              <div className="bg-white rounded p-2 aspect-square flex items-center justify-center">
                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                  🎨
                                </div>
                              </div>
                              <div className="bg-white rounded p-2 aspect-square flex items-center justify-center">
                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                  🖼️
                                </div>
                              </div>
                              <div className="bg-white rounded p-2 aspect-square flex items-center justify-center">
                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                  🗿
                                </div>
                              </div>
                              <div className="bg-white rounded p-2 aspect-square flex items-center justify-center">
                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                  🎭
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {event.id === "community-cleanup" && (
                          <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <div className="bg-white/90 rounded-lg p-6 m-8 text-center">
                              <div className="text-green-600 font-bold text-lg mb-2">REGISTRATION</div>
                              <div className="text-sm text-gray-600">Community Cleanup</div>
                              <div className="flex justify-center mt-4 gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        {event.id === "book-signing" && (
                          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                            <div className="bg-white rounded-lg p-4 m-8 flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                👩🏻
                              </div>
                              <div className="text-left">
                                <div className="font-semibold text-gray-800">Author</div>
                                <div className="text-sm text-gray-600">Book Signing</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
