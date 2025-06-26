"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Clock, Zap, MapPin, Users, Loader2, Tag, Calendar, Globe, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Confetti from "@/components/Confetti"
import { useStarknet } from "@/lib/starknet-provider"
import { useStampContract } from "@/lib/hooks/use-stamp-contract"
import { stringToFelt } from "@/lib/config"
import toast from "react-hot-toast"

export default function StampsPage() {
  const { isConnected, address } = useStarknet()
  const { 
    claimStamp, 
    getTagInfo,
    getAllAvailableStamps,
    hasUserClaimed, 
    loading: contractLoading,
    contract
  } = useStampContract()

  // State for blockchain stamps
  const [stamps, setStamps] = useState([])
  const [loading, setLoading] = useState(true)
  const [claimingStamps, setClaimingStamps] = useState(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState(null)

  // Known tag IDs - these are the actual stamps that have been created
  const knownTagIds = [
    stringToFelt("city-walker") // Your actual created stamp
  ]

  // Debug: Log the exact tag ID being searched
  console.log('🔍 Debug - "city-walker" converts to:', stringToFelt("city-walker").toString())

  // Load all available stamps from blockchain
  const loadStamps = async () => {
    if (!isConnected) {
      console.log('❌ Not connected to wallet')
      setLoading(false)
      return
    }

    if (!contract) {
      console.log('❌ Contract not initialized yet')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Loading stamps from blockchain...')
      console.log('📋 Known tag IDs to search:', knownTagIds.map(id => id.toString()))
      
      // Get all available stamps with their metadata
      const availableStamps = await getAllAvailableStamps(knownTagIds)
      
      console.log('📦 Retrieved stamps from blockchain:', availableStamps)
      console.log(`📊 Total stamps found: ${availableStamps.length}`)

      if (availableStamps.length === 0) {
        console.log('⚠️ No stamps found for the given tag IDs')
        console.log('💡 Try creating a stamp in the admin panel first')
        setStamps([])
        return
      }

      // Check claim status for each stamp
      console.log('🔍 Checking claim status for each stamp...')
      const stampsWithClaimStatus = await Promise.all(
        availableStamps.map(async (stamp, index) => {
          try {
            console.log(`📝 Processing stamp ${index + 1}/${availableStamps.length}:`, {
              tagId: stamp.tagId.toString(),
              hasMetadata: !!stamp.metadata,
              metadataName: stamp.metadata?.name,
              isActive: stamp.isActive
            })

            const userClaimed = await hasUserClaimed(address, stamp.tagId)
            
            const processedStamp = {
              ...stamp,
              userClaimed,
              // Calculate time remaining
              timeRemaining: Math.max(0, stamp.endTime - Math.floor(Date.now() / 1000)),
              // Use metadata for display or fallback
              displayName: stamp.metadata?.name || `Stamp ${stamp.tagId.toString().slice(0, 8)}`,
              displayDescription: stamp.metadata?.description || 'A unique stamp for the community',
              displayLocation: stamp.metadata?.location || 'Unknown location',
              displayImage: stamp.metadata?.image || null,
              // Additional metadata
              category: stamp.metadata?.attributes?.category || 'general',
              isLimited: stamp.maxClaims > 0,
              remainingClaims: stamp.maxClaims > 0 ? Math.max(0, stamp.maxClaims - stamp.claimCount) : Infinity
            }

            console.log(`✅ Processed stamp:`, {
              displayName: processedStamp.displayName,
              userClaimed: processedStamp.userClaimed,
              timeRemaining: processedStamp.timeRemaining,
              isActive: processedStamp.isActive
            })

            return processedStamp
          } catch (error) {
            console.error(`❌ Error checking claim status for stamp ${stamp.tagId}:`, error)
            return {
              ...stamp,
              userClaimed: false,
              timeRemaining: Math.max(0, stamp.endTime - Math.floor(Date.now() / 1000)),
              displayName: `Stamp ${stamp.tagId.toString().slice(0, 8)}`,
              displayDescription: 'A unique stamp for the community',
              displayLocation: 'Unknown location',
              displayImage: null,
              category: 'general',
              isLimited: stamp.maxClaims > 0,
              remainingClaims: stamp.maxClaims > 0 ? Math.max(0, stamp.maxClaims - stamp.claimCount) : Infinity
            }
          }
        })
      )

      // Sort stamps: unclaimed first, then by remaining time
      const sortedStamps = stampsWithClaimStatus.sort((a, b) => {
        if (a.userClaimed !== b.userClaimed) {
          return a.userClaimed ? 1 : -1 // Unclaimed first
        }
        return a.timeRemaining - b.timeRemaining // Expiring sooner first
      })

      console.log('🎯 Final sorted stamps:', sortedStamps.map(s => ({
        name: s.displayName,
        claimed: s.userClaimed,
        timeLeft: s.timeRemaining
      })))

      setStamps(sortedStamps)
      console.log('✅ Stamps loaded successfully:', sortedStamps.length)

      } catch (error) {
      console.error('❌ Error loading stamps:', error)
      setError(`Failed to load stamps: ${error.message}`)
      toast.error('Failed to load stamps')
      } finally {
      setLoading(false)
      }
    }

  // Load stamps on component mount and when connection changes
  useEffect(() => {
    loadStamps()
  }, [isConnected, address, contract])

  // Handle stamp claiming
  const handleClaim = async (stamp) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (stamp.userClaimed) {
      toast.error('You have already claimed this stamp')
      return
    }

    if (stamp.remainingClaims <= 0) {
      toast.error('No more claims available for this stamp')
      return
    }

    if (stamp.timeRemaining <= 0) {
      toast.error('This stamp has expired')
      return
    }

    // Add to claiming set immediately
    setClaimingStamps(prev => new Set([...prev, stamp.tagId]))
    
    try {
      console.log(`🎯 Starting claim process for stamp: ${stamp.displayName}`)
      
      const result = await claimStamp(stamp.tagId)
      
      if (result) {
        console.log('✅ Claim successful, updating local state')
        
        // Update local state
        setStamps(prevStamps => 
          prevStamps.map(s => 
            s.tagId === stamp.tagId 
              ? { 
                  ...s, 
                  userClaimed: true, 
                  claimCount: s.claimCount + 1,
                  remainingClaims: s.isLimited ? Math.max(0, s.remainingClaims - 1) : Infinity
                }
              : s
          )
        )
        
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else {
        console.log('❌ Claim failed or was cancelled')
      }
    } catch (error) {
      console.error('❌ Error in handleClaim:', error)
      // Error is already handled in claimStamp function
    } finally {
      // Always remove from claiming set, regardless of success or failure
      setClaimingStamps(prev => {
        const newSet = new Set(prev)
        newSet.delete(stamp.tagId)
        return newSet
      })
      console.log('🏁 Claim process completed, loading state cleared')
    }
  }

  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return 'Expired'
    
    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6F00]" />
          <p className="text-gray-600">Loading stamps from blockchain...</p>
        </div>
      </div>
    )
  }

  // Connection prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-2xl p-8 border-2 border-[#FF6F00]/20 shadow-lg">
            <Tag className="w-16 h-16 text-[#FF6F00] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">Connect your wallet to view and claim available stamps.</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] hover:from-[#FF6F00]/90 hover:to-[#9C27B0]/90 text-white px-6 py-2 rounded-lg">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-2xl p-8 border-2 border-red-200 shadow-lg">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Stamps</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={loadStamps}
              className="bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] hover:from-[#FF6F00]/90 hover:to-[#9C27B0]/90 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FF6F00] mb-2">Available Stamps</h1>
            <p className="text-gray-600">Discover and claim stamps from the blockchain</p>
            </div>
          <Button 
            onClick={loadStamps}
            disabled={loading}
            className="bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] hover:from-[#FF6F00]/90 hover:to-[#9C27B0]/90 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-[#FF6F00]/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Tag className="w-8 h-8 text-[#FF6F00]" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stamps.length}</p>
                  <p className="text-gray-600">Available Stamps</p>
                </div>
          </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-[#9C27B0]/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-[#9C27B0]" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stamps.filter(s => s.userClaimed).length}</p>
                  <p className="text-gray-600">Claimed by You</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-[#00C9A7]/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-[#00C9A7]" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stamps.filter(s => !s.userClaimed && s.timeRemaining > 0).length}</p>
                  <p className="text-gray-600">Available to Claim</p>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>

        {/* Stamps Grid */}
        {stamps.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No Stamps Available</h3>
            <p className="text-gray-400 mb-6">Check back later for new stamps to claim.</p>
            <Button 
              onClick={() => {
                console.log('🔄 Manual refresh triggered')
                loadStamps()
              }}
              variant="outline"
              className="border-[#FF6F00] text-[#FF6F00] hover:bg-[#FF6F00]/10"
            >
              <Globe className="w-4 h-4 mr-2" />
              Refresh
            </Button>
                  </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stamps.map((stamp) => (
              <Card 
                key={stamp.tagId} 
                className={`bg-white border-2 transition-all duration-300 hover:shadow-lg ${
                  stamp.userClaimed 
                    ? 'border-green-200 bg-green-50' 
                    : stamp.timeRemaining <= 0 
                    ? 'border-gray-200 bg-gray-50' 
                    : 'border-[#FF6F00]/20 hover:border-[#FF6F00]/40'
                }`}
              >
                <CardContent className="p-6">
                  {/* Stamp Image */}
                  <div className="w-full h-32 bg-gradient-to-br from-[#FF6F00]/10 to-[#9C27B0]/10 rounded-lg mb-4 flex items-center justify-center">
                    {stamp.displayImage ? (
                      <Image 
                        src={stamp.displayImage} 
                        alt={stamp.displayName}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <Tag className="w-12 h-12 text-[#FF6F00]" />
                    )}
                  </div>

                  {/* Stamp Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{stamp.displayName}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{stamp.displayDescription}</p>
                    </div>

                    {/* Location */}
                    {stamp.displayLocation && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{stamp.displayLocation}</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{stamp.claimCount} claimed</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeRemaining(stamp.timeRemaining)}</span>
                      </div>
                    </div>

                    {/* Claims remaining */}
                    {stamp.isLimited && (
                      <div className="text-sm text-[#9C27B0] font-medium">
                        {stamp.remainingClaims} claims remaining
                  </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => handleClaim(stamp)}
                      disabled={
                        stamp.userClaimed || 
                        stamp.timeRemaining <= 0 || 
                        stamp.remainingClaims <= 0 ||
                        claimingStamps.has(stamp.tagId)
                      }
                      className={`w-full ${
                        stamp.userClaimed
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : stamp.timeRemaining <= 0 || stamp.remainingClaims <= 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] hover:from-[#FF6F00]/90 hover:to-[#9C27B0]/90 text-white'
                      }`}
                    >
                      {claimingStamps.has(stamp.tagId) ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Claiming...
                        </>
                      ) : stamp.userClaimed ? (
                        'Claimed ✓'
                      ) : stamp.timeRemaining <= 0 ? (
                        'Expired'
                      ) : stamp.remainingClaims <= 0 ? (
                        'Sold Out'
                      ) : (
                        'Claim Stamp'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
              </div>
            )}
          </div>
    </div>
  )
}
