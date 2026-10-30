import { useCallback, useEffect, useState } from 'react'
import AddMemberForm from './components/AddMemberForm'
import AppShell, { type PageName } from './components/AppShell'
import DashboardPage from './pages/DashboardPage'
import MembersPage from './pages/MembersPage'
import { memberService } from './services/memberService'
import type { DashboardSummary, Member, NewMemberInput } from './types/member'

export default function App() {
  const [activePage, setActivePage] = useState<PageName>('dashboard')
  const [members, setMembers] = useState<Member[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [nextSummary, nextMembers] = await Promise.all([
        memberService.getDashboardSummary(),
        memberService.getMembers(),
      ])
      setSummary(nextSummary)
      setMembers(nextMembers)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Please try again in a moment.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function addMember(input: NewMemberInput) {
    const createdMember = await memberService.createMember(input)
    setMembers((current) => [createdMember, ...current])
    setSummary((current) => current && {
      ...current,
      totalMembers: current.totalMembers + 1,
      activeMembers: createdMember.status === 'Active' ? current.activeMembers + 1 : current.activeMembers,
      expiringMembers: createdMember.status === 'Expiring soon' ? current.expiringMembers + 1 : current.expiringMembers,
      expiredMembers: createdMember.status === 'Expired' ? current.expiredMembers + 1 : current.expiredMembers,
    })
    setIsAddMemberOpen(false)
    setNotice(`${createdMember.name} was added to your members.`)
    window.setTimeout(() => setNotice(''), 3500)
  }

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'dashboard' ? (
        <DashboardPage
          summary={summary}
          members={members}
          isLoading={isLoading}
          error={error}
          onRetry={() => void loadData()}
          onNavigateToMembers={() => setActivePage('members')}
          onAddMember={() => setIsAddMemberOpen(true)}
        />
      ) : (
        <MembersPage
          members={members}
          isLoading={isLoading}
          error={error}
          onRetry={() => void loadData()}
          onAddMember={() => setIsAddMemberOpen(true)}
        />
      )}

      {isAddMemberOpen && (
        <AddMemberForm onClose={() => setIsAddMemberOpen(false)} onSubmit={addMember} />
      )}
      {notice && <div className="toast-notice" role="status">{notice}</div>}
    </AppShell>
  )
}
