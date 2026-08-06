import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { CardSkeleton } from '@/components/ui/Skeleton'

const steps = [
  'Reading resume content...',
  'Comparing against job description...',
  'Scoring ATS compatibility...',
  'Identifying keyword gaps...',
  'Generating recommendations...',
]

export function AnalysisLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white py-14 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white"
        >
          <Sparkles className="h-7 w-7" />
        </motion.div>
        <p className="text-base font-semibold text-gray-900">Analyzing your resume with AI...</p>
        <div className="mt-4 space-y-1.5">
          {steps.map((step, i) => (
            <motion.p
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.4 }}
              className="text-xs text-gray-500"
            >
              {step}
            </motion.p>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
