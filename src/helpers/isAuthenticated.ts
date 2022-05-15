import lightcookie from 'lightcookie'
import { COOKIES } from '~/config'

export function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie')
  const parsed = lightcookie.parse(cookie)
  return COOKIES.address in parsed && COOKIES.nonce in parsed && COOKIES.verified in parsed
}

export default isAuthenticated
