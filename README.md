# Tanki Wallet - Smart Time-Based Wallets

A modern, Phantom-styled web application for creating and managing time-based smart wallets on Ethereum. Create smart wallets that automatically expire, transfer funds, and execute bundle transactions with a single signature.

## Features

- 🎨 **Beautiful UI**: Purple and black themed, responsive design with smooth animations
- ⏱️ **Time-Based Wallets**: Create smart wallets with expiration times
- 💸 **Easy Transfers**: Send and receive funds through smart wallets
- 📦 **Bundle Transactions**: Execute multiple transactions with one signature
- 🔐 **Wallet Integration**: Connect via MetaMask or any Web3 extension
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Wagmi** - Ethereum React hooks
- **Viem** - Ethereum utilities
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or any Web3 wallet extension
- Sepolia testnet ETH (for testing)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tanki_wallet
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (copy from `env.template`):
```bash
# Network Configuration
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111

# Contract Addresses
NEXT_PUBLIC_SMART_WALLET_FACTORY_ADDRESS=0x69175C0ac62348714Eec98BA7716F70474AD823D

# Optional: Custom RPC URL
# NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# Or use Alchemy
# NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

4. Run the development server:
```bash
npm run dev
```

   **Or use the clean start script** (recommended if you encounter lock file errors):
   ```bash
   npm run dev:clean
   ```
   This automatically clears any lock files and stops conflicting processes before starting.

5. Open [http://localhost:3000](http://localhost:3000) in your browser (or the port shown in the terminal)

## Usage

### Landing Page
- Visit the homepage to learn about the product
- Click "Connect Wallet" to connect your EOA wallet

### Dashboard
After connecting your wallet:
1. **Create Smart Wallet**: Set a duration (in days) and optionally fund it
2. **View Wallets**: See all your created smart wallets with their status
3. **Transfer Funds**: Send ETH to single or multiple recipients
4. **Bundle Transactions**: Execute multiple transactions with one signature
5. **Withdraw**: Withdraw funds from expired or active wallets

## Contract Details

- **Network**: Sepolia Testnet
- **Factory Address**: `0x69175C0ac62348714Eec98BA7716F70474AD823D`
- **Deployer**: `0x3882445EC769d078a26B6A9E4F7b2F310cf1404c`

## Project Structure

```
tanki_wallet/
├── app/
│   ├── dashboard/       # Dashboard page
│   ├── page.tsx         # Landing page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── wallet-button.tsx           # Wallet connection button
│   ├── smart-wallet-creator.tsx    # Create wallet form
│   ├── wallet-list.tsx             # List of user wallets
│   ├── wallet-card.tsx             # Individual wallet card
│   ├── transfer-modal.tsx          # Transfer funds modal
│   ├── bundle-transaction-modal.tsx # Bundle transaction modal
│   └── providers.tsx               # Wagmi providers
├── contracts/
│   ├── SmartWallet.json            # SmartWallet ABI
│   └── SmartWalletFactory.json     # Factory ABI
└── lib/
    ├── wagmi.ts        # Wagmi configuration
    ├── contracts.ts    # Contract addresses and ABIs
    └── utils.ts        # Utility functions
```

## Features in Detail

### Smart Wallet Creation
- Set expiration duration in days
- Optionally fund the wallet during creation
- Wallets automatically expire after the set duration

### Fund Transfers
- Single transfers to one recipient
- Batch transfers to multiple recipients
- Support for ETH transfers

### Bundle Transactions
- Execute multiple transactions atomically
- Set target addresses, values, and calldata for each transaction
- All transactions execute with a single signature

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
