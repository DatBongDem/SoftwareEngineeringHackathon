import { useMutation } from '@tanstack/react-query'
import * as exportApi from '../api/exportApi'
import { downloadBlob } from '@/shared/lib/downloadBlob'

export function useExportRankingsCsv(roundId: string) {
  return useMutation({
    mutationFn: () => exportApi.exportRankingsCsv(roundId),
    onSuccess: (blob) => downloadBlob(blob, `rankings_round_${roundId}.csv`),
  })
}
