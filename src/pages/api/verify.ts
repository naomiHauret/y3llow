import { SiweMessage } from 'siwe'
import lightcookie from 'lightcookie'
import { COOKIES } from '../../config'

export async function post({ params, request }) {
  const { message, signature } = await request.json()
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (!message) {
    return new Response(
      JSON.stringify({
        message: 'Expected prepareMessage object as body.',
      }),
      {
        headers,
        status: 422,
      },
    )
  }

  try {
    const cookie = request.headers.get('cookie')
    const nonce = lightcookie.parse(cookie)[COOKIES.nonce]
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)

    if (fields.nonce !== nonce) {
      return new Response(
        JSON.stringify({
          message: 'Invalid nonce',
          valid: false,
        }),
        {
          headers,
          status: 422,
        },
      )
    }

    headers.append('Set-Cookie', `${COOKIES.verified}=true; SameSite=Strict; HttpOnly; Secure; Path=/`)

    return new Response(
      JSON.stringify({
        valid: true,
      }),
      {
        headers,
        status: 302,
      },
    )
  } catch (e) {
    console.error(e)
  }
}
