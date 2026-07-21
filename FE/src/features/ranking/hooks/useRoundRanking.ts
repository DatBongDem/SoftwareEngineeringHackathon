import { useQuery } from '@tanstack/react-query'
import * as rankingApi from '../api/rankingApi'

export function useRoundRanking(roundId: string | undefined, trackId?: string) {
  return useQuery({
    queryKey: ['rankings', 'round', roundId, trackId ?? 'all'],
    queryFn: () => rankingApi.getRoundRanking(roundId!, trackId),
    enabled: Boolean(roundId),
  })
}
