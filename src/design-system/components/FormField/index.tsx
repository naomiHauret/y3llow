import { Show } from 'solid-js'
import { IconErrorCircleOutline } from '../../../components/solid/Icons'

const FormField = (props) => {
  return (
    <div
      class="flex flex-col border-solid rounded-md overflow-hidden border-1 max-w-[inherit]"
      classList={{
        'border-neutral-4': props.hasError === false || !props?.hasError,
        'border-negative-6': props.hasError === true,
      }}
    >
      {props.children}
    </div>
  )
}

const InputField = (props) => {
  return <div class="py-3 px-6">{props.children}</div>
}

const Label = (props) => {
  return (
    <label class="flex items-center font-bold text-md" for={props.form}>
      <Show when={props?.hasError === true}>
        <IconErrorCircleOutline class="text-negative-10 mie-1ex" />
      </Show>
      {props.children}
    </label>
  )
}

const Description = (props) => {
  return (
    <p class="text-neutral-11 text-xs mt-1 mb-3" id={props.id}>
      {props.children}
    </p>
  )
}

const HelpBlock = (props) => {
  return (
    <div
      class="px-6 py-3 border-t-1 text-2xs"
      classList={{
        'border-neutral-4 bg-neutral-1': props.hasError === false || !props?.hasError,
        'border-negative-6 bg-negative-1': props.hasError === true,
      }}
    >
      <p
        classList={{
          'text-neutral-11': props.hasError === false || !props?.hasError,
          'text-negative-11': props.hasError === true,
        }}
        id={props.id}
      >
        {props.children}
      </p>
    </div>
  )
}

FormField.InputField = InputField
FormField.Label = Label
FormField.Description = Description
FormField.HelpBlock = HelpBlock

export default FormField
