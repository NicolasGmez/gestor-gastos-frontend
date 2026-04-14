type SummaryCardProps = {
  label: string
  value: number
  type: 'balance' | 'income' | 'expense'
  sub?: string
}

const config = {
  balance: { color: '#a78bfa', prefix: '' },
  income: { color: '#34d399', prefix: '+' },
  expense: { color: '#f87171', prefix: '-' },
}

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(Math.abs(value))

export default function SummaryCard({ label, value, type, sub }: SummaryCardProps) {
  const { color, prefix } = config[type]
  return (
    <div className="rounded-xl p-5 flex flex-col gap-2"
      style={{ background: '#16161f', border: '1px solid #2a2a3a' }}>
      <p className="text-xs uppercase tracking-wide" style={{ color: '#6b6b8a' }}>{label}</p>
      <p className="text-2xl font-medium" style={{ color }}>
        {prefix}{formatCOP(value)}
      </p>
      {sub && <p className="text-xs" style={{ color: '#6b6b8a' }}>{sub}</p>}
    </div>
  )
}