import { omitProps } from 'solid-use'
import button from '../../styles/button'
import { IconSpinner } from '../../../components/solid/Icons'

export const Button = (props) => {
  return (
    <button
      class={button({ intent: props.intent ?? 'primary', size: props.size ?? 'default', class: props.class ?? '' })}
      aria-disabled={props.disabled || props.isLoading}
      {...omitProps(props, ['children', 'class', 'isLoading', 'intent', 'size'])}
    >
      {props.isLoading && <IconSpinner aria-hidden="true" class="animate-spin mie-1ex" />}
      {props.children}
    </button>
  )
}

export default Button
