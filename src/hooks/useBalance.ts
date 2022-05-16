import { createEffect } from 'solid-js'
import { fetchBalance, connect } from '@wagmi/core'
import { client } from '~/config'
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

  async function updateBalanceOf(address) {
    balanceState.setLoading(true)
    balanceState.setError(null)
    try {
      const balance = await fetchBalance({
        addressOrName: address,
        chainId: networkData()?.chain.id,
      })
      balanceState.setBalanceOf(address, balance)

      balanceState.setLoading(false)
      balanceState.setError(null)
    } catch (e) {
      console.error(e)
      balanceState.setLoading(false)
      balanceState.setError(e)
    }
  }

  createEffect(async () => {
    if (accountData().address && networkData()?.chain) {
      if (!accountData()?.connector) {
        const idConnector = JSON.parse(client.storage['wagmi.wallet'])
        // @ts-expect-error
        const connector = wagmiState.connectors.filter((c) => c.id === idConnector)[0]
        await connect({ connector })
      }
      await updateBalanceOf(accountData().address)
    }
  })
  return {
    balanceState,
    updateBalanceOf,
  }
}

export default useBalance
