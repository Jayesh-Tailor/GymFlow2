import { ArrowUpRight, MoreHorizontal } from 'lucide-react'
import type { Member } from '../types/member'
import MemberAvatar from './MemberAvatar'
import StatusBadge from './StatusBadge'
import { EmptyState } from './UiState'

interface MembersTableProps {
  members: Member[]
  emptyTitle?: string
  emptyMessage?: string
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

export default function MembersTable({
  members,
  emptyTitle = 'No members yet',
  emptyMessage = 'Add your first member to start building your gym community.',
}: MembersTableProps) {
  if (members.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <div className="table-scroll">
      <table className="members-table">
        <thead>
          <tr>
            <th scope="col">Member</th>
            <th scope="col">Plan</th>
            <th scope="col">Joined</th>
            <th scope="col">Membership status</th>
            <th scope="col" className="table-actions-heading">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="member-cell">
                  <MemberAvatar initials={member.initials} color={member.color} />
                  <div className="member-info">
                    <strong>{member.name}</strong>
                    <span>{member.email}</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="plan-cell">
                  <strong>{member.plan}</strong>
                  <span>{member.id}</span>
                </div>
              </td>
              <td className="date-cell">{formatDate(member.joinedAt)}</td>
              <td>
                <div className="status-cell">
                  <StatusBadge status={member.status} />
                  <span>Until {formatDate(member.expiresAt)}</span>
                </div>
              </td>
              <td className="table-actions">
                <button className="icon-button" type="button" aria-label={`View ${member.name}`}>
                  <MoreHorizontal size={19} aria-hidden="true" />
                </button>
                <ArrowUpRight size={14} className="row-arrow" aria-hidden="true" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
