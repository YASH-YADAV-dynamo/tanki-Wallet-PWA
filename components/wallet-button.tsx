'use client'

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatAddress } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, connectors, isPending, error } = useConnect({
    onError: (error) => {
      console.error('Connection error:', error)
    },
  })
  const { disconnect } = useDisconnect()
  const [isAutoConnecting, setIsAutoConnecting] = useState(true)
  const [showWalletOptions, setShowWalletOptions] = useState(false)

  // Check if wallet extension is available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Give a moment for auto-connect to work
      const timer = setTimeout(() => {
        setIsAutoConnecting(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <span className="text-sm font-medium text-purple-300">
            {formatAddress(address)}
          </span>
          {chainId !== sepolia.id && (
            <span className="ml-2 text-xs text-yellow-400">Wrong Network</span>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  // Filter and organize connectors
  const injectedConnector = connectors.find(c => c.type === 'injected')
  const metaMaskConnector = connectors.find(c => c.id === 'metaMaskSDK' || c.id === 'metaMask')
  const walletConnectConnector = connectors.find(c => c.id === 'walletConnect' || c.type === 'walletConnect')
  
  const availableConnectors = [
    ...(injectedConnector ? [injectedConnector] : []),
    ...(metaMaskConnector && metaMaskConnector !== injectedConnector ? [metaMaskConnector] : []),
    ...(walletConnectConnector ? [walletConnectConnector] : []),
  ].filter(Boolean)

  if (availableConnectors.length === 0) {
    return (
      <div className="px-6 py-3 bg-gray-500/20 rounded-lg text-gray-400 text-sm">
        Please install MetaMask or another Web3 wallet
      </div>
    )
  }

  // Show connecting state during auto-connect
  if (isAutoConnecting && typeof window !== 'undefined' && window.ethereum) {
    return (
      <div className="px-6 py-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <span className="text-sm font-medium text-purple-300">
          Connecting...
        </span>
      </div>
    )
  }

  const getConnectorName = (connector: any) => {
    if (connector.id === 'walletConnect' || connector.type === 'walletConnect') {
      return 'WalletConnect'
    }
    if (connector.id === 'metaMask' || connector.id === 'metaMaskSDK') {
      return 'MetaMask'
    }
    if (connector.type === 'injected') {
      return 'Browser Wallet'
    }
    return connector.name || 'Wallet'
  }

  const getConnectorIcon = (connector: any) => {
    if (connector.id === 'walletConnect' || connector.type === 'walletConnect') {
      return '🔗'
    }
    if (connector.id === 'metaMask' || connector.id === 'metaMaskSDK') {
      return '🦊'
    }
    return '💼'
  }

  // If only one connector, connect directly
  if (availableConnectors.length === 1) {
    return (
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => connect({ connector: availableConnectors[0], chainId: sepolia.id })}
          disabled={isPending}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-semibold text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
        {error && (
          <p className="text-xs text-red-400 max-w-xs text-right">
            {error.message || 'Failed to connect. Please try again.'}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-end gap-2">
      <button
        onClick={() => setShowWalletOptions(!showWalletOptions)}
        disabled={isPending}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-semibold text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Connect Wallet
      </button>

      <AnimatePresence>
        {showWalletOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 w-64 bg-gray-900 border border-purple-500/20 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2">
              {availableConnectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector, chainId: sepolia.id })
                    setShowWalletOptions(false)
                  }}
                  disabled={isPending}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-xl">{getConnectorIcon(connector)}</span>
                  <span className="text-sm font-medium text-white">
                    {getConnectorName(connector)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-red-400 max-w-xs text-right">
          {error.message || 'Failed to connect. Please try again.'}
        </p>
      )}

      {/* Click outside to close */}
      {showWalletOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowWalletOptions(false)}
        />
      )}
    </div>
  )
}

