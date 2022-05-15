import { sendTransaction, connect, waitForTransaction } from '@wagmi/core'
import { parseEther } from 'ethers/lib/utils'
import create from 'solid-zustand'
import { useAccount } from '~/hooks/useAccount'
import { API_ROUTE_DONATIONS, API_ROUTE_PROFILE, client } from '~/config'
import { createEffect, createSignal, createUniqueId, onMount } from 'solid-js'
import { string, number, object, bigint } from 'zod'
import { useMachine, useSetup } from '@zag-js/solid'
import * as toast from '@zag-js/toast'
import { createForm } from '@felte/solid'
import { reporter } from '@felte/reporter-solid'
import { validateSchema } from '@felte/validator-zod'
import useWagmiStore from './useWagmiStore'
import useNetwork from './useNetwork'

const schema = object({
  chain: string(),
  amount: number().positive(),
  message: string().max(420).optional(),
})

const useSendDonationStore = create((set) => ({
  success: false,
  error: null,
  loading: false,
  setSuccess: (value) => set((state) => ({ success: value })),
  setError: (value) => set((state) => ({ error: value })),
  setLoading: (value) => set((state) => ({ loading: value })),
}))

const useDonationsListStore = create((set) => ({
  list: [],
  setList: (list) => set((state) => ({ list: list })),
  addDonation: (donation) => set((state) => ({ list: [donation, ...state.list] })),
}))

export function useProfileDonation(initialDonationsList, to) {
  const sendDonationState = useSendDonationStore()
  const wagmiState = useWagmiStore()
  const { accountData } = useAccount()
  const { networkData } = useNetwork()
  const donationListState = useDonationsListStore()

  onMount(() => {
    donationListState.setList(initialDonationsList)
  })

  const [state, send] = useMachine(
    toast.group.machine({
      offsets: {
        top: '1rem',
        right: '1rem',
        bottom: '1rem',
        left: '1rem',
      },
    }),
  )
  const ref = useSetup({ send, id: createUniqueId() })
  const apiToast = toast.group.connect(state, send)
  const storeForm = createForm({
    initialValues: {
      amount: '',
      message: '',
    },
    onSubmit: (values) => {
      sendDonation(values)
    },
    validate: validateSchema(schema),
    extend: reporter,
  })

  async function sendDonation(values) {
    const { message, amount } = values
    sendDonationState.setLoading(true)

    try {
      if (accountData().address) {
        if (!accountData()?.connector) {
          const idConnector = JSON.parse(client.storage['wagmi.wallet'])
          // @ts-expect-error
          const connector = wagmiState.connectors.filter((c) => c.id === idConnector)[0]
          await connect({ connector })
        }
        const chainId = networkData()?.chain?.id
        const result = await sendTransaction({
          request: {
            from: accountData().address,
            to,
            value: parseEther(`${amount}`),
          },
        })
        apiToast.create({
          title: 'Sending your tip through, please wait ...',
          type: 'info',
          duration: 5000,
        })
        const receipt = await waitForTransaction({
          chainId,
          hash: result.hash,
        })

        const donationData = await fetch(API_ROUTE_DONATIONS, {
          method: 'POST',
          body: JSON.stringify({
            from: accountData().address,
            to,
            amount,
            hash: receipt.transactionHash,
            message,
            explorer_link: `${networkData()?.chain.blockExplorers.default.url}/tx/${receipt.transactionHash}`,
            token_name: networkData()?.chain.nativeCurrency.symbol,
          }),
        })

        const donation = await donationData.json()
        if (donation.data) {
          donationListState.addDonation(donation.data[0])
          sendDonationState.setError(null)
          sendDonationState.setLoading(false)
          sendDonationState.setSuccess(true)
          apiToast.create({
            title: 'Your tip was sent successfully !',
            type: 'success',
            duration: 5000,
          })
          storeForm.reset()
        } else {
          apiToast.create({
            title: 'Your tip was sent successfully !',
            type: 'success',
            duration: 5000,
          })
          throw new Error('Something went wrong while adding proof of transaction to the database')
        }
      } else {
        apiToast.create({
          title: 'You need to be authentified to send a tip.',
          type: 'error',
          duration: 5000,
        })
        throw new Error("Can't send a transaction without a sender address")
      }
    } catch (e) {
      console.error(e)
      apiToast.create({
        title: "Something went wrong and your tip couldn't be sent.",
        type: 'error',
        duration: 5000,
      })
      sendDonationState.setError(e)
      sendDonationState.setLoading(false)
      sendDonationState.setSuccess(false)
    }
  }

  return {
    donationListState,
    storeForm,
    apiToast,
    sendDonationState,
  }
}