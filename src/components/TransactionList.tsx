import { motion } from 'framer-motion'
import type { Transaction, Category } from '../types/index'
import { transactionService } from '../services/transaction.service'

type Props = {
  transactions: Transaction[]
  categories: Category[]
  onDeleted: () => void
}

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short'
  })

export default function TransactionList({ transactions, categories, onDeleted }: Props) {
  const getCategory = (id: number | null) =>
    categories.find((c) => c.id === id)

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta transacción?')) return
    await transactionService.delete(id)
    onDeleted()
  }

  if (transactions.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-center py-10"
        style={{ color: '#6b6b8a' }}
      >
        No hay transacciones aún
      </motion.p>
    )
  }

  return (
    <div style={{ borderTop: '1px solid #1e1e2e' }}>
      {transactions.map((tx, index) => {
        const cat = getCategory(tx.category_id)
        return (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            className="flex items-center justify-between py-3"
            style={{ borderBottom: '1px solid #1e1e2e' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: cat?.color || '#2a2a3a' }} />
              <div>
                <p className="text-sm" style={{ color: '#c4c4d8' }}>{tx.description}</p>
                <p className="text-xs" style={{ color: '#6b6b8a' }}>
                  {cat?.name || 'Sin categoría'} · {formatDate(tx.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium"
                style={{ color: tx.type === 'income' ? '#34d399' : '#f87171' }}>
                {tx.type === 'income' ? '+' : '-'}{formatCOP(tx.amount)}
              </span>
              <button
                onClick={() => handleDelete(tx.id)}
                className="text-xs transition-colors"
                style={{ color: '#2a2a3a' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2a2a3a'}
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}