import { useState } from 'react'
import type { Category, TransactionCreate } from '../types/index'
import { transactionService } from '../services/transaction.service'

type Props = {
  categories: Category[]
  onCreated: () => void
  onCancel: () => void
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Nueva transacción</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Domicilio almuerzo"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Monto (COP)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="32000"
            required
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Sin categoría</option>
            {categories
              .filter((cat) => cat.type === type)
              .map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="col-span-2 text-red-500 text-xs">{error}</p>}

        <div className="col-span-2 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}