export namespace NsDiscussionV2 {
    export interface INewCommentConfig {
        show: boolean,
        showTopInfo: boolean,
        commentTreeData: {
            isFirstComment: boolean,
            commentTreeId: string,
            hierarchyPath: string[],
            entityType: string,
            entityId: string,
            workflow: string
        }
        topInfo: {
            icon: string,
            text: string
        },
        avatarPhoto: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
        commentBox: {
            placeholder: string
        },
        postBtn: {
            text: string
        },
        styles: any,

    }

    export interface ICommentCardActionsObj {
        show: boolean,
        showCount: boolean,
        icon: string,
        canLike: boolean,
    }

    export interface ICommentCardActions {
        like?: ICommentCardActionsObj,
        comments?: ICommentCardActionsObj,
        avatarPhoto?: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
        flagComment?: ICommentCardActionsObj
    }

    export interface ICommentCardConfig {
        cardType: string,
        showActions: boolean,
        reportIcon?: {
            show: boolean,
            icon: string,
            successMsg: string,
            errorMsg: string,
            showToolTip: boolean,
            toolTipText: string
        },
        actions: ICommentCardActions,
        repliesSection: {
            show: boolean,
            newCommentReply?: INewCommentConfig,
            replyCardConfig?: ICommentCardConfig
        },
        noCommentsSection?: {
            text: string
        },
        newCommentReply?: INewCommentConfig
    }

    export interface ICommentWidgetData {
        newCommentSection: INewCommentConfig,
        commentsList: ICommentCardConfig,
        enrolledContent?: boolean
    }


    // Discussion v2 model
    export interface INewPostConfig {
        show: boolean,
        type: string,
        openAsDialogue?: boolean,
        showTopInfo: boolean,
        topInfo: {
            icon: string,
            text: string
        },
        avatarPhoto: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
        commentBox: {
            openDialogue?: boolean
            placeholder: string
        },
        postBtn: {
            show?: boolean
            text: string,
            icon: string
        },
        styles: any,
    }

    export interface IPostCardConfig {
        listType?: string,
        cardType: string,
        type: string,
        cardClick?: {
            enabled: boolean,
            position: string,
            redirectUrl: string,
            id: string
        }
        avatarPhoto?: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
        showActions: boolean,
        sliderData?: any,
        reportIcon?: {
            show: boolean,
            icon: string,
            successMsg: string,
            errorMsg: string,
            showToolTip: boolean,
            toolTipText: string
        },
        actions: IPostCardActions,
        editAsDialogue?: boolean
        repliesSection: {
            show: boolean,
            indented?: boolean,
            newPostReply?: INewPostConfig,
            replyCardConfig?: IPostCardConfig
        },
        noPostsSection?: {
            text: string
        },
        newPostReply?: INewPostConfig
    }

    export interface IPostCardActionsObj {
        show: boolean,
        showCount: boolean,
        icon: string,
    }

    export interface IPostCardActions {
        like?: IPostCardActionsObj,
        comments?: IPostCardActionsObj,
        bookmark?: IPostCardActionsObj
        avatarPhoto?: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
    }

    export interface IDiscussV2WidgetData {
        newPostSection: INewPostConfig,
        postsList: IPostCardConfig,
    }

    export interface IPostDetailsWidget {
        postsList: IPostCardConfig,
    }

    export enum EPostType {
        QUESTION = 'question',
        ANSWER_POST = 'answerPost',
        ANSWER_POST_REPLY = 'answerPostReply',
    }

    export type LevelKey = `level${number}` // Matches level0, level1, etc.
    export interface IDiscussV2WidgetDataV2 {
        maxLevels: number
        defaultAvatarConfig: IAvatarConfig
        levelConfigs: Record<LevelKey, LevelConfig>
        noPostsSection: INoPostsSection
    }

    export interface IAvatarConfig {
        show: boolean
        size: IAvatarSizeConfig
        photoUrl: string
        name: string
        color: string
    }

    export interface LevelConfig {
        type: 'question' | 'answerPost' | 'answerPostReply'
        allowReplies: boolean
        replyLevelRef: string | null
        childrenKey: string | null
        newPostSection: INewPostSection
        cardConfig: ICardConfigV2
    }

    export interface INewPostSection {
        show: boolean
        openAsDialogue: boolean
        showTopInfo: boolean
        topInfo?: TopInfo
        avatarPhoto?: IAvatarConfig
        commentBox: ICommentBox
        postBtn: IPostButton
        styles: { [key: string]: string }
    }

    export interface TopInfo {
        icon: string
        text: string
    }

    export interface IAvatarSizeConfig {
        size: 's' | 'm' | 'ml' | 'l'
    }
    export interface IListType {
        listType: 'multiple' | 'single'
    }

    export interface ICardType {
        cardType: 'topLevel' | 'reply' | 'reply-l2'
    }
    export interface ICommentBox {
        placeholder: string
    }

    export interface IPostButton {
        text: string
        icon: string
        show: boolean
    }

    // Card Configurations
    export interface ICardConfigV2 {
        listType?: IListType
        cardType: ICardType
        showActions: boolean
        editAsDialogue: boolean
        childrenIndented?: boolean
        cardClick?: ICardClickConfig
        avatarPhoto?: IAvatarConfig
        sliderData?: ISliderData
        reportIcon: ReportIcon
        actions: ICardActions
    }

    export interface ICardClickConfig {
        enabled: boolean
        position: 'title' | 'body'
        redirectUrl: string
        id: string
    }

    export interface ISliderData {
        styleData: ISliderStyleData
    }

    export interface ISliderStyleData {
        bannerMetaClass: string
        bannerMeta: string
        bannerMetaAlign: string
        navigationArrows: string
        borderRadius: string
        customHeight: string
        arrowsPlacement: string
        autoplay: boolean
        responsive: {
            bannerMetaClass: string
            customHeight: string
            bannerMetaAlign: string
            navigationArrows: string
            dots: string
            arrowsPlacement: string
            autoplay: boolean
        }
    }
    // Report & Actions
    export interface ReportIcon {
        show: boolean
        icon: string
        successMsg: string
        errorMsg: string
        showToolTip: boolean
        toolTipText: string
    }

    export interface ICardActions {
        like?: IActionItem
        comments?: IActionItem
        bookmark?: IActionItem
    }

    export interface IActionItem {
        show: boolean
        showCount?: boolean
        icon?: string
    }

    export interface INoPostsSection {
        text: string
    }
}
