import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { categoryService } from '../services/category.service'
import type { Category, CategoryCreate } from '../types/index'

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

  useEffect(() => { loadCategories() }, [])

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
          <h2 className="text-lg font-medium" style={{ color: '#e2e2f0' }}>Categorías</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: '#7c3aed', color: '#fff', border: 'none' }}
          >
            + Nueva categoría
          </button>
        </div>

        {showForm && (
          <div className="rounded-xl p-6 mb-8" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
            <h3 className="text-sm font-medium mb-5" style={{ color: '#9999b3' }}>Nueva categoría</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  placeholder="Ej: Gimnasio"
                  required
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'expense' | 'income')}
                  style={inputStyle}
                >
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#6b6b8a' }}>Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-9 rounded cursor-pointer"
                    style={{ border: '1px solid #2a2a3a', background: 'transparent' }}
                  />
                  <span className="text-xs" style={{ color: '#6b6b8a' }}>{color}</span>
                </div>
              </div>

              {error && (
                <p className="col-span-1 md:col-span-3 text-xs" style={{ color: '#f87171' }}>{error}</p>
              )}

              <div className="col-span-1 md:col-span-3 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm rounded-lg"
                  style={{ color: '#6b6b8a', border: '1px solid #2a2a3a', background: 'transparent' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg font-medium"
                  style={{ background: '#7c3aed', color: '#fff', border: 'none', opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#6b6b8a' }}>Gastos</h3>
            <div className="flex flex-col gap-3">
              {expenseCategories.length === 0 ? (
                <p className="text-sm" style={{ color: '#6b6b8a' }}>No hay categorías de gasto</p>
              ) : (
                expenseCategories.map((cat) => (
                  <div key={cat.id}
                    className="rounded-xl p-4 flex items-center justify-between"
                    style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: cat.color }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#e2e2f0' }}>{cat.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#1e1e2e', color: '#f87171' }}>
                          Gasto
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs transition-colors"
                      style={{ color: '#2a2a3a' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#2a2a3a'}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#6b6b8a' }}>Ingresos</h3>
            <div className="flex flex-col gap-3">
              {incomeCategories.length === 0 ? (
                <p className="text-sm" style={{ color: '#6b6b8a' }}>No hay categorías de ingreso</p>
              ) : (
                incomeCategories.map((cat) => (
                  <div key={cat.id}
                    className="rounded-xl p-4 flex items-center justify-between"
                    style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: cat.color }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#e2e2f0' }}>{cat.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#1e1e2e', color: '#34d399' }}>
                          Ingreso
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs transition-colors"
                      style={{ color: '#2a2a3a' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#2a2a3a'}
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