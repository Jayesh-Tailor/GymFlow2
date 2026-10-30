import { membershipPlans, mockDashboardSummary, mockMembers } from '../data/mockData'
import type { DashboardSummary, Member, MembershipStatus, NewMemberInput } from '../types/member'

const requestDelay = 300
let members = [...mockMembers]
let nextMemberNumber = 1043

function waitForMockResponse(): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, requestDelay))
}

function getMembershipStatus(expiresAt: string): MembershipStatus {
  const remainingDays = Math.ceil(
    (new Date(`${expiresAt}T23:59:59`).getTime() - Date.now()) / 86_400_000,
  )

  if (remainingDays < 0) return 'Expired'
  if (remainingDays <= 7) return 'Expiring soon'
  return 'Active'
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function getAvatarColor(index: number): Member['color'] {
  const colors: Member['color'][] = ['mint', 'peach', 'lavender', 'blue', 'yellow', 'rose']
  return colors[index % colors.length]
}

export const memberService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    await waitForMockResponse()
    return { ...mockDashboardSummary }
  },

  async getMembers(): Promise<Member[]> {
    await waitForMockResponse()
    return [...members]
  },

  async createMember(input: NewMemberInput): Promise<Member> {
    await waitForMockResponse()

    if (!membershipPlans.includes(input.plan)) {
      throw new Error('Choose a valid membership plan.')
    }

    const member: Member = {
      ...input,
      id: `GF-${nextMemberNumber++}`,
      joinedAt: new Date().toISOString().slice(0, 10),
      status: getMembershipStatus(input.expiresAt),
      initials: getInitials(input.name),
      color: getAvatarColor(members.length),
    }

    members = [member, ...members]
    return member
  },
}
