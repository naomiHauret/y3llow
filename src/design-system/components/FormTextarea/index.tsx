import { omitProps } from 'solid-use'

export const FormTextarea = (props) => {
  return <textarea {...omitProps(props, ['class', 'hasError'])} class={`default-input ${props.class ?? ''}`} />
}

export default FormTextarea
