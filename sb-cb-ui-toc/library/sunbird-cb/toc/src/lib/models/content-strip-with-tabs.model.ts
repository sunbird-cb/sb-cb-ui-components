/**
 * NsContentStripWithTabs namespace - stub model
 */
export namespace NsContentStripWithTabs {
  export interface IContentStripWithTabs {
    id?: string
    title?: string
    tabs?: IContentStripTab[]
    stripInfo?: IStripInfo
  }

  export interface IContentStripTab {
    id?: string
    title?: string
    content?: any[]
    tabKey?: string
    tabIndex?: number
  }

  export interface IContentStripUnit {
    key?: string
    logo?: string
    title?: string
    canHideStrip?: boolean
    mode?: string
    showStrip?: boolean
    widgets?: any[]
    stripTitle?: string
    stripTitleLink?: any
    sliderConfig?: any
    loader?: boolean
    stripBackground?: string
    titleDescription?: string
    stripConfig?: any
    viewMoreUrl?: any
    tabs?: any[]
    filters?: any[]
    stripInfo?: IStripInfo
    customeClass?: string
  }

  export interface IStripInfo {
    widget?: any
    mode?: string
    configs?: any
  }
}
