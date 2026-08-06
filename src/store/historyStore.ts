import { create } from 'zustand'
import { STORAGE_KEYS } from '@/utils/constants'
import type { AnalysisResult } from '@/types'

interface HistoryStoreState {
  entries: AnalysisResult[]
  loadForUser: (userId: string) => void
  addEntry: (userId: string, analysis: AnalysisResult) => void
  deleteEntry: (userId: string, id: string) => void
  clearAll: (userId: string) => void
}

function readHistory(userId: string): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY + userId)
    return raw ? (JSON.parse(raw) as AnalysisResult[]) : []
  } catch {
    return []
  }
}

function writeHistory(userId: string, entries: AnalysisResult[]) {
  localStorage.setItem(STORAGE_KEYS.HISTORY + userId, JSON.stringify(entries))
}

export const useHistoryStore = create<HistoryStoreState>((set, get) => ({
  entries: [],

  loadForUser: (userId) => {
    set({ entries: readHistory(userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) })
  },

  addEntry: (userId, analysis) => {
    const updated = [analysis, ...get().entries]
    writeHistory(userId, updated)
    set({ entries: updated })
  },

  deleteEntry: (userId, id) => {
    const updated = get().entries.filter((e) => e.id !== id)
    writeHistory(userId, updated)
    set({ entries: updated })
  },

  clearAll: (userId) => {
    writeHistory(userId, [])
    set({ entries: [] })
  },
}))
