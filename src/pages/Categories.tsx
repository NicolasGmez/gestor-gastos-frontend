import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { categoryService } from '../services/category.service'
import type { Category, CategoryCreate } from '../types/index'

const typeLabels = {
  expense: 'Gasto',
  income: 'Ingreso',
}

const typeColors = {
  expense: 'bg-red-50 text-red-500',
  income: 'bg-green-50 text-green-600',
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const data: CategoryCreate = { name, color, type }
      await categoryService.create(data)
      setName('')
      setColor('#6366f1')
      setType('expense')
      setShowForm(false)
      loadCategories()
    } catch {
      setError('Error al crear la categoría')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta categoría?')) return
    await categoryService.delete(id)
    loadCategories()
  }

  const expenseCategories = categories.filter((c) => c.type === 'expense')
  const incomeCategories = categories.filter((c) => c.type === 'income')

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
          <h2 className="text-xl font-medium text-gray-900">Categorías</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Nueva categoría
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Nueva categoría</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Gimnasio"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'expense' | 'income')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{color}</span>
                </div>
              </div>

              {error && <p className="col-span-3 text-red-500 text-xs">{error}</p>}

              <div className="col-span-3 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Gastos</h3>
            <div className="flex flex-col gap-3">
              {expenseCategories.length === 0 ? (
                <p className="text-sm text-gray-400">No hay categorías de gasto</p>
              ) : (
                expenseCategories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[cat.type]}`}>
                          {typeLabels[cat.type]}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Ingresos</h3>
            <div className="flex flex-col gap-3">
              {incomeCategories.length === 0 ? (
                <p className="text-sm text-gray-400">No hay categorías de ingreso</p>
              ) : (
                incomeCategories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[cat.type]}`}>
                          {typeLabels[cat.type]}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}