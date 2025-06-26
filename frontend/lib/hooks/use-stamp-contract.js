"use client"

import { useState, useCallback } from 'react'
import { useStarknet } from '../starknet-provider'
import { feltToString } from '../config'
import toast from 'react-hot-toast'

// IPFS utility functions
const fetchFromIPFS = async (ipfsHash) => {
  try {
    // Try multiple IPFS gateways for reliability
    const gateways = [
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      `https://ipfs.io/ipfs/${ipfsHash}`,
      `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`
    ]

    for (const gateway of gateways) {
      try {
        const response = await fetch(gateway, {
          headers: {
            'Accept': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`✅ Successfully fetched from ${gateway}`)
          return data
        }
      } catch (gatewayError) {
        console.warn(`Gateway ${gateway} failed:`, gatewayError.message)
        continue
      }
    }
    
    throw new Error('All IPFS gateways failed')
  } catch (error) {
    console.error('Error fetching from IPFS:', error)
    return null
  }
}

const convertFeltToIPFSHash = (feltMetadataUri) => {
  try {
    // Convert felt252 back to string (this should be the IPFS hash)
    const metadataString = feltToString(feltMetadataUri)
    
    // If it looks like an IPFS hash (starts with Qm or ba), return it
    if (metadataString.match(/^(Qm|ba)[a-zA-Z0-9]{44,}$/)) {
      return metadataString
    }
    
    // Otherwise, it might be a tag name fallback
    return null
  } catch (error) {
    console.error('Error converting felt to IPFS hash:', error)
    return null
  }
}

export function useStampContract() {
  const { contract, account, address, isConnected } = useStarknet()
  const [loading, setLoading] = useState(false)

  // Claim a stamp
  const claimStamp = useCallback(async (tagId) => {
    if (!contract || !account || !isConnected) {
      toast.error('Please connect your wallet first')
      return null
    }

    try {
      setLoading(true)
      console.log(`🎯 Starting claim for tag: ${tagId.toString()}`)
      
      // Call the claim_stamp function on the contract
      console.log('📞 Calling contract.claim_stamp...')
      const result = await contract.claim_stamp(tagId)
      console.log('✅ Contract call successful:', result)
      
      // Wait for transaction confirmation
      console.log('⏳ Waiting for transaction confirmation...')
      await account.waitForTransaction(result.transaction_hash)
      console.log('🎉 Transaction confirmed!')
      
      toast.success('Stamp claimed successfully!')
      return result
    } catch (error) {
      console.error('❌ Error claiming stamp:', error)
      
      // Handle specific error types
      if (error.message?.includes('Already claimed')) {
        toast.error('You have already claimed this stamp')
      } else if (error.message?.includes('Tag claim period ended')) {
        toast.error('This stamp has expired')
      } else if (error.message?.includes('Max claims reached')) {
        toast.error('No more claims available')
      } else if (error.message?.includes('Tag not yet available')) {
        toast.error('This stamp is not yet available')
      } else if (error.message?.includes('Tag does not exist')) {
        toast.error('This stamp does not exist')
      } else {
        toast.error('Failed to claim stamp: ' + (error.message || 'Unknown error'))
      }
      
      return null
    } finally {
      setLoading(false)
      console.log('🏁 Claim attempt completed')
    }
  }, [contract, account, isConnected])

  // Get tag metadata
  const getTagMetadata = useCallback(async (tagId) => {
    if (!contract) {
      console.error('Contract not initialized')
      return null
    }

    try {
      const metadata = await contract.get_tag_metadata(tagId)
      return metadata
    } catch (error) {
      console.error('Error getting tag metadata:', error)
      return null
    }
  }, [contract])

  // Get claim count for a tag
  const getClaimCount = useCallback(async (tagId) => {
    if (!contract) {
      console.error('Contract not initialized')
      return 0
    }

    try {
      const count = await contract.get_claim_count(tagId)
      return Number(count)
    } catch (error) {
      console.error('Error getting claim count:', error)
      return 0
    }
  }, [contract])

  // Check if user has claimed a specific tag
  const hasUserClaimed = useCallback(async (userAddress, tagId) => {
    if (!contract) {
      console.error('Contract not initialized')
      return false
    }

    try {
      const claimed = await contract.has_user_claimed(userAddress || address, tagId)
      return Boolean(claimed)
    } catch (error) {
      console.error('Error checking if user claimed:', error)
      return false
    }
  }, [contract, address])

  // Get total claims for a user
  const getUserTotalClaims = useCallback(async (userAddress) => {
    if (!contract) {
      console.error('Contract not initialized')
      return 0
    }

    try {
      const total = await contract.get_user_total_claims(userAddress || address)
      return Number(total)
    } catch (error) {
      console.error('Error getting user total claims:', error)
      return 0
    }
  }, [contract, address])

  // Check if current user is the contract owner
  const isOwner = useCallback(async () => {
    if (!address) {
      console.log('No address available')
      return false
    }

    // Hardcoded admin address for comparison
    const adminAddress = "0x7d14d37ef367bf4d6ce1bc84cd4f0ec74704963e976240ad64e6eb9572d8a9"
    
    // Normalize addresses for comparison
    const normalizeAddress = (addr) => {
      if (!addr) return ''
      let normalized = addr.toString().toLowerCase()
      if (!normalized.startsWith('0x')) {
        normalized = '0x' + normalized
      }
      return normalized
    }

    const normalizedAddress = normalizeAddress(address)
    const normalizedAdmin = normalizeAddress(adminAddress)
    
    console.log('Connected address:', normalizedAddress)
    console.log('Admin address:', normalizedAdmin)
    console.log('Is admin:', normalizedAddress === normalizedAdmin)
    
    return normalizedAddress === normalizedAdmin
  }, [address])

  // Add a new tag (admin only)
  const addTag = useCallback(async (tagId, maxClaims, startTime, endTime, metadataUri) => {
    if (!account || !isConnected) {
      toast.error('Please connect your wallet first')
      return null
    }

    if (!contract) {
      toast.error('Contract not available. Please check contract address configuration.')
      return null
    }

    try {
      setLoading(true)
      
      console.log('Calling add_tag with params:', {
        tagId: tagId.toString(),
        maxClaims,
        startTime,
        endTime,
        metadataUri: metadataUri.toString()
      })
      
      // Call the add_tag function on the contract
      const result = await contract.add_tag(tagId, maxClaims, startTime, endTime, metadataUri)
      
      console.log('Transaction result:', result)
      console.log('Transaction hash:', result.transaction_hash)
      
      // Show immediate success and optionally wait for confirmation in background
      toast.success('Tag submitted successfully! Transaction hash: ' + result.transaction_hash.slice(0, 10) + '...')
      
      // Wait for transaction confirmation in background (don't block UI)
      account.waitForTransaction(result.transaction_hash)
        .then(() => {
          console.log('Transaction confirmed successfully')
          toast.success('Tag creation confirmed on blockchain!')
        })
        .catch((confirmError) => {
          console.warn('Transaction confirmation issue:', confirmError)
          // Transaction was likely successful even if confirmation failed
          console.log('Transaction was submitted but confirmation failed - this is often normal')
        })
      
      return result
    } catch (error) {
      console.error('Error adding tag:', error)
      toast.error('Failed to add tag: ' + (error.message || 'Unknown error'))
      return null
    } finally {
      setLoading(false)
    }
  }, [contract, account, isConnected])

  // Get comprehensive tag info including metadata from IPFS
  const getTagInfo = useCallback(async (tagId) => {
    if (!contract) {
      console.error('Contract not initialized')
      return null
    }

    try {
      console.log(`🔍 Getting tag info for: ${tagId.toString()}`)
      
      // Get tag info from blockchain (max_claims, start_time, end_time, metadata_uri, claim_count)
      const tagInfo = await contract.get_tag_info(tagId)
      
      console.log(`📋 Raw tag info from contract:`, tagInfo)
      
      if (!tagInfo) {
        console.log(`⚠️ No tag info returned for ${tagId.toString()}`)
        return null
      }

      // Extract values from the returned tuple - handle both array and object formats
      let maxClaims, startTime, endTime, metadataUri, claimCount
      
      try {
        // Handle both array format [0, 1, 2, 3, 4] and object format {0: val, 1: val, ...}
        if (Array.isArray(tagInfo)) {
          [maxClaims, startTime, endTime, metadataUri, claimCount] = tagInfo
        } else if (typeof tagInfo === 'object' && tagInfo !== null) {
          // Handle object format from Starknet.js
          maxClaims = tagInfo[0] || tagInfo['0']
          startTime = tagInfo[1] || tagInfo['1'] 
          endTime = tagInfo[2] || tagInfo['2']
          metadataUri = tagInfo[3] || tagInfo['3']
          claimCount = tagInfo[4] || tagInfo['4']
        } else {
          throw new Error('Unexpected tagInfo format')
        }

        // Check if this is an empty/non-existent tag (all values are 0)
        if (Number(maxClaims) === 0 && Number(startTime) === 0 && Number(endTime) === 0 && 
            Number(metadataUri) === 0 && Number(claimCount) === 0) {
          console.log(`❌ Tag ${tagId.toString()} doesn't exist (all values are 0)`)
          return null
        }
      } catch (destructureError) {
        console.error(`❌ Error destructuring tag info for ${tagId.toString()}:`, destructureError)
        console.log('Tag info received:', tagInfo)
        return null
      }

      console.log(`📊 Parsed tag info for ${tagId.toString()}:`, {
        maxClaims: Number(maxClaims),
        startTime: Number(startTime),
        endTime: Number(endTime),
        metadataUri: metadataUri?.toString(),
        claimCount: Number(claimCount),
        currentTime: Math.floor(Date.now() / 1000),
        isActive: Date.now() / 1000 < Number(endTime)
      })

      // Try to fetch metadata from IPFS
      let metadata = null
      const ipfsHash = convertFeltToIPFSHash(metadataUri)
      
      if (ipfsHash) {
        console.log(`🔍 Fetching metadata from IPFS: ${ipfsHash}`)
        metadata = await fetchFromIPFS(ipfsHash)
      } else {
        console.log(`⚠️ No valid IPFS hash found in metadata URI: ${metadataUri?.toString()}`)
      }

      // Return comprehensive tag information
      const result = {
        tagId,
        maxClaims: Number(maxClaims),
        startTime: Number(startTime),
        endTime: Number(endTime),
        claimCount: Number(claimCount),
        metadataUri: metadataUri?.toString() || '',
        ipfsHash,
        metadata,
        isActive: Date.now() / 1000 < Number(endTime),
        hasMetadata: !!metadata
      }

      console.log(`✅ Final tag info for ${tagId.toString()}:`, result)
      return result

    } catch (error) {
      console.error(`❌ Error getting tag info for ${tagId.toString()}:`, error)
      
      // Check if it's a "tag not found" type error
      if (error.message && error.message.includes('EntryPoint')) {
        console.log(`💡 Tag ${tagId.toString()} likely doesn't exist on the blockchain yet`)
      }
      
      return null
    }
  }, [contract])

  // Get all available tags (simplified approach using known tag IDs)
  const getAllAvailableStamps = useCallback(async (knownTagIds = []) => {
    if (!contract) {
      console.error('Contract not initialized')
      return []
    }

    try {
      setLoading(true)
      const stamps = []
      
      console.log(`🔍 Checking ${knownTagIds.length} known tag IDs...`)

      // For each known tag ID, get its info
      for (let i = 0; i < knownTagIds.length; i++) {
        const tagId = knownTagIds[i]
        console.log(`📝 Checking tag ${i + 1}/${knownTagIds.length}: ${tagId.toString()}`)
        
        try {
          const tagInfo = await getTagInfo(tagId)
          
          if (tagInfo) {
            console.log(`✅ Tag found: ${tagInfo.displayName || 'Unknown'} (Active: ${tagInfo.isActive})`)
            
            // Include both active and inactive stamps for now (let the UI decide what to show)
            stamps.push(tagInfo)
          } else {
            console.log(`❌ Tag ${tagId.toString()} not found or invalid`)
          }
        } catch (error) {
          console.warn(`⚠️ Failed to get info for tag ${tagId.toString()}:`, error.message)
        }
      }

      console.log(`📊 Final result: Found ${stamps.length} stamps total`)
      console.log(`📋 Active stamps: ${stamps.filter(s => s.isActive).length}`)
      console.log(`📋 Inactive stamps: ${stamps.filter(s => !s.isActive).length}`)

      return stamps
    } catch (error) {
      console.error('Error getting all stamps:', error)
      return []
    } finally {
      setLoading(false)
    }
  }, [contract, getTagInfo])

  return {
    claimStamp,
    getTagMetadata,
    getTagInfo,
    getAllAvailableStamps,
    getClaimCount,
    hasUserClaimed,
    getUserTotalClaims,
    addTag,
    isOwner,
    loading,
    isConnected,
    contract,
    // IPFS utilities
    fetchFromIPFS,
    convertFeltToIPFSHash
  }
} 