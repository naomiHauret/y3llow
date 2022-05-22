import { connect } from '@wagmi/core'
import { parseEther } from 'ethers/lib/utils'
import create from 'solid-zustand'
import { useAccount } from '~/hooks/useAccount'
import { API_ROUTE_DONATIONS, client } from '~/config'
import { createEffect, createUniqueId, onMount } from 'solid-js'
import { string, number, object } from 'zod'
import { useMachine, useSetup } from '@zag-js/solid'
import * as toast from '@zag-js/toast'
import { createForm } from '@felte/solid'
import { reporter } from '@felte/reporter-solid'
import { validateSchema } from '@felte/validator-zod'
import useWagmiStore from './useWagmiStore'
import useNetwork from './useNetwork'
import useTransaction from './useTransaction'
import type { Donation } from '~/types/donation'
import type { PropTypes } from '@zag-js/solid'

const schema = object({
  amount: number().positive(),
  message: string().max(420).optional(),
})

interface SendDonationState {
  success: boolean
  error: null | string
  loading: boolean
  setSuccess: (value: boolean) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
}

interface ListDonationState {
  list: Array<Donation>
  setList: (list: Array<Donation>) => void
  addDonation: (donation: Donation) => void
}

const useSendDonationStore = create<SendDonationState>((set) => ({
  pickedToken: null,
  success: false,
  error: null,
  loading: false,
  setPickedToken: (value) => set((state) => ({ pickedToken: value })),
  setSuccess: (value) => set((state) => ({ success: value })),
  setError: (value) => set((state) => ({ error: value })),
  setLoading: (value) => set((state) => ({ loading: value })),
}))

const useDonationsListStore = create<ListDonationState>((set) => ({
  list: [],
  setList: (list) => set((state) => ({ list: list })),
  addDonation: (donation) => set((state) => ({ list: [donation, ...state.list] })),
}))

export function useProfileDonation(initialDonationsList: Array<Donation>, to?: string) {
  const sendDonationState = useSendDonationStore()
  const wagmiState = useWagmiStore()
  const { accountData } = useAccount()
  const { networkData } = useNetwork()
  const donationListState = useDonationsListStore()
  const { makeTransaction } = useTransaction()

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
  const apiToast = toast.group.connect<PropTypes>(state, send)
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
        const receipt = await makeTransaction({
          body: {
            request: {
              from: accountData().address,
              to,
              value: parseEther(`${amount}`),
            },
          },
          chainId,
          toastr: apiToast,
          pendingMessage: 'Sending your tip through, please wait ...',
          errorMessage: "Something went wrong and your tip couldn't be sent.",
          successMessage: 'Your tip was sent successfully !',
        })

        // Add the donation to the database
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

          storeForm.resetField('message')
          storeForm.resetField('amount')
        } else {
          apiToast.create({
            title:
              'Your tip was sent successfully but something went wrong while adding proof of transaction to the database',
            type: 'info',
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
      sendDonationState.setError(e)
      sendDonationState.setLoading(false)
      sendDonationState.setSuccess(false)
    }
  }

  createEffect(() => {
    if (networkData()?.chain?.id) {
      storeForm.reset()
      sendDonationState.setPickedToken(null)
    }
  })

  return {
    donationListState,
    storeForm,
    apiToast,
    sendDonationState,
  }
}
