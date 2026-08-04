import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage, isApiError } from '@/services/http/error'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      skipGlobalErrorToast?: boolean
    }
  }
}

const NON_RETRIABLE_STATUS_CODES = [400, 401, 403, 404, 409]

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (NON_RETRIABLE_STATUS_CODES.some((code) => isApiError(error, code))) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Never successfully loaded: let the page render an inline ErrorState
      // with a retry button instead of a toast alone on a blank page.
      if (query.state.dataUpdatedAt === 0) return
      toast.error(getApiErrorMessage(error))
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipGlobalErrorToast) return
      toast.error(getApiErrorMessage(error))
    },
  }),
})
