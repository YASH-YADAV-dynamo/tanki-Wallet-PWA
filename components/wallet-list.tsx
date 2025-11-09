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
      <div className="dashboard-card">
        <p className="text-gray-400">Please connect your wallet</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <div className="dashboard-wallet-header">
        <h2 className="dashboard-wallet-title">
          Your Smart Wallets ({wallets.length})
        </h2>
        <button
          onClick={() => refetch()}
          className="dashboard-refresh-btn"
        >
          Refresh
        </button>
      </div>

      {wallets.length === 0 ? (
        <div className="dashboard-empty-state">
          <p>No smart wallets created yet</p>
          <p className="small">Create your first smart wallet using the form</p>
        </div>
      ) : (
        <div className="dashboard-wallet-list">
          {wallets.map((wallet, index) => (
            <WalletCard key={wallet} walletAddress={wallet} index={index} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
