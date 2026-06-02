import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Category, TransactionCreate } from '../types/index'
import { transactionService } from '../services/transaction.service'

type Props = {
  categories: Category[]
  onCreated: () => void
  onCancel: () => void
}

type TransactionRow = {
  amount: string
  description: string
  categoryId: string
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

const emptyRow = (): TransactionRow => ({
  amount: '',
  description: '',
  categoryId: '',
})

export default function TransactionForm({ categories, onCreated, onCancel }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [rows, setRows] = useState<TransactionRow[]>([emptyRow()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredCategories = categories.filter((cat) => cat.type === type)

  const addRow = () => {
    setRows([...rows, emptyRow()])
  }

  const removeRow = (index: number) => {
    if (rows.length === 1) return
    setRows(rows.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: keyof TransactionRow, value: string) => {
    setRows(rows.map((row, i) => (
      i === index ? { ...row, [field]: value } : row
    )))
  }

  const handleTypeChange = (nextType: 'income' | 'expense') => {
    setType(nextType)
    setRows(rows.map((row) => ({ ...row, categoryId: '' })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const transactions: TransactionCreate[] = rows.map((row) => ({
        amount: parseFloat(row.amount),
        description: row.description.trim(),
        type,
        category_id: row.categoryId ? parseInt(row.categoryId) : null,
      }))

      await transactionService.createBulk({ transactions })
      onCreated()
    } catch {
      setError('Error al crear las transacciones')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-xl p-6"
      style={{ background: '#16161f', border: '1px solid #2a2a3a' }}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="text-sm font-medium" style={{ color: '#9999b3' }}>
          Nuevas transacciones
        </h3>
        <span className="text-xs" style={{ color: '#6b6b8a' }}>
          {rows.length} {rows.length === 1 ? 'transaccion' : 'transacciones'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="max-w-xs">
          <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Tipo</label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as 'income' | 'expense')}
            style={inputStyle}
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[1fr_140px_180px_auto] gap-3 items-end rounded-lg p-3"
              style={{ background: '#0f0f13', border: '1px solid #2a2a3a' }}
            >
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Descripcion</label>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => updateRow(index, 'description', e.target.value)}
                  style={inputStyle}
                  placeholder="Ej: Domicilio almuerzo"
                  required
                />
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Monto (COP)</label>
                <input
                  type="number"
                  value={row.amount}
                  onChange={(e) => updateRow(index, 'amount', e.target.value)}
                  style={inputStyle}
                  placeholder="32000"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Categoria</label>
                <select
                  value={row.categoryId}
                  onChange={(e) => updateRow(index, 'categoryId', e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Sin categoria</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={rows.length === 1}
                className="px-3 py-2 text-xs rounded-lg transition-colors"
                style={{
                  color: rows.length === 1 ? '#3a3a4a' : '#f87171',
                  border: '1px solid #2a2a3a',
                  background: 'transparent',
                  cursor: rows.length === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="self-start px-3 py-2 text-sm rounded-lg transition-colors"
          style={{ color: '#a78bfa', border: '1px solid #2a2a3a', background: '#1e1e2e' }}
        >
          + Agregar otra transaccion
        </button>

        {error && <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>}

        <div className="flex gap-3 justify-end">
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
            {loading
              ? 'Guardando...'
              : `Guardar ${rows.length} ${rows.length === 1 ? 'transaccion' : 'transacciones'}`}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
