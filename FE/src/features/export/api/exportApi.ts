import { apiClient } from '@/shared/lib/apiClient'

export async function exportRankingsCsv(roundId: string): Promise<Blob> {
  const { data } = await apiClient.get('/export/rankings/csv', {
    params: { roundId },
    responseType: 'blob',
  })
  return data
}

export async function exportRblDatasetCsv(eventId: string): Promise<Blob> {
  const { data } = await apiClient.get('/export/rbl-dataset/csv', {
    params: { eventId },
    responseType: 'blob',
  })
  return data
}

export async function exportFinalRankingsCsv(eventId: string): Promise<Blob> {
  const { data } = await apiClient.get(`/export/events/${eventId}/final-rankings/csv`, {
    responseType: 'blob',
  })
  return data
}
