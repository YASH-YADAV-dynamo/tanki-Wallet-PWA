import { Address } from 'viem'
import SmartWalletFactoryABI from '@/contracts/SmartWalletFactory.json'
import SmartWalletABI from '@/contracts/SmartWallet.json'

export const SMART_WALLET_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_SMART_WALLET_FACTORY_ADDRESS as Address || '0x69175C0ac62348714Eec98BA7716F70474AD823D'

export const SMART_WALLET_FACTORY_ABI = SmartWalletFactoryABI
export const SMART_WALLET_ABI = SmartWalletABI

