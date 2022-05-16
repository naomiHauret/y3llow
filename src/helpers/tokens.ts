import { chain } from '@wagmi/core'

// @TODO: implement stable donation

export const stables = {
  logos: {
    USDC: '//logo.chainbit.xyz/usdc',
    DAI: '//logo.chainbit.xyz/dai',
    USDT: '//logo.chainbit.xyz/usdt',
  },
  [chain.mainnet.id]: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  [chain.arbitrum.id]: {
    USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  [chain.optimism.id]: {
    USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  [chain.polygon.id]: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
}
