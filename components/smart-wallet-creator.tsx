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
      className="p-6 bg-gray-900/50 border border-purple-500/20 rounded-xl backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-300">Create Smart Wallet</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Duration (days)
          </label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="7"
          />
          <p className="text-xs text-gray-500 mt-1">Wallet will expire after this duration</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Initial Funding (ETH) - Optional
          </label>
          <input
            type="number"
            min="0"
            step="0.001"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="0.0"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={isPending || isConfirming || isCreating || isSigning || !address}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          <p className="text-xs text-yellow-400 text-center">
            Please connect your wallet to create a smart wallet
          </p>
        )}

        {address && (
          <p className="text-xs text-gray-500 text-center">
            You'll be asked to sign a message to authorize wallet creation
          </p>
        )}

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
          >
            Transaction confirmed! Check your wallets below.
          </motion.div>
        )}

        {hash && (
          <div className="text-xs text-gray-500 break-all">
            TX: {hash}
          </div>
        )}
      </div>
    </motion.div>
  )
}

