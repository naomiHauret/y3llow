import { createSignal } from 'solid-js'
import { ROUTE_USER_PROFILE } from '~/config'
import FormInput from '~/design-system/components/FormInput'
const FormSearchProfile = () => {
  const [address, setAddress] = createSignal()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        location.href = `${ROUTE_USER_PROFILE}${address()}`
      }}
    >
      <FormInput
        class="max-w-[64ex]"
        onChange={(e) => setAddress(e.currentTarget.value)}
        required
        pattern="^0x[a-fA-F0-9]{40}$"
        maxlength="64"
        placeholder="0x..."
        type="text"
      />
      <button hidden type="submit">
        Search profile
      </button>
    </form>
  )
}

export default FormSearchProfile
