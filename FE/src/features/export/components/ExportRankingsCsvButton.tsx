import { Download } from 'lucide-react'
import { useExportRankingsCsv } from '../hooks/useExportRankingsCsv'
import { Button } from '@/shared/components'

export function ExportRankingsCsvButton({ roundId }: { roundId: string }) {
  const exportRankings = useExportRankingsCsv(roundId)

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={exportRankings.isPending}
      onClick={() => exportRankings.mutate()}
    >
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </Button>
  )
}
