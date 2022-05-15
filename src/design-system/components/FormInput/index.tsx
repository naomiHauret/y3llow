import { omitProps } from 'solid-use'

export const FormInput = (props) => {
  return <input {...omitProps(props, ['class, hasError'])} class={`default-input ${props.class ?? ''}`} />
}

export default FormInput
