import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  note: string
  icon: LucideIcon
  tone: 'green' | 'blue' | 'orange' | 'purple'
}

export default function StatCard({ label, value, note, icon: Icon, tone }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon--${tone}`}>
        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="stat-label">{label}</p>
      <div className="stat-value-row">
        <strong className="stat-value">{value}</strong>
        <span className={`stat-note stat-note--${tone}`}>{note}</span>
      </div>
    </article>
  )
}
