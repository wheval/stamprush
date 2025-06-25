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
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Global Discovery</h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for locations or stamps"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-8">
          {["Global", "Country", "City"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-green-400 text-black hover:bg-green-500"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Map Container */}
        <div className="mb-8">
          <Map className="h-96" />
        </div>

        {/* Recent Claims */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Claims</h2>

          <div className="space-y-4">
            {recentClaims.map((claim) => (
              <div key={claim.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{claim.user.charAt(4).toUpperCase()}</span>
                </div>

                <div className="flex-1">
                  <div className="text-white font-medium">
                    <span className="font-semibold">{claim.user}</span> just claimed
                  </div>
                  <div className="text-gray-400">
                    {claim.stamp} in {claim.location}!
                  </div>
                </div>

                <div className="text-sm text-gray-400">{claim.time}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
