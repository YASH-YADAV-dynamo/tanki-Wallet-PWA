'use client'

import { useAccount, useReadContract } from 'wagmi'
import { SMART_WALLET_FACTORY_ADDRESS, SMART_WALLET_FACTORY_ABI, SMART_WALLET_ABI } from '@/lib/contracts'
import { formatAddress, formatTime } from '@/lib/utils'
import { WalletCard } from './wallet-card'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function WalletList() {
  const { address } = useAccount()
  const [wallets, setWallets] = useState<`0x${string}`[]>([])

  const { data: userWallets, refetch } = useReadContract({
    address: SMART_WALLET_FACTORY_ADDRESS,
    abi: SMART_WALLET_FACTORY_ABI,
    functionName: 'getUserWallets',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  useEffect(() => {
    if (userWallets) {
      setWallets(userWallets as `0x${string}`[])
    }
  }, [userWallets])

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [refetch])

  if (!address) {
    return (
      <div className="p-6 bg-gray-900/50 border border-purple-500/20 rounded-xl backdrop-blur-sm">
        <p className="text-gray-400">Please connect your wallet</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gray-900/50 border border-purple-500/20 rounded-xl backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-300">
          Your Smart Wallets ({wallets.length})
        </h2>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {wallets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No smart wallets created yet</p>
          <p className="text-sm text-gray-500">Create your first smart wallet using the form on the left</p>
        </div>
      ) : (
        <div className="space-y-4">
          {wallets.map((wallet, index) => (
            <WalletCard key={wallet} walletAddress={wallet} index={index} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

