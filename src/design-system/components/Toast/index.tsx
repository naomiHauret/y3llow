import * as toast from '@zag-js/toast'
import { Match, Switch } from 'solid-js'
import { toastIcon, toastLayer } from '~/design-system/styles/toast'
import { IconCheck, IconClose, IconErrorCircleOutline, IconSpinner } from '../../../components/solid/Icons'
import type { PropTypes } from '@zag-js/solid'

const Toast = (props) => {
  const api = toast.connect<PropTypes>(props.toast.state, props.toast.send)
  const layerStyles = toastLayer({ intent: api.type })
  const iconStyles = toastIcon({ intent: api.type })
  return (
    <div {...api.rootProps} class={layerStyles}>
      <div class="flex items-center">
        <div class="mis-2 text-xl">
          <Switch>
            <Match when={api.type === 'loading'}>
              <IconSpinner class={`${iconStyles} animate-spin`} />
            </Match>
            <Match when={api.type === 'success'}>
              <IconCheck class={iconStyles} />
            </Match>
            <Match when={api.type === 'error'}>
              <IconErrorCircleOutline class={iconStyles} />
            </Match>
          </Switch>
        </div>
        <div class="pis-1 pie-7 pt-2.5 pb-3">
          <p class="text-xs" {...api.titleProps}>
            {api.title}
          </p>
        </div>
      </div>
      <p>{api.type === 'loading' ? <span /> : null}</p>
      <button
        class="absolute rounded-full text-2xs top-0.5 inline-end-0.5 flex justify-center items-center p-0.5 bg-true-black bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-25"
        onClick={api.dismiss}
      >
        <span class="sr-only">Close this notification</span>
        <IconClose />
      </button>
      <div {...api.progressbarProps} />
    </div>
  )
}

export default Toast
