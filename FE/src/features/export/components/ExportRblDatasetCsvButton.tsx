import { Download } from 'lucide-react'
import { useExportRblDatasetCsv } from '../hooks/useExportRblDatasetCsv'
import { Button } from '@/shared/components'

export function ExportRblDatasetCsvButton({ eventId }: { eventId: string }) {
  const exportRbl = useExportRblDatasetCsv(eventId)

  return (
    <Button loading={exportRbl.isPending} onClick={() => exportRbl.mutate()}>
      <Download className="h-4 w-4" />
      Export anonymized dataset (CSV)
    </Button>
  )
}
