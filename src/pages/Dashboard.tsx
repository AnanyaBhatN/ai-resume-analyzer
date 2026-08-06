import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, TrendingUp, Target, Clock, UploadCloud, History as HistoryIcon, ArrowRight } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CircularScore } from '@/components/ui/CircularScore'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useHistoryStore } from '@/store/historyStore'

const statCardClasses = 'flex items-center gap-4'

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <Card className={statCardClasses}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: tone }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const entries = useHistoryStore((s) => s.entries)
  const loadForUser = useHistoryStore((s) => s.loadForUser)

  useEffect(() => {
    if (user) loadForUser(user.id)
  }, [user, loadForUser])

  const stats = useMemo(() => {
    const total = entries.length
    const avgMatch = total ? Math.round(entries.reduce((sum, e) => sum + e.overallMatchScore, 0) / total) : 0
    const avgAts = total ? Math.round(entries.reduce((sum, e) => sum + e.atsScore, 0) / total) : 0
    const best = total ? Math.max(...entries.map((e) => e.overallMatchScore)) : 0
    return { total, avgMatch, avgAts, best }
  }, [entries])

  const recent = entries.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Here's an overview of your resume analysis activity.</p>
        </div>
        <Link to="/analyze">
          <Button leftIcon={<UploadCloud className="h-4 w-4" />}>New Analysis</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FileText className="h-6 w-6 text-primary-700" />} label="Total Analyses" value={String(stats.total)} tone="#DBE6FE" />
        <StatCard icon={<Target className="h-6 w-6 text-green-700" />} label="Avg. Match Score" value={`${stats.avgMatch}%`} tone="#DCFCE7" />
        <StatCard icon={<TrendingUp className="h-6 w-6 text-blue-700" />} label="Avg. ATS Score" value={`${stats.avgAts}%`} tone="#DBEAFE" />
        <StatCard icon={<Clock className="h-6 w-6 text-amber-700" />} label="Best Score" value={`${stats.best}%`} tone="#FEF3C7" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Analyses"
              subtitle="Your latest resume evaluations"
              action={
                <Link to="/history" className="flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            {recent.length === 0 ? (
              <EmptyState
                icon={<HistoryIcon className="h-6 w-6" />}
                title="No analyses yet"
                description="Upload a resume and job description to get your first AI-powered analysis."
                action={
                  <Link to="/analyze">
                    <Button size="sm">Run your first analysis</Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {recent.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to="/history"
                      className="flex items-center justify-between gap-3 rounded-xl border border-primary-100/60 p-3.5 transition-colors hover:bg-primary-50/50"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {e.jobTitle} {e.companyName && `· ${e.companyName}`}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">
                        {e.overallMatchScore}%
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Score Snapshot" subtitle="Latest resume performance" />
            {recent[0] ? (
              <div className="flex items-center justify-around">
                <CircularScore score={recent[0].overallMatchScore} size={100} label="Match" />
                <CircularScore score={recent[0].atsScore} size={100} label="ATS" />
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">Run an analysis to see your scores here.</p>
            )}
          </Card>

          <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <h3 className="text-sm font-semibold">Quick Actions</h3>
            <div className="mt-3 space-y-2">
              <Link to="/analyze" className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium hover:bg-white/20">
                <UploadCloud className="h-4 w-4" /> Upload new resume
              </Link>
              <Link to="/history" className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium hover:bg-white/20">
                <HistoryIcon className="h-4 w-4" /> View analysis history
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
