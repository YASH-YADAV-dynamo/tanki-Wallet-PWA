'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SMART_WALLET_ABI } from '@/lib/contracts'
import { parseEther, Address, encodeFunctionData } from 'viem'
import { motion, AnimatePresence } from 'framer-motion'
import '../app/modals.css'

interface BundleTransactionModalProps {
  walletAddress: `0x${string}`
  isActive: boolean
  onClose: () => void
}

export function BundleTransactionModal({ walletAddress, isActive, onClose }: BundleTransactionModalProps) {
  const [transactions, setTransactions] = useState([
    { target: '', value: '', data: '' }
  ])

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const addTransaction = () => {
    setTransactions([...transactions, { target: '', value: '', data: '' }])
  }

  const removeTransaction = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index))
  }

  const updateTransaction = (index: number, field: 'target' | 'value' | 'data', value: string) => {
    const newTransactions = [...transactions]
    newTransactions[index][field] = value
    setTransactions(newTransactions)
  }

  const handleExecute = async () => {
    const validTransactions = transactions.filter(t => t.target.trim() !== '')

    if (validTransactions.length === 0) {
      alert('Please add at least one transaction')
      return
    }

    try {
      const targets = validTransactions.map(t => t.target as Address)
      const values = validTransactions.map(t => 
        t.value ? parseEther(t.value) : BigInt(0)
      )
      const calldatas = validTransactions.map(t => 
        t.data ? (t.data.startsWith('0x') ? t.data as `0x${string}` : `0x${t.data}`) : '0x' as `0x${string}`
      )

      await writeContract({
        address: walletAddress,
        abi: SMART_WALLET_ABI,
        functionName: 'executeBatch',
        args: [targets, values, calldatas],
      })
    } catch (error) {
      console.error('Bundle execution error:', error)
      alert('Bundle execution failed')
    }
  }

  if (!isActive) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-purple-500/20 rounded-xl p-6 max-w-md w-full"
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
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-purple-500/20 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-purple-300">Bundle Transactions</h3>
              <p className="text-sm text-gray-400 mt-1">Execute multiple transactions with one signature</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-black/50 border border-purple-500/20 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-purple-300">Transaction {index + 1}</span>
                  {transactions.length > 1 && (
                    <button
                      onClick={() => removeTransaction(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Target Address
                    </label>
                    <input
                      type="text"
                      value={tx.target}
                      onChange={(e) => updateTransaction(index, 'target', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Value (ETH) - Optional
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={tx.value}
                      onChange={(e) => updateTransaction(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Calldata (hex) - Optional
                    </label>
                    <input
                      type="text"
                      value={tx.data}
                      onChange={(e) => updateTransaction(index, 'data', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                      placeholder="0x..."
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            <button
              onClick={addTransaction}
              className="w-full px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 transition-colors"
            >
              + Add Transaction
            </button>

            <button
              onClick={handleExecute}
              disabled={isPending || isConfirming}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
            >
              {isPending || isConfirming ? 'Executing...' : `Execute Bundle (${transactions.length} transactions)`}
            </button>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
              >
                Bundle executed successfully!
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

