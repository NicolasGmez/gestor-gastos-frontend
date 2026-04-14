import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import TransactionList from '../components/TransactionList'
import TransactionForm from '../components/TransactionForm'
import { transactionService } from '../services/transaction.service'
import { categoryService } from '../services/category.service'
import type { Transaction, Category, Summary } from '../types/index'

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [txs, cats, sum] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll(),
        transactionService.getSummary()
      ])
      setTransactions(txs)
      setCategories(cats)
      setSummary(sum)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

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
          <h2 className="text-lg font-medium" style={{ color: '#e2e2f0' }}>Dashboard</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: '#7c3aed', color: '#fff', border: 'none' }}
          >
            + Agregar transacción
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <TransactionForm
              categories={categories}
              onCreated={() => { setShowForm(false); loadData() }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard
              label="Balance"
              value={summary.balance}
              type="balance"
              sub="Actualizado ahora"
            />
            <SummaryCard
              label="Ingresos del mes"
              value={summary.total_income}
              type="income"
              sub={`${transactions.filter(t => t.type === 'income').length} transacciones`}
            />
            <SummaryCard
              label="Gastos del mes"
              value={summary.total_expenses}
              type="expense"
              sub={`${transactions.filter(t => t.type === 'expense').length} transacciones`}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl p-6" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#9999b3' }}>
              Últimas transacciones
            </h3>
            <TransactionList
              transactions={transactions.slice(0, 8)}
              categories={categories}
              onDeleted={loadData}
            />
          </div>

          <div className="rounded-xl p-6" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
            <h3 className="text-sm font-medium mb-5" style={{ color: '#9999b3' }}>
              Gastos por categoría
            </h3>
            {!summary || summary.by_category.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#6b6b8a' }}>
                No hay gastos registrados aún
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {summary.by_category.map((item, i) => {
                  const color = categories.find(c => c.name === item.name)?.color || '#7c3aed'
                  const max = Math.max(...summary.by_category.map(c => c.total))
                  const pct = Math.round((item.total / max) * 100)
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#9999b3' }}>{item.name}</span>
                        <span style={{ color }}>{formatCOP(item.total)}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: '#1e1e2e' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}