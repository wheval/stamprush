"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Crown, Star, Medal, Loader2 } from "lucide-react"
import { useStarknet } from "@/lib/starknet-provider"
import { useStampContract } from "@/lib/hooks/use-stamp-contract"

export default function LeaderboardPage() {
  const { isConnected, address } = useStarknet()
  const { getUserTotalClaims } = useStampContract()
  
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState(null)

  // Mock user addresses for demonstration - replace with actual user data
  const mockUsers = [
    { address: "0x1234...5678", name: "CryptoExplorer", totalStamps: 25 },
    { address: "0x2345...6789", name: "StampCollector", totalStamps: 22 },
    { address: "0x3456...7890", name: "BlockchainFan", totalStamps: 18 },
    { address: "0x4567...8901", name: "NFTHunter", totalStamps: 15 },
    { address: "0x5678...9012", name: "DigitalNomad", totalStamps: 12 },
    { address: "0x6789...0123", name: "TechSavvy", totalStamps: 10 },
    { address: "0x7890...1234", name: "InnovateMind", totalStamps: 8 },
    { address: "0x8901...2345", name: "FutureBuilder", totalStamps: 6 },
    { address: "0x9012...3456", name: "Web3Pioneer", totalStamps: 4 },
    { address: "0x0123...4567", name: "StampRookie", totalStamps: 2 }
  ]

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)

        // For demonstration, we'll use mock data
        // In a real implementation, you would:
        // 1. Get all user addresses from your backend/indexer
        // 2. Call getUserTotalClaims for each user
        // 3. Sort by total claims
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Sort by total stamps (descending)
        const sortedUsers = [...mockUsers].sort((a, b) => b.totalStamps - a.totalStamps)
        
        // Add rank to each user
        const leaderboardWithRanks = sortedUsers.map((user, index) => ({
          ...user,
          rank: index + 1
        }))

        setLeaderboard(leaderboardWithRanks)

        // Find current user's rank if connected
        if (isConnected && address) {
          const userIndex = leaderboardWithRanks.findIndex(user => 
            user.address.toLowerCase() === address.toLowerCase()
          )
          setUserRank(userIndex !== -1 ? userIndex + 1 : null)
        }

      } catch (error) {
        console.error('Error loading leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [isConnected, address, getUserTotalClaims])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Trophy className="w-5 h-5 text-gray-400" />
    }
  }

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <main className="px-6 py-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            See who's leading the stamp collection race!
          </p>
        </div>

        {/* User's Current Rank */}
        {isConnected && userRank && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-orange-100 to-purple-100 border-2 border-orange-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Current Rank</h3>
                <div className="flex items-center justify-center gap-3">
                  {getRankIcon(userRank)}
                  <span className="text-2xl font-bold text-orange-600">#{userRank}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Top 3 Champions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboard.slice(0, 3).map((user, index) => (
              <Card 
                key={user.address} 
                className={`${
                  index === 0 ? 'md:order-2 transform md:scale-110' : 
                  index === 1 ? 'md:order-1' : 'md:order-3'
                } bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${getRankBadgeColor(user.rank)}`}>
                    <span className="text-lg font-bold">#{user.rank}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{user.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-xl font-bold text-orange-600">{user.totalStamps}</span>
                    <span className="text-sm text-gray-600">stamps</span>
            </div>
                </CardContent>
              </Card>
          ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Full Rankings</h2>
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <Card 
                key={user.address}
                className={`bg-white border shadow-sm hover:shadow-md transition-all duration-300 ${
                  isConnected && address && user.address.toLowerCase() === address.toLowerCase() 
                    ? 'ring-2 ring-orange-300 bg-orange-50' 
                    : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankBadgeColor(user.rank)}`}>
                        <span className="font-bold text-sm">#{user.rank}</span>
                      </div>
                      
                      {/* User Info */}
                      <div>
                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-500">
                          {user.address.slice(0, 6)}...{user.address.slice(-4)}
                        </p>
                      </div>
                      
                      {/* Current User Indicator */}
                      {isConnected && address && user.address.toLowerCase() === address.toLowerCase() && (
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          You
                        </span>
                      )}
            </div>

                    {/* Stamps Count */}
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-bold text-orange-600">{user.totalStamps}</span>
                      <span className="text-sm text-gray-600">stamps</span>
                    </div>
            </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-orange-100 to-purple-100 border-2 border-orange-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Want to climb the ranks?</h3>
              <p className="text-gray-600 mb-6">
                Collect more stamps to improve your position on the leaderboard!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/stamps" 
                  className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Explore Stamps
                </a>
                <a 
                  href="/my-stamps" 
                  className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
                  View My Collection
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
