/**
 * Secure server-side IPFS upload API route
 * Handles image and metadata uploads to Pinata without exposing API keys
 */

import { NextRequest, NextResponse } from 'next/server'

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_API_SECRET = process.env.PINATA_API_SECRET

export async function POST(request) {
  try {
    // Check if API keys are configured
    if (!PINATA_API_KEY || !PINATA_API_SECRET) {
      return NextResponse.json(
        { error: 'IPFS service not configured' },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const imageFile = formData.get('image')
    const metadataString = formData.get('metadata')

    if (!metadataString) {
      return NextResponse.json(
        { error: 'Metadata is required' },
        { status: 400 }
      )
    }

    const metadata = JSON.parse(metadataString)
    const result = { metadata }
    
    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      console.log('📸 Uploading image to IPFS...')
      
      const imageFormData = new FormData()
      imageFormData.append('file', imageFile)
      imageFormData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }))
      imageFormData.append('pinataMetadata', JSON.stringify({
        name: `stamp-${metadata.name.toLowerCase().replace(/\s+/g, '-')}-image`,
        keyvalues: {
          type: 'image',
          project: 'stamp-rush',
          uploadedAt: new Date().toISOString()
        }
      }))

      const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_API_SECRET,
        },
        body: imageFormData
      })

      if (imageResponse.ok) {
        const imageResult = await imageResponse.json()
        const imageUri = `ipfs://${imageResult.IpfsHash}`
        result.imageUri = imageUri
        metadata.image = imageUri // Add image to metadata
        
        console.log('✅ Image uploaded successfully:', imageUri)
      } else {
        console.warn('⚠️ Image upload failed:', await imageResponse.text())
      }
    }

    // Upload metadata JSON
    console.log('📄 Uploading metadata to IPFS...')
    
    const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET,
      },
      body: JSON.stringify({
        pinataOptions: { cidVersion: 1 },
        pinataMetadata: {
          name: `stamp-${metadata.name.toLowerCase().replace(/\s+/g, '-')}-metadata.json`,
          keyvalues: {
            type: 'json',
            project: 'stamp-rush',
            uploadedAt: new Date().toISOString()
          }
        },
        pinataContent: metadata
      })
    })

    if (metadataResponse.ok) {
      const metadataResult = await metadataResponse.json()
      const metadataUri = `ipfs://${metadataResult.IpfsHash}`
      result.metadataUri = metadataUri

      console.log('✅ Metadata uploaded successfully:', metadataUri)
      console.log('🌐 Gateway URL:', `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`)

      return NextResponse.json({
        success: true,
        ...result,
        gatewayUrls: {
          image: result.imageUri ? `https://gateway.pinata.cloud/ipfs/${result.imageUri.replace('ipfs://', '')}` : null,
          metadata: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`
        }
      })
    } else {
      const errorText = await metadataResponse.text()
      console.error('❌ Metadata upload failed:', errorText)
      
      return NextResponse.json(
        { error: 'Failed to upload metadata to IPFS', details: errorText },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ IPFS upload error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 