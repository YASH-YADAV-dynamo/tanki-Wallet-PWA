'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SMART_WALLET_ABI } from '@/lib/contracts'
import { parseEther, Address } from 'viem'
import { motion, AnimatePresence } from 'framer-motion'
import { formatAddress } from '@/lib/utils'
import '../app/modals.css'

interface TransferModalProps {
  walletAddress: `0x${string}`
  isActive: boolean
  onClose: () => void
}

export function TransferModal({ walletAddress, isActive, onClose }: TransferModalProps) {
  const [transferType, setTransferType] = useState<'eth' | 'erc20'>('eth')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [recipients, setRecipients] = useState<string[]>([''])
  const [amounts, setAmounts] = useState<string[]>([''])

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSingleTransfer = async () => {
    if (!recipient || !amount) {
      alert('Please fill in all fields')
      return
    }

    try {
      if (transferType === 'eth') {
        await writeContract({
          address: walletAddress,
          abi: SMART_WALLET_ABI,
          functionName: 'execute',
          args: [recipient as Address, parseEther(amount), '0x'],
        })
      } else {
        // ERC20 transfer would need token contract interaction
        alert('ERC20 transfers coming soon')
      }
    } catch (error) {
      console.error('Transfer error:', error)
      alert('Transfer failed')
    }
  }

  const handleBatchTransfer = async () => {
    const validRecipients = recipients.filter(r => r.trim() !== '')
    const validAmounts = amounts.filter((a, i) => a.trim() !== '' && i < validRecipients.length)

    if (validRecipients.length === 0 || validRecipients.length !== validAmounts.length) {
      alert('Please fill in all recipient and amount fields')
      return
    }

    try {
      await writeContract({
        address: walletAddress,
        abi: SMART_WALLET_ABI,
        functionName: 'batchTransferETH',
        args: [
          validRecipients.map(r => r as Address),
          validAmounts.map(a => parseEther(a)),
        ],
      })
    } catch (error) {
      console.error('Batch transfer error:', error)
      alert('Batch transfer failed')
    }
  }

  const addRecipient = () => {
    setRecipients([...recipients, ''])
    setAmounts([...amounts, ''])
  }

  if (!isActive) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
            style={{ maxWidth: '512px' }}
          >
            <h3 className="text-xl font-bold mb-4 text-red-400">Wallet Expired</h3>
            <p className="text-gray-400 mb-4">This wallet has expired and cannot execute transactions.</p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
            style={{ maxWidth: '768px' }}
          >
          <div className="modal-header">
            <h3 className="modal-title">Transfer Funds</h3>
            <button
              onClick={onClose}
              className="modal-close"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Transfer Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTransferType('eth')}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    transferType === 'eth'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-black/50 border-gray-700 text-gray-400'
                  }`}
                >
                  ETH
                </button>
                <button
                  onClick={() => setTransferType('erc20')}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    transferType === 'erc20'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-black/50 border-gray-700 text-gray-400'
                  }`}
                >
                  ERC20
                </button>
              </div>
            </div>

            {/* Single Transfer */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-300">Single Transfer</h4>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="0.0"
                />
              </div>
              <button
                onClick={handleSingleTransfer}
                disabled={isPending || isConfirming}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
              >
                {isPending || isConfirming ? 'Processing...' : 'Transfer'}
              </button>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-300">Batch Transfer</h4>
                <button
                  onClick={addRecipient}
                  className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 text-sm"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recipients.map((_, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={recipients[index]}
                      onChange={(e) => {
                        const newRecipients = [...recipients]
                        newRecipients[index] = e.target.value
                        setRecipients(newRecipients)
                      }}
                      className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="Recipient"
                    />
                    <input
                      type="number"
                      step="0.001"
                      value={amounts[index]}
                      onChange={(e) => {
                        const newAmounts = [...amounts]
                        newAmounts[index] = e.target.value
                        setAmounts(newAmounts)
                      }}
                      className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="Amount"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleBatchTransfer}
                disabled={isPending || isConfirming}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
              >
                {isPending || isConfirming ? 'Processing...' : 'Batch Transfer'}
              </button>
            </div>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
              >
                Transfer successful!
              </motion.div>
            )}

            {hash && (
              <div className="text-xs text-gray-500 break-all">
                TX: {hash}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

