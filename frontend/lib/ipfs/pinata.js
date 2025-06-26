const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Load environment variables from multiple possible locations
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config();

/**
 * Pinata IPFS Upload Module for Stamp Rush
 * Handles uploading images and JSON metadata to IPFS via Pinata API
 */

class PinataUploader {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.apiSecret = process.env.PINATA_API_SECRET;
    this.baseURL = 'https://api.pinata.cloud';
    
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Pinata API credentials not found. Please check your environment variables.');
    }
    
    // Configure axios instance with auth headers
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.apiSecret,
      },
      timeout: 120000, // 2 minutes timeout for large files
    });
    
    console.log('🚀 Pinata IPFS uploader initialized successfully');
  }

  /**
   * Test connection to Pinata API
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const response = await this.api.get('/data/testAuthentication');
      console.log('✅ Pinata connection test successful:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Pinata connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Upload an image file to IPFS via Pinata
   * @param {string} filePath - Local path to the image file
   * @param {Object} options - Optional upload parameters
   * @param {string} options.name - Custom name for the file
   * @param {Object} options.metadata - Additional metadata
   * @returns {Promise<string>} IPFS URI (ipfs://<CID>)
   */
  async uploadImageToIPFS(filePath, options = {}) {
    try {
      // Validate file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Get file stats
      const stats = fs.statSync(filePath);
      const fileName = options.name || path.basename(filePath);
      
      console.log(`📤 Uploading image: ${fileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

      // Create form data
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      
      // Pin options
      const pinataOptions = {
        cidVersion: 1,
      };
      
      // Pin metadata
      const pinataMetadata = {
        name: fileName,
        keyvalues: {
          type: 'image',
          uploadedAt: new Date().toISOString(),
          project: 'stamp-rush',
          ...options.metadata
        }
      };

      formData.append('pinataOptions', JSON.stringify(pinataOptions));
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      // Upload to Pinata
      const response = await this.api.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const ipfsHash = response.data.IpfsHash;
      const ipfsUri = `ipfs://${ipfsHash}`;
      
      console.log('✅ Image uploaded successfully!');
      console.log(`🔗 IPFS URI: ${ipfsUri}`);
      console.log(`🌐 Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

      return ipfsUri;

    } catch (error) {
      console.error('❌ Image upload failed:', error.message);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
      throw new Error(`Failed to upload image to IPFS: ${error.message}`);
    }
  }

  /**
   * Upload JSON metadata to IPFS via Pinata
   * @param {Object} metadata - JSON object to upload
   * @param {Object} options - Optional upload parameters
   * @param {string} options.name - Custom name for the metadata
   * @returns {Promise<string>} IPFS URI (ipfs://<CID>)
   */
  async uploadJSONToIPFS(metadata, options = {}) {
    try {
      // Validate metadata
      if (!metadata || typeof metadata !== 'object') {
        throw new Error('Invalid metadata: must be a valid object');
      }

      const fileName = options.name || `metadata-${Date.now()}.json`;
      
      console.log(`📤 Uploading JSON metadata: ${fileName}`);
      console.log('📄 Metadata preview:', JSON.stringify(metadata, null, 2));

      // Pin options
      const pinataOptions = {
        cidVersion: 1,
      };
      
      // Pin metadata
      const pinataMetadata = {
        name: fileName,
        keyvalues: {
          type: 'json',
          uploadedAt: new Date().toISOString(),
          project: 'stamp-rush'
        }
      };

      const requestBody = {
        pinataOptions,
        pinataMetadata,
        pinataContent: metadata
      };

      // Upload to Pinata
      const response = await this.api.post('/pinning/pinJSONToIPFS', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const ipfsHash = response.data.IpfsHash;
      const ipfsUri = `ipfs://${ipfsHash}`;
      
      console.log('✅ JSON metadata uploaded successfully!');
      console.log(`🔗 IPFS URI: ${ipfsUri}`);
      console.log(`🌐 Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

      return ipfsUri;

    } catch (error) {
      console.error('❌ JSON upload failed:', error.message);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
      throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
    }
  }

  /**
   * Upload complete stamp metadata (image + JSON)
   * @param {string} imagePath - Path to stamp image
   * @param {Object} stampData - Stamp metadata
   * @param {string} stampData.name - Stamp name
   * @param {string} stampData.description - Stamp description
   * @param {string} stampData.location - Stamp location
   * @param {Object} stampData.attributes - Additional attributes
   * @returns {Promise<Object>} Complete metadata with IPFS URIs
   */
  async uploadStampMetadata(imagePath, stampData) {
    try {
      console.log('🏷️ Uploading complete stamp metadata...');
      
      // Upload image first
      const imageUri = await this.uploadImageToIPFS(imagePath, {
        name: `${stampData.name}-image`,
        metadata: {
          stampName: stampData.name,
          stampLocation: stampData.location
        }
      });

      // Create complete metadata
      const completeMetadata = {
        name: stampData.name,
        description: stampData.description,
        location: stampData.location,
        image: imageUri,
        attributes: stampData.attributes || [],
        createdAt: new Date().toISOString(),
        project: 'stamp-rush',
        version: '1.0'
      };

      // Upload metadata JSON
      const metadataUri = await this.uploadJSONToIPFS(completeMetadata, {
        name: `${stampData.name}-metadata`
      });

      const result = {
        imageUri,
        metadataUri,
        metadata: completeMetadata
      };

      console.log('🎉 Complete stamp metadata uploaded successfully!');
      return result;

    } catch (error) {
      console.error('❌ Stamp metadata upload failed:', error.message);
      throw error;
    }
  }

  /**
   * Get file/metadata from IPFS
   * @param {string} ipfsUri - IPFS URI (ipfs://<CID>)
   * @returns {Promise<string>} Gateway URL
   */
  getGatewayUrl(ipfsUri) {
    const cid = ipfsUri.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }

  /**
   * List all pinned files
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of pinned files
   */
  async listPinnedFiles(options = {}) {
    try {
      const params = {
        status: 'pinned',
        pageLimit: options.limit || 10,
        pageOffset: options.offset || 0,
        ...options
      };

      const response = await this.api.get('/data/pinList', { params });
      return response.data.rows;
    } catch (error) {
      console.error('❌ Failed to list pinned files:', error.message);
      throw error;
    }
  }
}

// Export functions for easy importing
const pinataUploader = new PinataUploader();

/**
 * Upload an image file to IPFS via Pinata
 * @param {string} filePath - Local path to the image file
 * @param {Object} options - Optional upload parameters
 * @returns {Promise<string>} IPFS URI (ipfs://<CID>)
 */
async function uploadImageToIPFS(filePath, options = {}) {
  return await pinataUploader.uploadImageToIPFS(filePath, options);
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param {Object} metadata - JSON object to upload
 * @param {Object} options - Optional upload parameters
 * @returns {Promise<string>} IPFS URI (ipfs://<CID>)
 */
async function uploadJSONToIPFS(metadata, options = {}) {
  return await pinataUploader.uploadJSONToIPFS(metadata, options);
}

/**
 * Upload complete stamp metadata (image + JSON)
 * @param {string} imagePath - Path to stamp image
 * @param {Object} stampData - Stamp metadata
 * @returns {Promise<Object>} Complete metadata with IPFS URIs
 */
async function uploadStampMetadata(imagePath, stampData) {
  return await pinataUploader.uploadStampMetadata(imagePath, stampData);
}

/**
 * Test Pinata connection
 * @returns {Promise<boolean>} Connection status
 */
async function testPinataConnection() {
  return await pinataUploader.testConnection();
}

module.exports = {
  PinataUploader,
  uploadImageToIPFS,
  uploadJSONToIPFS,
  uploadStampMetadata,
  testPinataConnection,
  pinataUploader
}; 