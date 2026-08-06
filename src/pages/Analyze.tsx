import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RotateCcw, Download, Printer } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ResumeDropzone } from '@/components/upload/ResumeDropzone'
import { JobDescriptionForm } from '@/components/upload/JobDescriptionForm'
import { AnalysisLoading } from '@/components/analysis/AnalysisLoading'
import { AnalysisReport } from '@/components/analysis/AnalysisReport'
import { useAnalysisStore } from '@/store/analysisStore'
import { useHistoryStore } from '@/store/historyStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { analyzeResumeWithGemini, GeminiServiceError } from '@/services/geminiService'
import { downloadAnalysisPdf } from '@/services/pdfReport'

export default function Analyze() {
  const { user } = useAuth()
  const {
    resume,
    jobTitle,
    companyName,
    jobDescription,
    isAnalyzing,
    currentResult,
    setResume,
    setJobFields,
    setAnalyzing,
    setResult,
    reset,
  } = useAnalysisStore()
  const addEntry = useHistoryStore((s) => s.addEntry)
  const settings = useSettingsStore((s) => s.settings)
  const pushNotification = useUIStore((s) => s.pushNotification)
  const [shareCopied, setShareCopied] = useState(false)

  const apiKey = settings.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || ''
  const hasApiKey = apiKey.trim().length > 0
  const hasJobTitle = jobTitle.trim().length > 0
  const hasJobDescription = jobDescription.trim().length > 0
  const canAnalyze = !!resume && !isAnalyzing

  const handleAnalyze = async () => {
    if (!resume) return
    setAnalyzing(true)
    setResult(null)
    try {
      const result = await analyzeResumeWithGemini({
        apiKey,
        resumeText: resume.rawText,
        resumeFileName: resume.fileName,
        jobTitle: jobTitle || 'Untitled role',
        companyName,
        jobDescription: jobDescription || 'No job description provided.',
      })
      setResult(result)
      if (user) {
        addEntry(user.id, result)
        if (settings.notificationsEnabled) {
          pushNotification(user.id, 'Analysis complete', `Your resume scored ${result.overallMatchScore}% against ${jobTitle}.`)
        }
      }
      toast.success('Analysis complete!')
    } catch (err) {
      const message = err instanceof GeminiServiceError ? err.message : 'Something went wrong during analysis.'
      toast.error(message)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleShare = async () => {
    if (!currentResult) return
    const summary = `ResumeIQ Analysis — ${currentResult.jobTitle}\nOverall Match: ${currentResult.overallMatchScore}%\nATS Score: ${currentResult.atsScore}%`
    try {
      await navigator.clipboard.writeText(summary)
      setShareCopied(true)
      toast.success('Summary copied to clipboard')
      setTimeout(() => setShareCopied(false), 2000)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Analysis</h1>
          <p className="mt-1 text-sm text-gray-500">Upload your resume and a job description to get instant AI feedback.</p>
        </div>
        {currentResult && (
          <Button
            variant="outline"
            leftIcon={<RotateCcw className="h-4 w-4" />}
            onClick={() => {
              reset()
            }}
          >
            Start New
          </Button>
        )}
      </div>
      {!hasApiKey && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No Gemini API key is configured. Analysis will still run using a local fallback mode, but results are approximate and not full Gemini AI output. Add a key in Settings or your <code className="rounded bg-white px-1 py-0.5">.env</code> file for full AI scoring.
        </div>
      )}

      <AnimatePresence mode="wait">
        {!currentResult && !isAnalyzing && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="1. Upload Resume" subtitle="PDF, DOCX, or TXT" />
              <ResumeDropzone resume={resume} onResumeChange={setResume} />
            </Card>

            <Card>
              <CardHeader title="2. Job Description" subtitle="Paste the role you're targeting" />
              <JobDescriptionForm
                jobTitle={jobTitle}
                companyName={companyName}
                description={jobDescription}
                onJobTitleChange={(v) => setJobFields({ jobTitle: v })}
                onCompanyNameChange={(v) => setJobFields({ companyName: v })}
                onDescriptionChange={(v) => setJobFields({ jobDescription: v })}
              />
            </Card>

            <div className="lg:col-span-2">
              <Button size="lg" fullWidth leftIcon={<Sparkles className="h-4 w-4" />} disabled={!canAnalyze} onClick={handleAnalyze}>
                Analyze Resume
              </Button>
              {!hasApiKey && (
                <p className="mt-2 text-center text-xs text-amber-600">
                  No Gemini API key detected. Analysis will use a local fallback instead of Gemini.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalysisLoading />
          </motion.div>
        )}

        {currentResult && !isAnalyzing && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
              <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={() => downloadAnalysisPdf(currentResult)}>
                Download PDF
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                {shareCopied ? 'Copied!' : 'Share'}
              </Button>
            </div>
            <AnalysisReport result={currentResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
