"use client"

import { Button } from "./ui/button"
import { useStarknet } from "@/lib/starknet-provider"
import { Wallet, LogOut, Loader2 } from "lucide-react"

export default function WalletConnect() {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet 
  } = useStarknet()

  const formatAddress = (addr) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-700">
            {formatAddress(address)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
} 