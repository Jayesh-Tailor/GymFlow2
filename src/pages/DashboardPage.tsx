import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  UsersRound,
  UserRoundPlus,
} from 'lucide-react'
import type { DashboardSummary, Member } from '../types/member'
import MemberAvatar from '../components/MemberAvatar'
import MembersTable from '../components/MembersTable'
import StatCard from '../components/StatCard'
import { ErrorState, LoadingState } from '../components/UiState'

interface DashboardPageProps {
  summary: DashboardSummary | null
  members: Member[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onNavigateToMembers: () => void
  onAddMember: () => void
}

const attendanceBars = [38, 53, 46, 68, 61, 82, 72, 90, 75, 96, 83, 62]
const attendanceDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DashboardPage({
  summary,
  members,
  isLoading,
  error,
  onRetry,
  onNavigateToMembers,
  onAddMember,
}: DashboardPageProps) {
  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <span className="eyebrow">TUESDAY, OCTOBER 27, 2026</span>
          <h1>Good morning, Nora <span className="heading-sparkle">✳</span></h1>
          <p>Here’s what’s happening at your gym today.</p>
        </div>
        <button className="button button--primary" type="button" onClick={onAddMember}>
          <UserRoundPlus size={17} aria-hidden="true" />
          Add new member
        </button>
      </section>

      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !summary ? (
        <LoadingState label="Loading your dashboard" />
      ) : (
        <>
          <section className="stats-grid" aria-label="Gym overview">
            <StatCard label="Total members" value={summary.totalMembers.toLocaleString('en-IN')} note="+8.2% this month" icon={UsersRound} tone="green" />
            <StatCard label="Active memberships" value={summary.activeMembers.toLocaleString('en-IN')} note="87% of members" icon={CircleDollarSign} tone="blue" />
            <StatCard label="Expiring this week" value={String(summary.expiringMembers)} note="Needs attention" icon={Clock3} tone="orange" />
            <StatCard label="Expired memberships" value={String(summary.expiredMembers)} note="Renewals needed" icon={UsersRound} tone="purple" />
          </section>

          <section className="dashboard-grid">
            <article className="panel attendance-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">MEMBER ACTIVITY</span>
                  <h2>Attendance overview</h2>
                </div>
                <button className="select-button" type="button">
                  This week <CalendarDays size={15} aria-hidden="true" />
                </button>
              </div>
              <div className="chart-summary">
                <strong>1,284 <span>visits</span></strong>
                <span className="chart-change"><ArrowUpRight size={14} aria-hidden="true" /> 18.6%</span>
                <small>vs. last week</small>
              </div>
              <div className="attendance-chart" role="img" aria-label="Weekly member attendance trending upward, highest on Saturday">
                {attendanceBars.map((height, index) => (
                  <div className="chart-bar-wrap" key={`${height}-${index}`}>
                    <span className="chart-bar" style={{ height: `${height}%` }} />
                  </div>
                ))}
              </div>
              <div className="chart-labels" aria-hidden="true">
                {attendanceDays.map((day) => <span key={day}>{day}</span>)}
              </div>
            </article>

            <article className="panel membership-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">MEMBERSHIPS</span>
                  <h2>Status at a glance</h2>
                </div>
                <span className="panel-heading-icon"><CircleDollarSign size={17} aria-hidden="true" /></span>
              </div>
              <div className="membership-total">
                <strong>{summary.totalMembers.toLocaleString('en-IN')}</strong>
                <span>total members</span>
              </div>
              <div className="membership-bar" aria-hidden="true">
                <span className="membership-bar__active" />
                <span className="membership-bar__expiring" />
                <span className="membership-bar__expired" />
              </div>
              <div className="membership-legend">
                <div><i className="legend-dot legend-dot--active" /><span>Active</span><strong>{summary.activeMembers.toLocaleString('en-IN')}</strong></div>
                <div><i className="legend-dot legend-dot--expiring" /><span>Expiring soon</span><strong>{summary.expiringMembers}</strong></div>
                <div><i className="legend-dot legend-dot--expired" /><span>Expired</span><strong>{summary.expiredMembers}</strong></div>
              </div>
              <button className="text-link" type="button" onClick={onNavigateToMembers}>
                View member directory <ArrowRight size={15} aria-hidden="true" />
              </button>
            </article>
          </section>

          <section className="panel recent-panel">
            <div className="panel-heading panel-heading--row">
              <div>
                <span className="eyebrow">YOUR COMMUNITY</span>
                <h2>Recently added members</h2>
              </div>
              <button className="text-link" type="button" onClick={onNavigateToMembers}>
                View all <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
            <MembersTable
              members={members.slice(0, 5)}
              emptyTitle="No recent members"
              emptyMessage="New members will appear here once they join."
            />
          </section>

          <section className="bottom-summary" aria-label="Quick insights">
            <div>
              <span className="bottom-summary-icon bottom-summary-icon--green"><ArrowUpRight size={17} aria-hidden="true" /></span>
              <span><strong>Member growth is up</strong><small>12 new faces joined this month</small></span>
            </div>
            <div>
              <span className="bottom-summary-icon bottom-summary-icon--orange"><ArrowDownRight size={17} aria-hidden="true" /></span>
              <span><strong>{summary.expiringMembers} memberships need a nudge</strong><small>A friendly reminder can bring them back</small></span>
              <button className="quiet-link" type="button" onClick={onNavigateToMembers}>See members</button>
            </div>
            <div className="community-chip">
              <MemberAvatar initials="+" color="mint" />
              <span>Make today count.</span>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
