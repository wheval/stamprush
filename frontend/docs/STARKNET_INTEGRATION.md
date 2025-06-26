# Starknet Integration Guide for Stamp Rush

This guide explains how to integrate your Stamp Rush frontend with a Starknet smart contract.

## 📋 Prerequisites

1. **Deploy your Smart Contract**: First, you need to deploy your Stamp Rush smart contract to Starknet
2. **Get Contract Details**: Note your contract address and ABI
3. **Set up Environment**: Configure your environment variables

## 🚀 Setup Instructions

### 1. Install Dependencies

The following Starknet dependencies have been added to your project:

```bash
npm install starknet@^6.11.0 @starknet-io/get-starknet@^4.0.0 @starknet-io/types-js@^0.7.7 react-hot-toast@^2.4.1
```

### 2. Configure Environment Variables

Create a `.env.local` file in your frontend directory:

```env
# Starknet Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed contract address
NEXT_PUBLIC_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
NEXT_PUBLIC_STARKNET_NETWORK=sepolia

# For mainnet deployment:
# NEXT_PUBLIC_STARKNET_RPC_URL=https://starknet-mainnet.public.blastapi.io
# NEXT_PUBLIC_STARKNET_NETWORK=mainnet
```

### 3. Update Contract Configuration

Edit `lib/config.js` and update:

1. **CONTRACT_ADDRESS**: Replace with your actual deployed contract address
2. **CONTRACT_ABI**: Replace with your actual contract ABI

```javascript
export const CONTRACT_CONFIG = {
  CONTRACT_ADDRESS: "0x123...", // Your actual contract address
  CONTRACT_ABI: [
    // Your actual contract ABI here
  ],
  // ... rest of config
}
```

## 📊 Smart Contract Functions

Your smart contract should implement these functions:

### Core Functions

```cairo
// Claim a stamp
fn claim_stamp(tag_id: felt252) -> ();

// Get tag metadata
fn get_tag_metadata(tag_id: felt252) -> felt252;

// Get claim count for a tag
fn get_claim_count(tag_id: felt252) -> felt252;

// Check if user has claimed a tag
fn has_user_claimed(user_address: ContractAddress, tag_id: felt252) -> bool;

// Get total claims for a user
fn get_user_total_claims(user_address: ContractAddress) -> felt252;

// Add a new tag (admin only)
fn add_tag(tag_id: felt252, max_claims: felt252, start_time: felt252, end_time: felt252, metadata_uri: felt252) -> ();
```

## 🔄 User Flows Implementation

### 1. User Registration/Connection Flow

```javascript
// Automatic wallet connection
const { isConnected, connectWallet } = useStarknet()

if (!isConnected) {
  await connectWallet()
}
```

### 2. Discover & Claim Flow

```javascript
// Claiming a stamp
const { claimStamp, loading } = useStampContract()

const handleClaim = async (tagId) => {
  const result = await claimStamp(tagId)
  if (result) {
    // Update UI to show success
  }
}
```

### 3. View Claimed Stamps Flow

```javascript
// Getting user's claimed stamps
const { getUserTotalClaims, hasUserClaimed } = useStampContract()

const loadUserStamps = async () => {
  const totalClaims = await getUserTotalClaims(userAddress)
  const hasClaimedStamp = await hasUserClaimed(userAddress, tagId)
}
```

### 4. Leaderboard Flow

```javascript
// Get leaderboard data (requires backend indexing)
const loadLeaderboard = async () => {
  // 1. Get all user addresses from your indexer/backend
  // 2. Call getUserTotalClaims for each user
  // 3. Sort by total claims
}
```

### 5. Tag Management (Admin Only)

```javascript
// Adding a new tag
const { addTag } = useStampContract()

const createNewTag = async (tagData) => {
  const result = await addTag(
    tagData.id,
    tagData.maxClaims,
    tagData.startTime,
    tagData.endTime,
    tagData.metadataUri
  )
}
```

## 🎯 Key Components

### StarknetProvider
Wraps your app and provides Starknet context:
- Wallet connection management
- Contract instance management
- Network configuration

### useStarknet Hook
Provides access to:
- `isConnected`: Wallet connection status
- `address`: Connected wallet address
- `connectWallet()`: Function to connect wallet
- `disconnectWallet()`: Function to disconnect wallet

### useStampContract Hook
Provides contract interaction functions:
- `claimStamp(tagId)`: Claim a stamp
- `getTagMetadata(tagId)`: Get tag metadata
- `getClaimCount(tagId)`: Get claim count
- `hasUserClaimed(address, tagId)`: Check if user claimed
- `getUserTotalClaims(address)`: Get user's total claims
- `addTag(...)`: Add new tag (admin only)

### WalletConnect Component
Handles wallet connection UI:
- Shows "Connect Wallet" button when disconnected
- Shows connected address and disconnect option when connected

## 🔧 State Management

The integration uses React state management:

- **Global State**: Managed by StarknetProvider
- **Loading States**: Handled in useStampContract hook
- **Error Handling**: Toast notifications for user feedback

## 📝 Transaction Handling

All blockchain transactions follow this pattern:

1. **Check wallet connection**
2. **Call contract function**
3. **Wait for transaction confirmation**
4. **Update UI state**
5. **Show success/error feedback**

```javascript
const claimStamp = async (tagId) => {
  if (!isConnected) {
    toast.error('Please connect your wallet first')
    return null
  }

  try {
    setLoading(true)
    const result = await contract.claim_stamp(tagId)
    await account.waitForTransaction(result.transaction_hash)
    toast.success('Stamp claimed successfully!')
    return result
  } catch (error) {
    toast.error('Failed to claim stamp: ' + error.message)
    return null
  } finally {
    setLoading(false)
  }
}
```

## 🔐 Security Considerations

1. **Wallet Validation**: Always check wallet connection before transactions
2. **Error Handling**: Gracefully handle all contract call failures
3. **Loading States**: Prevent double-spending with loading indicators
4. **Input Validation**: Validate all inputs before sending to contract

## 🚀 Development Workflow

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Connect Wallet**: Use Argent X or Braavos wallet
3. **Test Contract Calls**: Use Starknet Sepolia testnet for testing
4. **Monitor Transactions**: Check transactions on Starknet Explorer

## 📱 Supported Wallets

- **Argent X**: Recommended Starknet wallet
- **Braavos**: Alternative Starknet wallet
- Any wallet supporting the Starknet standard

## 🐛 Troubleshooting

### Common Issues

1. **Contract Not Found**: Check contract address in config
2. **ABI Mismatch**: Ensure ABI matches deployed contract
3. **Network Issues**: Verify RPC URL and network configuration
4. **Wallet Connection**: Try refreshing and reconnecting wallet

### Debug Steps

1. Check browser console for errors
2. Verify environment variables
3. Test on Starknet testnet first
4. Use Starknet Explorer to verify transactions

## 📚 Additional Resources

- [Starknet Documentation](https://docs.starknet.io/)
- [Starknet.js Documentation](https://starknetjs.com/)
- [Cairo Programming Language](https://docs.cairo-lang.org/)
- [Argent X Wallet](https://www.argent.xyz/argent-x/)
- [Braavos Wallet](https://braavos.app/)

## 🔄 Next Steps

1. Deploy your smart contract to Starknet
2. Update configuration with actual contract details
3. Test all user flows on testnet
4. Deploy frontend to production
5. Monitor and maintain the application

---

**Note**: This integration provides a complete foundation for your Stamp Rush dApp. Customize the contract functions and UI components based on your specific requirements. 