export interface TeamRanking {
  rank: number
  teamId: string
  teamName: string
  trackId: string | null
  submissionId: string
  finalWeightedScore: number
  isPromoted: boolean
  isDisqualified: boolean
}

// Overall event standings: each team placed by the furthest round it still
// has a submission in, then by that round's score.
export interface EventRankingEntry extends TeamRanking {
  trackName: string | null
  roundId: string
  roundNumber: number
  roundName: string
}
