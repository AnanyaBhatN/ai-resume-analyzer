import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute, PublicOnlyRoute } from '@/routes/ProtectedRoute'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { useHistoryStore } from '@/store/historyStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useUIStore } from '@/store/uiStore'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import ForgotPassword from '@/pages/ForgotPassword'
import Dashboard from '@/pages/Dashboard'
import Analyze from '@/pages/Analyze'
import History from '@/pages/History'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

export default function App() {
  const { user, initializeSession } = useAuth()
  const loadHistory = useHistoryStore((s) => s.loadForUser)
  const loadSettings = useSettingsStore((s) => s.loadForUser)
  const loadNotifications = useUIStore((s) => s.loadNotifications)

  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  useEffect(() => {
    if (!user) return
    loadHistory(user.id)
    loadSettings(user.id)
    loadNotifications(user.id)
  }, [user, loadHistory, loadSettings, loadNotifications])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', background: '#1F2937', color: '#fff', fontSize: '14px' },
          success: { iconTheme: { primary: '#2563EB', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
