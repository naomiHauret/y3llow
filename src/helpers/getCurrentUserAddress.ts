import lightcookie from 'lightcookie'
import { COOKIES } from '~/config'

export function getCurrentUserAddress(request: Request) {
  const cookie = request.headers.get('cookie')
  const parsed = lightcookie.parse(cookie)
  return parsed[COOKIES.address]
}

export default getCurrentUserAddress
