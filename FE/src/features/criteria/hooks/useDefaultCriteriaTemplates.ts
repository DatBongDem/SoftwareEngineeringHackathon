import { useQuery } from '@tanstack/react-query'
import * as criteriaApi from '../api/criteriaApi'

export function useDefaultCriteriaTemplates() {
  return useQuery({
    queryKey: ['criteria', 'templates'],
    queryFn: criteriaApi.getDefaultTemplates,
  })
}
