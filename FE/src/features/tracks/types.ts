export interface Track {
  id: string
  eventId: string
  name: string
  description: string
  maxTeams: number
  mentorUserIds: string[]
}

export interface CreateTrackPayload {
  name: string
  description: string
  maxTeams: number
}

export interface AssignMentorPayload {
  mentorUserId: string
}
