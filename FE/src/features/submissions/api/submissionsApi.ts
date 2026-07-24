import { apiClient } from '@/shared/lib/apiClient'
import type { CreateSubmissionPayload, DisqualifySubmissionPayload, Submission } from '../types'

export async function getSubmissionById(submissionId: string): Promise<Submission> {
  const { data } = await apiClient.get<Submission>(`/submissions/${submissionId}`)
  return data
}

export async function getSubmissionsByEvent(eventId: string): Promise<Submission[]> {
  const { data } = await apiClient.get<Submission[]>(`/events/${eventId}/submissions`)
  return data
}

export async function getSubmissionsByRound(roundId: string): Promise<Submission[]> {
  const { data } = await apiClient.get<Submission[]>(`/rounds/${roundId}/submissions`)
  return data
}

export async function createSubmission(payload: CreateSubmissionPayload): Promise<Submission> {
  const { data } = await apiClient.post<Submission>('/submissions', payload)
  return data
}

export async function syncGithub(submissionId: string): Promise<Submission> {
  const { data } = await apiClient.post<Submission>(`/submissions/${submissionId}/sync-github`)
  return data
}

export async function disqualifySubmission(
  submissionId: string,
  payload: DisqualifySubmissionPayload,
): Promise<void> {
  await apiClient.post(`/submissions/${submissionId}/disqualify`, payload)
}

export async function setCalibrationStatus(
  submissionId: string,
  isCalibration: boolean,
): Promise<void> {
  await apiClient.put(`/submissions/${submissionId}/calibration`, null, {
    params: { isCalibration },
  })
}
