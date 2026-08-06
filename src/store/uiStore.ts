import { create } from 'zustand'
import { STORAGE_KEYS } from '@/utils/constants'
import type { AppNotification } from '@/types'

interface UIStoreState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
  notifications: AppNotification[]
  loadNotifications: (userId: string) => void
  pushNotification: (userId: string, title: string, message: string) => void
  markAllRead: (userId: string) => void
  globalSearch: string
  setGlobalSearch: (v: string) => void
}

function readNotifications(userId: string): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS + userId)
    return raw ? (JSON.parse(raw) as AppNotification[]) : []
  } catch {
    return []
  }
}

function writeNotifications(userId: string, items: AppNotification[]) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS + userId, JSON.stringify(items))
}

export const useUIStore = create<UIStoreState>((set, get) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  notifications: [],
  loadNotifications: (userId) => set({ notifications: readNotifications(userId) }),
  pushNotification: (userId, title, message) => {
    const item: AppNotification = {
      id: crypto.randomUUID(),
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    }
    const updated = [item, ...get().notifications].slice(0, 30)
    writeNotifications(userId, updated)
    set({ notifications: updated })
  },
  markAllRead: (userId) => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }))
    writeNotifications(userId, updated)
    set({ notifications: updated })
  },

  globalSearch: '',
  setGlobalSearch: (v) => set({ globalSearch: v }),
}))
