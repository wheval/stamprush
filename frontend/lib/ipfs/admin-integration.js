const { uploadStampMetadata } = require('./pinata');

/**
 * Admin Integration Module for Stamp Rush
 * Connects IPFS uploads with the admin panel stamp creation
 */

/**
 * Process form data and upload stamp to IPFS
 * @param {File} imageFile - Image file from form input
 * @param {Object} formData - Form data from admin panel
 * @returns {Promise<Object>} Upload result with IPFS URIs
 */
async function processStampCreation(imageFile, formData) {
  try {
    console.log('🏗️ Processing stamp creation...');
    
    // Validate inputs
    if (!imageFile) {
      throw new Error('Image file is required');
    }
    
    if (!formData.name || !formData.description) {
      throw new Error('Stamp name and description are required');
    }
    
    // Save image file temporarily (in a real implementation)
    // For now, we'll assume the file path is provided
    const tempImagePath = await saveImageTemporarily(imageFile);
    
    // Prepare stamp metadata
    const stampData = {
      name: formData.name,
      description: formData.description,
      location: formData.location || 'Unknown Location',
      attributes: [
        { trait_type: "Max Claims", value: formData.maxClaims.toString() },
        { trait_type: "Time Limited", value: formData.timeLimited ? "Yes" : "No" },
        { trait_type: "Created By", value: "Stamp Rush Admin" },
        { trait_type: "Created At", value: new Date().toISOString() }
      ]
    };
    
    // Add time-specific attributes if applicable
    if (formData.timeLimited) {
      stampData.attributes.push(
        { trait_type: "Start Time", value: new Date(formData.startTime).toISOString() },
        { trait_type: "End Time", value: new Date(formData.endTime).toISOString() }
      );
    }
    
    // Upload to IPFS
    const result = await uploadStampMetadata(tempImagePath, stampData);
    
    // Clean up temporary file
    await cleanupTempFile(tempImagePath);
    
    console.log('✅ Stamp uploaded to IPFS successfully!');
    return result;
    
  } catch (error) {
    console.error('❌ Stamp creation failed:', error.message);
    throw new Error(`Failed to create stamp: ${error.message}`);
  }
}

/**
 * Helper function to save uploaded file temporarily
 * @param {File} file - Uploaded file
 * @returns {Promise<string>} Temporary file path
 */
async function saveImageTemporarily(file) {
  // In a real implementation, you would:
  // 1. Create a temporary directory
  // 2. Save the file with a unique name
  // 3. Return the path
  
  // For browser environment, you might use FileReader API
  // For Node.js environment, you might use fs.writeFile
  
  // Mock implementation - replace with actual file handling
  const tempPath = `/tmp/stamp_${Date.now()}_${file.name}`;
  
  // Example for Node.js:
  // const fs = require('fs').promises;
  // const buffer = await file.arrayBuffer();
  // await fs.writeFile(tempPath, Buffer.from(buffer));
  
  console.log(`📁 Temporary file saved: ${tempPath}`);
  return tempPath;
}

/**
 * Clean up temporary file
 * @param {string} filePath - Path to temporary file
 */
async function cleanupTempFile(filePath) {
  try {
    // Example for Node.js:
    // const fs = require('fs').promises;
    // await fs.unlink(filePath);
    console.log(`🗑️ Cleaned up temporary file: ${filePath}`);
  } catch (error) {
    console.warn('⚠️ Failed to clean up temporary file:', error.message);
  }
}

/**
 * Convert form data to contract parameters
 * @param {Object} formData - Form data from admin panel
 * @param {string} metadataUri - IPFS URI of uploaded metadata
 * @returns {Object} Contract parameters
 */
function convertToContractParams(formData, metadataUri) {
  const now = Math.floor(Date.now() / 1000);
  
  return {
    tagId: formData.name.toLowerCase().replace(/\s+/g, '-'),
    maxClaims: parseInt(formData.maxClaims),
    startTime: formData.timeLimited 
      ? Math.floor(new Date(formData.startTime).getTime() / 1000)
      : now,
    endTime: formData.timeLimited
      ? Math.floor(new Date(formData.endTime).getTime() / 1000)
      : now + (365 * 24 * 60 * 60), // 1 year if unlimited
    metadataUri: metadataUri
  };
}

/**
 * Complete stamp creation workflow
 * @param {File} imageFile - Image file from form
 * @param {Object} formData - Form data from admin panel
 * @param {Function} addTagFunction - Smart contract function
 * @returns {Promise<Object>} Complete result
 */
async function createStampWorkflow(imageFile, formData, addTagFunction) {
  try {
    console.log('🚀 Starting complete stamp creation workflow...');
    
    // Step 1: Upload to IPFS
    const uploadResult = await processStampCreation(imageFile, formData);
    
    // Step 2: Convert to contract parameters
    const contractParams = convertToContractParams(formData, uploadResult.metadataUri);
    
    // Step 3: Create on blockchain
    console.log('📝 Creating stamp on blockchain...');
    const txResult = await addTagFunction(
      contractParams.tagId,
      contractParams.maxClaims,
      contractParams.startTime,
      contractParams.endTime,
      contractParams.metadataUri
    );
    
    const result = {
      // IPFS data
      imageUri: uploadResult.imageUri,
      metadataUri: uploadResult.metadataUri,
      metadata: uploadResult.metadata,
      
      // Blockchain data
      tagId: contractParams.tagId,
      transactionHash: txResult.transaction_hash,
      contractParams,
      
      // Status
      success: true,
      message: 'Stamp created successfully!'
    };
    
    console.log('🎉 Complete stamp creation workflow finished!');
    return result;
    
  } catch (error) {
    console.error('❌ Stamp creation workflow failed:', error.message);
    throw error;
  }
}

/**
 * Validate stamp creation form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result
 */
function validateStampForm(formData) {
  const errors = [];
  
  if (!formData.name || formData.name.trim().length === 0) {
    errors.push('Stamp name is required');
  }
  
  if (!formData.description || formData.description.trim().length === 0) {
    errors.push('Stamp description is required');
  }
  
  if (!formData.maxClaims || formData.maxClaims < 1) {
    errors.push('Max claims must be at least 1');
  }
  
  if (formData.timeLimited) {
    if (!formData.startTime) {
      errors.push('Start time is required for time-limited stamps');
    }
    
    if (!formData.endTime) {
      errors.push('End time is required for time-limited stamps');
    }
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      
      if (end <= start) {
        errors.push('End time must be after start time');
      }
      
      if (start < new Date()) {
        errors.push('Start time cannot be in the past');
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

module.exports = {
  processStampCreation,
  convertToContractParams,
  createStampWorkflow,
  validateStampForm,
  saveImageTemporarily,
  cleanupTempFile
}; 