import { createEffect, For } from 'solid-js'
import { ROUTE_USER_PROFILE } from '~/config'
import { useProfileDonation } from '~/hooks/useProfileDonation'
import { shrinkEthereumAddress } from '~/helpers'

export const ListDonations = (props) => {
  const { donationListState } = useProfileDonation(props.initialDonationsList)

  return (
    <>
      {donationListState.list.length > 0 ? (
        <ul class="space-y-6">
          <For each={donationListState.list}>
            {(donation) => (
              <li class="rounded-lg pis-6 pie-8 text-sm pt-4 pb-3 border-solid border-1 border-neutral-3 ">
                <p class="text-xs mb-3 flex flex-wrap items-baseline space-i-[1ex]">
                  <a
                    href={`ROUTE_USER_PROFILE${donation.from}`}
                    class="unstyled text-xs font-medium bg-neutral-3 text-true-white font-mono rounded-full py-0.5 px-3 mie-[1ex]"
                  >
                    {shrinkEthereumAddress(donation.from)}
                  </a>{' '}
                  sent{' '}
                  <span class="font-bold text-gradient-brand">
                    {donation.amount} {donation.token_name}
                  </span>
                </p>
                {donation?.message && donation?.message?.trim()?.length > 0 && (
                  <p class="font-medium bg-neutral-1 bg-opacity-50 border-neutral-6 text-xs rounded-lg border-solid border-1 px-4 py-2">
                    {donation?.message}
                  </p>
                )}
                <a class="block mt-4 text-2xs" href={donation?.explorer_link} target="_blank">
                  View transaction on explorer
                </a>
              </li>
            )}
          </For>
        </ul>
      ) : (
        <p class="text-neutral-8 italic">No tips to list (for now!)</p>
      )}
    </>
  )
}

export default ListDonations
