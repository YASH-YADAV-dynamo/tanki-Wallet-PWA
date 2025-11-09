'use client'

import { useState } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { SMART_WALLET_ABI } from '@/lib/contracts'
import { formatAddress, formatTime, formatEther } from '@/lib/utils'
import { parseEther, Address } from 'viem'
import { motion, AnimatePresence } from 'framer-motion'
import { TransferModal } from './transfer-modal'
import { BundleTransactionModal } from './bundle-transaction-modal'

interface WalletCardProps {
  walletAddress: `0x${string}`
  index: number
}

export function WalletCard({ walletAddress, index }: WalletCardProps) {
  const [showTransfer, setShowTransfer] = useState(false)
  const [showBundle, setShowBundle] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const { data: balance } = useBalance({
    address: walletAddress,
  })

  const { data: expiryTime } = useReadContract({
    address: walletAddress,
    abi: SMART_WALLET_ABI,
    functionName: 'expiryTime',
  })

  const { data: isActive } = useReadContract({
    address: walletAddress,
    abi: SMART_WALLET_ABI,
    functionName: 'isActive',
  })

  const { data: remainingTime } = useReadContract({
    address: walletAddress,
    abi: SMART_WALLET_ABI,
    functionName: 'getRemainingTime',
  })

  const { writeContract: withdraw, data: withdrawHash } = useWriteContract()
  const { isLoading: isWithdrawing } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  })

  const handleWithdraw = () => {
    withdraw({
      address: walletAddress,
      abi: SMART_WALLET_ABI,
      functionName: 'withdraw',
    })
  }

  const isExpired = expiryTime ? Number(expiryTime) * 1000 < Date.now() : false
  const isWalletActive = isActive === true

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="p-4 bg-black/50 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-purple-300">{formatAddress(walletAddress)}</h3>
              {isWalletActive && !isExpired ? (
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                  Active
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                  Expired
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Balance: {balance ? formatEther(balance.value) : '0'} ETH</p>
              {remainingTime !== undefined && (
                <p>Time Remaining: {formatTime(Number(remainingTime))}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-purple-400 hover:text-purple-300"
          >
            {showDetails ? '▼' : '▶'}
          </button>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-800 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowTransfer(true)}
                  disabled={!isWalletActive || isExpired}
                  className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Transfer
                </button>
                <button
                  onClick={() => setShowBundle(true)}
                  disabled={!isWalletActive || isExpired}
                  className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Bundle TX
                </button>
              </div>
              {balance && balance.value > BigInt(0) && (
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || !isWalletActive || isExpired}
                  className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showTransfer && (
        <TransferModal
          walletAddress={walletAddress}
          isActive={isWalletActive && !isExpired}
          onClose={() => setShowTransfer(false)}
        />
      )}

      {showBundle && (
        <BundleTransactionModal
          walletAddress={walletAddress}
          isActive={isWalletActive && !isExpired}
          onClose={() => setShowBundle(false)}
        />
      )}
    </>
  )
}

