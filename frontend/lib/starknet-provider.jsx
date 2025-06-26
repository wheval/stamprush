"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { connect, disconnect } from '@starknet-io/get-starknet'
import { Provider, Contract, WalletAccount } from 'starknet'
import toast from 'react-hot-toast'
import { CONTRACT_CONFIG } from './config'

const StarknetContext = createContext({})

// Starknet provider configuration
const provider = new Provider({
  sequencer: {
    baseUrl: CONTRACT_CONFIG.RPC_URL
  }
})

export function StarknetProvider({ children }) {
  const [wallet, setWallet] = useState(null)
  const [account, setAccount] = useState(null)
  const [address, setAddress] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [contract, setContract] = useState(null)

  // Initialize contract when wallet is connected
  useEffect(() => {
    if (account && CONTRACT_CONFIG.CONTRACT_ADDRESS && CONTRACT_CONFIG.CONTRACT_ABI.length > 0) {
      try {
        const contractInstance = new Contract(CONTRACT_CONFIG.CONTRACT_ABI, CONTRACT_CONFIG.CONTRACT_ADDRESS, account)
        setContract(contractInstance)
      } catch (error) {
        console.error('Error initializing contract:', error)
      }
    }
  }, [account])

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      const starknet = await connect({
        webWalletUrl: "https://web.argent.xyz",
        modalMode: "canAsk",
        modalTheme: "light"
      })

      if (!starknet) {
        throw new Error('Failed to connect to Starknet wallet')
      }

      await starknet.enable()
      
      if (starknet.isConnected && starknet.account) {
        const walletAccount = new WalletAccount(provider, starknet)
        
        setWallet(starknet)
        setAccount(walletAccount)
        setAddress(starknet.account.address)
        setIsConnected(true)
        
        toast.success('Wallet connected successfully!')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      if (wallet) {
        await disconnect()
      }
      
      setWallet(null)
      setAccount(null)
      setAddress(null)
      setIsConnected(false)
      setContract(null)
      
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  // Auto-connect on page load if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      try {
        const starknet = await connect({ modalMode: "neverAsk" })
        if (starknet && starknet.isConnected && starknet.account) {
          const walletAccount = new WalletAccount(provider, starknet)
          
          setWallet(starknet)
          setAccount(walletAccount)
          setAddress(starknet.account.address)
          setIsConnected(true)
        }
      } catch (error) {
        console.log('Auto-connect failed:', error)
      }
    }

    autoConnect()
  }, [])

  const value = {
    wallet,
    account,
    address,
    isConnected,
    isConnecting,
    contract,
    connectWallet,
    disconnectWallet,
    provider
  }

  return (
    <StarknetContext.Provider value={value}>
      {children}
    </StarknetContext.Provider>
  )
}

export const useStarknet = () => {
  const context = useContext(StarknetContext)
  if (!context) {
    throw new Error('useStarknet must be used within a StarknetProvider')
  }
  return context
} 