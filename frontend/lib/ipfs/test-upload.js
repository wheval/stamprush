const path = require('path');
const fs = require('fs');

// Load environment variables - try multiple locations
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config();

const { 
  uploadImageToIPFS, 
  uploadJSONToIPFS, 
  uploadStampMetadata,
  testPinataConnection 
} = require('./pinata');

/**
 * Test script for IPFS upload functionality
 * Run with: node frontend/lib/ipfs/test-upload.js
 */

async function runTests() {
  console.log('🧪 Starting IPFS Upload Tests...\n');

  try {
    // Test 1: Connection test
    console.log('1️⃣ Testing Pinata connection...');
    const connectionOk = await testPinataConnection();
    if (!connectionOk) {
      throw new Error('Pinata connection failed');
    }
    console.log('✅ Connection test passed\n');

    // Test 2: JSON upload
    console.log('2️⃣ Testing JSON metadata upload...');
    const sampleMetadata = {
      name: "Test Stamp",
      description: "This is a test stamp for the Stamp Rush game",
      location: "Test Location",
      attributes: [
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Event", value: "Test Event" },
        { trait_type: "Points", value: 10 }
      ],
      project: "stamp-rush",
      version: "1.0"
    };

    const metadataUri = await uploadJSONToIPFS(sampleMetadata, {
      name: 'test-stamp-metadata'
    });
    console.log('✅ JSON upload test passed\n');

    // Test 3: Image upload (if test image exists)
    console.log('3️⃣ Testing image upload...');
    const testImagePath = path.join(__dirname, '../../../public/rush/1.png');
    
    if (fs.existsSync(testImagePath)) {
      const imageUri = await uploadImageToIPFS(testImagePath, {
        name: 'test-stamp-image',
        metadata: {
          stampName: 'Test Stamp',
          category: 'test'
        }
      });
      console.log('✅ Image upload test passed\n');
      
      // Test 4: Complete stamp metadata upload
      console.log('4️⃣ Testing complete stamp metadata upload...');
      const completeStampData = {
        name: "Complete Test Stamp",
        description: "This is a complete test stamp with image and metadata",
        location: "Test Event Location",
        attributes: [
          { trait_type: "Category", value: "Event" },
          { trait_type: "Difficulty", value: "Easy" },
          { trait_type: "Points", value: 25 }
        ]
      };

      const result = await uploadStampMetadata(testImagePath, completeStampData);
      console.log('✅ Complete stamp metadata upload test passed');
      console.log('📊 Results:');
      console.log(`   🖼️  Image URI: ${result.imageUri}`);
      console.log(`   📄 Metadata URI: ${result.metadataUri}`);
      console.log('');
    } else {
      console.log('⚠️  Test image not found, skipping image upload tests');
      console.log(`   Expected path: ${testImagePath}`);
      console.log('');
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Connection test');
    console.log('   ✅ JSON metadata upload');
    if (fs.existsSync(testImagePath)) {
      console.log('   ✅ Image upload');
      console.log('   ✅ Complete stamp metadata');
    } else {
      console.log('   ⚠️  Image tests skipped (no test image)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('API credentials')) {
      console.log('\n🔧 Setup Instructions:');
      console.log('1. Get API keys from https://app.pinata.cloud/keys');
      console.log('2. Create a .env file in the frontend directory');
      console.log('3. Add your keys:');
      console.log('   PINATA_API_KEY=your_api_key_here');
      console.log('   PINATA_API_SECRET=your_api_secret_here');
    }
    process.exit(1);
  }
}

// Example usage functions
function showUsageExamples() {
  console.log(`
📚 USAGE EXAMPLES:

1. Basic Image Upload:
   const { uploadImageToIPFS } = require('./lib/ipfs/pinata');
   const uri = await uploadImageToIPFS('./path/to/image.png');
   console.log('IPFS URI:', uri);

2. Basic JSON Upload:
   const { uploadJSONToIPFS } = require('./lib/ipfs/pinata');
   const metadata = { name: "My Stamp", description: "Cool stamp" };
   const uri = await uploadJSONToIPFS(metadata);
   console.log('IPFS URI:', uri);

3. Complete Stamp Upload:
   const { uploadStampMetadata } = require('./lib/ipfs/pinata');
   const result = await uploadStampMetadata('./image.png', {
     name: "Event Stamp",
     description: "Special event stamp",
     location: "Conference Center",
     attributes: [{ trait_type: "Rarity", value: "Rare" }]
   });
   console.log('Image URI:', result.imageUri);
   console.log('Metadata URI:', result.metadataUri);

4. Using in Smart Contract:
   // Upload stamp metadata first
   const { metadataUri } = await uploadStampMetadata('./stamp.png', stampData);
   
   // Then use the URI in your smart contract call
   await addTag(tagId, maxClaims, startTime, endTime, metadataUri);
  `);
}

// Run tests if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === '--help' || command === '-h') {
    showUsageExamples();
  } else {
    runTests();
  }
} 