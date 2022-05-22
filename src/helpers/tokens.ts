import { chain } from '@wagmi/core'

export const stables = {
  logos: {
    USDC: '/usdc.webp',
    DAI: '/dai.webp',
    USDT: '/usdt.webp',
    MIM: '/mim.webp',
    wBTC: '/wbtc.webp',
    ETH: '/weth.webp',
    wETH: '/weth.webp',
    rETH: '/weth.webp',
    miMATIC: '/mai.webp',
    MATIC: '/matic.webp',
  },
  native: {
    [chain.mainnet.id]: 'ETH',
    [chain.optimism.id]: 'OP',
    [chain.polygon.id]: 'MATIC',
    [chain.rinkeby.id]: 'rETH',
  },
  [chain.mainnet.id]: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    MIM: '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3',
    wETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    wBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  },
  [chain.arbitrum.id]: {
    USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    MIM: '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A',
    wETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    wBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  },
  [chain.optimism.id]: {
    USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    wBTC: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
  },
  [chain.polygon.id]: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    miMATIC: '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1',
    wBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    wETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  [chain.rinkeby.id]: {
    USDC: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
    DAI: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
    USDT: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
  },
}
