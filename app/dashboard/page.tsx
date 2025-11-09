'use client'

import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { WalletButton } from '@/components/wallet-button'
import { SmartWalletCreator } from '@/components/smart-wallet-creator'
import { WalletList } from '@/components/wallet-list'
import { NetworkCheck } from '@/components/network-check'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { isConnected, address } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400">Loading...</div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Please connect your wallet</h2>
          <WalletButton />
          <Link href="/" className="block mt-4 text-purple-400 hover:text-purple-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetworkCheck />
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 md:px-12 py-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Tanki Wallet
          </Link>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Manage your smart wallets and transactions</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Wallet Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <SmartWalletCreator />
            </motion.div>

            {/* Wallet List Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <WalletList />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

