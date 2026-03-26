import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import TransactionList from '../components/TransactionList'
import TransactionForm from '../components/TransactionForm'
import { transactionService } from '../services/transaction.service'
import { categoryService } from '../services/category.service'
import type { Transaction, Category, Summary } from '../types/index'

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

  useEffect(() => {
    loadData()
  }, [])

  const handleCreated = () => {
    setShowForm(false)
    loadData()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p className="text-gray-400">Cargando...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-medium text-gray-900">Dashboard</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Agregar transacción
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <TransactionForm
              categories={categories}
              onCreated={handleCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {summary && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <SummaryCard
              label="Balance actual"
              value={summary.balance}
              type="balance"
            />
            <SummaryCard
              label="Ingresos del mes"
              value={summary.total_income}
              type="income"
            />
            <SummaryCard
              label="Gastos del mes"
              value={summary.total_expenses}
              type="expense"
            />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Últimas transacciones</h3>
          <TransactionList
            transactions={transactions.slice(0, 10)}
            categories={categories}
            onDeleted={loadData}
          />
        </div>
      </main>
    </div>
  )
}