import { generateNonce } from 'siwe'

export async function post({ params, request }) {
  const nonce = generateNonce()
  const { address } = await request.json()

  const headers = new Headers()
  headers.append('Set-Cookie', `nonce=${nonce}; SameSite=Strict; HttpOnly; Secure; Path=/`)
  headers.append('Set-Cookie', `address=${address}; SameSite=Strict; HttpOnly; Secure; Path=/`)
  headers.append('Content-Type', 'application/json')

  return new Response(
    JSON.stringify({
      nonce: nonce,
      address: address,
    }),
    {
      headers,
      status: 200,
    },
  )
}
