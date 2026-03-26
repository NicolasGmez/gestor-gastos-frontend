type SummaryCardProps = {
  label: string
  value: number
  type: 'balance' | 'income' | 'expense'
}

const colors = {
  balance: 'text-gray-900',
  income: 'text-green-600',
  expense: 'text-red-500',
}

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)

export default function SummaryCard({ label, value, type }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <p className={`text-2xl font-medium ${colors[type]}`}>
        {type === 'expense' ? '-' : ''}{formatCOP(value)}
      </p>
    </div>
  )
}