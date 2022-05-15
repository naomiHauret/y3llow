import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const button = cva(
  [
    'inline-flex items-center justify-center',
    'focus:ring-4 focus:ring-opacity-50 focus:outline-none',
    'font-sans tracking-wide',
    'rounded-full',
    'transition-colors transition-500',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-highlight-10 hover:bg-highlight-9 focus:ring-highlight-10',
          'text-highlight-3',
          'border-transparent',
        ],
        positive: [
          'bg-positive-9 hover:bg-positive-10 focus:ring-positive-10',
          'text-positive-3',
          'border-transparent',
        ],
        negative: [
          'bg-negative-10 hover:bg-negative-9 focus:ring-negative-10',
          'text-negative-3',
          'border-transparent',
        ],
        'primary-outline': [
          'text-true-white hover:text-true-black',
          'border-solid border-highlight-10',
          'hover:bg-highlight-10 focus:ring-highlight-10',
        ],
        'negative-outline': [
          'text-true-white hover:text-true-black',
          'border-solid border-negative-10',
          'hover:bg-negative-10 focus:ring-negative-10',
        ],
        brand: [
          'text-true-black',
          'bg-gradient-brand focus:ring-tinted-neutral-10',
          'after:transition-all after:bg-opacity-0 focus:after:bg-opacity-50 hover:after:bg-opacity-25',
        ],
        'brand-outline': [
          'text-true-white',
          'border-solid border-gradient-brand focus:ring-tinted-neutral-10',
          'after:transition-all focus:after:bg-opacity-75 hover:after:bg-opacity-90',
        ],
        'wallet-MetaMask': [
          'text-true-white hover:text-true-black',
          'hover:bg-[#F6851B]',
          'border-solid border-[#F6851B] focus:ring-[#F6851B]',
        ],
      },
      size: {
        sm: ['text-xs sm:text-xs', 'px-3 py-2 sm:py-2.5', 'font-bold sm:font-semibold', 'border-2'],
        default: ['text-xs', 'py-1 sm:py-2 px-3 sm:px-5', 'font-bold sm:font-semibold', 'border-2'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'default',
    },
  },
)

export type SystemUiButtonProps = VariantProps<typeof button>

export default button
