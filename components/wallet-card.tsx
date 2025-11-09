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
        className="wallet-card"
      >
        <div className="wallet-card-header">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h3 className="wallet-address-text">{formatAddress(walletAddress)}</h3>
              {isWalletActive && !isExpired ? (
                <span className="wallet-status wallet-status-active">
                  Active
                </span>
              ) : (
                <span className="wallet-status wallet-status-expired">
                  Expired
                </span>
              )}
            </div>
            <div className="wallet-info">
              <div className="wallet-info-item">
                <span>Balance: {balance ? formatEther(balance.value) : '0'} ETH</span>
              </div>
              {remainingTime !== undefined && (
                <div className="wallet-info-item">
                  <span>Time Remaining: {formatTime(Number(remainingTime))}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="wallet-toggle"
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
              style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--gray-800)' }}
            >
              <div className="wallet-actions">
                <button
                  onClick={() => setShowTransfer(true)}
                  disabled={!isWalletActive || isExpired}
                  className="wallet-action-btn"
                >
                  Transfer
                </button>
                <button
                  onClick={() => setShowBundle(true)}
                  disabled={!isWalletActive || isExpired}
                  className="wallet-action-btn"
                >
                  Bundle TX
                </button>
              </div>
              {balance && balance.value > BigInt(0) && (
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || !isWalletActive || isExpired}
                  className="wallet-action-btn wallet-withdraw-btn"
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
