// Event-related interface for today's events
export interface ITodayEvents {
  identifier?: string
  name?: string
  title?: string
  description?: string
  status?: string
  startDate?: string | number
  endDate?: string | number
  eventType?: string
  location?: string
  speakers?: string[]
  tags?: string[]
  appIcon?: string
  posterImage?: string
  thumbnail?: string
  [key: string]: any
}
