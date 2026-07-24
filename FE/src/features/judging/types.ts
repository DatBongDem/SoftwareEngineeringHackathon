export interface CriterionScoreItem {
  criterionId: string
  score: number
  comment?: string
}

export interface SubmitScorePayload {
  submissionId: string
  roundId: string
  criterionScores: CriterionScoreItem[]
}

export interface Score {
  id: string
  submissionId: string
  roundId: string
  judgeUserId: string
  criterionId: string
  scoreValue: number
  comment: string | null
  createdAt: string
}

export interface CriterionVariance {
  criterionId: string
  criterionName: string
  meanScore: number
  variance: number
  standardDeviation: number
  totalJudges: number
}

export interface CalibrationSubmissionVariance {
  submissionId: string
  teamName: string
  criteriaVariances: CriterionVariance[]
}

export interface CalibrationResult {
  roundId: string
  submissionsVariances: CalibrationSubmissionVariance[]
}
