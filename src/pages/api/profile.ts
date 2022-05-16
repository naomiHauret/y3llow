import { Core } from '@self.id/core'
import { CERAMIC_CAIP10_LINKS, CERAMIC_BLOCKCHAINS, COOKIES } from '~/config'
import lightcookie from 'lightcookie'

export async function get({ request, params }) {
  const cookie = request.headers.get('cookie')
  const parsed = lightcookie.parse(cookie)
  const address = params?.address ? params.address : parsed[COOKIES.address]
  const ceramicClient = new Core({ ceramic: 'testnet-clay' })
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const capLink = CERAMIC_CAIP10_LINKS[CERAMIC_BLOCKCHAINS.ethereum]

  try {
    const did = await ceramicClient.getAccountDID(`${address}${capLink}`)
    const dataBasicProfile = await ceramicClient.get('basicProfile', did)

    return new Response(
      JSON.stringify({
        created: true,
        profile: dataBasicProfile && dataBasicProfile !== null ? dataBasicProfile : {},
      }),
      {
        headers,
        status: 200,
      },
    )
  } catch (e) {
    console.error(e)
    if (e.message.includes('No DID found')) {
      return new Response(
        JSON.stringify({
          message: 'No DID found',
          created: false,
        }),
        {
          headers,
        },
      )
    }
    if (e.message.includes('Service Temporarily Unavailable')) {
      return new Response(
        JSON.stringify({
          created: false,
          message: 'Ceramic is temporarily unavailable',
        }),
        {
          status: 503,
          headers,
        },
      )
    }
  }
}
