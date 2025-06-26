# Stamp Rush Documentation

Welcome to the Stamp Rush documentation! This guide covers all aspects of the decentralized stamp collection game built on Starknet with IPFS integration.

## 📚 Documentation Index

### 🚀 Getting Started
- [Secure IPFS Setup](./SECURE_IPFS_SETUP.md) - **Start here** for secure Pinata configuration
- [IPFS Setup Guide](./IPFS_SETUP_GUIDE.md) - Alternative setup methods and troubleshooting
- [Starknet Integration](./STARKNET_INTEGRATION.md) - Smart contract integration guide

### 🔧 Technical References
- [IPFS API Reference](./IPFS_API_REFERENCE.md) - Complete API documentation
- Smart Contract Documentation (see `contract/` directory)

## 🏗️ Architecture Overview

```
Frontend (Next.js)
├── Admin Panel (/admin)
│   ├── Secure IPFS Upload → Server-side API
│   └── Smart Contract Integration
├── User Interface (/stamps)
│   ├── Stamp Discovery
│   └── Claim Functionality
└── API Routes (/api)
    └── /upload-to-ipfs (Secure Pinata proxy)

Smart Contract (Cairo)
├── StampRush Contract
├── Tag Management
└── Claim Validation

IPFS Storage (Pinata)
├── Stamp Images
└── Metadata JSON
```

## 🔒 Security Features

### Secure IPFS Integration
- **Server-side API keys**: Never exposed to browser
- **Secure upload proxy**: `/api/upload-to-ipfs` endpoint
- **Environment protection**: Keys stored in `.env.local`

### Smart Contract Security
- **Owner-only admin functions**: Tag creation restricted
- **Claim validation**: Time windows and limits enforced
- **Unique tag IDs**: Automatic conflict resolution

## 📋 Quick Start

### 1. Secure Environment Setup
```bash
# Create environment file
cp .env.example .env.local  # If template exists

# Add your Pinata API keys (server-side only)
PINATA_API_KEY=your_pinata_api_key_here
PINATA_API_SECRET=your_pinata_api_secret_here
```

### 2. Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
```

### 3. Test IPFS Integration
1. Access admin panel at `/admin`
2. Connect wallet (must be contract owner)
3. Create a stamp with image
4. Verify uploads in Pinata dashboard
5. Check blockchain transaction on Starknet

## 🛡️ Security Best Practices

### ✅ Secure Practices
- Use server-side API keys only
- Never commit `.env.local` to version control
- Validate all uploads server-side
- Use HTTPS in production
- Implement rate limiting for API routes

### ❌ Security Risks to Avoid
- Exposing API keys with `NEXT_PUBLIC_` prefix
- Client-side API key storage
- Unvalidated file uploads
- Missing owner verification

## 🔍 Monitoring & Verification

### Browser Console (Admin Panel)
```javascript
✅ IPFS upload successful: {
  imageUri: "ipfs://Qm...",
  metadataUri: "ipfs://Qm...",
  gatewayUrls: { ... }
}
```

### Server Logs
```bash
📸 Uploading image to IPFS...
✅ Image uploaded successfully: ipfs://Qm...
📄 Uploading metadata to IPFS...
✅ Metadata uploaded successfully: ipfs://Qm...
```

### Pinata Dashboard
- Files tagged with "stamp-rush"
- Proper metadata structure
- Gateway URLs working

## 🚨 Troubleshooting

### Common Issues

1. **IPFS Upload Fails**
   - Check API keys in `.env.local`
   - Verify Pinata account status
   - Check server logs for errors

2. **Tag Already Exists Error**
   - System automatically generates unique IDs
   - Check tag ID preview in admin panel
   - Verify contract connection

3. **Access Denied**
   - Ensure wallet is connected
   - Verify you're the contract owner
   - Check network connection

### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Test API endpoints directly
4. Check smart contract state
5. Review server logs

## 📖 Additional Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [Starknet Documentation](https://docs.starknet.io/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [IPFS Documentation](https://docs.ipfs.io/)

## 🤝 Contributing

1. Follow security guidelines
2. Test all changes thoroughly
3. Update documentation
4. Ensure backwards compatibility
5. Add proper error handling

---

**Security Notice**: Always prioritize security when handling API keys and user data. This documentation emphasizes secure practices throughout. 