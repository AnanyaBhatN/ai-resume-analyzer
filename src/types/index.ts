export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
  avatarColor: string
}

export interface AuthState {
  user: Omit<User, 'passwordHash'> | null
  isAuthenticated: boolean
}

export type FileKind = 'pdf' | 'docx' | 'txt'

export interface UploadedResume {
  fileName: string
  fileKind: FileKind
  fileSizeKB: number
  rawText: string
  uploadedAt: string
}

export interface KeywordMatch {
  keyword: string
  found: boolean
  importance: 'high' | 'medium' | 'low'
}

export interface SkillGap {
  skill: string
  reason: string
}

export interface SectionAnalysis {
  score: number
  summary: string
  points: string[]
}

export interface AnalysisResult {
  id: string
  createdAt: string
  jobTitle: string
  companyName: string
  resumeFileName: string
  source?: 'gemini' | 'local'
  overallMatchScore: number
  atsScore: number
  resumeSummary: string
  strengths: string[]
  weaknesses: string[]
  missingSkills: SkillGap[]
  recommendedSkills: string[]
  keywordAnalysis: KeywordMatch[]
  grammarSuggestions: string[]
  formattingSuggestions: string[]
  experienceAnalysis: SectionAnalysis
  educationAnalysis: SectionAnalysis
  projectAnalysis: SectionAnalysis
  certificationAnalysis: SectionAnalysis
  finalRecommendation: string
}

export interface HistoryEntry {
  analysis: AnalysisResult
}

export interface AppSettings {
  geminiApiKey: string
  theme: 'light' | 'dark'
  notificationsEnabled: boolean
}

export interface AppNotification {
  id: string
  title: string
  message: string
  createdAt: string
  read: boolean
}
