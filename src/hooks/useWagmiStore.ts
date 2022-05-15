import client from '~/config/wagmi'
import create from 'solid-zustand'

export const useWagmiStore = create(client.store)
export default useWagmiStore
