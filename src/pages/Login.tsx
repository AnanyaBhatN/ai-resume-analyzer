import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/utils/validators'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema), defaultValues: { rememberMe: true } })

  const onSubmit = async (data: LoginFormData) => {
    const result = login(data.email, data.password, data.rememberMe)
    if (result.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(result.message || 'Login failed')
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue analyzing your resumes.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email address" type="email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} error={errors.password?.message} {...register('password')} />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-300" {...register('rememberMe')} />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-primary-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-primary-700 hover:underline">
          Sign up
        </Link>
      </p>

      <div className="mt-6 rounded-xl bg-primary-50 p-3 text-xs text-primary-700">
        Demo tip: sign up first to create a local account — there's no real backend, everything is stored in your browser.
      </div>
    </AuthLayout>
  )
}
