'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import { useState, Suspense } from 'react'
import { AutoConnect } from './auto-connect'
import { DeepLinkHandler } from './deep-link-handler'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect />
        <Suspense fallback={null}>
          <DeepLinkHandler />
        </Suspense>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

