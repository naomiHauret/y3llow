import { createSignal } from 'solid-js'
import { ROUTE_USER_PROFILE } from '~/config'
import FormInput from '~/design-system/components/FormInput'
const FormSearchProfile = () => {
  const [address, setAddress] = createSignal()
  return (
    <form
      class="w-full"
      onSubmit={(e) => {
        e.preventDefault()
        location.href = `${ROUTE_USER_PROFILE}${address()}`
      }}
    >
      <div class="flex flex-col">
        <label class="text-[12px] text-center text-neutral-9" for="search-form-input-ethereum-address">
          Search profile
        </label>
        <FormInput
          id="search-form-input-ethereum-address"
          name="search-form-input-ethereum-address"
          class="w-full my-1 text-xs font-mono"
          onChange={(e) => setAddress(e.currentTarget.value)}
          required
          pattern="^0x[a-fA-F0-9]{40}$"
          maxlength="42"
          placeholder="0x..."
          type="text"
        />
        <p class="text-[12px] font-medium text-center text-neutral-8">Type a valid Ethereum address and press enter.</p>
      </div>

      <button hidden type="submit">
        Search profile
      </button>
    </form>
  )
}

export default FormSearchProfile
