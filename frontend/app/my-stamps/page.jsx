"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Calendar, MapPin, Users, Loader2 } from "lucide-react"
import Image from "next/image"
import { useStarknet } from "@/lib/starknet-provider"
import { useStampContract } from "@/lib/hooks/use-stamp-contract"
import toast from "react-hot-toast"

export default function MyStampsPage() {
  const { isConnected, address } = useStarknet()
  const { getUserTotalClaims, hasUserClaimed } = useStampContract()
  
  const [userStats, setUserStats] = useState({
    totalClaimed: 0,
    rank: 0
  })
  const [claimedStamps, setClaimedStamps] = useState([])
  const [loading, setLoading] = useState(true)

  // Sample stamps data - replace with actual stamps from your contract
  const allStamps = [
    {
      id: "community-stamp",
      name: "Community Stamp",
      description: "Special edition for community members",
      image: "🌿",
      location: "Community Center",
      claimedAt: "2024-01-15"
    },
    {
      id: "tech-conference",
      name: "Tech Conference 2024",
      description: "Claimed at the main stage during keynote",
      image: "💻",
      location: "Convention Center",
      claimedAt: "2024-01-14"
    },
    {
      id: "art-fair",
      name: "Local Art Fair",
      description: "Found at the sculpture exhibit",
      image: "🎨",
      location: "Art Gallery",
      claimedAt: "2024-01-13"
    },
    {
      id: "community-cleanup",
      name: "Community Cleanup",
      description: "Claimed at registration tent",
      image: "🌱",
      location: "City Park",
      claimedAt: "2024-01-12"
    }
  ]

  useEffect(() => {
    const loadUserData = async () => {
      if (!isConnected || !address) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Get user's total claims
        const totalClaims = await getUserTotalClaims(address)
        
        // Check which stamps the user has claimed
        const claimedChecks = await Promise.all(
          allStamps.map(stamp => hasUserClaimed(address, stamp.id))
        )

        const userClaimedStamps = allStamps.filter((stamp, index) => claimedChecks[index])

        setUserStats({
          totalClaimed: totalClaims,
          rank: Math.max(1, 100 - totalClaims) // Mock ranking calculation
        })

        setClaimedStamps(userClaimedStamps)
      } catch (error) {
        console.error('Error loading user data:', error)
        toast.error('Failed to load your stamps')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [isConnected, address, getUserTotalClaims, hasUserClaimed])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">You need to connect your wallet to view your stamps collection.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Loading your stamps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-4">
            My Stamps
          </h1>
          <p className="text-gray-600 text-lg">
            Your digital stamp collection and achievements
          </p>
        </div>

        {/* User Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Stamps */}
            <Card className="bg-white border-2 border-orange-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {userStats.totalClaimed}
                </div>
                <div className="text-sm text-gray-600">Total Stamps Claimed</div>
              </CardContent>
            </Card>

            {/* Rank */}
            <Card className="bg-white border-2 border-purple-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  #{userStats.rank}
                </div>
                <div className="text-sm text-gray-600">Global Rank</div>
              </CardContent>
            </Card>

            {/* Achievement Level */}
            <Card className="bg-white border-2 border-teal-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-teal-500 mb-2">
                  {userStats.totalClaimed >= 10 ? "Expert" : userStats.totalClaimed >= 5 ? "Intermediate" : "Beginner"}
                </div>
                <div className="text-sm text-gray-600">Achievement Level</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Claimed Stamps Collection */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-7 h-7 text-orange-500" />
            <h2 className="text-4xl font-bold text-gray-800">Your Collection</h2>
          </div>

          {claimedStamps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedStamps.map((stamp) => (
                <Card key={stamp.id} className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    {/* Stamp Display */}
                    <div className="relative h-48 bg-gradient-to-br from-orange-400 via-purple-500 to-teal-400 flex items-center justify-center rounded-t-lg">
                      <div className="text-white text-6xl opacity-90 group-hover:scale-110 transition-transform duration-300">
                        {stamp.image}
                      </div>
                      
                      {/* Claimed Badge */}
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Claimed
                      </div>
                    </div>

                    {/* Stamp Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{stamp.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{stamp.description}</p>
                      
                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{stamp.location}</span>
                      </div>

                      {/* Claimed Date */}
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Claimed on {stamp.claimedAt}</span>
                      </div>
                    </div>
                  </CardContent>
              </Card>
          ))}
        </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Stamps Yet</h3>
              <p className="text-gray-600 mb-8">Start claiming stamps to build your collection!</p>
              <Button asChild className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white">
                <a href="/stamps">Explore Stamps</a>
              </Button>
            </div>
          )}
        </section>

        {/* Achievement Progress */}
        <section className="mt-16">
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Achievement Progress</h3>
            
            <div className="space-y-4">
              {/* Beginner Achievement */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${userStats.totalClaimed >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="font-semibold">First Stamp</span>
                </div>
                <span className="text-sm text-gray-500">
                  {userStats.totalClaimed >= 1 ? '✓ Completed' : '1 stamp needed'}
                </span>
              </div>

              {/* Intermediate Achievement */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${userStats.totalClaimed >= 5 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="font-semibold">Collector</span>
                </div>
                <span className="text-sm text-gray-500">
                  {userStats.totalClaimed >= 5 ? '✓ Completed' : `${5 - userStats.totalClaimed} stamps needed`}
                </span>
              </div>

              {/* Advanced Achievement */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${userStats.totalClaimed >= 10 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="font-semibold">Expert Collector</span>
                </div>
                <span className="text-sm text-gray-500">
                  {userStats.totalClaimed >= 10 ? '✓ Completed' : `${10 - userStats.totalClaimed} stamps needed`}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
