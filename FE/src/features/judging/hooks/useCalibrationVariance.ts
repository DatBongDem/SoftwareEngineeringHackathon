import { useQuery } from '@tanstack/react-query'
import * as judgingApi from '../api/judgingApi'

export function useCalibrationVariance(roundId: string | undefined) {
  return useQuery({
    queryKey: ['scoring', 'calibration', roundId],
    queryFn: () => judgingApi.getCalibrationVariance(roundId!),
    enabled: Boolean(roundId),
  })
}
