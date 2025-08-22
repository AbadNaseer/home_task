'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const error = searchParams.get('error')

  let title = 'Something went wrong'
  let description = 'An unexpected error occurred. Please try again.'
  let actionText = 'Go back to login'

  if (type === 'auth_error') {
    title = 'Authentication Error'
    description = error || 'There was a problem with your authentication. This could be due to an expired or invalid link.'
    actionText = 'Try logging in again'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-6 shadow-sm text-center">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">{title}</h1>
          <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
        </div>

        <div className="space-y-3">
          <Link 
            href="/login" 
            className="w-full bg-stone-900 text-white py-2 px-4 rounded font-medium hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 inline-block"
          >
            {actionText}
          </Link>
          
          {type === 'auth_error' && (
            <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded border">
              <p className="font-medium mb-1">Troubleshooting tips:</p>
              <ul className="text-left space-y-1">
                <li>• Make sure you&apos;re clicking the latest email link</li>
                <li>• Check if the link has expired (links expire after some time)</li>
                <li>• Try requesting a new magic link</li>
                <li>• Use password login instead</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="text-stone-600">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}