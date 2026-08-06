import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, User, Download, Trash2, Bell, Moon, Sun } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/hooks/useAuth'
import { useSettingsStore } from '@/store/settingsStore'
import { useHistoryStore } from '@/store/historyStore'
import { profileSchema, type ProfileFormData } from '@/utils/validators'

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const settings = useSettingsStore((s) => s.settings)
  const loadSettings = useSettingsStore((s) => s.loadForUser)
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const entries = useHistoryStore((s) => s.entries)
  const loadHistory = useHistoryStore((s) => s.loadForUser)
  const clearAll = useHistoryStore((s) => s.clearAll)

  const [apiKeyInput, setApiKeyInput] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadSettings(user.id)
      loadHistory(user.id)
    }
  }, [user, loadSettings, loadHistory])

  useEffect(() => {
    setApiKeyInput(settings.geminiApiKey)
  }, [settings.geminiApiKey])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name || '', email: user?.email || '' },
  })

  const onSaveProfile = (data: ProfileFormData) => {
    const result = updateProfile(data)
    if (result.success) toast.success('Profile updated')
    else toast.error(result.message || 'Failed to update profile')
  }

  const handleSaveApiKey = () => {
    if (!user) return
    updateSettings(user.id, { geminiApiKey: apiKeyInput.trim() })
    toast.success('API key saved')
  }

  const handleToggleTheme = () => {
    if (!user) return
    updateSettings(user.id, { theme: settings.theme === 'light' ? 'dark' : 'light' })
    toast('Theme preference saved (light theme is used across the app in this demo).', { icon: '🎨' })
  }

  const handleToggleNotifications = () => {
    if (!user) return
    updateSettings(user.id, { notificationsEnabled: !settings.notificationsEnabled })
  }

  const handleExportData = () => {
    const payload = {
      user: user ? { name: user.name, email: user.email } : null,
      settings: { theme: settings.theme, notificationsEnabled: settings.notificationsEnabled },
      history: entries,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resumeiq-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported')
  }

  const handleDeleteData = () => {
    if (!user) return
    clearAll(user.id)
    setConfirmDeleteOpen(false)
    toast.success('All analysis history deleted')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your profile, AI configuration, and data.</p>
      </div>

      <Card>
        <CardHeader title="Profile" subtitle="Update your account information" action={<User className="h-5 w-5 text-primary-400" />} />
        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full name" error={errors.name?.message} {...register('name')} />
            <Input label="Email address" type="email" error={errors.email?.message} {...register('email')} />
          </div>
          <Button type="submit" isLoading={isSubmitting}>
            Save profile
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Gemini API Key" subtitle="Used to power AI resume analysis" action={<KeyRound className="h-5 w-5 text-primary-400" />} />
        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Paste your Gemini API key"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Stored only in your browser's local storage. Get a free key at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary-700 hover:underline">
              aistudio.google.com
            </a>
            . Alternatively, set <code className="rounded bg-gray-100 px-1 py-0.5">VITE_GEMINI_API_KEY</code> in your{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5">.env</code> file.
          </p>
          <Button onClick={handleSaveApiKey}>Save API key</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Preferences" subtitle="Customize your experience" />
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              {settings.theme === 'light' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-primary-600" />}
              <div>
                <p className="text-sm font-medium text-gray-800">Theme</p>
                <p className="text-xs text-gray-500">Currently {settings.theme === 'light' ? 'Light' : 'Dark'} mode</p>
              </div>
            </div>
            <button
              onClick={handleToggleTheme}
              className={`h-6 w-11 rounded-full transition-colors ${settings.theme === 'light' ? 'bg-gray-200' : 'bg-primary'}`}
            >
              <span
                className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                  settings.theme === 'light' ? 'translate-x-0.5' : 'translate-x-5'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Notifications</p>
                <p className="text-xs text-gray-500">Get notified when an analysis completes</p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`h-6 w-11 rounded-full transition-colors ${settings.notificationsEnabled ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <span
                className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Data Management" subtitle="Export or permanently delete your data" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={handleExportData}>
            Export my data
          </Button>
          <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDeleteOpen(true)}>
            Delete all history
          </Button>
        </div>
      </Card>

      <Modal isOpen={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} title="Delete all history?">
        <p className="text-sm text-gray-500">
          This will permanently delete all {entries.length} saved analyses. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteData}>
            Delete everything
          </Button>
        </div>
      </Modal>
    </div>
  )
}
