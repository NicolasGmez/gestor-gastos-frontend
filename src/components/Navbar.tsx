import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  BarChart2,
  LogOut,
  Menu,
  X,
  Wallet
} from 'lucide-react'
import { useMediaQuery } from '../hooks/useMediaQuery'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#7c3aed' },
  { to: '/transactions', label: 'Transacciones', icon: ArrowLeftRight, color: '#0ea5e9' },
  { to: '/categories', label: 'Categorías', icon: Tag, color: '#10b981' },
  { to: '/stats', label: 'Estadísticas', icon: BarChart2, color: '#f59e0b' },
  { to: '/budgets', label: 'Presupuestos', icon: Wallet, color: '#f59e0b' },
]


function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const initials = user?.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex items-center justify-between px-2 pb-5 mb-4"
        style={{ borderBottom: '1px solid #2a2a3a' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <span className="text-white font-medium text-base">Gastly</span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: '#6b6b8a' }}>
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon
          const active = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                background: active ? '#1e1e2e' : 'transparent',
                color: active ? '#a78bfa' : '#6b6b8a',
              }}
            >
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: active ? link.color : '#1e1e2e' }}>
                <Icon size={12} color={active ? '#fff' : link.color} />
              </div>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 pt-4" style={{ borderTop: '1px solid #2a2a3a' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            {initials}
          </div>
          <span className="text-xs truncate" style={{ color: '#6b6b8a' }}>
            {user?.email}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs w-full transition-colors"
          style={{ color: '#6b6b8a' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f87171'
            e.currentTarget.style.background = '#1e1e2e'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6b6b8a'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return (
      <>
        <div className="flex items-center justify-between px-4 py-3 w-full"
          style={{ background: '#16161f', borderBottom: '1px solid #2a2a3a' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="text-white font-medium text-sm">Gastly</span>
          </div>
          <button onClick={() => setDrawerOpen(true)} style={{ color: '#9999b3' }}>
            <Menu size={20} />
          </button>
        </div>

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed top-0 left-0 h-full w-64 z-50"
                style={{ background: '#16161f', borderRight: '1px solid #2a2a3a' }}
              >
                <SidebarContent onClose={() => setDrawerOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <aside style={{ background: '#16161f', borderRight: '1px solid #2a2a3a' }}
      className="w-52 min-h-screen flex flex-col flex-shrink-0">
      <SidebarContent />
    </aside>
  )
}