import { formatEther } from 'ethers/lib/utils'
import { tokens } from '~/helpers'
import { WebBundlr } from '@bundlr-network/client'
import { chain, getProvider } from '@wagmi/core'
import create from 'solid-zustand'
import useNetwork from './useNetwork'

interface BundlrState {
  bundlr: any
  error: null | string
  loadedBalance: null | string
  loading: boolean
  setBundlr: (instance: any) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
  setLoadedBalance: (balance: string | null) => void
}

const useBundlrStore = create<BundlrState>((set) => ({
  bundlr: null,
  loadedBalance: null,
  error: null,
  loading: false,
  setBundlr: (value) => set((state) => ({ bundlr: value })),
  setError: (value) => set((state) => ({ error: value })),
  setLoading: (value) => set((state) => ({ loading: value })),
  setLoadedBalance: (value) => set((state) => ({ loadedBalance: value })),
}))

export function useBundlr() {
  const bundlrState = useBundlrStore()
  const { networkData } = useNetwork()

  async function initBundlrInstance() {
    bundlrState.setLoading(true)
    const currency = tokens.bundlr[networkData().chain.id]
    const provider = getProvider()
    try {
      await provider._ready()
      const bundlrNodeUrl =
        networkData().chain.id === chain.rinkeby.id ? 'https://devnet.bundlr.network' : 'https://node1.bundlr.network'
      const bundlr = new WebBundlr(bundlrNodeUrl, currency, provider)
      await bundlr.utils.getBundlerAddress(currency)
      bundlrState.setBundlr(bundlr)
      bundlrState.setError(null)
      fetchLoadedBalance()
    } catch (e) {
      bundlrState.setError(e)
      console.error(e)
    }
  }

  async function fetchLoadedBalance() {
    bundlrState.setLoading(true)
    try {
      const data = await bundlrState.bundlr.getLoadedBalance()
      bundlrState.setLoadedBalance(formatEther(data.toString()))
      bundlrState.setError(null)
    } catch (e) {
      bundlrState.setError(e)
      console.error(e)
    } finally {
      bundlrState.setLoading(false)
    }
  }

  return {
    bundlrState,
    initBundlrInstance,
    fetchLoadedBalance,
  }
}

export default useBundlr
