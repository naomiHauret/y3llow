import { createEffect, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { switchNetwork } from '@wagmi/core'
import { useConnect, useNetwork } from '~/hooks'
import { useProfileDonation } from '~/hooks/useProfileDonation'
import useBalance from '~/hooks/useBalance'
import FormTextarea from '~/design-system/components/FormTextarea'
import FormInput from '~/design-system/components/FormInput'
import FormSelect from '~/design-system/components/FormSelect'
import { Button } from '~/design-system/components/Button'
import Toast from '~/design-system/components/Toast'
import { ROUTE_SIGN_IN } from '~/config'
import button from '~/design-system/styles/button'
import type { PanelDonateProps } from './types'

const loginButtonStyles = button({
  //@ts-ignore
  intent: 'brand-outline',
  class:
    'text-center inline-flex mt-3 xs:mis-auto md:mis-0 xs:mt-0 md:w-full md:mt-4 after:bg-true-black xs:flex-shrink-0 md:inline-flex unstyled',
})

const PanelDonate = (props: PanelDonateProps) => {
  const { walletConnectionState } = useConnect(false)
  const { storeForm, sendDonationState, apiToast } = useProfileDonation(props.initialDonationsList, props.to)
  const { networkData } = useNetwork()
  const { balanceData } = useBalance()
  const [showDonationForm, setShowDonationForm] = createSignal(props.isAuthenticated === true)
  const { form } = storeForm

  createEffect(() => {
    if (walletConnectionState.connected === true && walletConnectionState.verified === true) {
      setShowDonationForm(true)
    } else {
      showDonationForm(false)
    }
  })
  async function changeNetwork(value) {
    try {
      await switchNetwork({ chainId: value })
    } catch(e) {
      apiToast.create({
        title: 'Something went wrong while switching network. Please reload the page and try again.',
        type: 'error',
        duration: 7000,
      })
      console.error(e)
    }
  }
  return (
    <>
      <div class="md:sticky md:top-5 md:inline-end-5 border-solid border-1 border-neutral-6 rounded-lg p-6">
        {showDonationForm() === true ? (
          <>
            <h2 class="text-lg font-extrabold mb-3">Send {props.name} a tip</h2>
            <form use:form class="flex flex-col space-y-3">
              <div class="flex items-center">
                <label class="text-xs text-neutral-12 pie-[1ex]" for="chain">
                  Use chain
                </label>
                <FormSelect
                  hasError={storeForm.errors().chain?.length > 0 === true}
                  class="w-full pie-4"
                  wrapperClass="flex-grow"
                  required
                  onChange={(e) => {
                    changeNetwork(parseInt(e.currentTarget.value))
                  }}
                  id="chain"
                  name="chain"
                >
                  <option disabled selected>
                    Select a chain
                  </option>

                  {networkData()?.chains?.map((chain) => (
                    <option selected={chain.id === networkData()?.chain?.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
                </FormSelect>
              </div>
              <div>
                <label class="text-xs text-neutral-12 block pb-2" for="amount">
                  Donate amount
                </label>

                <div class="flex items-end">
                  <div class="pie-2 w-full">
                    <FormInput
                      hasError={storeForm.errors().amount?.length > 0 === true}
                      class="w-full"
                      placeholder=""
                      required
                      name="amount"
                      id="amount"
                      type="number"
                      min="0"
                      step="0.000000001"
                      max={balanceData()?.formatted}
                    />
                  </div>
                  <span class="text-sm font-medium">{balanceData()?.symbol}</span>
                </div>
                <div class="text-2xs pt-1 flex">
                  <span class="text-neutral-9 pie-1ex">Available balance:</span>{' '}
                  <span class="flex overflow-hidden max-w-[8ex]">{balanceData()?.formatted}</span>
                  <span class="pis-[0.5ex]">{balanceData()?.symbol}</span>
                </div>
              </div>
              <div>
                <label class="text-xs text-neutral-12 block pb-2" for="message">
                  Message <span class="text-neutral-9 text-2xs">(optional)</span>
                </label>
                <FormTextarea
                  hasError={storeForm.errors().message?.length > 0 === true}
                  class="w-full"
                  placeholder=""
                  id="message"
                  name="message"
                  maxlength="420"
                ></FormTextarea>
              </div>
              <Button
                type="submit"
                class="w-full after:bg-true-white"
                intent="brand"
                isLoading={storeForm.isSubmitting === true || sendDonationState.loading === true}
                disabled={
                  sendDonationState.loading === true ||
                  storeForm.interacted() === null ||
                  storeForm.isValidating === true ||
                  storeForm.isDirty === true
                }
              >
                Send a tip !
              </Button>
            </form>
          </>
        ) : (
          <>
            <p class="text-lg xs:pie-4 md:pie-0 font-extrabold">Want to send a tip ?</p>
            <a href={ROUTE_SIGN_IN} class={loginButtonStyles}>
              Sign in <span aria-hidden="true">✨</span>
            </a>
          </>
        )}
      </div>
      <Portal>
        <div
          {...apiToast.getGroupProps({ placement: 'bottom-center' })}
          class="relative z-50 flex flex-col items-center justify-center"
        >
          {apiToast.toasts.map((toast) => (
            <Toast toast={toast} />
          ))}
        </div>
      </Portal>
    </>
  )
}

export default PanelDonate
