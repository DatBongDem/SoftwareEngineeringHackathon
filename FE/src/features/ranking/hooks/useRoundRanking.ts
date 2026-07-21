import { useQuery } from '@tanstack/react-query'
import * as rankingApi from '../api/rankingApi'

export function useRoundRanking(roundId: string | undefined) {
  return useQuery({
    queryKey: ['rankings', 'round', roundId],
    queryFn: () => rankingApi.getRoundRanking(roundId!),
    enabled: Boolean(roundId),
  })
}
