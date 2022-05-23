import { Switch, Match } from 'solid-js'
import { RadioGroupLabel, RadioGroupOption } from 'solid-headless'
import { IconSpinner } from '../Icons'

export const OptionToken = (props) => {
  return (
    <RadioGroupOption
      aria-disabled={!props?.formatted || parseInt(props?.formatted === 0)}
      disabled={!props?.formatted || parseFloat(props?.formatted) === 0}
      value={props.value}
    >
      {({ isSelected: checked }) => (
        <>
          <RadioGroupLabel
            class="p-3 rounded-md border-1 flex items-center cursor-pointer"
            classList={{
              'border-neutral-3 text-true-white hover:bg-true-white hover:bg-opacity-5': !checked(),
              'bg-highlight-10 hover:bg-highlight-9 border-transparent text-true-black': checked(),
            }}
          >
            <img src={props.logo} alt="" width="25" height="25" loading="lazy" />
            <span class="pis-2 font-semibold">{props.tokenName}</span>
            <Switch>
              <Match when={props.formatted}>
                <p class="overflow-hidden pis-[5ex] text-ellipsis mis-auto font-medium font-mono animate-appear">
                  {((props.formatted * 100) / 100).toFixed(4)}
                </p>
              </Match>
              <Match when={!props?.formatted}>
                <IconSpinner class="animate-spin mis-auto" />
              </Match>
            </Switch>
          </RadioGroupLabel>
        </>
      )}
    </RadioGroupOption>
  )
}

export default OptionToken
