import { createEffect } from 'solid-js'
import { fetchBalance, connect } from '@wagmi/core'
import { client } from '~/config'
import { tokens } from '~/helpers'
import useAccount from './useAccount'
import useWagmiStore from './useWagmiStore'
import useNetwork from './useNetwork'
import create from 'solid-zustand'
interface BalanceState {
  balanceOf: object
  error: null | string
  loading: boolean
  setBalanceOf: (address: string, value: any) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
}

const useBalanceStore = create<BalanceState>((set) => ({
  balanceOf: {},
  loading: true, // set to true by default to take SSR into account
  error: null,
  setBalanceOf: (address, value) =>
    set((state) => ({
      balanceOf: {
        ...state.balanceOf,
        [address]: value,
      },
    })),
  setError: (value) => set((state) => ({ error: value })),
  setLoading: (value) => set((state) => ({ loading: value })),
}))

export function useBalance() {
  const wagmiState = useWagmiStore()
  const { accountData } = useAccount()
  const { networkData } = useNetwork()
  const balanceState = useBalanceStore()

  async function updateBalanceOf(tokenAddress?: string) {
    let addressToUpdate = tokenAddress ? tokenAddress : accountData().address
    balanceState.setLoading(true)
    balanceState.setError(null)
    try {
      if (tokenAddress) {
        const balance = await fetchBalance({
          addressOrName: accountData().address,
          token: tokenAddress,
          chainId: networkData()?.chain.id,
        })
        if (balance.decimals !== 18) {
          // @ts-ignore
          balance.formatted = `${10 ** (18 - balance.decimals) * balance.formatted}`
        }
        balanceState.setBalanceOf(addressToUpdate, balance)
      }
      const chainTokenBalance = await fetchBalance({
        addressOrName: accountData().address,
        chainId: networkData()?.chain.id,
      })
      balanceState.setBalanceOf(accountData().address, chainTokenBalance)
      balanceState.setLoading(false)
      balanceState.setError(null)
    } catch (e) {
      balanceState.setLoading(false)
      balanceState.setError(e)
    }
  }

  createEffect(async () => {
    if (accountData().address && networkData()?.chain) {
      balanceState.setLoading(true)
      try {
        if (!accountData()?.connector) {
          const idConnector = JSON.parse(client.storage['wagmi.wallet'])
          // @ts-expect-error
          const connector = wagmiState.connectors.filter((c) => c.id === idConnector)[0]
          await connect({ connector })
        }
        await updateBalanceOf(accountData().address)
        Promise.all(
          Object.keys(tokens[networkData()?.chain.id]).map(async (tokenName) => {
            const tokenAddress = tokens[networkData()?.chain.id][tokenName]
            await updateBalanceOf(tokenAddress)
          }),
        )
        balanceState.setLoading(false)
        balanceState.setError(null)
      } catch (e) {
        balanceState.setLoading(false)
        balanceState.setError(e)
      }
    }
  })
  return {
    balanceState,
    updateBalanceOf,
  }
}

export default useBalance
