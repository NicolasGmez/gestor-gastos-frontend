import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transacciones' },
  { to: '/categories', label: 'Categorías' },
  { to: '/stats', label: 'Estadísticas' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col p-4">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-medium text-gray-900">Gastly</h1>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === link.to
                ? 'bg-indigo-50 text-indigo-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 text-left rounded-lg hover:bg-red-50 transition-colors"
      >
        Cerrar sesión
      </button>
    </aside>
  )
}