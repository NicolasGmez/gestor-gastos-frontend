import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { budgetService } from '../services/budget.service'
import { categoryService } from '../services/category.service'
import type { Budget, BudgetCreate, Category } from '../types/index'

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

function getBarColor(percentage: number) {
  if (percentage >= 100) return '#f87171'
  if (percentage >= 70) return '#fbbf24'
  return '#34d399'
}

function getAlert(percentage: number) {
  if (percentage >= 100) return { text: 'Límite superado', color: '#f87171' }
  if (percentage >= 70) return { text: 'Cerca del límite', color: '#fbbf24' }
  return null
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [formCategoryId, setFormCategoryId] = useState('')
  const [formAmount, setFormAmount] = useState('')

  const loadData = async () => {
    try {
      const [buds, cats] = await Promise.all([
        budgetService.getAll(selectedMonth, selectedYear),
        categoryService.getAll()
      ])
      setBudgets(buds)
      setCategories(cats.filter(c => c.type === 'expense'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [selectedMonth, selectedYear])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const data: BudgetCreate = {
        amount: parseFloat(formAmount),
        category_id: parseInt(formCategoryId),
        month: selectedMonth,
        year: selectedYear
      }
      await budgetService.create(data)
      setFormAmount('')
      setFormCategoryId('')
      setShowForm(false)
      loadData()
    } catch {
      setError('Ya existe un presupuesto para esta categoría en este mes')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este presupuesto?')) return
    await budgetService.delete(id)
    loadData()
  }

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0)
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0)
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

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
          <h2 className="text-lg font-medium" style={{ color: '#e2e2f0' }}>Presupuestos</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: '#7c3aed', color: '#fff', border: 'none' }}
          >
            + Nuevo presupuesto
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{ ...inputStyle, width: 'auto' }}
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ ...inputStyle, width: 'auto' }}
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {budgets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-5 mb-6"
            style={{ background: '#16161f', border: '1px solid #2a2a3a' }}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm" style={{ color: '#9999b3' }}>Resumen del mes</p>
              <p className="text-xs" style={{ color: getBarColor(totalPercentage) }}>
                {totalPercentage}% del total presupuestado
              </p>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: '#6b6b8a' }}>Gastado: <span style={{ color: '#e2e2f0' }}>{formatCOP(totalSpent)}</span></span>
              <span style={{ color: '#6b6b8a' }}>Presupuesto: <span style={{ color: '#e2e2f0' }}>{formatCOP(totalBudget)}</span></span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totalPercentage, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ background: getBarColor(totalPercentage) }}
              />
            </div>
          </motion.div>
        )}

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
              <h3 className="text-sm font-medium mb-5" style={{ color: '#9999b3' }}>
                Nuevo presupuesto — {months[selectedMonth - 1]} {selectedYear}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Categoría de gasto</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    style={inputStyle}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Límite mensual (COP)</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    style={inputStyle}
                    placeholder="500000"
                    required
                    min="0"
                  />
                </div>

                {error && (
                  <p className="col-span-2 text-xs" style={{ color: '#f87171' }}>{error}</p>
                )}

                <div className="col-span-1 md:col-span-2 flex gap-3 justify-end">
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

        {budgets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl p-12 text-center"
            style={{ background: '#16161f', border: '1px solid #2a2a3a' }}
          >
            <p className="text-sm mb-2" style={{ color: '#6b6b8a' }}>
              No hay presupuestos para {months[selectedMonth - 1]} {selectedYear}
            </p>
            <p className="text-xs" style={{ color: '#3a3a4a' }}>
              Crea uno para empezar a controlar tus gastos por categoría
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {budgets.map((budget, i) => {
              const barColor = getBarColor(budget.percentage)
              const alert = getAlert(budget.percentage)
              const pct = Math.min(budget.percentage, 100)

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="rounded-xl p-5"
                  style={{ background: '#16161f', border: `1px solid ${budget.percentage >= 100 ? '#f8717133' : '#2a2a3a'}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full"
                        style={{ background: budget.category_color }} />
                      <span className="text-sm font-medium" style={{ color: '#e2e2f0' }}>
                        {budget.category_name}
                      </span>
                      {alert && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${alert.color}22`, color: alert.color }}>
                          {alert.text}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-xs transition-colors"
                      style={{ color: '#3a3a4a' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#3a3a4a'}
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="flex justify-between text-xs mb-2">
                    <span style={{ color: '#6b6b8a' }}>
                      Gastado: <span style={{ color: barColor }}>{formatCOP(budget.spent)}</span>
                    </span>
                    <span style={{ color: '#6b6b8a' }}>
                      Límite: <span style={{ color: '#e2e2f0' }}>{formatCOP(budget.amount)}</span>
                    </span>
                  </div>

                  <div className="h-2 rounded-full overflow-hidden mb-1"
                    style={{ background: '#1e1e2e' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      style={{ background: barColor }}
                    />
                  </div>

                  <div className="flex justify-end">
                    <span className="text-xs" style={{ color: barColor }}>
                      {budget.percentage.toFixed(1)}%
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