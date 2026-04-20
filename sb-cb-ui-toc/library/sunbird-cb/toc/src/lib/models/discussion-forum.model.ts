/**
 * NsDiscussionForum namespace - stub model for discussion forum
 */
export namespace NsDiscussionForum {
  export enum EDiscussionType {
    LEARNING = 'learning',
    GENERAL = 'general',
    SOCIAL = 'social',
    COURSE = 'course'
  }

  export interface IDiscussionForumInput {
    id?: string
    name?: string | EDiscussionType
    title?: string
    description?: string
    feedbackType?: string
    feedbackUrl?: string
    initialPostCount?: number
    isDisabled?: boolean
  }

  export interface IDiscussionConfig {
    id?: string
    type?: string
    enabled?: boolean
  }

  export interface IDiscussion {
    id?: string
    title?: string
    content?: string
    author?: string
    createdAt?: string
    replies?: IDiscussionReply[]
  }

  export interface IDiscussionReply {
    id?: string
    content?: string
    author?: string
    createdAt?: string
  }
}
