import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as submissionsApi from '../api/submissionsApi'

export function useSetCalibrationStatus(submissionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (isCalibration: boolean) =>
      submissionsApi.setCalibrationStatus(submissionId, isCalibration),
    onSuccess: () => {
      // Invalidate target submission query so UI gets updated properties
      queryClient.invalidateQueries({ queryKey: ['submissions', submissionId] })
    },
  })
}
