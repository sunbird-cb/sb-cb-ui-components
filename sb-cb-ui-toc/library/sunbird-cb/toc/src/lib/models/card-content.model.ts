/**
 * NsCardContent namespace - stub model for card content
 */
export namespace NsCardContent {
  export const ACBPConst = {
    OVERDUE: 'OVERDUE',
    SUCCESS: 'SUCCESS',
    UPCOMING: 'UPCOMING',
    IN_PROGRESS: 'IN_PROGRESS',
  }

  export interface ICardContent {
    id?: string
    title?: string
    description?: string
    thumbnail?: string
    duration?: number
    status?: string
  }
}
