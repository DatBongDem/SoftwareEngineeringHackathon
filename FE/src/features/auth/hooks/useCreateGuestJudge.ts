import { useMutation } from '@tanstack/react-query'
import * as authApi from '../api/authApi'

export function useCreateGuestJudge() {
  return useMutation({
    mutationFn: authApi.createGuestJudge,
  })
}
