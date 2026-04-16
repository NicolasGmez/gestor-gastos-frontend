import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'

type SummaryCardProps = {
  label: string
  value: number
  type: 'balance' | 'income' | 'expense'
  sub?: string
  delay?: number
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

export default function SummaryCard({ label, value, type, sub, delay = 0 }: SummaryCardProps) {
  const { color, prefix } = config[type]
  const animatedValue = useCountUp(Math.abs(value), 900)
  const glowColors = {
    balance: 'rgba(167, 139, 250, 0.15)',
    income: 'rgba(52, 211, 153, 0.15)',
    expense: 'rgba(248, 113, 113, 0.15)',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 24px ${glowColors[type]}`,
      }}
      className="rounded-xl p-5 flex flex-col gap-2 cursor-default"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      <p className="text-xs uppercase tracking-wide" style={{ color: '#6b6b8a' }}>{label}</p>
      <p className="text-2xl font-medium" style={{ color }}>
        {prefix}{formatCOP(animatedValue)}
      </p>
      {sub && <p className="text-xs" style={{ color: '#6b6b8a' }}>{sub}</p>}
    </motion.div>
  )
}