import { createEffect } from 'solid-js'
import { formatEther } from 'ethers/lib/utils'
import { tokens } from '~/helpers'
import { WebBundlr } from "@bundlr-network/client"
import useWagmiStore from './useWagmiStore'
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



export function useProfileDonation(initialDonationsList: Array<Donation>, to?: string) {
  const bundlrState = useBundlrStore()
  const { networkData } = useNetwork()

  async function initBundlrInstance() {
        bundlrState.setLoading(true)
      try {
        const bundlr = new WebBundlr("https://node1.bundlr.network", tokens.bundlr[networkData().chain.id] , provider)
        await bundlr.ready()  
        bundlrState.setBundlr(bundlr)
        bundlrState.setError(null)
      } catch(e) {
        bundlrState.setError(e)
        console.error(e)
      } finally {
          bundlrState.setLoading(false)
      }
  }

  async function fetchLoadedBalance() {
    bundlrState.setLoading(true)
    try {
        const data = await bundlrState.bundlr.getLoadedBalance()
        bundlrState.setLoadedBalance(formatEther(data.toString()))
        bundlrState.setError(null)
    } catch(e) {
      bundlrState.setError(e)
      console.error(e)
    } finally {
        bundlrState.setLoading(false)
    }
  }

  createEffect(() => {
    if (networkData()?.chain?.id) {
        initBundlrInstance()
    }
    if(bundlrState.bundlr) {
        fetchLoadedBalance()
    }
  })

  return {
      bundlrState,
      fetchLoadedBalance
  }
}
