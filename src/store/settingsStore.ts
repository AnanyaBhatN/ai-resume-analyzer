import { create } from 'zustand'
import { STORAGE_KEYS } from '@/utils/constants'
import type { AppSettings } from '@/types'

interface SettingsStoreState {
  settings: AppSettings
  loadForUser: (userId: string) => void
  updateSettings: (userId: string, partial: Partial<AppSettings>) => void
}

const defaultSettings: AppSettings = {
  geminiApiKey: '',
  theme: 'light',
  notificationsEnabled: true,
}

function readSettings(userId: string): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS + userId)
    return raw ? { ...defaultSettings, ...(JSON.parse(raw) as AppSettings) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

function writeSettings(userId: string, settings: AppSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS + userId, JSON.stringify(settings))
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  settings: defaultSettings,

  loadForUser: (userId) => {
    set({ settings: readSettings(userId) })
  },

  updateSettings: (userId, partial) => {
    const updated = { ...get().settings, ...partial }
    writeSettings(userId, updated)
    set({ settings: updated })
  },
}))
