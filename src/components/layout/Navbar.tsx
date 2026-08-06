import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import toast from 'react-hot-toast'

export function Navbar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const notifications = useUIStore((s) => s.notifications)
  const markAllRead = useUIStore((s) => s.markAllRead)
  const globalSearch = useUIStore((s) => s.globalSearch)
  const setGlobalSearch = useUIStore((s) => s.setGlobalSearch)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(profileRef, () => setProfileOpen(false))
  useOnClickOutside(notifRef, () => setNotifOpen(false))

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-primary-100 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex flex-1 items-center gap-3">
        <button onClick={toggleSidebar} className="rounded-lg p-2 text-gray-500 hover:bg-primary-50 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden max-w-sm flex-1 sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search history, reports..."
            className="w-full rounded-xl border border-gray-200 bg-primary-50/40 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen((v) => !v)
              if (!notifOpen && user) markAllRead(user.id)
            }}
            className="relative rounded-xl p-2.5 text-gray-500 hover:bg-primary-50"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-primary-100 bg-white p-2 shadow-premium">
              <div className="px-3 py-2 text-sm font-semibold text-gray-900">Notifications</div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-gray-400">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="rounded-xl px-3 py-2.5 hover:bg-primary-50">
                      <p className="text-sm font-medium text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500">{n.message}</p>
                      <p className="mt-1 text-[11px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-primary-50">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: user?.avatarColor || '#2563EB' }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-primary-100 bg-white p-2 shadow-premium">
              <div className="border-b border-gray-100 px-3 py-2.5">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/settings')
                  setProfileOpen(false)
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                <UserIcon className="h-4 w-4" /> Profile
              </button>
              <button
                onClick={() => {
                  navigate('/settings')
                  setProfileOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                <Settings className="h-4 w-4" /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
