'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function AutoConnect() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const [hasTriedAutoConnect, setHasTriedAutoConnect] = useState(false)

  useEffect(() => {
    // Only auto-connect once and if not already connected
    if (isConnected || hasTriedAutoConnect) return

    const tryAutoConnect = async () => {
      // Wait a bit for wallet extensions to initialize
      await new Promise(resolve => setTimeout(resolve, 300))

      // Check if we're in the browser
      if (typeof window === 'undefined') return

      // Check for injected wallet (MetaMask, Coinbase Wallet, etc.)
      const injectedConnector = connectors.find(c => c.type === 'injected')
      
      if (injectedConnector && window.ethereum) {
        try {
          // Check if wallet is already authorized
          const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]
          
          if (accounts && accounts.length > 0) {
            // Wallet is authorized, try to connect
            connect({ 
              connector: injectedConnector,
              chainId: sepolia.id,
            })
            setHasTriedAutoConnect(true)
          } else {
            setHasTriedAutoConnect(true)
          }
        } catch (error) {
          // Silently fail - user can manually connect
          console.debug('Auto-connect skipped:', error)
          setHasTriedAutoConnect(true)
        }
      } else {
        setHasTriedAutoConnect(true)
      }
    }

    tryAutoConnect()
  }, [isConnected, hasTriedAutoConnect, connectors, connect])

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        return
      }
      // Account changed - wagmi will handle reconnection
    }

    const handleChainChanged = () => {
      // Chain changed - wagmi will handle this
      window.location.reload()
    }

    window.ethereum.on?.('accountsChanged', handleAccountsChanged)
    window.ethereum.on?.('chainChanged', handleChainChanged)

    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [])

  return null
}

