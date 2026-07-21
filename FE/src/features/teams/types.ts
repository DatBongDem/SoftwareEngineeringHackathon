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

export interface CreateTeamPayload {
  eventId: string
  teamName: string
  trackId?: string
}

export interface InviteMemberPayload {
  emailOrStudentId: string
}

export interface RegisterTrackPayload {
  trackId: string
}
