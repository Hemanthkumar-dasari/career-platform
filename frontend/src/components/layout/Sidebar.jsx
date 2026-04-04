import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Map,
  Lightbulb,
  FileText,
  MessageSquare,
  LogOut,
  Sparkles,
  Clock,
  UserCircle,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/learning-paths', label: 'Learning Paths', icon: Map },
  { to: '/project-ideas', label: 'Project Ideas', icon: Lightbulb },
  { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
  { to: '/interview-prep', label: 'Interview Prep', icon: MessageSquare },
  { to: '/history', label: 'My History', icon: Clock },
  { to: '/profile', label: 'Profile', icon: UserCircle },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r border-white/8 flex flex-col z-20" style={{ background: 'rgba(8,6,18,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-500" />
          <span className="font-bold text-lg text-white">CareerAI</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">AI Career Guidance</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600/80 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
