import type { ReactNode } from 'react'
import { Sparkles, ShieldCheck, Zap, BarChart3 } from 'lucide-react'
import { APP_NAME } from '@/utils/constants'

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary to-primary-800 lg:flex">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative z-10 max-w-md px-10 text-white">
          <h2 className="text-3xl font-bold leading-tight">Land more interviews with an AI resume co-pilot.</h2>
          <p className="mt-4 text-primary-100">
            ResumeIQ analyzes your resume against any job description in seconds — ATS scoring, keyword gaps, and
            actionable improvements included.
          </p>
          <div className="mt-10 space-y-4">
            <Feature icon={<BarChart3 className="h-5 w-5" />} text="Instant match & ATS scoring" />
            <Feature icon={<Zap className="h-5 w-5" />} text="Actionable, AI-generated feedback" />
            <Feature icon={<ShieldCheck className="h-5 w-5" />} text="Your data stays in your browser" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">{icon}</div>
      <span className="text-sm font-medium text-primary-50">{text}</span>
    </div>
  )
}
