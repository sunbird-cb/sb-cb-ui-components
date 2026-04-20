export namespace NsAppToc {
  export interface IWsTocResponse {
    content: any
    errorCode: EWsTocErrorCode | null
  }

  export enum EWsTocErrorCode {
    API_FAILURE = 'API_FAILURE',
    NO_DATA = 'NO_DATA',
  }

  export interface ITocStructure {
    assessment?: number
    course?: number
    handsOn?: number
    interactiveVideo?: number
    learningModule?: number
    other?: number
    pdf?: number
    podcast?: number
    quiz?: number
    video?: number
    webModule?: number
    webPage?: number
    youtube?: number
    survey?: number
    offlineSession?: number
    practiceTest?: number
    finalTest?: number
    interactivecontent?: number
  }

  export interface IPostAssessment {
    identifier: string
    name: string
    passed: boolean
  }

  export interface IContentParentReq {
    fields?: string[]
  }

  export interface IContentParentResponse {
    content: any
  }
}

export namespace NsCohorts {
  export enum ECohortTypes {
    ACTIVE_USERS = 'activeusers',
    COMMON_GOALS = 'commongoals',
    AUTHORS = 'authors',
    EDUCATORS = 'educators',
    TOP_PERFORMERS = 'top-performers',
  }

  export interface ICohortsContent {
    identifier: string
    name: string
    type: string
  }

  export interface ICohortsGroupUsers {
    userId: string
    userName: string
  }
}
