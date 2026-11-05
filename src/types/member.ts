export type MembershipStatus = 'Active' | 'Expiring soon' | 'Expired'

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  plan: string
  joinedAt: string
  expiresAt: string
  status: MembershipStatus
  initials: string
  color: string
}

export interface NewMemberInput {
  name: string
  email: string
  phone: string
  plan: string
  expiresAt: string
}

export interface DashboardSummary {
  totalMembers: number
  activeMembers: number
  expiringMembers: number
  expiredMembers: number
}

export type MemberStatusFilter = 'All members' | MembershipStatus
