import { isAxiosError } from 'axios'

// Controllers uniformly catch Exception and return BadRequest(new { message = ex.Message })
export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string') return message
    return error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
