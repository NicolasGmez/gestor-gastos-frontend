import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { savingsGoalService } from '../services/savings-goal.service'
import type { SavingsGoal, SavingsGoalCreate } from '../types/index'

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)

const inputStyle = {
  width: '100%',
  background: '#0f0f13',
  border: '1px solid #2a2a3a',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '13px',
  color: '#e2e2f0',
  outline: 'none',
}

const icons = [
  { key: 'laptop', label: 'Computador', emoji: '💻' },
  { key: 'car', label: 'Vehículo', emoji: '🚗' },
  { key: 'home', label: 'Vivienda', emoji: '🏠' },
  { key: 'travel', label: 'Viaje', emoji: '✈️' },
  { key: 'education', label: 'Educación', emoji: '📚' },
  { key: 'phone', label: 'Celular', emoji: '📱' },
  { key: 'health', label: 'Salud', emoji: '🏥' },
  { key: 'target', label: 'General', emoji: '🎯' },
]

function getEmoji(key: string) {
  return icons.find(i => i.key === key)?.emoji || '🎯'
}

function getMotivation(percentage: number) {
  if (percentage >= 100) return { text: 'Meta alcanzada', color: '#34d399' }
  if (percentage >= 75) return { text: 'Casi lo logras', color: '#a78bfa' }
  if (percentage >= 50) return { text: 'Vas por buen camino', color: '#60a5fa' }
  if (percentage >= 25) return { text: 'Sigue adelante', color: '#fbbf24' }
  return { text: 'Empezando el camino', color: '#6b6b8a' }
}

export default function SavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formName, setFormName] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formIcon, setFormIcon] = useState('target')

  const loadGoals = async () => {
    try {
      const data = await savingsGoalService.getAll()
      setGoals(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGoals() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const data: SavingsGoalCreate = {
        name: formName,
        target_amount: parseFloat(formAmount),
        icon: formIcon
      }
      await savingsGoalService.create(data)
      setFormName('')
      setFormAmount('')
      setFormIcon('target')
      setShowForm(false)
      loadGoals()
    } catch {
      setError('Error al crear la meta')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta meta?')) return
    await savingsGoalService.delete(id)
    loadGoals()
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#0f0f13' }}>
        <Navbar />
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <p style={{ color: '#6b6b8a' }}>Cargando...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#0f0f13' }}>
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium" style={{ color: '#e2e2f0' }}>Metas de ahorro</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: '#7c3aed', color: '#fff', border: 'none' }}
          >
            + Nueva meta
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl p-6 mb-6"
              style={{ background: '#16161f', border: '1px solid #2a2a3a' }}
            >
              <h3 className="text-sm font-medium mb-5" style={{ color: '#9999b3' }}>Nueva meta de ahorro</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Nombre de la meta</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      style={inputStyle}
                      placeholder="Ej: Computador nuevo"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Monto objetivo (COP)</label>
                    <input
                      type="number"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      style={inputStyle}
                      placeholder="3000000"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs mb-2 block" style={{ color: '#6b6b8a' }}>Ícono</label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon.key}
                        type="button"
                        onClick={() => setFormIcon(icon.key)}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
                        style={{
                          background: formIcon === icon.key ? '#2a2a4a' : '#1e1e2e',
                          border: `1px solid ${formIcon === icon.key ? '#7c3aed' : '#2a2a3a'}`,
                          minWidth: '60px'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{icon.emoji}</span>
                        <span className="text-xs" style={{ color: '#6b6b8a' }}>{icon.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>}

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm rounded-lg"
                    style={{ color: '#6b6b8a', border: '1px solid #2a2a3a', background: 'transparent' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm rounded-lg font-medium"
                    style={{ background: '#7c3aed', color: '#fff', border: 'none', opacity: saving ? 0.6 : 1 }}
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl p-12 text-center"
            style={{ background: '#16161f', border: '1px solid #2a2a3a' }}
          >
            <p className="text-sm mb-2" style={{ color: '#6b6b8a' }}>No tienes metas de ahorro aún</p>
            <p className="text-xs" style={{ color: '#3a3a4a' }}>
              Crea una meta y empieza a seguir tu progreso
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, i) => {
              const motivation = getMotivation(goal.percentage)
              const pct = Math.min(goal.percentage, 100)
              const completed = goal.percentage >= 100

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="rounded-xl p-6"
                  style={{
                    background: '#16161f',
                    border: `1px solid ${completed ? '#34d39933' : '#2a2a3a'}`
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: '#1e1e2e' }}>
                        {getEmoji(goal.icon)}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#e2e2f0' }}>{goal.name}</p>
                        <span className="text-xs" style={{ color: motivation.color }}>
                          {motivation.text}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-xs transition-colors"
                      style={{ color: '#3a3a4a' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#3a3a4a'}
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span style={{ color: '#6b6b8a' }}>
                        Ahorrado: <span style={{ color: '#a78bfa' }}>{formatCOP(goal.current_amount)}</span>
                      </span>
                      <span style={{ color: '#6b6b8a' }}>
                        Meta: <span style={{ color: '#e2e2f0' }}>{formatCOP(goal.target_amount)}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                        style={{
                          background: completed
                            ? '#34d399'
                            : 'linear-gradient(90deg, #7c3aed, #a78bfa)'
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#6b6b8a' }}>
                      {completed
                        ? 'Meta completada'
                        : `Faltan ${formatCOP(goal.remaining)}`}
                    </span>
                    <span className="text-sm font-medium" style={{ color: motivation.color }}>
                      {goal.percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}