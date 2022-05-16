import { createSignal, createEffect } from 'solid-js'
import { fetchBalance, connect } from '@wagmi/core'
import { client } from '~/config'
import useAccount from './useAccount'
import useWagmiStore from './useWagmiStore'
import useNetwork from './useNetwork'

export function useBalance() {
  const wagmiState = useWagmiStore()
  const { accountData } = useAccount()
  const { networkData } = useNetwork()
  const [balanceData, setBalanceData] = createSignal()

  createEffect(async () => {
    if (accountData().address && networkData()?.chain) {
      if (!accountData()?.connector) {
        const idConnector = JSON.parse(client.storage['wagmi.wallet'])
        // @ts-expect-error
        const connector = wagmiState.connectors.filter((c) => c.id === idConnector)[0]
        await connect({ connector })
      }
      const balance = await fetchBalance({
        addressOrName: accountData().address,
      })
      setBalanceData(balance)
    }
  })
  return {
    balanceData,
  }
}

export default useBalance
