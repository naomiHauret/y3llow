import { createClient, chain, configureChains } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'

export const CHAIN_AVALANCHE_ID = 43_114
const avalancheChain = {
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
  },
  id: CHAIN_AVALANCHE_ID,
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: 'https://api.avax.network/ext/bc/C/rpc',
  },
  testnet: false,
}

export const CHAIN_FANTOM_ID = 250
const fantomChain = {
  blockExplorers: {
    default: { name: 'FTMScan', url: 'https://ftmscan.com/' },
    etherscan: { name: 'FTMScan', url: 'https://ftmscan.com/' },
  },
  id: CHAIN_FANTOM_ID,
  name: 'Fantom',
  network: 'fantom',
  nativeCurrency: {
    decimals: 18,
    name: 'Fantom',
    symbol: 'FTM',
  },
  rpcUrls: {
    default: 'https://rpc.ftm.tools/',
  },
  testnet: false,
}

export const CHAIN_BSC_ID = 56
const binanceSmartChain = {
  blockExplorers: {
    default: { name: 'BSCScan', url: 'https://bscscan.com/' },
    etherscan: { name: 'BSCScan', url: 'https://bscscan.com/' },
  },
  id: CHAIN_BSC_ID,
  name: 'Binance Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: 'https://bsc-dataseed.binance.org/',
  },
  testnet: false,
}

const defaultChains = [
  chain.mainnet,
  fantomChain,
  avalancheChain,
  binanceSmartChain,
  chain.polygon,
  chain.optimism,
  chain.arbitrum,
  chain.rinkeby,
  chain.polygonMumbai,
]

export const supportedChains = {
  [chain.mainnet.id]: {
    ...chain.mainnet,
    icon: '/ethereum.webp',
  },
  [CHAIN_FANTOM_ID]: {
    ...fantomChain,
    icon: '/fantom.webp',
  },
  [CHAIN_AVALANCHE_ID]: {
    ...avalancheChain,
    icon: '/avalanche.webp',
  },
  [chain.rinkeby.id]: {
    ...chain.rinkeby,
    icon: '/ethereum.webp',
  },
  [chain.polygon.id]: {
    ...chain.polygon,
    icon: '/polygon.webp',
  },
  [chain.polygonMumbai.id]: {
    ...chain.polygonMumbai,
    icon: '/polygon.webp',
  },
  [chain.optimism.id]: {
    ...chain.optimism,
    icon: '/optimism.webp',
  },
  [chain.arbitrum.id]: {
    ...chain.arbitrum,
    icon: '/arbitrum.webp',
  },
  [CHAIN_BSC_ID]: {
    ...binanceSmartChain,
    icon: '/bsc.webp',
  },
}

const { chains, provider } = configureChains(defaultChains, [publicProvider()])

export const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
  ],
})

export default client
