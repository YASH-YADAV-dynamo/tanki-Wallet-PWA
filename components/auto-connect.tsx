'use client'

import { useEffect, useRef } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function AutoConnect() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const hasAutoConnectedRef = useRef(false)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    // Only auto-connect once and if not already connected
    if (isConnected || hasAutoConnectedRef.current || hasInitializedRef.current) {
      return
    }

    // Mark as initialized immediately to prevent multiple attempts
    hasInitializedRef.current = true

    const tryAutoConnect = async () => {
      // Wait a bit for wallet extensions to initialize
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check if we're in the browser
      if (typeof window === 'undefined') {
        return
      }

      // Check for injected wallet (MetaMask, Coinbase Wallet, etc.)
      const injectedConnector = connectors.find(c => c.type === 'injected')
      
      if (injectedConnector && window.ethereum) {
        try {
          // Check if wallet is already authorized
          const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]
          
          if (accounts && accounts.length > 0) {
            // Wallet is authorized, try to connect
            hasAutoConnectedRef.current = true
            try {
              await connect({ 
                connector: injectedConnector,
                chainId: sepolia.id,
              })
            } catch (connectError) {
              // Connection failed, but we tried
              console.debug('Auto-connect failed:', connectError)
              hasAutoConnectedRef.current = false
            }
          }
        } catch (error) {
          // Silently fail - user can manually connect
          console.debug('Auto-connect skipped:', error)
        }
      }
    }

    tryAutoConnect()
  }, [isConnected, connect, connectors])

  // Listen for account changes (removed chain change reload to prevent infinite loops)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[]
      if (accounts && accounts.length === 0) {
        // User disconnected their wallet
        return
      }
      // Account changed - wagmi will handle reconnection automatically
    }

    window.ethereum.on?.('accountsChanged', handleAccountsChanged)

    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
    }
  }, [])

  return null
}

