import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  const error_param = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  console.log('Auth confirm - token_hash:', token_hash)
  console.log('Auth confirm - type:', type)
  console.log('Auth confirm - next:', next)
  console.log('Auth confirm - error_param:', error_param)
  console.log('Auth confirm - error_description:', error_description)

  // Handle error cases from Supabase
  if (error_param) {
    console.error('Auth confirmation error:', error_param, error_description)
    const errorMessage = error_description ? 
      decodeURIComponent(error_description) : 
      'Authentication failed'
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
  }

  // Verify the OTP token
  if (token_hash && type) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    console.log('Verify OTP data:', data)
    console.log('Verify OTP error:', error)
    
    if (!error && data?.user) {
      console.log('Magic link verification successful for user:', data.user.email)
      // Redirect user to tasks page after successful magic link confirmation
      redirect(next)
    }
    
    // Handle error case or unexpected state
    const errorMessage = error ? error.message : 'Authentication failed'
    console.error('OTP verification failed:', errorMessage)
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
  }

  // If we get here, something went wrong
  console.error('Auth confirmation failed - missing token_hash or type')
  redirect('/login?error=Invalid authentication link')
}