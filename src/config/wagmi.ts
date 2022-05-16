import { createClient, chain } from '@wagmi/core'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'

const defaultChains = [chain.mainnet, chain.rinkeby, chain.polygon, chain.polygonMumbai, chain.optimism, chain.arbitrum]
export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: defaultChains,
    }),
  ],
})

export default client
