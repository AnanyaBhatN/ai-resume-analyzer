import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { signupSchema, type SignupFormData } from '@/utils/validators'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (data: SignupFormData) => {
    const result = signup(data.name, data.email, data.password)
    if (result.success) {
      toast.success('Account created! Welcome to ResumeIQ.')
      navigate('/dashboard')
    } else {
      toast.error(result.message || 'Sign up failed')
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start getting AI-powered feedback on your resume in minutes.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full name" placeholder="Jane Doe" icon={<User className="h-4 w-4" />} error={errors.name?.message} {...register('name')} />
        <Input label="Email address" type="email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="At least 6 characters" icon={<Lock className="h-4 w-4" />} error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" placeholder="Re-enter your password" icon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message} {...register('confirmPassword')} />

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-300" {...register('agreeToTerms')} />
          I agree to the Terms of Service and Privacy Policy
        </label>
        {errors.agreeToTerms && <p className="text-xs text-red-600">{errors.agreeToTerms.message}</p>}

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-700 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
