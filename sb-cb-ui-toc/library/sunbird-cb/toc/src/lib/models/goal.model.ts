/**
 * NsGoal namespace - stub model for goals
 */
export namespace NsGoal {
  export interface IGoalConfig {
    id?: string
    type?: string
  }

  export interface IGoal {
    id?: string
    name?: string
    description?: string
    contents?: any[]
    targetDate?: string
  }

  export interface IBtnGoal {
    contentId?: string
    contentName?: string
    contentType?: any
    primaryCategory?: any
  }
}
