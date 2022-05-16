import { createEffect, createMemo } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Transition, TransitionChild } from 'solid-headless'
import { useMachine, useSetup, normalizeProps } from '@zag-js/solid'
import * as dialog from '@zag-js/dialog'
import { useConnect } from '~/hooks'
import panel from '~/design-system/styles/panel'
import type { PropTypes } from "@zag-js/solid"

//@ts-ignore
const modalBody = panel({
  intent: 'default',
  size: 'default',
  class: 'inline-block w-full max-w-md pt-6 pb-10 my-8 overflow-hidden align-middle transition-all transform',
})

export default function DialogCompleteVerification() {
  const { walletConnectionState } = useConnect(true)
  const [state, send] = useMachine(
    dialog.machine({
      closeOnOutsideClick: false,
      preventScroll: true,
    }),
  )
  const ref = useSetup({ send, id: 'dialog-modal-sign-verification' })
  const api = createMemo(() => dialog.connect<PropTypes>(state, send, normalizeProps))

  createEffect(() => {
    if (walletConnectionState.loading === true) {
      api().open()
    } else {
      api().close()
    }
  })
  return (
    <>
      <Portal>
        <Transition appear show={api().isOpen}>
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
                <div class="bg-true-black bg-opacity-50 fixed inset-0" {...api().overlayProps} />
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
                <div class={modalBody} {...api().underlayProps}>
                  <div class="px-6 text-start xs:text-center" {...api().contentProps}>
                    <h2 class="text-xl font-bold" {...api().titleProps}>
                      Complete authentication
                    </h2>
                    <p class="mt-5 mb-4" {...api().descriptionProps}>
                      Please{' '}
                      <span class="font-bold">
                        sign the <span class="underline">verification message</span> that appeared in your wallet
                      </span>{' '}
                      to complete the authentication process and continue using y3llow.
                    </p>

                    <p class="text-neutral-11 mb-5 text-xs">
                      Curious about how different is Ethereum from "Sign-in with Google" and other centralized identity
                      providers ?
                    </p>
                    <a
                      class="text-xs"
                      target="_blank"
                      rel="nofollow noreferrer"
                      href="https://blog.mycrypto.com/sign-in-with-ethereum-an-alternative-to-centralized-identity-providers"
                    >
                      Read more about using Ethereum to sign up
                    </a>
                  </div>
                </div>
              </TransitionChild>
            </div>
          </div>
        </Transition>
      </Portal>
    </>
  )
}
