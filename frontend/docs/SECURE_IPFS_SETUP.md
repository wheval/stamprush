# Secure IPFS Setup for Stamp Rush

## 🔒 Security-First Approach

This implementation keeps your Pinata API keys secure by using **server-side API routes** instead of exposing them to the browser.

## 📁 Architecture

```
Browser (Admin Panel)
    ↓ (form data + image)
Server-side API Route (/api/upload-to-ipfs)
    ↓ (secure API keys)
Pinata IPFS
```

## 🔧 Environment Configuration

Create a `.env.local` file in the `frontend/` directory with:

```bash
# Secure server-side configuration (NOT exposed to browser)
PINATA_API_KEY=your_pinata_api_key_here
PINATA_API_SECRET=your_pinata_api_secret_here
```

## ⚠️ Security Rules

### ✅ DO (Secure)
- Use `PINATA_API_KEY` (server-side only)
- Process uploads through `/api/upload-to-ipfs`
- Keep API keys in `.env.local`

### ❌ DON'T (Insecure)
- Use `NEXT_PUBLIC_PINATA_API_KEY` (exposes to browser)
- Include API keys in client-side code
- Commit `.env.local` to version control

## 🚀 How It Works

1. **Admin submits form** → Browser sends image + metadata to `/api/upload-to-ipfs`
2. **Server processes** → API route uses secure keys to upload to Pinata
3. **Response returned** → IPFS URLs sent back to browser
4. **Blockchain transaction** → Metadata URI used in smart contract

## 📋 Setup Steps

1. **Get Pinata API Keys**
   - Visit: https://app.pinata.cloud/developers/api-keys
   - Create a new API key
   - Copy both API Key and Secret

2. **Configure Environment**
   ```bash
   cd frontend
   cp .env.example .env.local  # If template exists
   # OR create .env.local manually
   ```

3. **Add Your Keys**
   ```bash
   # Add to .env.local
   PINATA_API_KEY=your_actual_api_key
   PINATA_API_SECRET=your_actual_secret
   ```

4. **Test Upload**
   - Go to admin panel
   - Create a stamp with an image
   - Check console for IPFS upload logs
   - Verify files appear in Pinata dashboard

## 🔍 Verification

### Browser Console (Admin Panel)
```
✅ IPFS upload successful: {
  imageUri: "ipfs://Qm...",
  metadataUri: "ipfs://Qm...",
  gatewayUrls: { ... }
}
```

### Server Logs (Terminal)
```
📸 Uploading image to IPFS...
✅ Image uploaded successfully: ipfs://Qm...
📄 Uploading metadata to IPFS...
✅ Metadata uploaded successfully: ipfs://Qm...
```

### Pinata Dashboard
- Files should appear in your Pinata file manager
- Tagged with project: "stamp-rush"

## 🛡️ Security Benefits

1. **API Keys Never Exposed**: Keys stay server-side only
2. **No Browser Vulnerabilities**: Can't be extracted from client
3. **Audit Trail**: Server logs all upload activity
4. **Rate Limiting**: Can add rate limiting to API route
5. **Validation**: Server validates all uploads before processing

## 🔧 API Route Details

**Endpoint**: `POST /api/upload-to-ipfs`

**Request**:
```javascript
const formData = new FormData()
formData.append('image', imageFile)  // Optional
formData.append('metadata', JSON.stringify(metadata))
```

**Response**:
```json
{
  "success": true,
  "imageUri": "ipfs://Qm...",
  "metadataUri": "ipfs://Qm...",
  "gatewayUrls": {
    "image": "https://gateway.pinata.cloud/ipfs/Qm...",
    "metadata": "https://gateway.pinata.cloud/ipfs/Qm..."
  }
}
```

## 🎯 What This Fixes

- ❌ Browser API key exposure → ✅ Server-side security
- ❌ Public credential leaks → ✅ Private environment vars
- ❌ Client-side upload errors → ✅ Reliable server processing
- ❌ CORS/browser limitations → ✅ Full Node.js capabilities

This approach follows security best practices and ensures your Pinata API credentials remain safe while providing full IPFS functionality. 