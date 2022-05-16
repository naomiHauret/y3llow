import { For } from 'solid-js'
import { useConnect } from '~/hooks'
import Button from '../../../design-system/components/Button'

export const ButtonGroupWalletOptions = () => {
  const { connect, connectors, walletConnectionState } = useConnect(false)
  return (
    <>
      <For each={connectors}>
        {(connector) => (
          <>
            <Button
              /* @ts-expect-error */
              intent={`wallet-${connector.name}`}
              class={`${
                walletConnectionState.loading === true ?? 'animate-pulse'
              } w-full flex items-center justify-center`}
              /* @ts-ignore */
              disabled={connector.ready === false || walletConnectionState.loading === true}
              onClick={() => connect(connector)}
              isLoading={walletConnectionState.loading === true}
            >
              {/* @ts-ignore */}
              {' '}{connector.name}{' '}
            </Button>
          </>
        )}
      </For>
    </>
  )
}

export default ButtonGroupWalletOptions
