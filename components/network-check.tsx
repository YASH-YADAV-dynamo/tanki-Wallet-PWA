'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { motion, AnimatePresence } from 'framer-motion'

export function NetworkCheck() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { isConnected } = useAccount()

  const isCorrectNetwork = chainId === sepolia.id

  if (!isConnected || isCorrectNetwork) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-yellow-300 font-semibold">Wrong Network</p>
            <p className="text-yellow-400/80 text-sm">Please switch to Sepolia testnet</p>
          </div>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-300 font-medium transition-colors"
          >
            Switch Network
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

