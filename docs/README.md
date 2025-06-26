# 📚 Stamp Rush Documentation

Welcome to the Stamp Rush documentation! This folder contains all the technical documentation for the project.

## 📖 Documentation Index

### 🚀 Setup Guides
- **[IPFS Setup Guide](./IPFS_SETUP_GUIDE.md)** - Complete guide to setting up IPFS uploads with Pinata
- **[Starknet Integration](./STARKNET_INTEGRATION.md)** - Documentation for Starknet blockchain integration

### 📋 API References
- **[IPFS API Reference](./IPFS_API_REFERENCE.md)** - Detailed API documentation for IPFS upload functions

## 🏗️ Project Overview

Stamp Rush is a blockchain-based stamp collection game built on Starknet with IPFS storage for metadata.

### Key Components:
- **Frontend**: Next.js React application
- **Blockchain**: Starknet smart contracts
- **Storage**: IPFS via Pinata for images and metadata
- **Wallet**: Starknet wallet integration

### Main Features:
- 🏷️ **Stamp Creation**: Admin panel for creating new stamps
- 🎯 **Stamp Claiming**: Users can claim stamps at events/locations
- 🏆 **Leaderboards**: Track top collectors
- 🗺️ **Map Integration**: Location-based stamp discovery
- 👤 **User Profiles**: View collected stamps and achievements

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up IPFS** (for admin functionality):
   ```bash
   npm run ipfs:setup
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:

```env
# Pinata IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_secret

# Starknet Configuration
NEXT_PUBLIC_STARKNET_NETWORK=mainnet-alpha
NEXT_PUBLIC_CONTRACT_ADDRESS=0x029e90c75c201922437d2d9be3b3574c51612c639f4fd79ccc21064287e35004
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── stamps/            # Stamp-related pages
│   ├── leaderboard/       # Leaderboard page
│   └── profile/           # User profile pages
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── ipfs/             # IPFS upload system
│   └── hooks/            # Custom React hooks
├── docs/                 # Documentation (this folder)
└── public/               # Static assets
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# IPFS Management
npm run ipfs:setup      # Interactive IPFS setup
npm run ipfs:test       # Test IPFS functionality
npm run ipfs:help       # Show IPFS setup instructions

# Code Quality
npm run lint            # Run ESLint
```

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Update documentation when adding new features
3. Test IPFS functionality with `npm run ipfs:test`
4. Ensure all environment variables are properly documented

## 🔗 Useful Links

- [Starknet Documentation](https://docs.starknet.io/)
- [Pinata IPFS Documentation](https://docs.pinata.cloud/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📞 Support

For technical issues or questions:
1. Check the relevant documentation in this folder
2. Run diagnostic scripts (`npm run ipfs:test`)
3. Review console logs for detailed error messages 