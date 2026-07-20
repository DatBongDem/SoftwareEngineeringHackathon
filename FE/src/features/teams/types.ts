import type { TeamStatus } from '@/shared/types/enums'

export interface TeamMemberInfo {
  userId: string
  fullName: string
  email: string
  isAccepted: boolean
}

export interface Team {
  id: string
  eventId: string
  trackId: string | null
  teamName: string
  leaderUserId: string
  members: TeamMemberInfo[]
  status: TeamStatus
}
