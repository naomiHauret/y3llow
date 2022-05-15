import { omitProps } from 'solid-use'
import styles from './index.module.css'

export const FormSelect = (props) => {
  return (
    <span class={`relative block ${props.wrapperClass ?? ''} ${styles.wrapper}`}>
      <select
        {...omitProps(props, ['class', 'hasError', 'wrapperClass', 'children'])}
        class={`default-input ${props.class ?? ''}`}
      >
        {props.children}
      </select>
      <div class={`${styles.pseudoChevron} pointer-events-none absolute inline-end-1.5 w-3 top-0 h-full`} />
    </span>
  )
}

export default FormSelect
