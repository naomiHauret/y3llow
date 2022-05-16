export interface Donation {
  id: number
  created_at: string
  from: string
  to: string
  hash: string
  explorer_link: string
  amount: string
  token_name: string
  message?: string
  name?: string
}
