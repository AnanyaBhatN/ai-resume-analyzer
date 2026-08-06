import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validators'

export default function ForgotPassword() {
  const { resetPasswordRequest } = useAuth()
  const [sent, setSent] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = resetPasswordRequest(data.email)
    if (result.success) {
      setSent(result.message)
    } else {
      setError('email', { message: result.message })
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you reset instructions.">
      {sent ? (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
          <p className="mt-3 text-sm font-medium text-green-800">{sent}</p>
          <Link to="/login" className="mt-4 inline-block text-sm font-medium text-primary-700 hover:underline">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email address" type="email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register('email')} />
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Send reset instructions
          </Button>
          <Link to="/login" className="block text-center text-sm font-medium text-primary-700 hover:underline">
            Back to login
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
