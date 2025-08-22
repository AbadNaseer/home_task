'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  console.log('Login error:', error)
  console.log('Login data:', data)
  if (error) {
    console.error('Login error:', error.message)
    redirect(`/login?error=${error.message}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function sendMagicLink(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    redirect('/login?error=Email is required')
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const emailRedirectTo = `${siteUrl}/auth/confirm`
  console.log('emailRedirectTo', emailRedirectTo)

  const {data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // Allow creating users with magic links
      emailRedirectTo,
    },
  })

  console.log('data', data)
  console.log('Magic link sent:', email)
  console.log('Magic link error:', error)

  if (error) {
    console.error('Magic link error:', error.message)
    // Provide more specific error messages
    const errorMessage = encodeURIComponent(error.message)
    redirect(`/login?error=${errorMessage}`)
  }

  // Redirect with success parameter
  redirect('/login?magic_sent=true')
} 
