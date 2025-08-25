'use client'

import { login, sendMagicLink } from '@/actions/login'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const [activeTab, setActiveTab] = useState<'password' | 'magic'>('password')
    const [isPending, startTransition] = useTransition()

    // useEffect(() => {
    //     if (searchParams.get('magic_sent') === 'true') {
    //         toast.success('Magic link sent! Check your email and click the link to sign in.')
    //     }
    //     if (error) {
    //         // Show error toast for better visibility
    //         toast.error(decodeURIComponent(error))
    //     }
    // }, [searchParams, error])

    const handleLogin = (formData: FormData) => {
        startTransition(async () => {
            await login(formData)
        })
    }

    const handleSendMagicLink = (formData: FormData) => {
        startTransition(async () => {
            await sendMagicLink(formData)
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
            <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-medium text-stone-900">Welcome back</h1>
                    <p className="mt-1 text-sm text-stone-600">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex bg-stone-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('password')}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
                                activeTab === 'password'
                                    ? 'bg-white text-stone-900 shadow-sm'
                                    : 'text-stone-600 hover:text-stone-900'
                            }`}
                        >
                            Password
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('magic')}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
                                activeTab === 'magic'
                                    ? 'bg-white text-stone-900 shadow-sm'
                                    : 'text-stone-600 hover:text-stone-900'
                            }`}
                        >
                            Magic Link
                        </button>
                    </div>
                </div>

                {/* Password Login Form */}
                {activeTab === 'password' && (
                    <form className="space-y-4">
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
                                placeholder="Your password"
                            />
                        </div>

                        <button
                            disabled={isPending}
                            formAction={handleLogin}
                            className="w-full bg-stone-900 text-white py-2 px-4 rounded font-medium hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50"
                        >
                            {isPending ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                )}

                {/* Magic Link Form */}
                {activeTab === 'magic' && (
                    <form className="space-y-4">
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                            <p className="font-medium mb-1">📧 Magic Link Login</p>
                            <p>We&apos;ll send you a secure link to sign in without a password. Make sure to check your spam folder!</p>
                        </div>
                        
                        <div>
                            <label htmlFor="email-magic" className="block text-sm font-medium text-stone-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email-magic"
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            disabled={isPending}
                            formAction={handleSendMagicLink}
                            className="w-full bg-stone-900 text-white py-2 px-4 rounded font-medium hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50"
                        >
                            {isPending ? 'Sending link...' : 'Send magic link'}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-stone-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-medium text-stone-900 hover:text-stone-700">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}
