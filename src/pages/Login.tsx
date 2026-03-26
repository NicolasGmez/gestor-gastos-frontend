import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth.service'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await authService.register(email, password, fullName)
      }
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Credenciales incorrectas o email ya registrado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {isRegister ? 'Empezá a gestionar tus gastos' : 'Bienvenido de vuelta'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nombre completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 font-medium hover:underline"
          >
            {isRegister ? 'Inicia sesión' : 'Registrarse'}
          </button>
        </p>
      </div>
    </div>
  )
}