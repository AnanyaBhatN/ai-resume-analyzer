import { motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  SpellCheck2,
  LayoutTemplate,
  Sparkles,
  Target,
} from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { CircularScore } from '@/components/ui/CircularScore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Chip } from '@/components/ui/Chip'
import type { AnalysisResult, SectionAnalysis } from '@/types'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

function SectionAnalysisCard({
  title,
  icon,
  data,
}: {
  title: string
  icon: React.ReactNode
  data: SectionAnalysis
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">{icon}</div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
      <ProgressBar value={data.score} showValue className="mb-3" />
      <p className="mb-2 text-sm text-gray-600">{data.summary}</p>
      <ul className="space-y-1.5">
        {data.points.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-400" />
            {p}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function AnalysisReport({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-6">
      {result.source === 'local' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Local fallback analysis used because no Gemini API key is available. The results are heuristic and not full AI-generated scoring.
        </div>
      )}
      {/* Score overview */}
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <Card className="bg-gradient-to-br from-primary-50 to-white">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-around">
            <CircularScore score={result.overallMatchScore} label="Overall Match Score" />
            <CircularScore score={result.atsScore} label="ATS Score" />
            <div className="max-w-xs text-center sm:text-left">
              <h3 className="mb-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-900 sm:justify-start">
                <Sparkles className="h-4 w-4 text-primary" /> Resume Summary
              </h3>
              <p className="text-sm text-gray-600">{result.resumeSummary}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Strengths / Weaknesses */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card>
            <CardHeader title="Strengths" subtitle="What's working well" />
            <ul className="space-y-2.5">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card>
            <CardHeader title="Weaknesses" subtitle="Areas to improve" />
            <ul className="space-y-2.5">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {w}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Missing skills + Recommended skills */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card>
            <CardHeader title="Missing Skills" subtitle="Skills the job wants but your resume doesn't show" />
            <div className="space-y-3">
              {result.missingSkills.map((s, i) => (
                <div key={i} className="rounded-xl bg-red-50/60 p-3">
                  <p className="text-sm font-medium text-red-700">{s.skill}</p>
                  <p className="mt-0.5 text-xs text-red-600/80">{s.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card>
            <CardHeader title="Recommended Skills" subtitle="Consider learning or highlighting these" />
            <div className="flex flex-wrap gap-2">
              {result.recommendedSkills.map((s, i) => (
                <Chip key={i} tone="primary" icon={<Target className="h-3 w-3" />}>
                  {s}
                </Chip>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Keyword analysis */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
        <Card>
          <CardHeader title="Keyword Analysis" subtitle="Key terms from the job description" />
          <div className="flex flex-wrap gap-2">
            {result.keywordAnalysis.map((k, i) => (
              <Chip
                key={i}
                tone={k.found ? 'success' : 'danger'}
                icon={k.found ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              >
                {k.keyword}
                <span className="opacity-60">· {k.importance}</span>
              </Chip>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Grammar + Formatting */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card>
            <CardHeader
              title="Grammar Suggestions"
              action={<SpellCheck2 className="h-4 w-4 text-primary-400" />}
            />
            <ul className="space-y-2 text-sm text-gray-600">
              {result.grammarSuggestions.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-400" />
                  {g}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
          <Card>
            <CardHeader
              title="Formatting Suggestions"
              action={<LayoutTemplate className="h-4 w-4 text-primary-400" />}
            />
            <ul className="space-y-2 text-sm text-gray-600">
              {result.formattingSuggestions.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-400" />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Section analyses */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SectionAnalysisCard title="Experience Analysis" icon={<Briefcase className="h-4 w-4" />} data={result.experienceAnalysis} />
        <SectionAnalysisCard title="Education Analysis" icon={<GraduationCap className="h-4 w-4" />} data={result.educationAnalysis} />
        <SectionAnalysisCard title="Project Analysis" icon={<FolderGit2 className="h-4 w-4" />} data={result.projectAnalysis} />
        <SectionAnalysisCard title="Certification Analysis" icon={<Award className="h-4 w-4" />} data={result.certificationAnalysis} />
      </div>

      {/* Final recommendation */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="border-primary-200 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <h3 className="text-base font-semibold">Final Recommendation</h3>
          </div>
          <p className="text-sm text-primary-50">{result.finalRecommendation}</p>
        </Card>
      </motion.div>
    </div>
  )
}
