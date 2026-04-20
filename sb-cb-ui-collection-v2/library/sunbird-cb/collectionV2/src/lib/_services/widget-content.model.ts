export namespace NsContent {
  export interface IContinueLearningData extends IContent {
    continueData: any
  }

  export interface IContinueLearningDataReq {
    request: {
      userId: string | undefined,
      courseId: string,
      contentIds: string[],
      batchId: string | undefined | null
      fields?: string[]
    }
  }

  export interface IContent {
    platform?: any
    addedOn: string
    appIcon: string
    artifactUrl: string
    averageRating?: any
    body?: string
    instructions?: string
    certificationList?: IRelatedContentMeta[]
    certificationStatus?: TCertificationStatus
    certificationSubmissionDate?: string
    certificationUrl: string
    children: IContent[]
    childrenClassifiers?: string[]
    clients?: IClient[]
    collections?: IContent[]
    complexityLevel: string
    contentId: string
    contentType: EContentTypes
    contentUrlAtSource: string
    courseCategory?: string
    creatorContacts: ICreator[]

    creatorDetails: ICreator[]
    creatorLogo: string
    creatorPosterImage: string
    creatorThumbnail: string

    curatedTags: string[]
    description: string
    displayContentType: EDisplayContentTypes // For UI
    downloadUrl?: string
    duration: number
    exclusiveContent?: boolean
    expiryDate?: string
    equivalentCertifications?: IRelatedContentMeta[]
    hasAccess: boolean
    hasAssessment?: string
    idealScreenSize?: string
    identifier: string
    introductoryVideo?: string
    introductoryVideoIcon?: string
    learningTrack?: string
    isExternal: boolean
    isIframeSupported: 'Yes' | 'No' | 'Maybe'
    isInIntranet?: boolean
    keywords?: string[]
    kArtifacts?: IRelatedContentMeta[]
    lastUpdatedOn: string
    learningMode?: TLearningMode
    learningObjective: string
    labels?: string[]
    locale?: string
    hasTranslations?: { identifier: string; locale: string }[]
    isTranslationOf?: { identifier: string; locale: string }[]
    me_totalSessionsCount: number
    mediaType: string
    mimeType: EMimeTypes
    minWingspanVersion?: string
    msArtifactDetails?: IMSArtifactDetails
    mode?: ETagType
    name: string
    nextCertificationAttemptDate?: string
    playgroundInstructions?: string
    playgroundResources?: IResourcePlayground[]
    postContents?: IPrePostContent[]
    posterImage?: string
    preContents?: IPrePostContent[]
    preRequisites: string
    price?: {
      currency: string
      value: number
    }
    primaryCategory: string,
    proctorUrl?: string
    progress?: IMarkAsCompleteProgress
    publishedOn: string
    recentCertificationAttemptScore?: number
    recommendationReasons?: string[]
    region?: string[]
    registrationUrl?: string
    registrationInstructions?: string
    resourceCategory?: string[]
    resourceType: string
    size?: number
    skills: ISkill[]
    softwareRequirements?: IResourceDetail[]
    sourceName: string
    sourceShortName: string
    sourceIconUrl?: string
    sourceUrl?: string
    ssoEnabled?: boolean
    status:
    | 'Draft'
    | 'Review'
    | 'InReview'
    | 'QualityReview'
    | 'Reviewed'
    | 'Processing'
    | 'Live'
    | 'Deleted'
    | 'MarkedForDeletion'
    | 'Expired'
    subTitle?: string
    subTitles?: ISubtitle[]
    studyMaterials?: IRelatedContentMeta[]
    systemRequirements?: string[]
    tags: ITag[]
    topics: IContentTopic[]
    totalLikes?: { [key: string]: number }
    totalRating?: number
    track: ITrack[]
    uniqueLearners?: number
    viewCount?: { [key: string]: number }
    reason?: string // required for Knowledge board
    trainingLHubCount?: number // for LHub trainings
    verifiers?: {
      // required for External Certifications
      name: string
      email: string
      id: string
    }[]
    references?: { url: string; title: string }[]
    resumePage?: number // For player WebModule in UI
    [key: string]: any
    streamingUrl?: string
  }

  export interface IContentResponse {
    id: string,
    params: any,
    responseCode: string,
    result: {
      content: IContent
    },
    ts: string,
    ver: string
  }

  export interface IBatch {
    batchId: string,
    createdBy: string,
    endDate: string | null,
    enrollmentType: string,
    identifier: string,
    name: string,
    startDate: string,
    status: number
    cert_templates?: null
    collectionId: string
    courseId: string
    createdDate: string
    createdFor: string[]
    description?: null
    enrollmentEndDate: string | null
    id: string
    mentors?: string[] | null
    tandc?: null
    updatedDate?: string | null
  }

  export interface IBatchListResponse {
    content?: IBatch[]
    count?: number,
    enrolled?: boolean,
    workFlow?: {
      wfInitiated?: boolean
      batch?: any
      wfItem?: any
    },
  }

  export interface ICourse {
    active: true
    addedBy: string
    batch: IBatch
    batchId: string
    certificates: []
    collectionId: string
    completedOn: string | null
    completionPercentage: number | null
    completionStatus?: number
    content: IContent
    contentId: string
    contentStatus: any
    courseId: string
    courseLogoUrl: string
    courseName: string
    dateTime: number
    description: string
    enrolledDate: string
    issuedCertificates: []
    lastContentAccessTime?: string
    lastReadContentId: string | null
    lastReadContentStatus: string | null
    leafNodesCount: number
    progress: number
    status: number
    userId: string
  }

  export interface IContentMinimal {
    appIcon: string
    artifactUrl: string
    complexityLevel: string
    contentType: EContentTypes
    description: string
    displayContentType?: EDisplayContentTypes
    duration: number
    identifier: string
    hasAccess?: boolean
    isInIntranet?: boolean
    learningMode?: TLearningMode
    mimeType: EMimeTypes
    name: string
    creatorDetails: ICreator[]
    creatorContacts: ICreator[]
    primaryCategory: EPrimaryCategory
    PosterImage: string
    posterImage: string
    resourceType?: string
    totalRating?: number
    difficultyLevel: string
  }

  export interface ICollectionHierarchyResponse {
    data: IContent
    hasMore: boolean
    totalContents: number
  }

  export interface IRelatedContentMeta {
    identifier: string
    name: string
  }

  type TCertificationStatus = 'ongoing' | 'passed' | 'canAttempt' | 'cannotAttempt'
  export type TLearningMode = 'Self-Paced' | 'Instructor-Led' | 'Open' | 'Closed'

  interface IMarkAsCompleteProgress {
    progressStatus: 'open' | 'started' | 'completed'
    showMarkAsComplete: boolean
    markAsCompleteReason: string
    progressSupported: boolean
    progress: number | null
  }

  interface ITag {
    id: string
    type: string
    value: string
  }
  interface IMSArtifactDetails {
    channelId: string
    videoId: string
  }
  interface IClient {
    displayName: string
    id: string
    name: string
  }
  interface ISubtitle {
    srclang: string
    label: string
    url: string
  }
  interface IPrePostContent {
    identifier: string
    name: string
  }
  interface IResourceDetail {
    title?: string
    url?: string
  }
  interface IResourcePlayground {
    appIcon: string
    artifactUrl: string
    identifier: string
    name: string
  }
  interface ITrack {
    id: string
    name: string
    status: string
    visibility: string
  }
  interface ISkill {
    id: string
    category: string
    skill: string
    name: string
  }
  export interface ICreator {
    id: string
    name: string
    email: string
  }
  export interface IContentTopic {
    identifier: string
    name: string
  }
  // API Based

  export interface IContact {
    id: string
    name: string
    email: string
  }

  export interface IViewerContinueLearningRequest {
    resourceId: string
    contextPathId: string
    data: string
    dateAccessed: number
    contextType?: string
  }

  export enum EContentTypes {
    // PROGRAM = 'Learning Path',// deperaceted
    PROGRAM = 'Program',
    CHANNEL = 'Channel',
    COURSE = 'Course',
    KNOWLEDGE_ARTIFACT = 'Knowledge Artifact',
    KNOWLEDGE_BOARD = 'Knowledge Board',
    LEARNING_JOURNEY = 'Learning Journeys',
    MODULE = 'CourseUnit',
    RESOURCE = 'Resource',
  }

  export enum EResourcePrimaryCategories {
    LEARNING_RESOURCE = 'Learning Resource',
    PRACTICE_RESOURCE = 'Practice Resource',
    FINAL_ASSESSMENT = 'Final Assessment',
    COMP_ASSESSMENT = 'Competency Assessment',
    OFFLINE_SESSION = 'Offline Session',
  }

  export enum EPrimaryCategory {
    PROGRAM = 'Program',
    MODULE = 'Course Unit',
    COURSE = 'Course',
    RESOURCE = 'Learning Resource',
    ASSESSMENT = 'Practice Question Set',
    FINALASSESSMENT = 'Course Assessment',
    PROGRAM_END_SURVEY = 'Survey',
    FTB_QUESTION = 'FTB Question',
    MTF_QUESTION = 'MTF Question',
    MULTIPLE_CHOICE_QUESTION = 'Multiple Choice Question',
    SINGLE_CHOICE_QUESTION = 'Single Choice Question',
    STANDALONE_ASSESSMENT = 'Standalone Assessment',
    BLENDED_PROGRAM = 'Blended Program',
    OFFLINE_SESSION = 'Offline Session',
    CURATED_PROGRAM = 'Curated Program',
    PRACTICE_RESOURCE = 'Practice Question Set',
    CQF_ASSESSMENT = 'CQF Assessment',
    GOALS = 'GOALS',
    PLAYLIST = 'PLAYLIST',
    FINAL_ASSESSMENT = 'Course Assessment',
    COMP_ASSESSMENT = 'Competency Assessment',
    MANDATORY_COURSE_GOAL = 'Mandatory Course Goal',
    // following will not be available soon
    /**
     * @deprecated The type should not be used
     */
    KNOWLEDGE_ARTIFACT = 'Knowledge Artifact',
    /**
    * @deprecated The type should not be used
    */
    KNOWLEDGE_BOARD = 'Knowledge Board',
    /**
    * @deprecated The type should not be used
    */
    LEARNING_JOURNEY = 'Learning Journeys',
    /**
    * @deprecated The type should not be used
    */
    CHANNEL = 'Channel',
  }

  export enum EMiscPlayerSupportedCollectionTypes {
    PLAYLIST = 'Playlist',
  }
  export const PLAYER_SUPPORTED_COLLECTION_TYPES: string[] = [
    EContentTypes.COURSE,
    EContentTypes.MODULE,
    EContentTypes.PROGRAM,
    EPrimaryCategory.COURSE,
    EPrimaryCategory.MODULE,
    EPrimaryCategory.PROGRAM,
    EPrimaryCategory.STANDALONE_ASSESSMENT,
    EPrimaryCategory.BLENDED_PROGRAM,
    EPrimaryCategory.CURATED_PROGRAM,
    EMiscPlayerSupportedCollectionTypes.PLAYLIST,
  ]
  export const KB_SUPPORTED_CONTENT_TYPES: EContentTypes[] = [
    EContentTypes.COURSE,
    EContentTypes.MODULE,
    EContentTypes.PROGRAM,
    EContentTypes.RESOURCE,
  ]
  export const KB_SUPPORTED_PRIMARY_CATEGORY: EPrimaryCategory[] = [
    EPrimaryCategory.COURSE,
    EPrimaryCategory.MODULE,
    EPrimaryCategory.PROGRAM,
    EPrimaryCategory.RESOURCE,
    EPrimaryCategory.BLENDED_PROGRAM,
  ]
  export const PLAYLIST_SUPPORTED_CONTENT_TYPES: EContentTypes[] = [
    EContentTypes.COURSE,
    EContentTypes.MODULE,
    EContentTypes.PROGRAM,
    EContentTypes.RESOURCE,
  ]
  export const PLAYLIST_SUPPORTED_PRIMARY_CATEGORY: EPrimaryCategory[] = [
    EPrimaryCategory.COURSE,
    EPrimaryCategory.MODULE,
    EPrimaryCategory.PROGRAM,
    EPrimaryCategory.RESOURCE,
    EPrimaryCategory.BLENDED_PROGRAM,
  ]
  export enum EMimeTypes {
    COLLECTION = 'application/vnd.ekstep.content-collection',
    ZIP = 'application/vnd.ekstep.html-archive',
    ZIP2 = 'application/vnd.ekstep.ecml-archive',
    HTML = 'application/html',
    HTML_TEXT = 'text/html',
    ILP_FP = 'application/ilpfp',
    IAP = 'application/iap-assessment',
    M4A = 'audio/m4a',
    MP3 = 'audio/mpeg',
    MP4 = 'video/mp4',
    M3U8 = 'application/x-mpegURL',
    INTERACTION = 'video/interactive',
    PDF = 'application/pdf',
    QUIZ = 'application/quiz',
    DRAG_DROP = 'application/drag-drop',
    HTML_PICKER = 'application/htmlpicker',
    WEB_MODULE = 'application/web-module',
    WEB_MODULE_EXERCISE = 'application/web-module-exercise',
    YOUTUBE = 'video/x-youtube',
    HANDS_ON = 'application/integrated-hands-on',
    RDBMS_HANDS_ON = 'application/rdbms',
    CLASS_DIAGRAM = 'application/class-diagram',
    CHANNEL = 'application/channel',
    COLLECTION_RESOURCE = 'resource/collection',
    APPLICATION_JSON = 'application/json',
    PRACTICE_RESOURCE = 'application/vnd.sunbird.questionset',
    // Added on UI Only
    CERTIFICATION = 'application/certification',
    PLAYLIST = 'application/playlist',
    QUESTION_SET = 'application/vnd.sunbird.questionset',
    QUESTION = 'application/vnd.sunbird.question',
    FINAL_ASSESSMENT = 'application/vnd.sunbird.questionset',
    OFFLINE_SESSION = 'application/offline',
    SURVEY = 'application/survey',
    TEXT_WEB = 'text/x-url',
    UNKNOWN = 'application/unknown',
  }
  export enum EDisplayContentTypes {
    ASSESSMENT = 'ASSESSMENT',
    AUDIO = 'AUDIO',
    CERTIFICATION = 'CERTIFICATION',
    CHANNEL = 'Channel',
    CLASS_DIAGRAM = 'CLASS_DIAGRAM',
    COURSE = 'COURSE',
    DEFAULT = 'DEFAULT',
    DRAG_DROP = 'DRAG_DROP',
    EXTERNAL_CERTIFICATION = 'EXTERNAL_CERTIFICATION',
    EXTERNAL_COURSE = 'EXTERNAL_COURSE',
    GOALS = 'GOALS',
    HANDS_ON = 'HANDS_ON',
    IAP = 'IAP',
    INSTRUCTOR_LED = 'INSTRUCTOR_LED',
    INTERACTIVE_VIDEO = 'INTERACTIVE_VIDEO',
    KNOWLEDGE_ARTIFACT = 'KNOWLEDGE_ARTIFACT',
    MODULE = 'MODULE',
    PDF = 'PDF',
    PLAYLIST = 'PLAYLIST',
    PROGRAM = 'PROGRAM',
    QUIZ = 'QUIZ',
    RESOURCE = 'RESOURCE',
    RDBMS_HANDS_ON = 'RDBMS_HANDS_ON',
    VIDEO = 'VIDEO',
    WEB_MODULE = 'WEB_MODULE',
    WEB_PAGE = 'WEB_PAGE',
    YOUTUBE = 'YOUTUBE',
    KNOWLEDGE_BOARD = 'Knowledge Board',
    LEARNING_JOURNEY = 'Learning Journeys',
    LINK = 'LINK',
    STANDALONE_ASSESSMENT = 'STANDALONE ASSESSMENT',
    BLENDED_PROGRAM = 'BLENDED PROGRAM',
    CURATED_PROGRAM = 'CURATED PROGRAM',
  }
  // for UI
  export enum EFilterCategory {
    ALL = 'ALL',
    LEARN = 'LEARN',
    PRACTICE = 'PRACTICE',
    ASSESS = 'ASSESS',
  }

  // for UI
  export enum ETagType {
    NEWLY_ADDED = 'NEWLY ADDED',
  }

  // Course category enum
  export enum ECourseCategory {
    MODULE = 'Course Unit',
    INVITE_ONLY_PROGRAM = 'Invite-Only Program',
    MODERATED_PROGRAM = 'Moderated Program',
    BLENDED_PROGRAM = 'Blended Program',
    CURATED_PROGRAM = 'Curated Program',
    COURSE = 'Course',
    MODERATED_COURSE = 'Moderated Course',
    STANDALONE_ASSESSMENT = 'Standalone Assessment',
    MODERATED_ASSESSEMENT = 'Moderated Assessment',
    INVITE_ONLY_ASSESSMENT = 'Invite-Only Assessment',
    CQF_ASSESSMENT = 'CQF Assessment',
    CASE_STUDY = 'Case Study',
    PRE_ENROLMENT_ASSESSMENT = 'Pre Enrolment Assessment',
    COMPREHENSIVE_ASSESSMENT_PROGRAM = 'Comprehensive Assessment Program',
    MULTILINGUAL_COURSE = 'Multilingual Course',
    RESOURCE = 'Learning Resource',
  }

  export enum ESectionType {
    SECTION = 'section',
    PARAGRAPH = 'paragraph',
  }

  export enum ECompatibility {
    COMPATIBILITY_SIX = 6,
    COMPATIBILITY_LATEST = 8,
  }

  export enum ECompatibilityProgram {
    LATEST = 5,
    PREVIOUS = 4,
  }

  export enum EContextCategory {
    FINAL_PROGRAM_ASSESSMENT = 'Final Program Assessment',
    PRE_ENROLMENT_ASSESSMENT = 'Pre Enrolment Assessment',
  }

  export enum EContextLocking {
    COURSE_ASSESSMENT_ONLY = 'Course Assessment Only',
  }

  export enum EResourceCategory {
    LEARNING_RESOURCE = 'Learning Resource', // This is default and is used to diff from course resource and standalone resource
    EVENT = 'Events',
    PODCAST = 'Podcasts',
    WEBINAR = 'Webinar',
    OTHERS = 'OTHERS',
    REFERENCE_RESOURCE = 'Reference Resource',
    TEACHERS_RESOURCE = 'Teachers Resource',
  }

  export enum EAccessSetting {
    ALL_USERS = 'allUsers',
    MDO_SPECIFIC = 'mdoSpecific',
    CUSTOME_USER = 'customeUser',
  }

  export enum EAssessmentType {
    QUESTION_WEIGHTAGE = 'questionWeightage',
    OPTION_WEIGHTAGE = 'optionalWeightage',
    QUESTION_OPTION_WEIGHTAGE = 'questionOptionWeightage',
  }
  export enum EQuestionTagging {
    PF_BASED = 'Proficiency',
    EMDH_BASED = 'EMDH',
  }

  // Interface for rating
  export interface IRating {
    activity_Id: string,
    userId: string,
    activity_type: string,
    rating: number,
    review: string,
  }

  // Interface for rating lookup requests
  export interface ILookupRequest {
    activityId: string,
    activityType: string,
    rating?: number,
    limit?: number,
    updateOn?: string,
  }

  export interface ICompentencyKeys {
    vKey: string
    vCompetencyArea: string
    vCompetencyAreaDescription: string
    vCompetencyTheme: string
    vCompetencySubTheme: string
  }

  export const UN_SUPPORTED_DATA_TYPES_FOR_NON_BATCH_USERS: string[] = [
    // this is comment now for enabling links in the toc page for enrolled users
    // EMimeTypes.QUIZ,
    // EMimeTypes.APPLICATION_JSON,
    // EMimeTypes.WEB_MODULE_EXERCISE,

  ]

  export enum WFBlendedProgramApprovalTypes {
    ONE_STEP_PC = 'oneStepPCApproval',
    ONE_STEP_MDO = 'oneStepMDOApproval',
    TWO_STEP_MDO_PC = 'twoStepMDOAndPCApproval',
    TWO_STEP_PC_MDO = 'twoStepPCAndMDOApproval',
  }

  export enum WFBlendedProgramStatus {
    INITIATE = 'INITIATE',
    SEND_FOR_MDO_APPROVAL = 'SEND_FOR_MDO_APPROVAL',
    SEND_FOR_PC_APPROVAL = 'SEND_FOR_PC_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
    REMOVED = 'REMOVED',
    WITHDRAW = 'WITHDRAW',
  }

  export const WFSTATUS_MSG_MAPPING: any = {
    INITIATE: '',
    SEND_FOR_MDO_APPROVAL: 'BatchEnrollL1Msg',
    SEND_FOR_PC_APPROVAL: 'BatchEnrollL2Msg',
    APPROVED: 'BatchEnrollApprovedMsg',
    REJECTED: 'BatchEnrollRejectedMsg',
    WITHDRAWN: 'BatchEnrollWithdrawMsg',
    REMOVED: 'BatchEnrollRemoveMsg',
    EXPIRED: 'BatchListExpiredMsg',
  }

  export const PUBLIC_SUPPORTED_CONTENT_TYPES: EMimeTypes[] = [
    EMimeTypes.APPLICATION_JSON,
    EMimeTypes.FINAL_ASSESSMENT,
    EMimeTypes.HTML,
    EMimeTypes.HTML_TEXT,
    EMimeTypes.ZIP,
    EMimeTypes.ZIP2,
    EMimeTypes.M4A,
    EMimeTypes.MP3,
    EMimeTypes.MP4,
    EMimeTypes.PDF,
    EMimeTypes.YOUTUBE,
    EMimeTypes.TEXT_WEB,
    EMimeTypes.SURVEY,
  ]

  export enum ROLE_MAP {
    CONTENT_CREATOR = 'content_creator',
    CONTENT_REVIEWER = 'content_reviewer',
    CONTENT_PUBLISHER = 'content_publisher',
    SPV_PUBLISHER = 'spv_publisher',
    PROGRAM_COORDINATOR = 'program_coordinator',
    PUBLIC = 'public',
    CONTENT_ADMIN = 'content_admin',
    CBP_ADMIN = 'cbp_admin',
    CBP_REVIEWER = 'cbp_reviewer',
    CBP_PUBLISHER = 'cbp_publisher',
    CBP_CREATOR = 'cbp_creator',
    PROGRAM_INSTRUCTOR = 'program_instructor',
  }

  export const END_SURVEY_FIELD_TYPES = [
    'checkbox', 'text', 'radio', 'rating'
  ]

  export const FIELD_TYPES_LIST = [
    'boolean', 'checkbox', 'date', 'dropdown', 'email',
    'numeric', 'phone number', 'radio', 'rating', 'text', 'textarea',
  ]

  export const FORM_TYPES = {
    COMPLETION_SURVEY: 'completionSurvey',
    FORM: 'form',
    AGK_PUBLIC_SURVEY: 'AGKPublicSurvey'
  }

  export const FORM_TYPES_LIST = [
    {
      key: 'Form',
      value: FORM_TYPES.FORM
    },
    {
      key: 'Survey',
      value: FORM_TYPES.COMPLETION_SURVEY
    },
    // {
    //   key: 'AGK Survey',
    //   value: FORM_TYPES.AGK_PUBLIC_SURVEY
    // }
  ]
}
