import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const toastLayer = cva(['font-medium rounded-md relative animate-fade-in'], {
  variants: {
    intent: {
      info: 'bg-true-black border-1 border-solid border-neutral-4 text-neutral-12',
      loading: 'bg-true-black border-1 border-solid border-neutral-4 text-neutral-12',
      success: 'bg-positive-11 text-positive-3',
      error: 'bg-negative-11 text-negative-3',
    },
  },
  defaultVariants: {
    intent: 'info',
  },
})

export const toastIcon = cva('', {
  variants: {
    intent: {
      info: 'text-true-white',
      loading: 'text-highlight-9',
      success: 'text-positive-7',
      negative: 'text-negative-7',
    },
  },
})

export type SystemUiButtonProps = VariantProps<typeof toast>
