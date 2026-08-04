import axios from 'axios'
import type { ApiErrorShape } from '@/types/common.types'

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorShape>(error)) {
    const message = error.response?.data?.message
    if (message) return Array.isArray(message) ? message.join(', ') : message
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

export function isApiError(error: unknown, statusCode?: number): boolean {
  if (!axios.isAxiosError(error)) return false
  return statusCode === undefined || error.response?.status === statusCode
}
