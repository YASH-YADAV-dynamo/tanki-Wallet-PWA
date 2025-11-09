'use client'

import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { WalletButton } from '@/components/wallet-button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import './landing.css'

export default function LandingPage() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isConnected) {
    return (
      <div className="landing-page">
        <div className="bg-effects">
          <div className="bg-blob bg-blob-1"></div>
          <div className="bg-blob bg-blob-2"></div>
        </div>
        
        <nav className="nav">
          <div className="nav-logo">Tanki Wallet</div>
          <div className="nav-actions">
            <div className="nav-desktop">
              <WalletButton />
            </div>
            <button
              className="nav-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="nav-mobile-menu"
              >
                <WalletButton />
              </motion.div>
              <div
                className="overlay"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        <main className="landing-main">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="landing-hero"
            >
              <h1>
                <span className="gradient-text">Welcome Back!</span>
              </h1>
              <p>
                Your wallet is connected. Start managing your smart wallets and create new ones.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: 'inline-block', marginTop: '24px' }}
              >
                <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '16px 32px', textDecoration: 'none' }}>
                  Go to Dashboard →
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="landing-page">
      {/* Background Effects */}
      <div className="bg-effects">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="nav-logo"
        >
          Tanki Wallet
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="nav-actions"
        >
          <div className="nav-desktop">
            <WalletButton buttonText="Get Started" />
          </div>
          <button
            className="nav-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="nav-mobile-menu"
            >
              <WalletButton buttonText="Get Started" />
            </motion.div>
            <div
              className="overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="landing-main">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="landing-hero"
          >
            <h1>
              <span className="gradient-text">Smart Wallets</span>
              <br />
              <span className="text-white">That Expire</span>
            </h1>
            <p>
              Create time-based smart wallets from your EOA. Transfer funds, execute bundle transactions, 
              and let them automatically expire when time runs out. Secure, temporary, and fully controlled by you.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-block' }}
              className="hero-button"
            >
              <WalletButton buttonText="Get Started" />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

