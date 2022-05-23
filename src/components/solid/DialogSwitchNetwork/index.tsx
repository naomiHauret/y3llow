import { switchNetwork } from '@wagmi/core'
import { Transition, TransitionChild } from 'solid-headless'
import { For } from 'solid-js'
import panel from '~/design-system/styles/panel'
import { IconClose } from '../Icons'
import { useNetwork } from '~/hooks'
import { supportedChains } from '~/config'

const modalBody = panel({
  //@ts-ignore
  intent: 'default',
  size: 'default',
  class:
    'inline-block w-full max-w-screen-2xs pt-6 pb-10 my-8 overflow-hidden align-middle transition-all transform relative',
})

export const DialogSwitchNetwork = (props) => {
  const { networkData } = useNetwork()

  async function changeNetwork(value) {
    try {
      await switchNetwork({ chainId: value })
      props.api().close()
    } catch (e) {
      props.apiToast.create({
        title: 'Something went wrong while switching network. Please reload the page and try again.',
        type: 'error',
        duration: 7000,
      })
      console.error(e)
    }
  }

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
                    Switch network
                  </h2>
                  <p class="my-3 text-xs text-neutral-11">
                    You are currently using{' '}
                    <span class="text-highlight-10 font-medium">{networkData()?.chain.name}</span>.
                  </p>
                  <p class="mt-3 text-xs text-true-white mb-6" {...props.api().descriptionProps}>
                    Click on the network you want to use to send your tip.
                  </p>

                  <ul class="grid grid-cols-1 gap-3 2xs:grid-cols-2">
                    <For each={networkData()?.chains}>
                      {(chain) => (
                        <li
                          class="text-2xs relative flex flex-col justify-start items-center col-span-1 p-3 text-center rounded-md border-solid border-1 bg-true-white bg-opacity-3.5 border-true-white border-opacity-15"
                          classList={{
                            'opacity-50 ring-4 ring-highlight-10 ring-opacity-50': chain.id === networkData().chain.id,
                            ' hover:border-opacity-25 focus-within:bg-opacity-7.5 focus-within:border-opacity-25':
                              chain.id !== networkData().chain.id,
                          }}
                        >
                          <img height="50" width="50" src={supportedChains[chain.id].icon} alt="" />
                          <div class="pt-3">
                            <div>{chain.name}</div>
                            {chain?.testnet === true && (
                              <div class="absolute top-2 inline-start-2 w-[fit-content] mx-auto text-3xs uppercase bg-positive-1 py-1 px-2 tracking-wide rounded-full text-positive-10 font-semibold">
                                Testnet
                              </div>
                            )}
                          </div>
                          <Show when={chain.id !== networkData().chain.id}>
                            <button
                              onclick={() => changeNetwork(chain.id)}
                              class="absolute inset-0 w-full h-full block z-10 opacity-0"
                            >
                              Use {chain.name}
                            </button>
                          </Show>
                        </li>
                      )}
                    </For>
                    <li class="text-2xs text-neutral-12 relative flex flex-col justify-start items-center col-span-1 p-3 text-center rounded-md">
                      <p class="mt-3 mb-2">Don't see your favourite chain ?</p>
                      <a href="https://github.com/naomiHauret/y3llow/issues/new" target="_blank" rel="noreferrer">
                        Request support
                      </a>
                    </li>
                  </ul>
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

export default DialogSwitchNetwork
