import { create } from 'zustand'
import type { AnalysisResult, UploadedResume } from '@/types'

interface AnalysisStoreState {
  resume: UploadedResume | null
  jobTitle: string
  companyName: string
  jobDescription: string
  isAnalyzing: boolean
  currentResult: AnalysisResult | null
  error: string | null
  setResume: (resume: UploadedResume | null) => void
  setJobFields: (fields: { jobTitle?: string; companyName?: string; jobDescription?: string }) => void
  setAnalyzing: (v: boolean) => void
  setResult: (result: AnalysisResult | null) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAnalysisStore = create<AnalysisStoreState>((set) => ({
  resume: null,
  jobTitle: '',
  companyName: '',
  jobDescription: '',
  isAnalyzing: false,
  currentResult: null,
  error: null,

  setResume: (resume) => set({ resume }),
  setJobFields: (fields) => set((s) => ({ ...s, ...fields })),
  setAnalyzing: (v) => set({ isAnalyzing: v }),
  setResult: (result) => set({ currentResult: result }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      resume: null,
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      isAnalyzing: false,
      currentResult: null,
      error: null,
    }),
}))
