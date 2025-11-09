'use client'

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatAddress } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WalletButtonProps {
  buttonText?: string
}

export function WalletButton({ buttonText = 'Connect Wallet' }: WalletButtonProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, connectors, isPending, error } = useConnect()
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
      <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
        <div className="wallet-address">
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            {formatAddress(address)}
          </span>
          {chainId !== sepolia.id && (
            <span className="ml-2" style={{ fontSize: '0.75rem', color: 'var(--yellow-400)' }}>Wrong Network</span>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="btn btn-danger"
          style={{ padding: '8px 16px', fontSize: '0.875rem' }}
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
      <div className="card" style={{ padding: '12px 24px', background: 'rgba(107, 114, 128, 0.2)' }}>
        <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
          Please install MetaMask or another Web3 wallet
        </span>
      </div>
    )
  }

  // Show connecting state during auto-connect
  if (isAutoConnecting && typeof window !== 'undefined' && window.ethereum) {
    return (
      <div className="wallet-address">
        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
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


  // If only one connector, connect directly
  if (availableConnectors.length === 1) {
    return (
      <div className="wallet-button-container">
        <button
          onClick={() => connect({ connector: availableConnectors[0], chainId: sepolia.id })}
          disabled={isPending}
          className="btn btn-primary"
        >
          {isPending ? 'Connecting...' : buttonText}
        </button>
        {error && (
          <p className="wallet-error">
            {error.message || 'Failed to connect. Please try again.'}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="wallet-button-container">
      <button
        onClick={() => setShowWalletOptions(!showWalletOptions)}
        disabled={isPending}
        className="btn btn-primary"
      >
        {buttonText}
      </button>

      <AnimatePresence>
        {showWalletOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="wallet-dropdown"
          >
            <div style={{ padding: '8px' }}>
              {availableConnectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector, chainId: sepolia.id })
                    setShowWalletOptions(false)
                  }}
                  disabled={isPending}
                  className="wallet-option"
                >
                  <span>{getConnectorName(connector)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="wallet-error">
          {error.message || 'Failed to connect. Please try again.'}
        </p>
      )}

      {/* Click outside to close */}
      {showWalletOptions && (
        <div
          className="overlay"
          onClick={() => setShowWalletOptions(false)}
        />
      )}
    </div>
  )
}
