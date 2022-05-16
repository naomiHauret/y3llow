import { Portal } from 'solid-js/web'
import { useEditProfile } from '~/hooks'
import ipfsToHttpsUrl from '~/helpers/ipfsToHttpsUrl'
import Toast from './../../../design-system/components/Toast'
import Button from './../../../design-system/components/Button'
import ProfilePreview from './ProfilePreview'
import FormFields from './FormFields'
import type { EditProfileProps } from './types'

export const EditProfile = (props: EditProfileProps) => {
  let submitButtonRef
  const { storeForm, apiToast, formInputImagesState, submitEditProfileState } = useEditProfile(props?.defaultValues)
  const { form } = storeForm
  return (
    <>
      <div class="container mx-auto relative flex flex-col space-y-6 sm:space-y-0 sm:space-x-8 sm:flex-row">
        <div class="w-full sm:w-7/12 md:w-3/4">
          {/* @ts-ignore */}
          <form use:form>
            <FormFields
              storeForm={storeForm}
              formInputImagesState={formInputImagesState}
              submitEditProfileState={submitEditProfileState}
            />
            <button hidden ref={submitButtonRef} type="submit">
              Edit profile
            </button>
          </form>
        </div>
        <div class="relative w-full sm:w-5/12 md:w-1/4 pt-4 sm:pt-0">
          <div class="sm:sticky flex flex-col space-y-4 bottom-0 inline-end-0 w-full sm:bottom-unset sm:top-5 sm:inline-end-5">
            <Button
              isLoading={storeForm.isSubmitting === true || submitEditProfileState.loading === true}
              intent="positive"
              class="w-full"
              onClick={() => submitButtonRef.click()}
              disabled={
                storeForm.interacted() === null || storeForm.isValidating === true || storeForm.isDirty === true
              }
            >
              Edit profile
            </Button>
            <Button
              intent="negative-outline"
              class="w-full"
              onClick={() => storeForm.reset()}
              disabled={
                storeForm.interacted() === null ||
                storeForm.isSubmitting === true ||
                submitEditProfileState.loading === true ||
                storeForm.isValidating === true ||
                storeForm.isDirty === true
              }
            >
              Cancel my changes
            </Button>
            <div class="flex items-center justify-center flex-col space-y-1">
              <span class="text-2xs font-medium text-neutral-9">Changes preview</span>
              <ProfilePreview
                data={{
                  ...storeForm.data(),
                  banner:
                    formInputImagesState.background !== null ? ipfsToHttpsUrl(formInputImagesState.background) : null,
                  avatar: formInputImagesState.image !== null ? ipfsToHttpsUrl(formInputImagesState.image) : null,
                  affiliations: storeForm
                    .data()
                    .affiliations?.split(',')
                    .filter((element) => element.trim() !== ''),
                }}
              />
            </div>
          </div>
        </div>

        <Portal>
          <div
            {...apiToast.getGroupProps({ placement: 'bottom-center' })}
            class="relative z-50 flex flex-col items-center justify-center"
          >
            {apiToast.toasts.map((toast) => (
              <Toast toast={toast} />
            ))}
          </div>
        </Portal>
      </div>
    </>
  )
}

export default EditProfile
