import { Transition, TransitionChild, RadioGroup } from 'solid-headless'
import { For } from 'solid-js'
import { tokens } from '~/helpers'
import panel from '~/design-system/styles/panel'
import OptionToken from './OptionToken'
import type { PropTypes } from '@zag-js/solid'
import { IconClose } from '../Icons'
import Button from '~/design-system/components/Button'

const modalBody = panel({
  //@ts-ignore
  intent: 'default',
  size: 'default',
  class:
    'inline-block w-full max-w-screen-min pt-6 pb-10 my-8 overflow-hidden align-middle transition-all transform relative',
})

export const DialogPickToken = (props) => {
  return (
    <>
      <Transition appear show={props.api().isOpen}>
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="min-h-screen px-4 flex items-center justify-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* @ts-ignore */}
              <div class="bg-true-black bg-opacity-50 fixed inset-0" {...props.api().overlayProps} />
            </TransitionChild>
            <span class="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div class={modalBody} {...props.api().underlayProps}>
                <div class="px-6 text-start" {...props.api().contentProps}>
                  <h2 class="text-lg font-bold" {...props.api().titleProps}>
                    Select a token
                  </h2>
                  <p class="mt-3 text-xs text-neutral-10 mb-6" {...props.api().descriptionProps}>
                    Select the token that you want to send as a tip.
                  </p>
                  <RadioGroup
                    class="space-y-2"
                    value={props.sendDonationState.pickedToken}
                    onChange={(e) => {
                      props.onRadioChange(e)
                    }}
                  >
                    {({ isSelected, isActive }) => (
                      <>
                        <OptionToken
                          formatted={props.balanceState.balanceOf[props?.currentAddress]?.formatted}
                          tokenName={tokens.native[props.networkId]}
                          value={props.currentAddress}
                          logo={tokens.logos[tokens.native[props.networkId]]}
                        />
                        <For each={Object.keys(tokens[props.networkId])}>
                          {(tokenName) => (
                            <OptionToken
                              formatted={props.balanceState.balanceOf[tokens[props.networkId][tokenName]]?.formatted}
                              tokenName={tokenName}
                              value={tokens[props.networkId][tokenName]}
                              logo={tokens.logos[tokenName]}
                            />
                          )}
                        </For>
                      </>
                    )}
                  </RadioGroup>
                  <button
                    class="absolute top-3 inline-end-3 p-1.5 rounded-full bg-true-white hover:text-highlight-10 bg-opacity-0 hover:bg-opacity-5 focus:bg-opacity-10 focus:outline-none"
                    {...props.api().closeButtonProps}
                  >
                    <IconClose />
                    <span class="sr-only">Close this dialog</span>
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Transition>
    </>
  )
}

export default DialogPickToken
