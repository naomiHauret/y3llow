import { createEffect, createSignal, Match, Switch } from 'solid-js'
import { useAccount, useConnect } from '~/hooks'
import { shrinkEthereumAddress } from '~/helpers'
import button from '~/design-system/styles/button'
import panel from '~/design-system/styles/panel'
import { ROUTE_DASHBOARD, ROUTE_MY_PROFILE } from '~/config'
import * as popover from '@zag-js/popover'
import { normalizeProps, useMachine, useSetup } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Transition } from 'solid-headless'
import ButtonGroupWalletOptions from '../ButtonGroupWalletOptions'
import { IconChevronDown, IconSpinner } from '../Icons'
import type { PropTypes } from '@zag-js/solid'
import type { PopoverConnectionProps } from './types'

//@ts-ignore
const layerPanel = panel({ intent: 'default', size: 'default', class: 'overflow-hidden' })

export const PopoverConnectionWallet = (props: PopoverConnectionProps) => {
  const { accountData } = useAccount()
  const { walletConnectionState, disconnect } = useConnect(false)
  const [state, send] = useMachine(popover.machine())
  const ref = useSetup({ send, id: createUniqueId() })
  const api = createMemo(() => popover.connect<PropTypes>(state, send, normalizeProps))
  const [popoverLabel, setPopoverLabel] = createSignal(
    props.initialAddress ? shrinkEthereumAddress(props.initialAddress) : 'Connect',
  )

  createEffect(() => {
    if (accountData().address) setPopoverLabel(shrinkEthereumAddress(accountData().address))
    if (walletConnectionState.loading === true) setPopoverLabel('Connecting...')
    if (
      !accountData().address &&
      walletConnectionState.connected === false &&
      walletConnectionState.verified === false &&
      walletConnectionState.loading === false
    )
      setPopoverLabel('Connect')
  })
  return (
    <>
      <div ref={ref} class={`relative`}>
        <button
          //@ts-ignore
          class={button({ intent: 'brand-outline', size: 'sm', class: 'after:bg-true-black' })}
          {...api().triggerProps}
        >
          {walletConnectionState.loading && <IconSpinner class="animate-spin mie-1ex" />} {popoverLabel()}{' '}
          <div
            class="mis-1ex bg-true-white p-0.5 rounded-full"
            classList={{
              'bg-opacity-5': api().isOpen === false,
              'bg-opacity-20 transform rotate-180': api().isOpen === true,
            }}
          >
            <IconChevronDown />
          </div>
        </button>
        <Transition
          show={api().isOpen}
          enter="transition duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div
            {...api().contentProps}
            class="absolute inline-start-1/2 transform -translate-x-1/2 2xs:inline-start-unset 2xs:inline-start-full 2xs:-translate-x-full text-center z-10 w-screen max-w-screen-xs xs:max-w-screen-min px-2 xs:px-0 mt-0.5"
          >
            <div class="sr-only" {...api().titleProps}>
              Connect your Ethereum wallet
            </div>
            <div class="sr-only" {...api().descriptionProps}>
              Description
            </div>
            <Switch>
              <Match
                when={
                  walletConnectionState.connected === true &&
                  walletConnectionState.loading === false &&
                  walletConnectionState.verified === true
                }
              >
                <div class={`divide-y-1 divide-neutral-6 ${layerPanel}`}>
                  <a
                    href={ROUTE_DASHBOARD}
                    class="unstyled text-xs font-bold sm:font-semibold py-2 px-4 w-full flex justify-between items-baseline hover:bg-true-white hover:bg-opacity-10 focus:bg-highlight-10 focus:text-true-black"
                  >
                    Go to my dashboard
                  </a>
                  <a
                    href={ROUTE_MY_PROFILE}
                    class="unstyled text-xs font-bold sm:font-semibold py-2 px-4 w-full flex justify-between items-baseline hover:bg-true-white hover:bg-opacity-10 focus:bg-highlight-10 focus:text-true-black"
                  >
                    Edit my profile
                  </a>
                  <button
                    class="text-xs font-bold sm:font-semibold py-2 px-4 w-full flex items-baseline hover:bg-true-white hover:bg-opacity-10 focus:bg-highlight-10 focus:text-true-black"
                    onClick={disconnect}
                  >
                    <span class="text-neutral-9 h-[1em] mie-[0.5ch]" />
                    Log out
                  </button>
                </div>
              </Match>
              <Match
                when={
                  walletConnectionState.connected === false ||
                  walletConnectionState.loading === true ||
                  walletConnectionState.verified === false
                }
              >
                <div class={layerPanel}>
                  <div class="pt-4 space-y-4">
                    <div class="px-4 space-y-4 divide-y-1 divide-neutral-6">
                      <ButtonGroupWalletOptions />
                    </div>
                    <div class="px-4 pb-4 border-t-1 border-solid border-neutral-6 bg-neutral-1 rounded-b-none border-l-none border-x-0">
                      <p class="xs:text-xs text-neutral-12 pt-2.5 font-medium">Don't see your favourite wallet ?</p>
                      <a
                        class="xs:text-xs"
                        href="https://github.com/naomiHauret/y3llow/issues/new"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Request support
                      </a>
                    </div>
                  </div>
                </div>
              </Match>
            </Switch>
          </div>
        </Transition>
      </div>
    </>
  )
}

export default PopoverConnectionWallet
