import { createEffect, For, Show, Switch } from 'solid-js'
import { IconCardId, IconLink } from '../../Icons'

const ProfilePreview = (props) => {
  return (
    <article class="w-full text-xs rounded-md overflow-hidden border-solid border-1 border-neutral-4">
      <div class="aspect-banner w-full bg-neutral-6">
        <Show when={props?.data?.banner !== null}>
          <img
            width="240"
            height="80"
            loading="lazy"
            alt=""
            class="w-full h-full object-cover"
            src={props?.data?.banner}
          />
        </Show>
      </div>
      <div class="pb-2">
        <div class="px-3 pb-2">
          <div class="-mt-10 md:-mt-4 h-20 w-20 2xs:h-24 2xs:w-24 sm:h-14 sm:w-14 ring-true-black ring-4 bg-neutral-6 relative rounded-full">
            <Show when={props?.data?.avatar !== null}>
              <img
                width="56"
                height="56"
                loading="lazy"
                class=" w-full h-full object-cover rounded-full"
                src={props?.data?.avatar}
                alt=""
              />
            </Show>
            <Show when={props?.data?.emoji}>
              <span class="absolute -bottom-1 -inline-end-2 z-10 flex items-center justify-center p-1 aspect-square bg-true-white border-solid border-2 border-true-black rounded-full text-2xs">
                {props?.data?.emoji}
              </span>
            </Show>
          </div>
          <div class="pt-3">
            <span class="font-extrabold text-true-white">{props?.data?.name}</span>
          </div>
          <div class="flex flex-row items-baseline space-">
            <span
              class="text-xs font-medium text-neutral-11"
              classList={{
                'pie-[1.5ex]': props?.data?.gender && props?.data?.gender?.trim().length > 0,
              }}
            >
              {props?.data?.gender}
            </span>
            <span class="text-2xs text-neutral-8">{props?.data?.homeLocation}</span>
          </div>
          <Show when={props?.data?.url}>
            <a href={props?.data?.url} class="pt-1 pb-2.5 flex text-2xs items-center" target="_blank">
              {' '}
              <IconLink class="text-sm mie-[0.5ex]" /> <span>Website</span>
            </a>
          </Show>
          <Show when={props?.data?.description.trim() !== ''}>
            <p class="text-neutral-12">{props?.data?.description}</p>
          </Show>
        </div>
        <Show when={props?.data?.affiliations.length > 0}>
          <div class="mt-2 border-t-1 border-solid border-neutral-6">
            <div class="pt-1.5 px-3">
              <span class="uppercase block font-semibold text-2xs tracking-wide mb-1 text-neutral-8">Affiliations</span>
              <ul class="space-y-1">
                <For each={props?.data?.affiliations}>
                  {(affiliation) => (
                    <li class="text-2xs text-neutral-9 flex rounded-md">
                      <IconCardId class="text-neutral-7 text-lg mie-[1ex]" />
                      {affiliation}
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </div>
        </Show>
      </div>
    </article>
  )
}
export default ProfilePreview
