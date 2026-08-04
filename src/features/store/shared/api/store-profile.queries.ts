import { useQuery } from '@tanstack/react-query'
import { getStoreProfile } from '@/services/store/store.api'

export const storeProfileKeys = {
  all: ['store-profile'] as const,
}

export function useStoreProfileQuery() {
  return useQuery({
    queryKey: storeProfileKeys.all,
    queryFn: getStoreProfile,
    staleTime: 5 * 60 * 1000,
  })
}
