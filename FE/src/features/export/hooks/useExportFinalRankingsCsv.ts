import { useMutation } from '@tanstack/react-query'
import * as exportApi from '../api/exportApi'
import { downloadBlob } from '@/shared/lib/downloadBlob'

export function useExportFinalRankingsCsv(eventId: string) {
  return useMutation({
    mutationFn: () => exportApi.exportFinalRankingsCsv(eventId),
    onSuccess: (blob) => downloadBlob(blob, `final_rankings_event_${eventId}.csv`),
  })
}
