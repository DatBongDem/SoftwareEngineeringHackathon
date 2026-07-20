import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as authApi from '../api/authApi'

export function useApproveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.approveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'pending'] })
    },
  })
}
