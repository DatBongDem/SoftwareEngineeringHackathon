export interface Criteria {
  id: string
  eventId: string | null
  name: string
  description: string
  weight: number
  maxScore: number
  isDefaultTemplate: boolean
}

export interface CreateCriteriaPayload {
  name: string
  description: string
  weight: number
  maxScore: number
  isDefaultTemplate: boolean
}
