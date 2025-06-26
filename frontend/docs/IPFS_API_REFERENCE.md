# IPFS Upload System for Stamp Rush

A production-ready Node.js module for uploading images and metadata to IPFS using the Pinata API.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install axios form-data dotenv
```

### 2. Setup Environment Variables

Create a `.env` file in your project root:

```env
# Get your API keys from https://app.pinata.cloud/keys
PINATA_API_KEY=your_pinata_api_key_here
PINATA_API_SECRET=your_pinata_api_secret_here
```

### 3. Basic Usage

```javascript
const { uploadImageToIPFS, uploadJSONToIPFS } = require('./lib/ipfs/pinata');

// Upload an image
const imageUri = await uploadImageToIPFS('./path/to/image.png');
console.log('Image IPFS URI:', imageUri);

// Upload JSON metadata
const metadata = {
  name: "Cool Stamp",
  description: "An awesome event stamp",
  attributes: [{ trait_type: "Rarity", value: "Rare" }]
};
const metadataUri = await uploadJSONToIPFS(metadata);
console.log('Metadata IPFS URI:', metadataUri);
```

## 📋 API Reference

### `uploadImageToIPFS(filePath, options)`

Uploads an image file to IPFS via Pinata.

**Parameters:**
- `filePath` (string): Local path to the image file
- `options` (object, optional):
  - `name` (string): Custom name for the file
  - `metadata` (object): Additional metadata to store

**Returns:** Promise<string> - IPFS URI in format `ipfs://<CID>`

**Example:**
```javascript
const uri = await uploadImageToIPFS('./stamp.png', {
  name: 'event-stamp-image',
  metadata: {
    event: 'Tech Conference 2024',
    location: 'San Francisco'
  }
});
```

### `uploadJSONToIPFS(metadata, options)`

Uploads JSON metadata to IPFS via Pinata.

**Parameters:**
- `metadata` (object): JSON object to upload
- `options` (object, optional):
  - `name` (string): Custom name for the metadata file

**Returns:** Promise<string> - IPFS URI in format `ipfs://<CID>`

**Example:**
```javascript
const metadata = {
  name: "Conference Stamp",
  description: "Exclusive stamp for tech conference attendees",
  image: "ipfs://QmYourImageHash",
  attributes: [
    { trait_type: "Event", value: "Tech Conference 2024" },
    { trait_type: "Rarity", value: "Limited Edition" }
  ]
};

const uri = await uploadJSONToIPFS(metadata, {
  name: 'conference-stamp-metadata'
});
```

### `uploadStampMetadata(imagePath, stampData)`

Uploads complete stamp metadata (image + JSON) to IPFS.

**Parameters:**
- `imagePath` (string): Path to stamp image
- `stampData` (object):
  - `name` (string): Stamp name
  - `description` (string): Stamp description
  - `location` (string): Stamp location
  - `attributes` (array, optional): Additional attributes

**Returns:** Promise<object> - Object containing:
- `imageUri` (string): IPFS URI of the image
- `metadataUri` (string): IPFS URI of the complete metadata
- `metadata` (object): The complete metadata object

**Example:**
```javascript
const result = await uploadStampMetadata('./event-stamp.png', {
  name: "Tech Conference 2024",
  description: "Exclusive stamp for tech conference attendees",
  location: "San Francisco Convention Center",
  attributes: [
    { trait_type: "Event Type", value: "Technology" },
    { trait_type: "Year", value: "2024" },
    { trait_type: "Rarity", value: "Limited Edition" }
  ]
});

console.log('Image URI:', result.imageUri);
console.log('Metadata URI:', result.metadataUri);
// Use result.metadataUri in your smart contract
```

### `testPinataConnection()`

Tests the connection to Pinata API.

**Returns:** Promise<boolean> - Connection status

**Example:**
```javascript
const isConnected = await testPinataConnection();
if (isConnected) {
  console.log('✅ Pinata connection successful');
} else {
  console.log('❌ Pinata connection failed');
}
```

## 🧪 Testing

Run the test script to verify your setup:

```bash
# Run all tests
node frontend/lib/ipfs/test-upload.js

# Show usage examples
node frontend/lib/ipfs/test-upload.js --help
```

## 🏗️ Integration with Smart Contracts

### Example: Creating a Stamp with IPFS Metadata

```javascript
const { uploadStampMetadata } = require('./lib/ipfs/pinata');
const { addTag } = require('./your-contract-interface');

async function createStamp(imagePath, stampInfo, contractParams) {
  try {
    // 1. Upload image and metadata to IPFS
    const { metadataUri } = await uploadStampMetadata(imagePath, stampInfo);
    
    // 2. Create stamp on blockchain with IPFS URI
    const { tagId, maxClaims, startTime, endTime } = contractParams;
    const txHash = await addTag(tagId, maxClaims, startTime, endTime, metadataUri);
    
    console.log('✅ Stamp created successfully!');
    console.log('Metadata URI:', metadataUri);
    console.log('Transaction Hash:', txHash);
    
    return { metadataUri, txHash };
  } catch (error) {
    console.error('❌ Failed to create stamp:', error.message);
    throw error;
  }
}

// Usage
await createStamp(
  './event-image.png',
  {
    name: "DevCon 2024",
    description: "Exclusive stamp for DevCon 2024 attendees",
    location: "Bangkok, Thailand"
  },
  {
    tagId: "devcon-2024",
    maxClaims: 1000,
    startTime: Math.floor(Date.now() / 1000),
    endTime: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  }
);
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PINATA_API_KEY` | Your Pinata API key | Yes |
| `PINATA_API_SECRET` | Your Pinata API secret | Yes |
| `IPFS_GATEWAY_URL` | Custom IPFS gateway URL | No |

### Getting Pinata API Keys

1. Sign up at [Pinata.cloud](https://app.pinata.cloud)
2. Go to [API Keys](https://app.pinata.cloud/keys)
3. Create a new API key with admin permissions
4. Copy the API Key and API Secret to your `.env` file

## 🛡️ Error Handling

The module includes comprehensive error handling:

```javascript
try {
  const uri = await uploadImageToIPFS('./image.png');
  console.log('Success:', uri);
} catch (error) {
  if (error.message.includes('File not found')) {
    console.error('Image file does not exist');
  } else if (error.message.includes('API credentials')) {
    console.error('Check your Pinata API keys');
  } else {
    console.error('Upload failed:', error.message);
  }
}
```

## 📊 File Size Limits

- **Images**: Up to 100MB per file
- **JSON**: Up to 1MB per file
- **Timeout**: 2 minutes for large file uploads

## 🌐 IPFS URIs

The module returns IPFS URIs in the standard format:
- `ipfs://QmYourHashHere`
- Gateway URL: `https://gateway.pinata.cloud/ipfs/QmYourHashHere`

## 🔍 Debugging

Enable verbose logging by setting:

```javascript
process.env.DEBUG = 'pinata:*';
```

## 📝 Notes

- All uploads are automatically tagged with `project: 'stamp-rush'`
- Images are pinned with CID version 1 for better compatibility
- Metadata includes timestamps and project information
- Failed uploads are automatically retried once

## 🤝 Contributing

To extend the module:

1. Add new methods to the `PinataUploader` class
2. Export them in the module.exports
3. Add tests to `test-upload.js`
4. Update this documentation 