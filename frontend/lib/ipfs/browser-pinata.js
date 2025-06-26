/**
 * Browser-compatible Pinata IPFS Upload Module for Stamp Rush
 * Handles uploading images and JSON metadata to IPFS via Pinata API in the browser
 */

/**
 * Upload an image file to IPFS via Pinata (browser-compatible)
 * @param {File} file - Image file from browser file input
 * @param {Object} options - Optional upload parameters
 * @returns {Promise<string>} IPFS URI (ipfs://<CID>)
 */
export async function uploadImageToIPFS(file, options = {}) {
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
  const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET
  
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    throw new Error('Pinata API credentials not found. Please check your environment variables.')
  }

  try {
    console.log(`📤 Uploading image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)

    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    
    // Pin options
    const pinataOptions = {
      cidVersion: 1,
    }
    
    // Pin metadata
    const pinataMetadata = {
      name: options.name || file.name,
      keyvalues: {
        type: 'image',
        uploadedAt: new Date().toISOString(),
        project: 'stamp-rush',
        originalName: file.name,
        size: file.size.toString(),
        ...options.metadata
      }
    }

    formData.append('pinataOptions', JSON.stringify(pinataOptions))
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata))

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET,
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Pinata API error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()
    const ipfsHash = result.IpfsHash
    const ipfsUri = `ipfs://${ipfsHash}`
    
    console.log('✅ Image uploaded successfully!')
    console.log(`🔗 IPFS URI: ${ipfsUri}`)
    console.log(`🌐 Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`)

    return ipfsUri

  } catch (error) {
    console.error('❌ Image upload failed:', error.message)
    throw new Error(`Failed to upload image to IPFS: ${error.message}`)
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata (browser-compatible)
 * @param {Object} metadata - JSON object to upload
 * @param {Object} options - Optional upload parameters
 * @returns {Promise<string>} IPFS URI (ipfs://<CID>)
 */
export async function uploadJSONToIPFS(metadata, options = {}) {
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
  const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET
  
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    throw new Error('Pinata API credentials not found. Please check your environment variables.')
  }

  try {
    // Validate metadata
    if (!metadata || typeof metadata !== 'object') {
      throw new Error('Invalid metadata: must be a valid object')
    }

    const fileName = options.name || `metadata-${Date.now()}.json`
    
    console.log(`📤 Uploading JSON metadata: ${fileName}`)
    console.log('📄 Metadata preview:', JSON.stringify(metadata, null, 2))

    // Pin options
    const pinataOptions = {
      cidVersion: 1,
    }
    
    // Pin metadata
    const pinataMetadata = {
      name: fileName,
      keyvalues: {
        type: 'json',
        uploadedAt: new Date().toISOString(),
        project: 'stamp-rush'
      }
    }

    const requestBody = {
      pinataOptions,
      pinataMetadata,
      pinataContent: metadata
    }

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET,
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Pinata API error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()
    const ipfsHash = result.IpfsHash
    const ipfsUri = `ipfs://${ipfsHash}`
    
    console.log('✅ JSON metadata uploaded successfully!')
    console.log(`🔗 IPFS URI: ${ipfsUri}`)
    console.log(`🌐 Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`)

    return ipfsUri

  } catch (error) {
    console.error('❌ JSON upload failed:', error.message)
    throw new Error(`Failed to upload JSON to IPFS: ${error.message}`)
  }
}

/**
 * Upload complete stamp metadata (image + JSON) - browser compatible
 * @param {File} imageFile - Image file from browser input
 * @param {Object} stampData - Stamp metadata
 * @returns {Promise<Object>} Complete metadata with IPFS URIs
 */
export async function uploadStampMetadata(imageFile, stampData) {
  try {
    console.log('🚀 Starting complete stamp metadata upload...')
    
    let imageUri = null
    
    // Upload image if provided
    if (imageFile) {
      console.log('📸 Uploading stamp image...')
      imageUri = await uploadImageToIPFS(imageFile, {
        name: `stamp-${stampData.name.toLowerCase().replace(/\s+/g, '-')}-image`
      })
    }
    
    // Prepare complete metadata
    const completeMetadata = {
      ...stampData,
      image: imageUri, // Add IPFS image URI to metadata
      external_url: imageUri ? `https://gateway.pinata.cloud/ipfs/${imageUri.replace('ipfs://', '')}` : null,
    }
    
    // Upload metadata JSON
    console.log('📄 Uploading stamp metadata...')
    const metadataUri = await uploadJSONToIPFS(completeMetadata, {
      name: `stamp-${stampData.name.toLowerCase().replace(/\s+/g, '-')}-metadata.json`
    })
    
    const result = {
      imageUri,
      metadataUri,
      metadata: completeMetadata,
      gatewayUrls: {
        image: imageUri ? `https://gateway.pinata.cloud/ipfs/${imageUri.replace('ipfs://', '')}` : null,
        metadata: `https://gateway.pinata.cloud/ipfs/${metadataUri.replace('ipfs://', '')}`
      }
    }
    
    console.log('🎉 Complete stamp metadata upload finished!')
    console.log('📊 Upload result:', result)
    
    return result
    
  } catch (error) {
    console.error('❌ Complete stamp upload failed:', error.message)
    throw new Error(`Failed to upload stamp metadata: ${error.message}`)
  }
}

/**
 * Test connection to Pinata API
 * @returns {Promise<boolean>} Connection status
 */
export async function testPinataConnection() {
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
  const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET
  
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    console.error('❌ Pinata API credentials not found')
    return false
  }

  try {
    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET,
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Pinata connection test successful:', data)
      return true
    } else {
      console.error('❌ Pinata connection test failed:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Pinata connection test failed:', error.message)
    return false
  }
}

/**
 * Get gateway URL from IPFS URI
 * @param {string} ipfsUri - IPFS URI (ipfs://...)
 * @returns {string} Gateway URL
 */
export function getGatewayUrl(ipfsUri) {
  if (!ipfsUri || !ipfsUri.startsWith('ipfs://')) {
    return null
  }
  
  const hash = ipfsUri.replace('ipfs://', '')
  return `https://gateway.pinata.cloud/ipfs/${hash}`
} 