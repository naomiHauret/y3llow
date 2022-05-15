import { For } from 'solid-js'
import { useConnect } from '~/hooks'
//import button from '~/design-system/styles/button'
import Button from '../../../design-system/components/Button'

export const ButtonGroupWalletOptions = (props) => {
  const { connect, connectors, walletConnectionState } = useConnect(props.runVerification)
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
              disabled={connector.ready === false || walletConnectionState.loading === true}
              onClick={() => connect(connector)}
              isLoading={walletConnectionState.loading === true}
            >
              {/* @ts-expect-error */} {connector.name}{' '}
            </Button>
          </>
        )}
      </For>
    </>
  )
}

export default ButtonGroupWalletOptions
