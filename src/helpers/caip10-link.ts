import { CeramicClient } from '@ceramicnetwork/http-client'
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'
import { CERAMIC_BLOCKCHAINS, CERAMIC_CAIP10_LINKS, CERAMIC_ENDPOINT } from '~/config'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'

const ceramic = new CeramicClient(CERAMIC_ENDPOINT)
const capLink = CERAMIC_CAIP10_LINKS[CERAMIC_BLOCKCHAINS.ethereum]

export async function getLinkedDID(address: string) {
  const link = await Caip10Link.fromAccount(ceramic, `${address}${capLink}`)
  return link.did
}

export async function linkCurrentAddress(address: string, did: string) {
  const authProvider = new EthereumAuthProvider(window.ethereum, address)

  // Retrieve the CAIP-10 account from the EthereumAuthProvider instance
  const accountId = await authProvider.accountId()

  // Load the account link based on the account ID
  const accountLink = await Caip10Link.fromAccount(ceramic, accountId.toString())

  // Link the DID to the account using the EthereumAuthProvider instance
  const link = await accountLink.setDid(did, authProvider)

  return link
}
