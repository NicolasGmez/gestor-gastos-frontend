import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { transactionService } from '../services/transaction.service'
import { categoryService } from '../services/category.service'
import type { Summary, Category } from '../types/index'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)

export default function Stats() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sum, cats] = await Promise.all([
          transactionService.getSummary(),
          categoryService.getAll()
        ])
        setSummary(sum)
        setCategories(cats)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const getCategoryColor = (name: string) =>
    categories.find((c) => c.name === name)?.color || '#7c3aed'

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

  if (!summary) return null

  const barData = [
    { name: 'Ingresos', value: summary.total_income, fill: '#34d399' },
    { name: 'Gastos', value: summary.total_expenses, fill: '#f87171' },
    { name: 'Balance', value: summary.balance, fill: '#a78bfa' },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#0f0f13' }}>
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <h2 className="text-lg font-medium mb-8" style={{ color: '#e2e2f0' }}>Estadísticas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl p-5" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#6b6b8a' }}>Total ingresos</p>
            <p className="text-2xl font-medium" style={{ color: '#34d399' }}>{formatCOP(summary.total_income)}</p>
          </div>
          <div className="rounded-xl p-5" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#6b6b8a' }}>Total gastos</p>
            <p className="text-2xl font-medium" style={{ color: '#f87171' }}>-{formatCOP(summary.total_expenses)}</p>
          </div>
          <div className="rounded-xl p-5" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#6b6b8a' }}>Balance</p>
            <p className="text-2xl font-medium"
              style={{ color: summary.balance >= 0 ? '#a78bfa' : '#f87171' }}>
              {formatCOP(summary.balance)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl p-6" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
            <h3 className="text-sm font-medium mb-6" style={{ color: '#9999b3' }}>Resumen general</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => formatCOP(Number(value))}
                  contentStyle={{ background: '#1e1e2e', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#e2e2f0' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl p-6" style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
            <h3 className="text-sm font-medium mb-6" style={{ color: '#9999b3' }}>Gastos por categoría</h3>
            {summary.by_category.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm" style={{ color: '#6b6b8a' }}>No hay gastos registrados aún</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={summary.by_category}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      strokeWidth={0}
                    >
                      {summary.by_category.map((entry, index) => (
                        <Cell key={index} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCOP(Number(value))}
                      contentStyle={{ background: '#1e1e2e', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#e2e2f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 mt-4">
                  {summary.by_category.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full"
                          style={{ background: getCategoryColor(entry.name) }} />
                        <span style={{ color: '#9999b3' }}>{entry.name}</span>
                      </div>
                      <span className="font-medium" style={{ color: '#e2e2f0' }}>{formatCOP(entry.total)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}