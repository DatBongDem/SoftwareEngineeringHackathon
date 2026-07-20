export interface HackathonEvent {
  id: string
  title: string
  description: string
  academicYear: string
  term: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

export interface CreateEventPayload {
  title: string
  description: string
  academicYear: string
  term: string
  startDate: string
  endDate: string
}

export interface Round {
  id: string
  eventId: string
  roundNumber: number
  name: string
  submissionDeadline: string
  promotionRuleTopN: number
  criteriaIds: string[]
  judgeUserIds: string[]
}

export interface CreateRoundPayload {
  roundNumber: number
  name: string
  submissionDeadline: string
  promotionRuleTopN: number
  criteriaIds: string[]
}

export interface AssignJudgesPayload {
  judgeUserIds: string[]
}
