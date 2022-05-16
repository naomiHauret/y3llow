import type { Donation } from '~/types/donation'

export interface PanelDonateProps {
  initialDonationsList: Array<Donation>
  name?: string
  isAuthenticated: boolean
  to: string
}
