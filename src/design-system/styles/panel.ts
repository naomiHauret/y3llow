import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const panel = cva(['border-solid border-1'], {
  variants: {
    intent: {
      default: ['border-neutral-6', 'bg-true-black'],
    },
    size: {
      none: 'rounded-none',
      default: 'rounded-lg',
    },
  },
  defaultVariants: {
    intent: 'default',
    size: 'default',
  },
})

export type SystemUiPanelProps = VariantProps<typeof panel>

export default panel
