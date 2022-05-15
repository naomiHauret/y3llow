import lightcookie from 'lightcookie'
import { COOKIES } from '../../config'
import { supabase } from '../../config/supabase'

export async function get({ params, request }) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  const address = params?.of ? params.of : params.address

  try {
    let { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('to', address)
      .order('created_at', { ascending: false })
      .range(0, 6)
    return new Response(
      JSON.stringify({
        data,
        error,
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

export async function post({ params, request }) {
  const cookie = request.headers.get('cookie')
  const address = lightcookie.parse(cookie)[COOKIES.address]
  const verified = lightcookie.parse(cookie)[COOKIES.verified]

  const headers = new Headers()
  try {
    if (address && verified) {
      const transactionData = await request.json()

      const donation = await supabase.from('transactions').insert([transactionData])

      return new Response(
        JSON.stringify({
          data: donation.data,
        }),
        {
          headers,
          status: donation.status,
        },
      )
    }
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e.message,
      }),
      {
        headers,
        status: e.status,
      },
    )
  }
}
