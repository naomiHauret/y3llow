import { createClient, chain } from '@wagmi/core'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'

const defaultChains = [chain.mainnet, chain.rinkeby, chain.polygon, chain.polygonMumbai, chain.optimism, chain.arbitrum]

export const supportedChains = {
  [chain.mainnet.id]: {
    ...chain.mainnet,
    icon: '/ethereum.webp',
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
}

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: defaultChains,
    }),
  ],
})

export default client
