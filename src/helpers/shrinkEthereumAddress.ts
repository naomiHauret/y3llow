export function shrinkEthereumAddress(address: string) {
  let shrinkedAddress = address
  const shrinkedLength = 4
  const front = address.substr(0, shrinkedLength)
  const mid = '...'
  const end = address.substr(-2)
  shrinkedAddress = front + mid + end
  return shrinkedAddress
}
