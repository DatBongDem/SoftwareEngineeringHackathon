import { useQuery } from '@tanstack/react-query'
import * as authApi from '../api/authApi'

export function usePendingUsers() {
  return useQuery({
    queryKey: ['users', 'pending'],
    queryFn: authApi.getPendingUsers,
  })
}
