export interface ResendType {
  statusCode: number
  success: boolean
  message: string
  data?: unknown
  timestamps?: string
  error?: {
    name?: string
    message?: string
    stack?: string
  }
}
