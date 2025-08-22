'use client'
import { signup } from '@/actions/register'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const success = searchParams.get('success')
  const [isPending, startTransition] = useTransition()

  const handleSignup = (formData: FormData) => {
    startTransition(async () => {
      await signup(formData)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-medium text-stone-900">Create your account</h1>
          <p className="mt-1 text-sm text-stone-600">Sign up to start managing your tasks</p>
        </div>

        <form className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              Account created successfully! Please check your email for a confirmation link.
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            disabled={isPending}
            formAction={handleSignup}
            className="w-full bg-stone-900 text-white py-2 px-4 rounded font-medium hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50"
          >
            {isPending ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-stone-900 hover:text-stone-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}


