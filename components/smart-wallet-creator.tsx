'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSignMessage } from 'wagmi'
import { parseEther } from 'viem'
import { SMART_WALLET_FACTORY_ADDRESS, SMART_WALLET_FACTORY_ABI } from '@/lib/contracts'
import { motion } from 'framer-motion'

export function SmartWalletCreator() {
  const [duration, setDuration] = useState('7')
  const [fundAmount, setFundAmount] = useState('0')
  const [isCreating, setIsCreating] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleCreate = async () => {
    if (!duration || parseFloat(duration) <= 0) {
      alert('Please enter a valid duration in days')
      return
    }

    if (!address) {
      alert('Please connect your wallet first')
      return
    }

    setIsCreating(true)
    setIsSigning(true)

    try {
      // Step 1: Sign a message to authorize wallet creation
      const message = `I authorize the creation of a smart wallet with ${duration} day expiration.\n\nTimestamp: ${Date.now()}\nAddress: ${address}`
      
      try {
        await signMessageAsync({ 
          message,
        })
      } catch (signError: any) {
        // User rejected the signature
        if (signError?.code === 4001) {
          alert('Signature rejected. Please approve the message to create a wallet.')
          return
        }
        throw signError
      }

      setIsSigning(false)

      // Step 2: Create the smart wallet via contract
      const durationInSeconds = BigInt(Math.floor(parseFloat(duration) * 24 * 60 * 60))
      const fundAmountWei = fundAmount && parseFloat(fundAmount) > 0 
        ? parseEther(fundAmount) 
        : BigInt(0)

      if (fundAmountWei > 0) {
        await writeContract({
          address: SMART_WALLET_FACTORY_ADDRESS,
          abi: SMART_WALLET_FACTORY_ABI,
          functionName: 'createAndFundWallet',
          args: [durationInSeconds],
          value: fundAmountWei,
        })
      } else {
        await writeContract({
          address: SMART_WALLET_FACTORY_ADDRESS,
          abi: SMART_WALLET_FACTORY_ABI,
          functionName: 'createSmartWallet',
          args: [durationInSeconds],
        })
      }
    } catch (error: any) {
      console.error('Error creating wallet:', error)
      if (error?.code !== 4001) {
        alert(error?.message || 'Failed to create wallet. Please try again.')
      }
    } finally {
      setIsCreating(false)
      setIsSigning(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <h2 className="dashboard-card-title">Create Smart Wallet</h2>
      
      <div>
        <div className="dashboard-form-group">
          <label className="dashboard-form-label">
            Duration (days)
          </label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="dashboard-form-input"
            placeholder="7"
          />
          <p className="dashboard-form-hint">Wallet will expire after this duration</p>
        </div>

        <div className="dashboard-form-group">
          <label className="dashboard-form-label">
            Initial Funding (ETH) - Optional
          </label>
          <input
            type="number"
            min="0"
            step="0.001"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            className="dashboard-form-input"
            placeholder="0.0"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={isPending || isConfirming || isCreating || isSigning || !address}
          className="dashboard-btn"
        >
          {isSigning
            ? 'Sign Message...'
            : isPending || isConfirming || isCreating
            ? 'Creating Wallet...'
            : isSuccess
            ? 'Wallet Created!'
            : !address
            ? 'Connect Wallet First'
            : 'Create Wallet'}
        </button>

        {!address && (
          <p className="text-xs text-yellow-400 text-center" style={{ marginTop: '12px', fontSize: '0.75rem' }}>
            Please connect your wallet to create a smart wallet
          </p>
        )}

        {address && (
          <p className="dashboard-form-hint text-center" style={{ marginTop: '8px' }}>
            You'll be asked to sign a message to authorize wallet creation
          </p>
        )}

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="success-message"
          >
            Transaction confirmed! Check your wallets below.
          </motion.div>
        )}

        {hash && (
          <div className="tx-hash">
            TX: {hash}
          </div>
        )}
      </div>
    </motion.div>
  )
}
