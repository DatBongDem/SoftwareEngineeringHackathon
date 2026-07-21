import { useMutation } from '@tanstack/react-query'
import * as exportApi from '../api/exportApi'
import { downloadBlob } from '@/shared/lib/downloadBlob'

export function useExportRblDatasetCsv(eventId: string) {
  return useMutation({
    mutationFn: () => exportApi.exportRblDatasetCsv(eventId),
    onSuccess: (blob) => downloadBlob(blob, `anonymized_rbl_dataset_event_${eventId}.csv`),
  })
}
