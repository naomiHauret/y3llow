import lightcookie from 'lightcookie'
import { COOKIES } from '../../config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function get({ params, request }) {
  const cookie = request.headers.get('cookie')
  const address = lightcookie.parse(cookie)[COOKIES.address]
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  try {
    let donationReceived = await supabase.from('transactions').select('*').eq('to', address)

    let donationSent = await supabase.from('transactions').select('*').eq('from', address)

    return new Response(
      JSON.stringify({
        received: donationReceived.data,
        sent: donationSent.data,
      }),
      {
        headers,
        status: 200,
      },
    )
  } catch (e) {
    console.error(e)
  }
}
