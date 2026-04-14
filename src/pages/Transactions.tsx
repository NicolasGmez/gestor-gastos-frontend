import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import { transactionService } from '../services/transaction.service'
import { categoryService } from '../services/category.service'
import type { Transaction, Category } from '../types/index'

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

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

  useEffect(() => {
    loadData()
  }, [])

  const handleCreated = () => {
    setShowForm(false)
    loadData()
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true
    return tx.type === filter
  })

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#0f0f13' }}>
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          <p className="text-gray-400">Cargando...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#0f0f13' }}>
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-medium text-gray-900">Transacciones</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Nueva transacción
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

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            {(['all', 'expense', 'income'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'expense' ? 'Gastos' : 'Ingresos'}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400">
              {filteredTransactions.length} transacciones
            </span>
          </div>

          <TransactionList
            transactions={filteredTransactions}
            categories={categories}
            onDeleted={loadData}
          />
        </div>
      </main>
    </div>
  )
}