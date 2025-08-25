'use client'

import { Suspense } from 'react'
import RegisterForm from './register-form'

export const dynamic = "force-dynamic"

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}


