"use client"

import { useState, useCallback } from 'react'
import { useStarknet } from '../starknet-provider'
import toast from 'react-hot-toast'

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
      
      // Call the claim_stamp function on the contract
      const result = await contract.claim_stamp(tagId)
      
      // Wait for transaction confirmation
      await account.waitForTransaction(result.transaction_hash)
      
      toast.success('Stamp claimed successfully!')
      return result
    } catch (error) {
      console.error('Error claiming stamp:', error)
      toast.error('Failed to claim stamp: ' + (error.message || 'Unknown error'))
      return null
    } finally {
      setLoading(false)
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

  return {
    claimStamp,
    getTagMetadata,
    getClaimCount,
    hasUserClaimed,
    getUserTotalClaims,
    addTag,
    isOwner,
    loading,
    isConnected
  }
} 