import { createUniqueId } from 'solid-js'
import create from 'solid-zustand'
import { EthereumAuthProvider, SelfID, WebClient } from '@self.id/web'
import { uploadImage } from '@self.id/image-utils'
import { createForm } from '@felte/solid'
import { reporter } from '@felte/reporter-solid'
import { validateSchema } from '@felte/validator-zod'
import { object, string, instanceof as zodValidationInstanceOf } from 'zod'
import { useMachine, useSetup } from '@zag-js/solid'
import * as toast from '@zag-js/toast'
import { useAccount } from '~/hooks'
import { getLinkedDID, linkCurrentAddress } from '~/helpers/caip10-link'
import type { PropTypes } from '@zag-js/solid'

interface SubmitProfileState {
  success: boolean
  error: null | string
  loading: boolean
  setSuccess: (isVerified: boolean) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
}

interface FormInputFileImagesState {
  image: string | null
  background: string | null
  setBackground: (value: string | null) => void
  setImage: (value: string | null) => void
}

const schema = object({
  name: string().max(150).optional(),
  residenceCountry: string().max(140).optional(),
  image: zodValidationInstanceOf(File).optional(),
  emoji: string()
    .regex(/\p{Emoji}/u)
    .max(2)
    .or(string().max(0)),
  description: string().max(420).optional(),
  background: zodValidationInstanceOf(File).optional(),
  url: string().url().or(string().max(0)),
  gender: string().max(42).optional(),
  affiliations: string().max(240).optional(),
})

const useSubmitProfileStore = create<SubmitProfileState>((set) => ({
  success: false,
  error: null,
  loading: false,
  setSuccess: (value) => set((state) => ({ success: value })),
  setError: (value) => set((state) => ({ error: value })),
  setLoading: (value) => set((state) => ({ loading: value })),
}))

export function useEditProfile(defaultValues) {
  const { accountData } = useAccount()
  const submitEditProfileState = useSubmitProfileStore()
  const [state, send] = useMachine(
    toast.group.machine({
      offsets: {
        top: '1rem',
        right: '1rem',
        bottom: '1rem',
        left: '1rem',
      },
    }),
  )
  const ref = useSetup({ send, id: createUniqueId() })
  const apiToast = toast.group.connect<PropTypes>(state, send)
  const storeForm = createForm({
    initialValues: {
      name: defaultValues?.name ?? '',
      homeLocation: defaultValues?.homeLocation ?? '',
      emoji: defaultValues?.emoji ?? '',
      description: defaultValues?.description ?? '',
      gender: defaultValues?.gender ?? '',
      url: defaultValues?.url ?? '',
      affiliations: defaultValues?.affiliations.join(',') ?? '',
    },
    onSubmit: (values) => {
      submitEditProfileState.setSuccess(false)
      submitEditProfileState.setLoading(true)
      submitEditProfileState.setError(null)
      editProfile(values)
    },
    validate: validateSchema(schema),
    extend: reporter,
  })

  const useFormInputFileImagesStore = create<FormInputFileImagesState>((set) => ({
    image: defaultValues?.image?.original?.src ?? null,
    background: defaultValues?.background?.original?.src ?? null,
    setBackground: (value) => set((state) => ({ background: value })),
    setImage: (value) => set((state) => ({ image: value })),
  }))

  const formInputImagesState = useFormInputFileImagesStore()

  async function setProfileImage(selfID, file) {
    try {
      const imageSources = await uploadImage('https://ipfs.infura.io:5001/api/v0', file, [
        { width: 60, height: 60 },
        { width: 200, height: 200 },
        { width: 400, height: 400 },
      ])
      return imageSources
    } catch (e) {
      console.error(e)
    }
  }

  async function setBackgroundImage(selfID, file) {
    try {
      const imageSources = await uploadImage('https://ipfs.infura.io:5001/api/v0', file, [
        { width: 568, height: 189 },
        { width: 1024, height: 341 },
        { width: 1200, height: 400 },
        { width: 1500, height: 500 },
      ])
      return imageSources
    } catch (e) {
      console.error(e)
    }
  }

  async function editProfile(profile) {
    apiToast.create({
      title: 'Updating your profile, please wait...',
      type: 'info',
      duration: 5000,
    })
    try {
      const profileData = {
        ...profile,
        affiliations: profile.affiliations.trim().split(','),
      }

      const authProvider = new EthereumAuthProvider(window.ethereum, accountData().address)
      const ceramicClient = new WebClient({
        ceramic: 'testnet-clay',
        connectNetwork: 'testnet-clay',
      })

      await ceramicClient.authenticate(authProvider)

      const selfId = new SelfID({ client: ceramicClient })
      const linkedDid = await getLinkedDID(accountData().address)
      const did = selfId.did?._id

      if (linkedDid === null) {
        const link = await linkCurrentAddress(accountData().address, did)
      }

      if (profileData.image) {
        const image = await setProfileImage(selfId, profileData.image)
        profileData.image = image
      } else if (defaultValues && defaultValues !== null && defaultValues?.image !== null) {
        profileData.image = defaultValues.image
      }

      if (profileData?.background) {
        const background = await setBackgroundImage(selfId, profileData.background)
        profileData.background = background
      } else if (defaultValues && defaultValues !== null && defaultValues?.background !== null) {
        profileData.background = defaultValues.background
      }

      await selfId.set('basicProfile', profileData)
      submitEditProfileState.setLoading(false)
      submitEditProfileState.setSuccess(true)
      apiToast.create({
        title: 'Your profile was updated successfully !',
        type: 'success',
        duration: 5000,
      })
    } catch (e) {
      console.error(e)
      submitEditProfileState.setError(e)
      submitEditProfileState.setLoading(false)
      submitEditProfileState.setSuccess(false)
      apiToast.create({
        title: `Your profile couldn\'t be updated : ${e}`,
        type: 'error',
        duration: 5000,
      })
    }
  }

  return {
    apiToast,
    storeForm,
    editProfile,
    submitEditProfileState,
    formInputImagesState,
  }
}

export default useEditProfile
