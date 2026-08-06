import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/utils/constants'
import type { User } from '@/types'

// NOTE: This is a dummy client-side auth system for demo purposes only.
// Passwords are hashed with a simple non-cryptographic hash and stored in
// localStorage or sessionStorage. Do not use this approach in a real production application.

function simpleHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return `h${Math.abs(hash)}_${input.length}`
}

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS)
    return raw ? (JSON.parse(raw) as User[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

function getStoredSessionId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.SESSION) || sessionStorage.getItem(STORAGE_KEYS.SESSION) || null
}

function saveSessionId(id: string, rememberMe: boolean) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.SESSION)
  sessionStorage.removeItem(STORAGE_KEYS.SESSION)
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(STORAGE_KEYS.SESSION, id)
}

function clearStoredSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.SESSION)
  sessionStorage.removeItem(STORAGE_KEYS.SESSION)
}

const AVATAR_COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#1D4ED8', '#0EA5E9', '#6366F1']

interface AuthStoreState {
  user: Omit<User, 'passwordHash'> | null
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => { success: boolean; message?: string }
  signup: (name: string, email: string, password: string) => { success: boolean; message?: string }
  logout: () => void
  resetPasswordRequest: (email: string) => { success: boolean; message: string }
  updateProfile: (data: { name: string; email: string }) => { success: boolean; message?: string }
  initializeSession: () => void
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password, rememberMe = true) => {
        const users = getUsers()
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!found) return { success: false, message: 'No account found with this email.' }
        if (found.passwordHash !== simpleHash(password)) {
          return { success: false, message: 'Incorrect password.' }
        }
        const { passwordHash: _passwordHash, ...safeUser } = found
        saveSessionId(safeUser.id, rememberMe)
        set({ user: safeUser, isAuthenticated: true })
        return { success: true }
      },

      signup: (name, email, password) => {
        const users = getUsers()
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, message: 'An account with this email already exists.' }
        }
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          passwordHash: simpleHash(password),
          createdAt: new Date().toISOString(),
          avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        }
        saveUsers([...users, newUser])
        const { passwordHash: _passwordHash, ...safeUser } = newUser
        saveSessionId(safeUser.id, true)
        set({ user: safeUser, isAuthenticated: true })
        return { success: true }
      },

      logout: () => {
        clearStoredSession()
        set({ user: null, isAuthenticated: false })
      },

      resetPasswordRequest: (email) => {
        const users = getUsers()
        const found = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!found) {
          return { success: false, message: 'No account found with this email.' }
        }
        return { success: true, message: 'Password reset instructions have been sent to your email (demo mode — no email is actually sent).' }
      },

      updateProfile: (data) => {
        const current = get().user
        if (!current) return { success: false, message: 'Not authenticated.' }
        const users = getUsers()
        const idx = users.findIndex((u) => u.id === current.id)
        if (idx === -1) return { success: false, message: 'User not found.' }
        users[idx] = { ...users[idx], name: data.name, email: data.email }
        saveUsers(users)
        set({ user: { ...current, name: data.name, email: data.email } })
        return { success: true }
      },

      initializeSession: () => {
        if (get().user) return
        const sessionId = getStoredSessionId()
        if (!sessionId) return
        const found = getUsers().find((u) => u.id === sessionId)
        if (!found) return
        const { passwordHash: _passwordHash, ...safeUser } = found
        set({ user: safeUser, isAuthenticated: true })
      },
    }),
    {
      name: 'resumeiq_auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
