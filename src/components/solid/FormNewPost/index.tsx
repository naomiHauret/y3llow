import { createEffect, onMount } from 'solid-js'
import useBundlr from '~/hooks/useBundlr'

export const FormNewPost = () => {
  const { bundlrState, initBundlrInstance } = useBundlr()
  onMount(() => {
    initBundlrInstance()
  })
  createEffect(() => {
    console.log(bundlrState.loadedBalance)
  })
  return <>hey bla bla bla new post</>
}

export default FormNewPost
