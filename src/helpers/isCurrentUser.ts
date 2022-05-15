import lightcookie from 'lightcookie'
import { COOKIES } from '~/config'

export function isCurrentUser(request: Request, currentAddress: string): boolean {
  const cookie = request.headers.get('cookie')
  const parsed = lightcookie.parse(cookie)
  if (COOKIES.address in parsed) {
    return parsed[COOKIES.address] === currentAddress
  } else {
    return false
  }
}

export default isCurrentUser
