import { createEffect, createSignal, createMemo, Switch, Match, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useAccount, useConnect, useNetwork } from '~/hooks'
import { useProfileDonation } from '~/hooks/useProfileDonation'
import * as dialog from '@zag-js/dialog'
import { useMachine, useSetup, normalizeProps } from '@zag-js/solid'
import useBalance from '~/hooks/useBalance'
import FormTextarea from '~/design-system/components/FormTextarea'
import { Button } from '~/design-system/components/Button'
import Toast from '~/design-system/components/Toast'
import { ROUTE_SIGN_IN, supportedChains } from '~/config'
import button from '~/design-system/styles/button'
import type { PanelDonateProps } from './types'
import DialogPickToken from '../DialogPickToken'
import DialogSwitchNetwork from '../DialogSwitchNetwork'
import { IconChevronDown, IconErrorCircleOutline, IconSpinner } from '../Icons'
import { tokens } from '~/helpers'

const loginButtonStyles = button({
  //@ts-ignore
  intent: 'brand-outline',
  class:
    'text-center inline-flex mt-3 xs:mis-auto md:mis-0 xs:mt-0 md:w-full md:mt-4 after:bg-true-black xs:flex-shrink-0 md:inline-flex unstyled',
})

const PanelDonate = (props: PanelDonateProps) => {
  const { walletConnectionState } = useConnect(false)
  const { accountData } = useAccount()
  const { storeForm, sendDonationState, apiToast } = useProfileDonation(props.initialDonationsList, props.to)
  const { networkData } = useNetwork()
  const { balanceState } = useBalance()
  const [showDonationForm, setShowDonationForm] = createSignal(props.isAuthenticated === true)
  const { form } = storeForm
  const [stateDialogPickToken, sendDialogPickToken] = useMachine(dialog.machine)
  const [stateDialogSwitchNetwork, sendDialogSwitchNetwork] = useMachine(dialog.machine)
  const refDialogPickToken = useSetup({ send: sendDialogPickToken, id: 'dialog-pick-token-donation' })
  const apiDialogPickToken = createMemo(() => dialog.connect(stateDialogPickToken, sendDialogPickToken, normalizeProps))
  const refDialogSwitchNetwork = useSetup({ send: sendDialogSwitchNetwork, id: 'dialog-switch-network' })
  const apiDialogSwitchNetwork = createMemo(() =>
    dialog.connect(stateDialogSwitchNetwork, sendDialogSwitchNetwork, normalizeProps),
  )
  const [amountValid, setAmountValid] = createSignal(true)
  const [showNetworkName, setShowNetworkName] = createSignal(false)

  createEffect(() => {
    if (networkData()?.chain?.name) {
      setShowNetworkName(true)
    } else {
      setShowNetworkName(false)
    }
    if (walletConnectionState.connected === true && walletConnectionState.verified === true) {
      setShowDonationForm(true)
    } else {
      showDonationForm(false)
    }
  })
  return (
    <>
      <div
        class="md:sticky md:top-5 md:inline-end-5 border-solid border-1 border-neutral-6 rounded-lg p-6"
        classList={{
          'animate-pulse':
            showDonationForm() === true &&
            balanceState.loading === true &&
            !balanceState.balanceOf[accountData()?.address],
        }}
      >
        {showDonationForm() === true ? (
          <>
            <h2 class="text-lg font-extrabold mb-3">Send {props.name} a tip</h2>
            <form use:form class="flex flex-col space-y-3">
              <div class="flex items-center">
                <label class="text-xs text-neutral-12 pie-[1ex]" for="chain">
                  Use chain
                </label>
                <button
                  disabled={showNetworkName() === false || balanceState.loading === true}
                  aria-disabled={showNetworkName() === false || balanceState.loading === true}
                  class="border-1 text-xs border-true-white border-opacity-15 cursor-pointer p-2 rounded-md flex justify-center w-full max-w-fit-content items-center font-medium"
                  ref={refDialogSwitchNetwork}
                  {...apiDialogSwitchNetwork().triggerProps}
                >
                  <Show when={showNetworkName() === false}>
                    <IconSpinner class="animate-spin" />
                  </Show>
                  <Show when={showNetworkName() === true}>
                    <div class="animate-appear flex items-center">
                      <img height="25" width="25" src={supportedChains[networkData().chain.id].icon} alt="" />

                      <span class="pis-1ex"> {networkData().chain.name}</span>
                    </div>
                    <IconChevronDown class="mis-1ex" />
                  </Show>
                </button>
              </div>
              <div>
                <label class="text-xs text-neutral-12 block pb-2" for="amount">
                  Donate amount
                </label>

                <div class="flex items-end">
                  <div
                    class="flex border-1 border-solid text-sm rounded-md"
                    classList={{
                      'bg-true-white bg-opacity-3.5 focus:bg-opacity-7.5 border-true-white border-opacity-15 hover:border-opacity-25 focus-within:border-opacity-25':
                        storeForm.errors().amount?.length > 0 === false && amountValid() === true,
                      'input-error-border': storeForm.errors().amount?.length > 0 === true || amountValid() === false,
                    }}
                  >
                    <button
                      class="border-ie-1 border-true-white border-opacity-15 cursor-pointer py-1 pis-2 pie-1 rounded-is-md flex justify-center w-full max-w-fit-content items-center font-medium"
                      disabled={showNetworkName() === false || balanceState.loading === true}
                      aria-disabled={showNetworkName() === false || balanceState.loading === true}
                      ref={refDialogPickToken}
                      {...apiDialogPickToken().triggerProps}
                    >
                      <Switch>
                        <Match when={!balanceState.balanceOf[sendDonationState?.pickedToken]?.symbol}>
                          <div class="uppercase text-3xs">Pick token</div>
                        </Match>
                        <Match when={balanceState.balanceOf[sendDonationState?.pickedToken]?.symbol}>
                          <div class="text-2xs flex">
                            <img
                              src={tokens.logos[balanceState.balanceOf[sendDonationState.pickedToken].symbol]}
                              alt=""
                              width="20"
                              height="20"
                            />
                            <span class="pis-1ex">
                              {balanceState.balanceOf[sendDonationState?.pickedToken]?.symbol}
                            </span>
                          </div>
                        </Match>
                      </Switch>
                      <IconChevronDown class="mis-1ex text-2xs" />
                    </button>
                    <input
                      aria-disabled={
                        balanceState.loading === true || !balanceState.balanceOf[sendDonationState?.pickedToken]?.symbol
                      }
                      disabled={
                        balanceState.loading === true || !balanceState.balanceOf[sendDonationState?.pickedToken]?.symbol
                      }
                      aria-invalid={storeForm.errors().amount?.length > 0 === true}
                      class="w-full px-2 py-1 input-report-error rounded-ie-[inherit]"
                      classList={{
                        'bg-transparent': storeForm.errors().amount?.length > 0 === false && amountValid() === true,
                        'input-error-bg': storeForm.errors().amount?.length > 0 === true || amountValid() === false,
                      }}
                      placeholder=""
                      required
                      name="amount"
                      id="amount"
                      type="number"
                      min="0"
                      step="0.000000001"
                      max={balanceState.balanceOf[sendDonationState?.pickedToken]?.formatted}
                      oninput={(e) => {
                        e.target.validity.valid === true ? setAmountValid(true) : setAmountValid(false)
                      }}
                      onblur={(e) => {
                        e.target.validity.valid === true ? setAmountValid(true) : setAmountValid(false)
                      }}
                    />
                  </div>
                </div>
                <div class="text-2xs pt-1 flex flex-col">
                  <Show when={amountValid() === false}>
                    <div class="flex pb-1.5 items-center text-negative-11">
                      <IconErrorCircleOutline class="text-negative-10 text-lg mie-1ex" />
                      Please type a valid tip amount (max{' '}
                      {balanceState.balanceOf[sendDonationState?.pickedToken]?.formatted}
                      {balanceState.balanceOf[sendDonationState?.pickedToken]?.symbol})
                    </div>
                  </Show>
                  <div class="flex">
                    <span class="text-neutral-9 pie-1ex">Available balance:</span>{' '}
                    <span class="flex overflow-hidden max-w-[8ex]">
                      {balanceState.balanceOf[sendDonationState?.pickedToken]?.formatted}
                    </span>
                    <span class="pis-[0.5ex]">{balanceState.balanceOf[sendDonationState?.pickedToken]?.symbol}</span>
                  </div>
                </div>
              </div>
              <div>
                <label class="text-xs text-neutral-12 block pb-2" for="message">
                  Message <span class="text-neutral-9 text-2xs">(optional)</span>
                </label>
                <FormTextarea
                  aria-disabled={balanceState.loading === true}
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
                  balanceState.loading ||
                  amountValid() === false ||
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
      {apiDialogSwitchNetwork().isOpen && (
        <Portal>
          <DialogSwitchNetwork api={apiDialogSwitchNetwork} apiToast={apiToast} />
        </Portal>
      )}
      {apiDialogPickToken().isOpen && (
        <Portal>
          <DialogPickToken
            currentAddress={accountData()?.address}
            api={apiDialogPickToken}
            balanceState={balanceState}
            networkId={networkData()?.chain?.id}
            sendDonationState={sendDonationState}
            onRadioChange={(value) => {
              if (sendDonationState.pickedToken !== value) {
                storeForm.reset()
                apiDialogPickToken().close()
                sendDonationState.setPickedToken(value)
              }
            }}
          />
        </Portal>
      )}
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
