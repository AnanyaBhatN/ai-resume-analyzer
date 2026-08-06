import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash2, Eye, Download, History as HistoryIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { AnalysisReport } from '@/components/analysis/AnalysisReport'
import { useHistoryStore } from '@/store/historyStore'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { downloadAnalysisPdf } from '@/services/pdfReport'
import type { AnalysisResult } from '@/types'

export default function History() {
  const { user } = useAuth()
  const entries = useHistoryStore((s) => s.entries)
  const loadForUser = useHistoryStore((s) => s.loadForUser)
  const deleteEntry = useHistoryStore((s) => s.deleteEntry)
  const globalSearch = useUIStore((s) => s.globalSearch)

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<AnalysisResult | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (user) loadForUser(user.id)
  }, [user, loadForUser])

  useEffect(() => {
    if (globalSearch !== query) {
      setQuery(globalSearch)
    }
  }, [globalSearch, query])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) => e.jobTitle.toLowerCase().includes(q) || e.companyName.toLowerCase().includes(q) || e.resumeFileName.toLowerCase().includes(q),
    )
  }, [entries, query])

  const handleDelete = (id: string) => {
    if (!user) return
    deleteEntry(user.id, id)
    toast.success('Analysis deleted')
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
        <p className="mt-1 text-sm text-gray-500">Every resume analysis you've run, saved locally in your browser.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by job title, company, or file..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="h-6 w-6" />}
          title={entries.length === 0 ? 'No analyses yet' : 'No matches found'}
          description={entries.length === 0 ? 'Run your first resume analysis to see it appear here.' : 'Try a different search term.'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((e) => (
              <motion.div key={e.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="flex h-full flex-col">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{e.jobTitle}</p>
                      {e.companyName && <p className="truncate text-xs text-gray-500">{e.companyName}</p>}
                    </div>
                    <span className="shrink-0 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">
                      {e.overallMatchScore}%
                    </span>
                  </div>
                  <p className="mb-1 truncate text-xs text-gray-500">📄 {e.resumeFileName}</p>
                  <p className="mb-4 text-xs text-gray-400">{new Date(e.createdAt).toLocaleString()}</p>
                  <div className="mt-auto flex items-center gap-2">
                    <Button size="sm" variant="outline" fullWidth leftIcon={<Eye className="h-3.5 w-3.5" />} onClick={() => setSelected(e)}>
                      View
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => downloadAnalysisPdf(e)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setConfirmDeleteId(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* View report modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary-100 bg-white/90 px-6 py-4 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-gray-900">{selected.jobTitle}</h2>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mx-auto max-w-5xl px-6 py-8">
              <AnalysisReport result={selected} />
            </div>
          </div>
        )}
      </AnimatePresence>

      <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Delete this analysis?">
        <p className="text-sm text-gray-500">This action cannot be undone. The analysis will be permanently removed from your history.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
