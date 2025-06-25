"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search } from "lucide-react"
import Link from "next/link"
import recentClaims from "@/mock/explore"
import Map from "@/components/Map"

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("Global")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#FF6F00]">Global Discovery</h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FF6F00]/60 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for locations or stamps"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 text-lg bg-white border-[#FF6F00]/20 text-gray-800 placeholder-gray-400 rounded-xl vibrant-shadow"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-8">
          {["Global", "Country", "City"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg transition-all duration-300 playful-hover ${
                activeTab === tab
                  ? "bg-[#FF6F00] text-white hover:bg-[#FF6F00]/90 vibrant-shadow"
                  : "text-[#FF6F00] hover:bg-[#FF6F00]/10 border border-[#FF6F00]/20"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Map Container */}
        <div className="mb-8 border border-[#FF6F00]/20 rounded-xl overflow-hidden vibrant-shadow bg-white">
          <Map className="h-96" />
        </div>

        {/* Recent Claims */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#9C27B0]">Recent Claims</h2>

          <div className="space-y-4">
            {recentClaims.map((claim, index) => (
              <div key={claim.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#FF6F00]/30 transition-all duration-300 vibrant-shadow playful-hover">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index % 3 === 0 ? 'bg-gradient-to-br from-[#FF6F00] to-[#9C27B0]' :
                  index % 3 === 1 ? 'bg-gradient-to-br from-[#9C27B0] to-[#00C9A7]' :
                  'bg-gradient-to-br from-[#00C9A7] to-[#FF6F00]'
                }`}>
                  <span className="text-white font-semibold text-sm">{claim.user.charAt(4).toUpperCase()}</span>
                </div>

                <div className="flex-1">
                  <div className="text-gray-800 font-medium">
                    <span className="font-semibold text-[#FF6F00]">{claim.user}</span> just claimed
                  </div>
                  <div className="text-[#9C27B0]">
                    {claim.stamp} in {claim.location}!
                  </div>
                </div>

                <div className="text-sm text-[#00C9A7] font-medium">{claim.time}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
