import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)
  const signup = useAuthStore((s) => s.signup)
  const logout = useAuthStore((s) => s.logout)
  const resetPasswordRequest = useAuthStore((s) => s.resetPasswordRequest)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const initializeSession = useAuthStore((s) => s.initializeSession)

  return { user, isAuthenticated, login, signup, logout, resetPasswordRequest, updateProfile, initializeSession }
}
