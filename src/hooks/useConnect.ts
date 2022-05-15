import { createEffect, onMount } from 'solid-js'
import { disconnect, connect, signMessage } from '@wagmi/core'
import create from 'solid-zustand'
import { SiweMessage } from 'siwe'
import {
  client,
  SESSION_STORAGE_WALLET_VERIFIED_KEY,
  API_ROUTE_LOGOUT,
  API_ROUTE_NONCE_GENERATOR,
  API_ROUTE_VERIFY_USER,
  ROUTE_SIGN_IN,
  ROUTE_MY_PROFILE,
  ROUTE_DASHBOARD,
} from '~/config'
import useAccount from './useAccount'
import useNetwork from './useNetwork'
import useWagmiStore from './useWagmiStore'

interface ConnectWalletState {
  connected: boolean
  verified: boolean
  error: null | string
  loading: boolean
  setConnected: (isConnected: boolean) => void
  setVerified: (isVerified: boolean) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
}

const useConnectWalletStore = create<ConnectWalletState>((set) => ({
  connected: false,
  verified: false,
  error: null,
  loading: false,
  setConnected: (value) => set((state) => ({ connected: value })),
  setVerified: (value) => set((state) => ({ verified: value })),
  setError: (value) => set((state) => ({ error: value })),
  setLoading: (value) => set((state) => ({ loading: value })),
}))

export function useConnect(runVerification) {
  const wagmiState = useWagmiStore()
  const { accountData } = useAccount()
  const { networkData } = useNetwork()
  const walletConnectionState = useConnectWalletStore()
  onMount(() => {
    if (sessionStorage.getItem(SESSION_STORAGE_WALLET_VERIFIED_KEY) === null)
      sessionStorage.setItem(SESSION_STORAGE_WALLET_VERIFIED_KEY, 'false')
    else if (sessionStorage.getItem(SESSION_STORAGE_WALLET_VERIFIED_KEY) === 'true') {
      walletConnectionState.setVerified(true)
    }
  })

  createEffect(() => {
    if (accountData().address) {
      walletConnectionState.setConnected(true)
    }
    if (
      sessionStorage.getItem(SESSION_STORAGE_WALLET_VERIFIED_KEY) !== 'true' &&
      walletConnectionState.connected === true &&
      walletConnectionState.verified === false &&
      walletConnectionState.loading === false &&
      walletConnectionState.error === null &&
      accountData().address &&
      runVerification === true
    ) {
      walletConnectionState.setLoading(true)
      verifyWallet()
    }

    if (
      JSON.parse(client.storage.getItem('store'))?.state?.data?.chain?.id !== networkData()?.chain?.id &&
      runVerification === true &&
      walletConnectionState.connected === true &&
      walletConnectionState.verified === true &&
      accountData().address &&
      walletConnectionState.loading === false
    ) {
      walletConnectionState.setVerified(false)
      sessionStorage.setItem(SESSION_STORAGE_WALLET_VERIFIED_KEY, 'false')
      walletConnectionState.setLoading(true)
      verifyWallet()
    }
  })

  async function verifyWallet() {
    try {
      if (accountData().address && !accountData()?.connector) {
        const idConnector = JSON.parse(client.storage['wagmi.wallet'])
        // @ts-expect-error
        const connector = wagmiState.connectors.filter((c) => c.id === idConnector)[0]
        await connect({ connector })
      }
      const fetchNonce = await fetch(API_ROUTE_NONCE_GENERATOR, {
        method: 'POST',
        body: JSON.stringify({ address: accountData().address }),
      })
      const nonceRes = await fetchNonce.json()
      const nonce = nonceRes.nonce

      const address = accountData()?.address
      const chainId = networkData()?.chain?.id
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      })

      const signature = await signMessage({ message: message.prepareMessage() })
      const verifyRes = await fetch(API_ROUTE_VERIFY_USER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      const verify = await verifyRes.json()
      if (!verify.valid) throw new Error('Error verifying message')
      walletConnectionState.setVerified(true)
      walletConnectionState.setLoading(false)
      walletConnectionState.setError(null)
      sessionStorage.setItem(SESSION_STORAGE_WALLET_VERIFIED_KEY, 'true')
      const currentPage = window.location.href
      const previousUrl = document.referrer

      if (currentPage.includes(ROUTE_SIGN_IN)) {
        if (previousUrl.includes('y3llow.xyz')) {
          location.href = previousUrl
        } else {
          location.href = ROUTE_MY_PROFILE
        }
      }
    } catch (e) {
      sessionStorage.setItem(SESSION_STORAGE_WALLET_VERIFIED_KEY, 'false')
      walletConnectionState.setVerified(false)
      walletConnectionState.setLoading(false)
      walletConnectionState.setError(e)
      console.error(e)
    }
  }

  async function connectWallet(connector) {
    try {
      await connect({ connector })
      walletConnectionState.setConnected(true)
      walletConnectionState.setError(null)
      sessionStorage.setItem(SESSION_STORAGE_WALLET_VERIFIED_KEY, 'false')
      walletConnectionState.setVerified(false)
    } catch (e) {
      sessionStorage.setItem(SESSION_STORAGE_WALLET_VERIFIED_KEY, 'false')
      walletConnectionState.setConnected(false)
      walletConnectionState.setVerified(false)
      walletConnectionState.setError(e)
      console.error(e)
    }
  }

  async function disconnectWallet() {
    try {
      await fetch(API_ROUTE_LOGOUT)
      await disconnect()
      walletConnectionState.setConnected(false)
      walletConnectionState.setVerified(false)
      walletConnectionState.setLoading(false)
      sessionStorage.setItem(SESSION_STORAGE_WALLET_VERIFIED_KEY, 'false')
      const currentPage = window.location.href

      if (currentPage.includes(ROUTE_MY_PROFILE) || currentPage.includes(ROUTE_DASHBOARD)) {
        location.href = '/'
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    connect: connectWallet,
    disconnect: disconnectWallet,
    verify: verifyWallet,
    //@ts-expect-error
    connectors: wagmiState.connectors,
    walletConnectionState,
  }
}

export default useConnect
