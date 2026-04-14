import { useState } from 'react'
import type { Category, TransactionCreate } from '../types/index'
import { transactionService } from '../services/transaction.service'

type Props = {
  categories: Category[]
  onCreated: () => void
  onCancel: () => void
}

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

export default function TransactionForm({ categories, onCreated, onCancel }: Props) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [categoryId, setCategoryId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data: TransactionCreate = {
        amount: parseFloat(amount),
        description,
        type,
        category_id: categoryId ? parseInt(categoryId) : null,
      }
      await transactionService.create(data)
      onCreated()
    } catch {
      setError('Error al crear la transacción')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl p-6" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
      <h3 className="text-sm font-medium mb-5" style={{ color: '#9999b3' }}>Nueva transacción</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
            placeholder="Ej: Domicilio almuerzo"
            required
          />
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Monto (COP)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
            placeholder="32000"
            required
            min="0"
          />
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Tipo</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as 'income' | 'expense')
              setCategoryId('')
            }}
            style={inputStyle}
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Sin categoría</option>
            {categories
              .filter((cat) => cat.type === type)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
          </select>
        </div>

        {error && <p className="col-span-2 text-xs" style={{ color: '#f87171' }}>{error}</p>}

        <div className="col-span-1 md:col-span-2 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ color: '#6b6b8a', border: '1px solid #2a2a3a', background: 'transparent' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg font-medium transition-colors"
            style={{ background: '#7c3aed', color: '#fff', border: 'none', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}