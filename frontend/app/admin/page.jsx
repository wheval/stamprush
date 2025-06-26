"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bell, Upload, Loader2, Shield, AlertTriangle, Globe } from "lucide-react"
import Link from "next/link"
import { useStarknet } from "@/lib/starknet-provider"
import { useStampContract } from "@/lib/hooks/use-stamp-contract"
import { stringToFelt } from "@/lib/config"
import toast from "react-hot-toast"

export default function SubmitTagPage() {
  const { isConnected, address } = useStarknet()
  const { addTag, isOwner, loading, getTagMetadata } = useStampContract()
  
  const [isOwnerCheck, setIsOwnerCheck] = useState(false)
  const [ownerLoading, setOwnerLoading] = useState(true)
  const [tagIdPreview, setTagIdPreview] = useState("")
  const [ipfsLoading, setIpfsLoading] = useState(false)
  const [ipfsStatus, setIpfsStatus] = useState(null)

  const [formData, setFormData] = useState({
    tagName: "",
    tagDescription: "",
    tagLocation: "",
    tagImage: null,
    claimRules: {
      firstComeFirstServed: false,
      limitedClaims: false,
      timeLimited: false,
    },
    numberOfClaims: "",
    startDate: "",
    endDate: "",
  })

  // Generate unique tag ID that doesn't conflict with existing tags
  const generateUniqueTagId = async (baseName) => {
    if (!baseName || !baseName.trim()) {
      return stringToFelt(`tag-${Date.now()}`)
    }

    // Sanitize the base name
    const sanitized = baseName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

    // If sanitization resulted in empty string, use fallback
    const baseId = sanitized || `tag-${Date.now()}`
    
    try {
      // Check if base ID exists
      let candidateId = baseId
      let tagIdFelt = stringToFelt(candidateId)
      let metadata = await getTagMetadata(tagIdFelt)
      
      // If tag doesn't exist (metadata is 0 or null), we can use this ID
      if (!metadata || metadata === '0' || metadata === 0) {
        return tagIdFelt
      }

      // If base ID exists, try with incremental numbers
      let counter = 1
      const maxAttempts = 100 // Safety limit

      while (counter <= maxAttempts) {
        candidateId = `${baseId}-${counter}`
        tagIdFelt = stringToFelt(candidateId)
        metadata = await getTagMetadata(tagIdFelt)
        
        if (!metadata || metadata === '0' || metadata === 0) {
          return tagIdFelt
        }
        
        counter++
      }

      // Fallback to timestamp-based ID if all attempts failed
      const timestampId = `${baseId}-${Date.now()}`
      return stringToFelt(timestampId)

    } catch (error) {
      console.error('Error checking tag existence:', error)
      // Fallback to timestamp-based ID on error
      const timestampId = `${baseId}-${Date.now()}`
      return stringToFelt(timestampId)
    }
  }

  // Upload to IPFS function (secure server-side)
  const uploadToIPFS = async (imageFile, metadata) => {
    try {
      setIpfsLoading(true)
      setIpfsStatus('Preparing upload...')
      
      // Create form data for server-side upload
      const formData = new FormData()
      if (imageFile) {
        formData.append('image', imageFile)
      }
      formData.append('metadata', JSON.stringify(metadata))
      
      setIpfsStatus('Uploading to IPFS...')
      
      // Call our secure server-side API
      const response = await fetch('/api/upload-to-ipfs', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
      
      const result = await response.json()
      
      setIpfsStatus('Upload complete!')
      console.log('✅ IPFS upload successful:', result)
      
      return result
      
    } catch (error) {
      console.error('IPFS upload error:', error)
      setIpfsStatus('Upload failed - using fallback')
      
      // Return fallback for graceful degradation
      return {
        imageUri: null,
        metadataUri: null,
        metadata: metadata,
        fallback: true,
        error: error.message
      }
    } finally {
      setIpfsLoading(false)
      setTimeout(() => setIpfsStatus(null), 3000) // Clear status after 3s
    }
  }

  // Update tag ID preview when tag name changes
  useEffect(() => {
    if (formData.tagName.trim()) {
      const sanitized = formData.tagName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      setTagIdPreview(sanitized || `tag-${Date.now()}`)
    } else {
      setTagIdPreview("")
    }
  }, [formData.tagName])

  // Check if user is owner on mount and when wallet connection changes
  useEffect(() => {
    const checkOwnership = async () => {
      if (!isConnected) {
        console.log('Not connected, setting owner check to false')
        setIsOwnerCheck(false)
        setOwnerLoading(false)
        return
      }

      try {
        setOwnerLoading(true)
        console.log('Checking ownership for address:', address)
        const ownerStatus = await isOwner()
        console.log('Owner status result:', ownerStatus)
        setIsOwnerCheck(ownerStatus)
      } catch (error) {
        console.error('Error checking ownership:', error)
        setIsOwnerCheck(false)
      } finally {
        setOwnerLoading(false)
      }
    }

    checkOwnership()
  }, [isConnected, address, isOwner])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleClaimRuleChange = (rule, checked) => {
    setFormData((prev) => ({
      ...prev,
      claimRules: {
        ...prev.claimRules,
        [rule]: checked,
      },
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        tagImage: file,
      }))
    }
  }

  const validateForm = () => {
    if (!formData.tagName.trim()) {
      toast.error('Tag name is required')
      return false
    }
    if (!formData.tagDescription.trim()) {
      toast.error('Tag description is required')
      return false
    }
    if (formData.claimRules.limitedClaims) {
      if (!formData.numberOfClaims || formData.numberOfClaims.trim() === '') {
        toast.error('Number of claims is required when limited claims is enabled')
        return false
      }
      const claimCount = parseInt(formData.numberOfClaims)
      if (isNaN(claimCount) || claimCount < 1 || claimCount > 1000000) {
        toast.error('Number of claims must be between 1 and 1,000,000')
        return false
      }
    }
    
    // Note: Time limited validation temporarily disabled - using default 30-day period
    // This will be enhanced in future updates with custom date selection
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!isOwnerCheck) {
      toast.error('Only the contract owner can create new stamps')
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      // Generate tag ID from name (felt252)
      const tagId = await generateUniqueTagId(formData.tagName)
      
      // Set max claims (u32) - 0 for unlimited, ensure valid number
      let maxClaims = 0
      if (formData.claimRules.limitedClaims) {
        const parsedClaims = parseInt(formData.numberOfClaims)
        maxClaims = isNaN(parsedClaims) ? 0 : Math.max(0, parsedClaims)
      }
      
      // Set timestamps (u64) - handle time limited vs unlimited
      const now = Math.floor(Date.now() / 1000)
      let startTime = now
      let endTime
      
      if (formData.claimRules.timeLimited) {
        // Time limited: 30 days from now
        endTime = now + (30 * 24 * 60 * 60)
      } else {
        // Unlimited: 1 year from now (effectively unlimited)
        endTime = now + (365 * 24 * 60 * 60)
      }
      
      // Create stamp metadata object
      const stampMetadata = {
        name: formData.tagName,
        description: formData.tagDescription,
        location: formData.tagLocation || '',
        image: formData.tagImage ? formData.tagImage.name : '',
        attributes: {
          maxClaims: maxClaims,
          startTime: startTime,
          endTime: endTime,
          isTimeLimited: formData.claimRules.timeLimited,
          isLimitedClaims: formData.claimRules.limitedClaims,
          isFirstComeFirstServed: formData.claimRules.firstComeFirstServed
        },
        createdAt: new Date().toISOString(),
        version: '1.0'
      }

      console.log('Creating stamp with data:', {
        tagId: tagId.toString(),
        maxClaims,
        startTime,
        endTime,
        metadata: stampMetadata
      })

      // Upload to IPFS first
      toast.loading('Uploading to IPFS...', { id: 'creating-stamp' })
      const ipfsResult = await uploadToIPFS(formData.tagImage, stampMetadata)
      
      // Use IPFS URI as metadata URI, fallback to tag name if IPFS fails
      let metadataUri
      if (ipfsResult.metadataUri) {
        // Convert IPFS URI to felt252 (remove ipfs:// prefix and convert hash)
        const ipfsHash = ipfsResult.metadataUri.replace('ipfs://', '')
        metadataUri = stringToFelt(ipfsHash.substring(0, 31)) // Truncate to fit felt252
        console.log('✅ Using IPFS metadata URI')
      } else {
        // Fallback to tag name if IPFS upload failed or not configured
        metadataUri = stringToFelt(formData.tagName)
        console.log('⚠️ Using fallback metadata URI (tag name)')
        
        if (ipfsResult.fallback) {
          toast('IPFS not configured - using local metadata', { 
            icon: '⚠️',
            duration: 4000
          })
        }
      }

      console.log('IPFS upload result:', ipfsResult)
      console.log('Metadata URI for contract:', metadataUri.toString())

      toast.loading('Creating stamp on blockchain...', { id: 'creating-stamp' })

      // Call the contract
      const result = await addTag(tagId, maxClaims, startTime, endTime, metadataUri)
      
      if (result) {
        toast.dismiss('creating-stamp')
        // Reset form on success
        setFormData({
          tagName: "",
          tagDescription: "",
          tagLocation: "",
          tagImage: null,
          claimRules: {
            firstComeFirstServed: false,
            limitedClaims: false,
            timeLimited: false,
          },
          numberOfClaims: "",
          startDate: "",
          endDate: "",
        })
        setTagIdPreview("")
        toast.success('Stamp created successfully!')
      }
    } catch (error) {
      toast.dismiss('creating-stamp')
      console.error('Error creating stamp:', error)
      
      // Parse error message for specific issues
      let errorMessage = 'Unknown error occurred'
      if (error.message) {
        if (error.message.includes('Tag already exists')) {
          errorMessage = 'Tag ID conflict detected. Please try a different tag name or try again.'
        } else if (error.message.includes('End time less than start time')) {
          errorMessage = 'End time must be after start time'
        } else if (error.message.includes('Metadata URI cannot be zero')) {
          errorMessage = 'Invalid metadata configuration'
        } else if (error.message.includes('argent/multicall-failed')) {
          errorMessage = 'Transaction failed. This might be due to a tag ID conflict or validation error. Please try again with a different tag name.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error('Failed to create stamp: ' + errorMessage)
    }
  }

  // Loading state while checking ownership
  if (ownerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Show connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 shadow-lg">
            <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h2>
            <p className="text-gray-600 mb-6">Please connect your wallet to access the admin panel.</p>
            <Link href="/stamps">
              <Button className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg">
                Go to Stamps
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied if not owner
  if (!isOwnerCheck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-2xl p-8 border-2 border-red-200 shadow-lg">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-2">You are not authorized to access this page.</p>
            <p className="text-sm text-gray-500 mb-6">Only the contract owner can create new stamps.</p>
            <p className="text-xs text-gray-400 mb-4">Connected wallet: {address}</p>
            <Link href="/stamps">
              <Button className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg">
                Go to Stamps
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-orange-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
              Admin Panel
          </h1>
          </div>
          <p className="text-gray-600 text-lg">Create a new stamp tag for the community</p>
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">✓ Verified contract owner: {address}</p>
          </div>
          
          {/* IPFS Status */}
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <p className="text-blue-800 text-sm">
              IPFS Integration: <span className="font-medium">Active</span>
              {ipfsStatus && (
                <span className="ml-2 text-blue-600">- {ipfsStatus}</span>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 shadow-lg shadow-orange-100/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tag Name */}
            <div className="space-y-3">
              <Label htmlFor="tagName" className="text-lg font-semibold text-gray-800">
                Tag Name *
              </Label>
              <Input
                id="tagName"
                type="text"
                placeholder="Enter tag name (e.g., 'Community Event')"
                value={formData.tagName}
                onChange={(e) => handleInputChange("tagName", e.target.value)}
                className="bg-white border-2 border-orange-200 focus:border-orange-500 text-gray-800 placeholder:text-gray-400 rounded-xl p-4 text-lg transition-all duration-200 hover:border-orange-300 focus:shadow-lg focus:shadow-orange-100"
                required
              />
              {tagIdPreview && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Tag ID Preview:</span> {tagIdPreview}
                    <br />
                    <span className="text-blue-600">This will be automatically checked for uniqueness when submitting.</span>
                  </p>
                </div>
              )}
            </div>

            {/* Tag Description */}
            <div className="space-y-3">
              <Label htmlFor="tagDescription" className="text-lg font-semibold text-gray-800">
                Tag Description *
              </Label>
              <Textarea
                id="tagDescription"
                placeholder="Enter tag description"
                value={formData.tagDescription}
                onChange={(e) => handleInputChange("tagDescription", e.target.value)}
                className="bg-white border-2 border-purple-200 focus:border-purple-500 text-gray-800 placeholder:text-gray-400 rounded-xl p-4 text-lg min-h-[120px] transition-all duration-200 hover:border-purple-300 focus:shadow-lg focus:shadow-purple-100"
                required
              />
            </div>

            {/* Tag Location */}
            <div className="space-y-3">
              <Label htmlFor="tagLocation" className="text-lg font-semibold text-gray-800">
                Tag Location
              </Label>
              <Input
                id="tagLocation"
                type="text"
                placeholder="Enter tag location (optional)"
                value={formData.tagLocation}
                onChange={(e) => handleInputChange("tagLocation", e.target.value)}
                className="bg-white border-2 border-teal-200 focus:border-teal-500 text-gray-800 placeholder:text-gray-400 rounded-xl p-4 text-lg transition-all duration-200 hover:border-teal-300 focus:shadow-lg focus:shadow-teal-100"
              />
            </div>

            {/* Tag Image */}
            <div className="space-y-3">
              <Label htmlFor="tagImage" className="text-lg font-semibold text-gray-800">
                Tag Image
              </Label>
              <div className="relative">
                <Input id="tagImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Label
                  htmlFor="tagImage"
                  className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-purple-50 border-2 border-dashed border-orange-300 text-gray-600 p-6 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-100 hover:to-purple-100 transition-all duration-200 group"
                >
                  <Upload className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors" />
                  <span className="text-lg">
                    {formData.tagImage ? formData.tagImage.name : "Upload tag image (optional)"}
                  </span>
                </Label>
              </div>
            </div>

            {/* Claim Rules */}
            <div className="space-y-6">
              <Label className="text-lg font-semibold text-gray-800">Claim Rules</Label>
              <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-6 rounded-xl border-2 border-purple-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <Checkbox
                      id="firstCome"
                      checked={formData.claimRules.firstComeFirstServed}
                      onCheckedChange={(checked) => handleClaimRuleChange("firstComeFirstServed", checked)}
                      className="border-2 border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <Label htmlFor="firstCome" className="text-gray-800 text-lg cursor-pointer">
                      First-come, first-served
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <Checkbox
                      id="limitedClaims"
                      checked={formData.claimRules.limitedClaims}
                      onCheckedChange={(checked) => handleClaimRuleChange("limitedClaims", checked)}
                      className="border-2 border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <Label htmlFor="limitedClaims" className="text-gray-800 text-lg cursor-pointer">
                      Limited number of claims
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <Checkbox
                      id="timeLimited"
                      checked={formData.claimRules.timeLimited}
                      onCheckedChange={(checked) => handleClaimRuleChange("timeLimited", checked)}
                      className="border-2 border-teal-300 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                    />
                    <Label htmlFor="timeLimited" className="text-gray-800 text-lg cursor-pointer">
                      Time-limited claim
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Number of Claims */}
            {formData.claimRules.limitedClaims && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <Label htmlFor="numberOfClaims" className="text-lg font-semibold text-gray-800">
                  Number of Claims *
                </Label>
                <Input
                  id="numberOfClaims"
                  type="number"
                  min="1"
                  max="1000000"
                  placeholder="Enter number of claims (1-1,000,000)"
                  value={formData.numberOfClaims}
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow numbers and empty string
                    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 1000000)) {
                      handleInputChange("numberOfClaims", value)
                    }
                  }}
                  className="bg-white border-2 border-purple-200 focus:border-purple-500 text-gray-800 placeholder:text-gray-400 rounded-xl p-4 text-lg transition-all duration-200 hover:border-purple-300 focus:shadow-lg focus:shadow-purple-100"
                  required
                />
              </div>
            )}

            {/* Date Range */}
            {formData.claimRules.timeLimited && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <Label className="text-lg font-semibold text-gray-800">Time Settings</Label>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    ℹ️ Time-limited stamps will be active for 30 days from creation. 
                    Advanced time settings will be available in future updates.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-8">
              <Button
                type="submit"
                disabled={loading || ipfsLoading}
                className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading || ipfsLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {ipfsLoading ? 'Uploading to IPFS...' : 'Creating Stamp...'}
                  </>
                ) : (
                  "Create Stamp"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
