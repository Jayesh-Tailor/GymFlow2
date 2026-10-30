import { describe, expect, it } from 'vitest'
import { mockMembers } from '../data/mockData'
import { memberService } from './memberService'

describe('memberService mock adapter', () => {
  it('returns a copy of the mock member directory', async () => {
    const result = await memberService.getMembers()

    expect(result).toHaveLength(mockMembers.length)
    expect(result).not.toBe(mockMembers)
    expect(result[0]?.id).toBe('GF-1042')
  })

  it('creates a member with a generated ID and membership status', async () => {
    const result = await memberService.createMember({
      name: 'Devika Rao',
      email: 'devika.rao@email.com',
      phone: '+91 98765 00000',
      plan: 'Elite Annual',
      expiresAt: '2027-10-27',
    })

    expect(result.id).toBe('GF-1043')
    expect(result.initials).toBe('DR')
    expect(result.status).toBe('Active')
  })

  it('rejects membership plans outside the available plans', async () => {
    await expect(
      memberService.createMember({
        name: 'Devika Rao',
        email: 'devika.rao@email.com',
        phone: '+91 98765 00000',
        plan: 'Unknown plan',
        expiresAt: '2027-10-27',
      }),
    ).rejects.toThrow('Choose a valid membership plan.')
  })
})
