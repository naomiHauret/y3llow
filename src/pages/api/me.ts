import lightcookie from 'lightcookie'
import { COOKIES } from '../../config'

export async function get({ params, request }) {
  const cookie = request.headers.get('cookie')
  const address = lightcookie.parse(cookie)[COOKIES.address]
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (!address)
    return new Response(
      JSON.stringify({
        message: 'Not found',
      }),
      {
        headers,
        status: 404,
      },
    )

  return new Response(
    JSON.stringify({
      address: address,
    }),
    {
      headers,
      status: 200,
    },
  )
}
