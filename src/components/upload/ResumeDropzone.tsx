import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, UploadCloud, X, CheckCircle2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { detectFileKind, extractResumeText } from '@/services/fileParser'
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from '@/utils/constants'
import type { UploadedResume } from '@/types'

interface ResumeDropzoneProps {
  resume: UploadedResume | null
  onResumeChange: (resume: UploadedResume | null) => void
}

export function ResumeDropzone({ resume, onResumeChange }: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      const kind = detectFileKind(file)
      if (!kind) {
        toast.error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.')
        return
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`)
        return
      }
      setIsParsing(true)
      try {
        const text = await extractResumeText(file, kind)
        if (!text || text.trim().length < 20) {
          toast.error('Could not extract meaningful text from this file. Try another file.')
          setIsParsing(false)
          return
        }
        onResumeChange({
          fileName: file.name,
          fileKind: kind,
          fileSizeKB: Math.round(file.size / 1024),
          rawText: text,
          uploadedAt: new Date().toISOString(),
        })
        toast.success('Resume uploaded and parsed successfully')
      } catch (err) {
        console.error(err)
        toast.error('Failed to parse this file. Please try a different one.')
      } finally {
        setIsParsing(false)
      }
    },
    [onResumeChange],
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  if (resume) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl border border-primary-100 bg-primary-50/50 p-4"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{resume.fileName}</p>
            <p className="text-xs text-gray-500">
              {resume.fileKind.toUpperCase()} · {resume.fileSizeKB} KB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <button
            onClick={() => onResumeChange(null)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary-50' : 'border-primary-200 bg-primary-50/30 hover:bg-primary-50/60'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) processFile(file)
          e.target.value = ''
        }}
      />
      {isParsing ? (
        <>
          <Loader2 className="mb-3 h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-gray-700">Parsing your resume...</p>
        </>
      ) : (
        <>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
            <UploadCloud className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-gray-800">Drag & drop your resume here</p>
          <p className="mt-1 text-xs text-gray-500">or click to browse · PDF, DOCX, TXT · up to {MAX_FILE_SIZE_MB}MB</p>
        </>
      )}
    </div>
  )
}
