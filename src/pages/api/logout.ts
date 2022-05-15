import { COOKIES } from '../../config'

export async function get({ params, request }) {
  const headers = new Headers()
  headers.append('Set-Cookie', `${COOKIES.nonce}=; Max-Age=0; SameSite=Strict; HttpOnly; Secure; Path=/`)
  headers.append('Set-Cookie', `${COOKIES.address}=; Max-Age=0; SameSite=Strict; HttpOnly; Secure; Path=/`)
  headers.append('Set-Cookie', `${COOKIES.verified}=; Max-Age=0; SameSite=Strict; HttpOnly; Secure; Path=/`)
  headers.append('Set-Cookie', `${COOKIES.did}=; Max-Age=0; SameSite=Strict; HttpOnly; Secure; Path=/`)
  headers.append('Content-Type', 'application/json')
  headers.append('Location', '/')
  return new Response(
    JSON.stringify({
      ok: true,
    }),
    {
      headers,
      status: 302,
    },
  )
}
