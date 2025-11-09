'use client'

import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { WalletButton } from '@/components/wallet-button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isConnected) {
    return (
      <div className="min-h-screen bg-black">
        <Link href="/dashboard" className="block w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg text-white font-semibold text-lg"
            >
              Go to Dashboard →
            </motion.div>
          </motion.div>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 md:px-12 py-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
        >
          Tanki Wallet
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <WalletButton />
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Smart Wallets
              </span>
              <br />
              <span className="text-white">That Expire</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
              Create time-based smart wallets from your EOA. Transfer funds, execute bundle transactions, 
              and let them automatically expire when time runs out.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <WalletButton />
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            <FeatureCard
              icon="⏱️"
              title="Time-Based Expiry"
              description="Set expiration times for your wallets. They automatically burn when time runs out."
              delay={0.1}
            />
            <FeatureCard
              icon="💸"
              title="Easy Transfers"
              description="Send and receive funds through your smart wallets with simple, intuitive controls."
              delay={0.2}
            />
            <FeatureCard
              icon="📦"
              title="Bundle Transactions"
              description="Execute multiple transactions with a single signature. Save gas and time."
              delay={0.3}
            />
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-32"
          >
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <StepCard
                number="1"
                title="Connect Wallet"
                description="Connect your EOA wallet using MetaMask or any Web3 extension"
              />
              <StepCard
                number="2"
                title="Create Smart Wallet"
                description="Set a duration and create a new smart wallet contract"
              />
              <StepCard
                number="3"
                title="Fund & Use"
                description="Transfer funds and execute transactions through your smart wallet"
              />
              <StepCard
                number="4"
                title="Auto Expire"
                description="Your wallet automatically expires after the set duration"
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-gray-800 mt-20">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>Built on Sepolia Testnet • Smart Contract Wallet Factory</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: string; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="p-6 bg-gray-900/50 border border-purple-500/20 rounded-xl backdrop-blur-sm"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-purple-300">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  )
}
