import { Circle } from 'lucide-react'
import type { MembershipStatus } from '../types/member'

interface StatusBadgeProps {
  status: MembershipStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusClass = status === 'Active' ? 'active' : status === 'Expired' ? 'expired' : 'expiring'

  return (
    <span className={`status-badge status-badge--${statusClass}`}>
      <Circle size={7} fill="currentColor" strokeWidth={0} aria-hidden="true" />
      {status}
    </span>
  )
}
