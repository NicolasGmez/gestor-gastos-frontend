import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import { transactionService } from '../services/transaction.service'
import { categoryService } from '../services/category.service'
import type { Transaction, Category } from '../types/index'

type FilterType = 'all' | 'today' | 'week' | 'month' | 'custom'

const inputStyle = {
  background: '#0f0f13',
  border: '1px solid #2a2a3a',
  borderRadius: '8px',
  padding: '6px 10px',
  fontSize: '13px',
  color: '#e2e2f0',
  outline: 'none',
}

function getDateRange(filter: FilterType, customStart?: string, customEnd?: string) {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (filter) {
    case 'today':
      return { start: startOfDay, end: now }
    case 'week': {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(now.setDate(diff))
      monday.setHours(0, 0, 0, 0)
      return { start: monday, end: new Date() }
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start, end: new Date() }
    }
    case 'custom':
      return {
        start: customStart ? new Date(customStart) : null,
        end: customEnd ? new Date(customEnd + 'T23:59:59') : null,
      }
    default:
      return { start: null, end: null }
  }
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [dateFilter, setDateFilter] = useState<FilterType>('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const loadData = async () => {
    try {
      const [txs, cats] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ])
      setTransactions(txs)
      setCategories(cats)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const { start, end } = getDateRange(dateFilter, customStart, customEnd)

  const filtered = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false
    if (start && new Date(tx.date) < start) return false
    if (end && new Date(tx.date) > end) return false
    return true
  })

  const totalFiltered = filtered.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount
  }, 0)

  const formatCOP = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Math.abs(value))

  const dateFilters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'today', label: 'Hoy' },
    { key: 'week', label: 'Esta semana' },
    { key: 'month', label: 'Este mes' },
    { key: 'custom', label: 'Rango' },
  ]

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
          <h2 className="text-lg font-medium" style={{ color: '#e2e2f0' }}>Transacciones</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: '#7c3aed', color: '#fff', border: 'none' }}
          >
            + Nueva transacción
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mb-6"
            >
              <TransactionForm
                categories={categories}
                onCreated={() => { setShowForm(false); loadData() }}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-xl p-6" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs mr-1" style={{ color: '#6b6b8a' }}>Tipo:</span>
              {(['all', 'expense', 'income'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{
                    background: typeFilter === f ? '#7c3aed' : '#1e1e2e',
                    color: typeFilter === f ? '#fff' : '#6b6b8a',
                    border: 'none'
                  }}
                >
                  {f === 'all' ? 'Todas' : f === 'expense' ? 'Gastos' : 'Ingresos'}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs mr-1" style={{ color: '#6b6b8a' }}>Fecha:</span>
              {dateFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setDateFilter(f.key)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{
                    background: dateFilter === f.key ? '#7c3aed' : '#1e1e2e',
                    color: dateFilter === f.key ? '#fff' : '#6b6b8a',
                    border: 'none'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {dateFilter === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 flex-wrap"
                >
                  <span className="text-xs" style={{ color: '#6b6b8a' }}>Desde</span>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    style={inputStyle}
                  />
                  <span className="text-xs" style={{ color: '#6b6b8a' }}>Hasta</span>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    style={inputStyle}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-2"
              style={{ borderTop: '1px solid #1e1e2e' }}>
              <span className="text-xs" style={{ color: '#6b6b8a' }}>
                {filtered.length} transacciones
              </span>
              <span className="text-sm font-medium"
                style={{ color: totalFiltered >= 0 ? '#34d399' : '#f87171' }}>
                {totalFiltered >= 0 ? '+' : '-'}{formatCOP(totalFiltered)}
              </span>
            </div>
          </div>

          <TransactionList
            transactions={filtered}
            categories={categories}
            onDeleted={loadData}
          />
        </div>
      </main>
    </div>
  )
}