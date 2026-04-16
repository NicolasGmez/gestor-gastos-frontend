import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth.service'

const inputStyle = {
  width: '100%',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '14px',
  color: 'var(--text-primary)',
  outline: 'none',
}

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
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-md rounded-2xl p-8"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="text-white font-medium text-lg">Gastly</span>
        </div>

        <h1 className="text-2xl font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {isRegister ? 'Empieza a gestionar tus gastos' : 'Bienvenido de vuelta'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                Nombre completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
                placeholder="Tu nombre"
                required
              />
            </div>
          )}
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium mt-2 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff',
              border: 'none',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-medium hover:underline"
            style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  )
}