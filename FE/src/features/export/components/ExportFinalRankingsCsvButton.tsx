import { Download } from 'lucide-react'
import { useExportFinalRankingsCsv } from '../hooks/useExportFinalRankingsCsv'
import { Button } from '@/shared/components'

export function ExportFinalRankingsCsvButton({ eventId }: { eventId: string }) {
  const exportFinal = useExportFinalRankingsCsv(eventId)

  return (
    <Button loading={exportFinal.isPending} onClick={() => exportFinal.mutate()}>
      <Download className="h-4 w-4" />
      Export final standings (CSV)
    </Button>
  )
}
