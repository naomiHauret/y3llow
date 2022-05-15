import { createClient } from '@wagmi/core'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'

export const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector()],
})

export default client
