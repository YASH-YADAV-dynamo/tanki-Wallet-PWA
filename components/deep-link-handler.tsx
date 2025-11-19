'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'

/**
 * Deep Link Handler Component
 * Handles deep links, URL parameters, and protocol handlers for PWA
 */
export function DeepLinkHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isConnected } = useAccount()

  useEffect(() => {
    // Handle URL parameters
    const action = searchParams.get('action')
    const wallet = searchParams.get('wallet')
    const route = searchParams.get('route')

    if (action) {
      handleAction(action, wallet)
    }

    if (route) {
      handleRoute(route)
    }

    // Handle protocol handlers (web+tanki:// or tanki-wallet://)
    if (typeof window !== 'undefined') {
      // Check if we're being opened from a protocol handler
      const url = window.location.href
      if (url.includes('web+tanki://') || url.includes('tanki-wallet://')) {
        const protocolMatch = url.match(/(?:web\+tanki|tanki-wallet):\/\/(.+)/)
        if (protocolMatch) {
          const protocolData = decodeURIComponent(protocolMatch[1])
          handleProtocolData(protocolData)
        }
      }
    }
  }, [searchParams, router, isConnected])

  const handleAction = (action: string, wallet?: string | null) => {
    switch (action) {
      case 'connect':
        // Handle wallet connection deep link
        if (wallet) {
          console.log('Deep link: Connect wallet', wallet)
          // You can add wallet connection logic here
        }
        break
      case 'dashboard':
        router.push('/dashboard')
        break
      case 'create':
        if (isConnected) {
          router.push('/dashboard?action=create')
        }
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  const handleRoute = (route: string) => {
    // Handle direct route navigation
    const validRoutes = ['/', '/dashboard']
    if (validRoutes.includes(route)) {
      router.push(route)
    }
  }

  const handleProtocolData = (data: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(data)
      if (parsed.action) {
        handleAction(parsed.action, parsed.wallet)
      } else if (parsed.route) {
        handleRoute(parsed.route)
      }
    } catch {
      // If not JSON, treat as action string
      handleAction(data)
    }
  }

  return null // This component doesn't render anything
}

