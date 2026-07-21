import { apiClient } from '@/shared/lib/apiClient'
import type { CalibrationResult, Score, SubmitScorePayload } from '../types'

export async function submitScores(payload: SubmitScorePayload): Promise<void> {
  await apiClient.post('/scoring/submit-scores', payload)
}

export async function getSubmissionScores(submissionId: string): Promise<Score[]> {
  const { data } = await apiClient.get<Score[]>(`/scoring/submission/${submissionId}`)
  return data
}

export async function getCalibrationVariance(roundId: string): Promise<CalibrationResult> {
  const { data } = await apiClient.get<CalibrationResult>('/scoring/calibration/variance', {
    params: { roundId },
  })
  return data
}
