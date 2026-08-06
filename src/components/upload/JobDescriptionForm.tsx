import { ClipboardPaste, Eraser } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SAMPLE_JOB_DESCRIPTION } from '@/utils/constants'
import toast from 'react-hot-toast'

interface JobDescriptionFormProps {
  jobTitle: string
  companyName: string
  description: string
  onJobTitleChange: (v: string) => void
  onCompanyNameChange: (v: string) => void
  onDescriptionChange: (v: string) => void
}

export function JobDescriptionForm({
  jobTitle,
  companyName,
  description,
  onJobTitleChange,
  onCompanyNameChange,
  onDescriptionChange,
}: JobDescriptionFormProps) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        onDescriptionChange(text)
        toast.success('Pasted from clipboard')
      }
    } catch {
      toast.error('Could not access clipboard. Paste manually instead.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Job title" placeholder="e.g. Frontend Engineer" value={jobTitle} onChange={(e) => onJobTitleChange(e.target.value)} />
        <Input label="Company name (optional)" placeholder="e.g. Acme Inc." value={companyName} onChange={(e) => onCompanyNameChange(e.target.value)} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Job description</label>
          <div className="flex items-center gap-3 text-xs">
            <button type="button" onClick={handlePaste} className="flex items-center gap-1 font-medium text-primary-700 hover:underline">
              <ClipboardPaste className="h-3.5 w-3.5" /> Paste
            </button>
            <button
              type="button"
              onClick={() => onDescriptionChange(SAMPLE_JOB_DESCRIPTION)}
              className="font-medium text-primary-700 hover:underline"
            >
              Use sample
            </button>
            <button type="button" onClick={() => onDescriptionChange('')} className="flex items-center gap-1 font-medium text-gray-500 hover:underline">
              <Eraser className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={10}
          placeholder="Paste the full job description here..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <div className="mt-1.5 flex justify-end">
          <span className="text-xs text-gray-400">{description.length} characters</span>
        </div>
      </div>
    </div>
  )
}
