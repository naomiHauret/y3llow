import { Show } from 'solid-js'
import FormInput from '~/design-system/components/FormInput'
import FormField from '~/design-system/components/FormField'
import FormTextarea from '~/design-system/components/FormTextarea'
import styles from './index.module.css'
import { IconCamera } from '../../Icons'
import ipfsToHttpsUrl from '~/helpers/ipfsToHttpsUrl'

export const FormFields = (props) => {
  return (
    <fieldset
      class={`${styles.fieldset} flex flex-col space-y-4`}
      aria-disabled={props.storeForm.isSubmitting === true || props.submitEditProfileState.loading === true}
    >
      <FormField>
        <FormField.InputField>
          <div class="flex flex-col lg:justify-between lg:flex-row lg:space-x-6">
            <div>
              <FormField.Label for="background">Your banner</FormField.Label>
              <FormField.Description id="input-background-description">
                An image displayed on top of your profile. <br />
                Click on the picture to upload a custom image from your files.
              </FormField.Description>
            </div>
            <div class="h-28 rounded-md overflow-hidden aspect-banner relative bg-neutral-6">
              <input
                onChange={(e) => {
                  //@ts-ignore
                  const src = URL.createObjectURL(e.target.files[0])
                  props.formInputImagesState.setBackground(src)
                }}
                class="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                type="file"
                accept="image/*"
                name="background"
                id="background"
                aria-describedby="input-background-description input-background-helpblock"
              />

              <div class="absolute w-full h-full rounded-md inset-0 z-20 bg-neutral-6 bg-opacity-50 flex items-center justify-center">
                <IconCamera class="text-2xl text-true-white" />
              </div>

              <Show when={props.formInputImagesState.background !== null}>
                <img
                  loading="lazy"
                  width="268"
                  height="112"
                  alt=""
                  class="absolute w-full h-full object-cover block z-10 inset-0"
                  src={ipfsToHttpsUrl(props.formInputImagesState.background)}
                />
              </Show>
            </div>
          </div>
        </FormField.InputField>
        <FormField.HelpBlock id="input-background-helpblock">
          A 3:1 ratio picture. We recommend it to be minimum 568x189, maximum 1500x500 and less than 5MB.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <div class="flex flex-col lg:justify-between lg:flex-row lg:space-x-6">
            <div>
              <FormField.Label for="image">Your profile picture</FormField.Label>
              <FormField.Description id="input-image-description">
                An image you want to be represented by. <br />
                Click on the picture to upload a custom image from your files.
              </FormField.Description>
            </div>
            <div class="h-28 w-28 rounded-full overflow-hidden relative bg-neutral-6">
              <input
                onChange={(e) => {
                  //@ts-ignore
                  const src = URL.createObjectURL(e.target.files[0])
                  props.formInputImagesState.setImage(src)
                }}
                class="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                type="file"
                accept="image/*"
                name="image"
                id="image"
                aria-describedby="input-image-description input-image-helpblock"
              />
              <div class="absolute w-full h-full rounded-full inset-0 z-20 bg-neutral-6 bg-opacity-50 flex items-center justify-center">
                <IconCamera class="text-2xl text-true-white" />
              </div>
              <Show when={props.formInputImagesState.image !== null}>
                <img
                  alt=""
                  loading="lazy"
                  width="112"
                  height="112"
                  class="absolute w-full h-full object-cover block z-10 inset-0"
                  src={ipfsToHttpsUrl(props.formInputImagesState.image)}
                />
              </Show>
            </div>
          </div>
        </FormField.InputField>
        <FormField.HelpBlock id="input-image-helpblock">
          A 1:1 ratio picture. We recommend it to be minimum 120x120, maximum 160x160 and less than 1MB.
        </FormField.HelpBlock>
      </FormField>

      <FormField hasError={props.storeForm.errors().emoji?.length > 0 === true}>
        <FormField.InputField>
          <FormField.Label hasError={props.storeForm.errors().emoji?.length > 0 === true} for="emoji">
            Your emoji
          </FormField.Label>
          <FormField.Description id="input-emoji-description">
            Pick the emoji that you think represents you
          </FormField.Description>
          <FormInput
            aria-invalid={props.storeForm.errors().emoji?.length > 0 === true}
            class="max-w-full w-auto 2xs:w-full lg:max-w-[4ex]"
            type="text"
            name="emoji"
            id="emoji"
            maxLength="2"
            aria-describedby="input-emoji-description input-emoji-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock hasError={props.storeForm.errors().emoji?.length > 0 === true} id="input-emoji-helpblock">
          Please use an emoji of maximum 2 characters.
        </FormField.HelpBlock>
      </FormField>

      <FormField hasError={props.storeForm.errors().name?.length > 0 === true}>
        <FormField.InputField>
          <FormField.Label hasError={props.storeForm.errors().name?.length > 0 === true} for="name">
            Your name
          </FormField.Label>
          <FormField.Description id="input-name-description">
            A display name you are comfortable with (your full name, first name, nickname ...)
          </FormField.Description>
          <FormInput
            aria-invalid={props.storeForm.errors().name?.length > 0 === true}
            class="lg:max-w-[155ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
            type="text"
            name="name"
            id="name"
            maxLength="150"
            aria-describedby="input-name-description input-name-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock hasError={props.storeForm.errors().name?.length > 0 === true} id="input-name-helpblock">
          Please use at most 150 characters.
        </FormField.HelpBlock>
      </FormField>

      <FormField hasError={props.storeForm.errors().gender?.length > 0 === true}>
        <FormField.InputField>
          <FormField.Label hasError={props.storeForm.errors().gender?.length > 0 === true} for="gender">
            Your gender/pronouns
          </FormField.Label>
          <FormField.Description id="input-gender-description">
            The gender you identify as and/or your pronouns.
          </FormField.Description>
          <FormInput
            aria-invalid={props.storeForm.errors().gender?.length > 0 === true}
            class="lg:max-w-[45ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
            type="text"
            name="gender"
            id="gender"
            maxLength="42"
            aria-describedby="input-gender-description input-gender-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock
          hasError={props.storeForm.errors().gender?.length > 0 === true}
          id="input-gender-helpblock"
        >
          Please use at most 42 characters.
        </FormField.HelpBlock>
      </FormField>

      <FormField hasError={props.storeForm.errors().homeLocation?.length > 0 === true}>
        <FormField.InputField>
          <FormField.Label hasError={props.storeForm.errors().homeLocation?.length > 0 === true} for="homeLocation">
            Where are you based ?
          </FormField.Label>
          <FormField.Description id="input-homeLocation-description">
            The place you call home (your city, country, planet...)
          </FormField.Description>
          <FormInput
            aria-invalid={props.storeForm.errors().homeLocation?.length > 0 === true}
            class="lg:max-w-[145ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
            type="text"
            name="homeLocation"
            id="homeLocation"
            maxLength="140"
            aria-describedby="input-homeLocation-description input-homeLocation-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock
          hasError={props.storeForm.errors().homeLocation?.length > 0 === true}
          id="input-homeLocation-helpblock"
        >
          Please use at most 140 characters.
        </FormField.HelpBlock>
      </FormField>

      <FormField hasError={props.storeForm.errors().url?.length > 0 === true}>
        <FormField.InputField>
          <FormField.Label hasError={props.storeForm.errors().url?.length > 0 === true} for="url">
            Your website
          </FormField.Label>
          <FormField.Description id="input-url-description">Your personal website</FormField.Description>
          <FormInput
            aria-invalid={props.storeForm.errors().url?.length > 0 === true ? 'true' : 'false'}
            class="lg:max-w-[245ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
            placeholder="https://example.xyz"
            type="url"
            name="url"
            id="url"
            maxLength="240"
            aria-describedby="input-url-description input-url-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock hasError={props.storeForm.errors().url?.length > 0 === true} id="input-url-helpblock">
          Please type a valid URL that is at most 240 characters.
        </FormField.HelpBlock>
      </FormField>

      <FormField hasError={props.storeForm.errors().description?.length > 0 === true}>
        <FormField.InputField>
          <FormField.Label hasError={props.storeForm.errors().description?.length > 0 === true} for="description">
            About you
          </FormField.Label>
          <FormField.Description id="input-description-description">
            What do you want the world to know about you ?
          </FormField.Description>
          <FormTextarea
            aria-invalid={props.storeForm.errors().description?.length > 0 === true}
            class="lg:max-w-[245ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
            type="text"
            name="description"
            id="description"
            maxLength="240"
            aria-describedby="input-description-description input-description-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock
          hasError={props.storeForm.errors().description?.length > 0 === true}
          id="input-description-helpblock"
        >
          Please use at most 240 characters.
        </FormField.HelpBlock>
      </FormField>

      <FormField hasError={props.storeForm.errors().affiliations?.length > 0 === true}>
        <FormField.InputField>
          <FormField.Label hasError={props.storeForm.errors().affiliations?.length > 0 === true} for="affiliations">
            Your affiliations
          </FormField.Label>
          <FormField.Description id="input-affiliations-description">
            Companies you worked at, DAOs/NGOs you're part of...
          </FormField.Description>
          <FormTextarea
            aria-invalid={props.storeForm.errors().affiliations?.length > 0 === true}
            class="lg:max-w-[245ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
            type="text"
            name="affiliations"
            id="affiliations"
            maxLength="240"
            aria-describedby="input-affiliations-description input-affiliations-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock
          hasError={props.storeForm.errors().affiliations?.length > 0 === true}
          id="input-affiliations-helpblock"
        >
          Separate your organizations name with a "," and use at most 240 characters.
        </FormField.HelpBlock>
      </FormField>
    </fieldset>
  )
}

export default FormFields
