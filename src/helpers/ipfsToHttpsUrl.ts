export function ipfsToHttpsUrl(str) {
  return str.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')
}

export default ipfsToHttpsUrl
