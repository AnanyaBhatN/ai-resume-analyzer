import { NavLink } from 'react-router-dom'
import { LayoutDashboard, UploadCloud, History, Settings, Sparkles, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useUIStore } from '@/store/uiStore'
import { APP_NAME } from '@/utils/constants'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyze', label: 'New Analysis', icon: UploadCloud },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-gray-900/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 transform border-r border-primary-100 bg-white transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-primary-100 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-white shadow-premium' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-4">
            <p className="text-xs font-semibold text-primary-700">Pro tip</p>
            <p className="mt-1 text-xs text-primary-600/80">
              Tailor each resume to the job description for the highest ATS match scores.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
