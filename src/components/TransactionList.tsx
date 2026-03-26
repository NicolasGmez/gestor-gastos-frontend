import type { Transaction, Category } from '../types/index'
import { transactionService } from '../services/transaction.service'

type Props = {
  transactions: Transaction[]
  categories: Category[]
  onDeleted: () => void
}

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

export default function TransactionList({ transactions, categories, onDeleted }: Props) {
  const getCategoryName = (id: number | null) =>
    categories.find((c) => c.id === id)?.name || 'Sin categoría'

  const getCategoryColor = (id: number | null) =>
    categories.find((c) => c.id === id)?.color || '#e5e7eb'

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta transacción?')) return
    await transactionService.delete(id)
    onDeleted()
  }

  if (transactions.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No hay transacciones aún</p>
  }

  return (
    <div className="divide-y divide-gray-100">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: getCategoryColor(tx.category_id) }}
            />
            <div>
              <p className="text-sm text-gray-800">{tx.description}</p>
              <p className="text-xs text-gray-400">{getCategoryName(tx.category_id)} · {formatDate(tx.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
              {tx.type === 'income' ? '+' : '-'}{formatCOP(tx.amount)}
            </span>
            <button
              onClick={() => handleDelete(tx.id)}
              className="text-xs text-gray-300 hover:text-red-400 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}