import { membershipPlans } from '../data/mockData'

import type {
  DashboardSummary,
  Member,
  NewMemberInput,
} from '../types/member'

// Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api'

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const body: unknown = await response.json()

      if (
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        typeof body.message === 'string'
      ) {
        message = body.message
      }
    } catch {
      // Keep the default error message if the response isn't JSON.
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export const memberService = {

  // Dashboard summary is temporarily mock data.
  // We'll connect it when we build the dashboard API.
  async getDashboardSummary(): Promise<DashboardSummary> {
    return apiRequest<DashboardSummary>('/dashboard/summary')
  },

  // Fetch actual members from Spring Boot
  async getMembers(): Promise<Member[]> {
    return apiRequest<Member[]>('/members')
  },

  // Save a new member in PostgreSQL through Spring Boot
  async createMember(input: NewMemberInput): Promise<Member> {

    if (!membershipPlans.includes(input.plan)) {
      throw new Error('Choose a valid membership plan.')
    }

    return apiRequest<Member>('/members', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
}
