import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine((v) => v === true, 'You must agree to the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
export type SignupFormData = z.infer<typeof signupSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const jobDescriptionSchema = z.object({
  jobTitle: z.string().min(2, 'Job title is required'),
  companyName: z.string().optional(),
  description: z.string().min(50, 'Job description should be at least 50 characters'),
})
export type JobDescriptionFormData = z.infer<typeof jobDescriptionSchema>

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})
export type ProfileFormData = z.infer<typeof profileSchema>
