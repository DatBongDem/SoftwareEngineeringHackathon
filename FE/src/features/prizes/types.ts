export interface Prize {
  id: string
  eventId: string
  trackId: string | null
  name: string
  teamId: string
  reward: string
}

export interface CreatePrizePayload {
  name: string
  trackId?: string
  teamId: string
  reward: string
}
