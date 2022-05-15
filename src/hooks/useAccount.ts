import { createSignal, createEffect } from 'solid-js'
import { watchAccount, getAccount } from '@wagmi/core'

export function useAccount() {
  const [accountData, setAccountData] = createSignal(getAccount())

  createEffect(() => {
    setAccountData(getAccount())
    const unwatch = watchAccount(setAccountData)
    return () => {
      unwatch()
    }
  })

  return {
    accountData,
  }
}

export default useAccount
