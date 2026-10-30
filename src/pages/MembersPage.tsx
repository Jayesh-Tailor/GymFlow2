import { useMemo, useState } from 'react'
import { Search, UserRoundPlus, UsersRound } from 'lucide-react'
import MembersTable from '../components/MembersTable'
import StatCard from '../components/StatCard'
import { EmptyState, ErrorState, LoadingState } from '../components/UiState'
import type { Member, MemberStatusFilter } from '../types/member'

interface MembersPageProps {
  members: Member[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onAddMember: () => void
}

const statusFilters: MemberStatusFilter[] = ['All members', 'Active', 'Expiring soon', 'Expired']

export default function MembersPage({
  members,
  isLoading,
  error,
  onRetry,
  onAddMember,
}: MembersPageProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>('All members')

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return members.filter((member) => {
      const matchesStatus = statusFilter === 'All members' || member.status === statusFilter
      const matchesSearch = !query || [member.name, member.email, member.id, member.plan]
        .some((value) => value.toLowerCase().includes(query))
      return matchesStatus && matchesSearch
    })
  }, [members, search, statusFilter])

  const activeCount = members.filter((member) => member.status === 'Active').length
  const expiringCount = members.filter((member) => member.status === 'Expiring soon').length
  const expiredCount = members.filter((member) => member.status === 'Expired').length

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <span className="eyebrow">YOUR COMMUNITY</span>
          <h1>Members <span className="member-count-pill">{members.length}</span></h1>
          <p>Get to know the people who make your gym special.</p>
        </div>
        <button className="button button--primary" type="button" onClick={onAddMember}>
          <UserRoundPlus size={17} aria-hidden="true" />
          Add new member
        </button>
      </section>

      <section className="stats-grid members-stats" aria-label="Membership status counts">
        <StatCard label="Total members" value={String(members.length)} note="In your directory" icon={UsersRound} tone="green" />
        <StatCard label="Active" value={String(activeCount)} note="Good to go" icon={UsersRound} tone="blue" />
        <StatCard label="Expiring soon" value={String(expiringCount)} note="Next 7 days" icon={UsersRound} tone="orange" />
        <StatCard label="Expired" value={String(expiredCount)} note="Ready to renew" icon={UsersRound} tone="purple" />
      </section>

      <section className="panel directory-panel">
        <div className="directory-heading">
          <div>
            <span className="eyebrow">MEMBER DIRECTORY</span>
            <h2>All members <span>{members.length}</span></h2>
          </div>
          <label className="search-field">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search members</span>
            <input
              type="search"
              placeholder="Search members..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd>⌘ K</kbd>
          </label>
        </div>

        <div className="directory-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter members by status">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                className={`filter-tab ${statusFilter === filter ? 'filter-tab--active' : ''}`}
                type="button"
                aria-pressed={statusFilter === filter}
                onClick={() => setStatusFilter(filter)}
              >
                {filter}
                {filter === 'Expiring soon' && expiringCount > 0 && <span>{expiringCount}</span>}
              </button>
            ))}
          </div>
          <span className="results-count">{filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}</span>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : isLoading ? (
          <LoadingState label="Loading members" />
        ) : members.length === 0 ? (
          <EmptyState
            title="Your member list is ready to grow"
            message="Add your first member and their details will show up here."
          />
        ) : (
          <MembersTable
            members={filteredMembers}
            emptyTitle="No members match those filters"
            emptyMessage="Try another search or choose a different membership status."
          />
        )}
      </section>
    </div>
  )
}
