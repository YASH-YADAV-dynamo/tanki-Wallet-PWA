import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const factoryAddress = process.env.NEXT_PUBLIC_SMART_WALLET_FACTORY_ADDRESS || '0x69175C0ac62348714Eec98BA7716F70474AD823D'

// Default to reliable public RPC endpoints if no custom RPC is provided
const getRpcUrl = () => {
  if (process.env.NEXT_PUBLIC_RPC_URL) {
    return process.env.NEXT_PUBLIC_RPC_URL
  }
  // Use multiple fallback RPC endpoints for reliability
  return 'https://ethereum-sepolia-rpc.publicnode.com'
}

// WalletConnect Project ID - get one from https://cloud.walletconnect.com
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const connectors = [
  injected(),
  metaMask(),
]

// Add WalletConnect if project ID is provided
if (walletConnectProjectId) {
  connectors.push(
    walletConnect({
      projectId: walletConnectProjectId,
      metadata: {
        name: 'Tanki Wallet',
        description: 'Smart Time-Based Wallets',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://tanki-wallet.vercel.app',
        icons: [],
      },
      showQrModal: true,
    }) as any
  )
}

export const config = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(getRpcUrl(), {
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
  ssr: false,
})

export { factoryAddress }

