'use client'

import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { WalletButton } from '@/components/wallet-button'
import { SmartWalletCreator } from '@/components/smart-wallet-creator'
import { WalletList } from '@/components/wallet-list'
import { NetworkCheck } from '@/components/network-check'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import './dashboard.css'

export default function DashboardPage() {
  const { isConnected, address } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="loading-screen">
        <div className="text-purple-400">Loading...</div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="connect-screen">
        <div className="connect-content">
          <h2>Please Connect Your Wallet</h2>
          <WalletButton />
          <Link href="/">← Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <NetworkCheck />
      
      {/* Background Effects */}
      <div className="dashboard-bg">
        <div className="dashboard-blob dashboard-blob-1"></div>
        <div className="dashboard-blob dashboard-blob-2"></div>
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <Link href="/" className="dashboard-logo">
            Tanki Wallet
          </Link>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Manage your smart wallets and transactions</p>
        </div>

        <div className="dashboard-grid">
          {/* Create Wallet Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SmartWalletCreator />
          </motion.div>

          {/* Wallet List Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <WalletList />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
