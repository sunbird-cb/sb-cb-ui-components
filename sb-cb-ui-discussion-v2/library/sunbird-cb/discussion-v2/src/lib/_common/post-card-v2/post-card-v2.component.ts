import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MatDialog } from '@angular/material/dialog'
// tslint:disable-next-line
import _ from 'lodash'
import { FlagDialogueComponent } from '../../_shared/flag-dialogue/flag-dialogue.component'
import { DiscussionV2Service } from '../../_services/discussion-v2.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfirmDialogueComponent } from '../../_shared/confirm-dialogue/confirm-dialogue.component'
import { NewPostDialogueComponent } from '../new-post-dialogue/new-post-dialogue.component'
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service'
import { map } from 'rxjs/operators'

@Component({
  selector: 'd-v2-post-card-v2',
  templateUrl: './post-card-v2.component.html',
  styleUrls: ['./post-card-v2.component.scss']
})
export class PostCardV2Component implements OnInit {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.IDiscussV2WidgetDataV2
  @Input() type!: string
  @Input() post!: any
  @Input() replyData: any[] = []
  @Input() hierarchyPath = []
  @Input() userLikedPosts: any = []
  @Input() userJoinedCommunity!: boolean
  @Input() community!: string
  @Input() parentPost!: any
  @Input() showCommunity: boolean = false
  @Input() levelKey!: string
  @Input() currentLevel: number = 0
  @Output() likeUnlikeData = new EventEmitter<any>()
  @Output() bookmarkEvent = new EventEmitter<any>()
  @Output() newReply = new EventEmitter<any>()
  @Output() newComment = new EventEmitter<any>()
  @Output() communityClickEvent = new EventEmitter<any>()

  data = {
    replyToggle: false,
  }
  replyDataCopy: any[] = []
  fetchedReplyData: any = []
  fetchedSearchData: any
  loading = false
  loadingMore = false
  editCommentData: any = ''
  answerPostLimit: any = 10
  answerPostPage = 0
  loogedInUserProfile: any = {}
  loggedInUserData: any = {}
  flagSelectionList: any
  reportPending = false
  viewMoreLength = 246
  editMode: boolean = false
  userJoinedCommunityObject: any = {}

  levelConfig: any
  showReplies: boolean = false;
  avatarConfig: any
  allowReplies: boolean = false;
  nextLevel: string | null = null;
  nextNestingLevel: number = 0;
  nextLevelConfig: any

  constructor(
    private configSvc: ConfigurationsService,
    private dialog: MatDialog,
    private discussV2Svc: DiscussionV2Service,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private userEnrollCommunitySvc: UserEnrollCommunityService
  ) {

  }

  async ngOnInit() {
    this.loggedInUserData = this.configSvc.unMappedUser
    this.loogedInUserProfile = this.configSvc.userProfile
    this.replyDataCopy = [...this.replyData || []]
    let userEnrolledCommunityList = await this.userEnrollCommunitySvc.getEnrollDataId()
    if (userEnrolledCommunityList.length) {
      this.userJoinedCommunityObject = this.userEnrollCommunitySvc.userEnrolledCommunityObjectData
    }

    this.levelConfig = this.cardConfig.levelConfigs[this.levelKey as keyof typeof this.cardConfig.levelConfigs]
    // Check if replies are allowed for this level
    this.allowReplies = this.levelConfig.allowReplies &&
      this.currentLevel < this.cardConfig.maxLevels

    // Get the reference to the next level's configuration
    this.nextLevel = this.levelConfig.replyLevelRef
    this.nextNestingLevel = this.currentLevel + 1
    this.nextLevelConfig = this.cardConfig.levelConfigs[this.nextLevel as keyof typeof this.cardConfig.levelConfigs]
  }


  expandReplyComment() {
    this.data.replyToggle = !this.data.replyToggle
    if (this.data.replyToggle && this.replyData && this.replyData.length) {
      this.loading = true
      this.answerPostPage = 0
      this.getListOfReplies()
    }
  }

  loadMoreAnswers() {
    this.answerPostPage = this.answerPostPage + 1
    // this.answerPostLimit = this.answerPostCount + this.answerPostLimit
    this.getListOfRepliesMore()
  }

  getListOfReplies() {
    // let reveseReplayDataCopy = [...this.replyDataCopy]
    // reveseReplayDataCopy.reverse()
    // let ids:any = reveseReplayDataCopy.slice(0,this.answerPostLimit)
    const req = {
      "filterCriteriaMap": {
        // discussionId : [...this.replyDataCopy],
        // isActive: true, // this is to get only active posts, deleted posts won't be returned
        communityId: this.parentPost?.communityId,
        "type": this.nextLevelConfig.type || '',
        ...(this.nextLevelConfig.type === 'answerPost') ? { parentDiscussionId: this.parentPost?.discussionId } :
          { parentAnswerPostId: this.post?.discussionId }
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": this.answerPostLimit,
      "orderBy": "createdOn",
      "orderDirection": "DESC",
      "facets": []
    }
    this.discussV2Svc.searchPosts(req).subscribe(res => {
      this.fetchedSearchData = _.get(res, 'result.search_results') || {}
      const postsData = _.get(res, 'result.search_results.data') || []
      if (postsData.length) {
        this.enrichData(postsData).subscribe(
          () => {
            this.fetchedReplyData = postsData
            this.replyDataCopy = [...this.fetchedReplyData.map((x: any) => x.discussionId)]
            this.loading = false
            // this.newReply.emit({ response: [], type: this.levelConfig.cardConfig.cardType, replyDataCopy:this.replyDataCopy, replyData: this.fetchedReplyData })
          },
          () => {
            // On enrichData failure, fallback to original posts
            this.fetchedReplyData = postsData
            this.loading = false
          }
        )
      } else {
        this.fetchedReplyData = []
        this.loading = false
      }
    }, () => {
      this.loading = false
    })
  }

  getListOfRepliesMore() {
    this.loadingMore = true
    // let start: number = this.answerPostCount - this.answerPostLimit
    // let reveseReplayDataCopy = [...this.replyDataCopy]
    // reveseReplayDataCopy.reverse()
    // let ids:any = reveseReplayDataCopy.slice(start,this.answerPostCount)
    const req = {
      "filterCriteriaMap": {
        // discussionId : [...this.replyDataCopy],
        // isActive: true, // this is to get only active posts, deleted posts won't be returned
        communityId: this.parentPost?.communityId,
        "type": this.nextLevelConfig.type || '',
        ...(this.nextLevelConfig.type === 'answerPost') ? { parentDiscussionId: this.parentPost?.discussionId } :
          { parentAnswerPostId: this.post?.discussionId },
        // parentDiscussionId: this.hierarchyPath.length ? this.hierarchyPath[0] : '',
      },
      "requestedFields": [],
      "pageNumber": this.answerPostPage,
      "pageSize": this.answerPostLimit,
      "orderBy": "createdOn",
      "orderDirection": "DESC",
      "facets": []
    }
    this.discussV2Svc.searchPosts(req).subscribe(res => {
      const newPosts = _.get(res, 'result.search_results.data') || []

      if (newPosts.length) {
        this.enrichData(newPosts).subscribe(
          () => {
            this.fetchedReplyData = [...this.fetchedReplyData, ...newPosts]
            this.loadingMore = false
          },
          () => {
            // On enrichData failure, fallback to original posts
            this.fetchedReplyData = [...this.fetchedReplyData, ...newPosts]
            this.loadingMore = false
          }
        )
      } else {
        this.loadingMore = false
      }
    }, () => {
      this.loadingMore = false
    })
  }


  viewMoreOrLess(item: any) {
    if (this.getEditorTextLength(item.description) > this.viewMoreLength) {
      item.expanded = !item.expanded
    }
  }

  enrichData(posts: any) {
    const groupedDataRequest = this.groupByCommunityId(posts)
    return this.discussV2Svc.enrichData(groupedDataRequest).pipe(
      map((res: any) => {
        const enrichedData = _.get(res, 'result.search_results')
        if (enrichedData) {
          posts.forEach((post: any) => {
            post.isLiked = enrichedData.likes[post.discussionId] || false
            post.isBookmarked = enrichedData.bookmarks[post.discussionId] || false
            post.isReported = enrichedData.reported[post.discussionId] || false
          })
        }
        return posts
      })
    )
  }

  groupByCommunityId(posts: any) {
    const communityFilters: { [key: string]: { communityId: string; identifier: string[] } } = {}

    posts.forEach((post: any) => {
      const { communityId, discussionId } = post
      if (!communityFilters[communityId]) {
        communityFilters[communityId] = { communityId, identifier: [] }
      }
      communityFilters[communityId].identifier.push(discussionId)
    })

    return {
      request: {
        communityFilters: Object.values(communityFilters),
        requestType: "question",
        filters: ["likes", "bookmarks", "reported"]
      }
    }
  }

  likeUnlikeComment(post: any) {
    this.likeUnlikeData.emit(post)
    // after emit change the status to locally update the color. otherwise emitted data will behave reverse
    // So its necessary to first emit the event and then change
    post.isLiked = post.isLiked ? false : true
  }

  bookmark(bookmark: boolean, post: any) {
    this.bookmarkEvent.emit({
      bookmark,
      post
    })
  }

  likeUnlikeEvent(event: any) {
    if (event && event.isLiked) {
      this.downVotePost('dislike', event.type, event.discussionId)
    } else {
      this.upVotePost('like', event.type, event.discussionId)
    }
  }

  upVotePost(flag: string, type: string, discussionId: string) {
    this.discussV2Svc.upVotePost(type, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const post = this.fetchedReplyData.find((comm: any) => comm.discussionId === discussionId)
        if (flag === 'like') {
          post.upVoteCount = post.upVoteCount ? post.upVoteCount + 1 : 1
          // this.userLikedComments.push(commentId)
        } else {
          post.upVoteCount = post.upVoteCount ? post.upVoteCount - 1 : 0
          // const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          // this.userLikedComments.splice(index, 1)
        }
      }
    })
  }

  downVotePost(flag: string, type: string, discussionId: string) {
    this.discussV2Svc.downVotePost(type, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const post = this.fetchedReplyData.find((comm: any) => comm.discussionId === discussionId)
        if (flag === 'like') {
          post.upVoteCount = post.upVoteCount ? post.upVoteCount + 1 : 1
          // this.userLikedComments.push(commentId)
        } else {
          post.upVoteCount = post.upVoteCount ? post.upVoteCount - 1 : 0
          // const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          // this.userLikedComments.splice(index, 1)
        }
      }
    })
  }

  openFlagDialogue(comment: any) {
    this.getAllFlagList(comment)

  }

  getAllFlagList(comment: any) {
    this.discussV2Svc.fetchAllFlags().subscribe((res: any) => {
      if (res && res.result
        && res.result.response
        && res.result.response.value
        && res.result.response.value.length) {
        this.flagSelectionList = res.result.response.value
        const confirmDialog = this.dialog.open(FlagDialogueComponent, {
          width: '600px',
          panelClass: 'flag-dialog',
          backdropClass: 'flag-dialog-backdrop',
          data: { comment, flagSelectionList: this.flagSelectionList },
        })
        confirmDialog.afterClosed().subscribe((result: any) => {

          if (result) {
            this.reportPost(result)
          }
        })
      }
    })
  }

  reportPost(flagDetails: any) {
    this.reportPending = true
    let requestData: any = {
      "discussionId": this.post.discussionId,
      "type": this.post.type,
      "discussionText": this.post.description,
    }
    requestData = { ...requestData, ...flagDetails }

    this.discussV2Svc.reportPost(requestData).subscribe(res => {
      if (res && res.responseCode && res.responseCode.toLowerCase() === 'ok') {
        this.loading = false
        this.reportPending = false
        this.post.isReported = true
        // this.post = res.result
        this._snackBar.open(_.get(this.cardConfig, 'reportIcon.successMsg') || 'Reported successfully! Thank you for reporting.')
      } else {
        if (res && res.params && res.params.err) {
          this._snackBar.open(res.params.err || 'Something went wrong! please try reporting again later.')
        }
      }
    },
      () => {
        this._snackBar.open(_.get(this.cardConfig, 'reportIcon.errorMsg') || 'Something went wrong! please try reporting again later.')
        this.reportPending = false
        this.loading = false
      })
  }

  openDeleteDialogue(post: any) {
    const confirmDialog = this.dialog.open(ConfirmDialogueComponent, {
      width: '600px',
      panelClass: 'flag-dialog',
      backdropClass: 'flag-dialog-backdrop',
      data: {
        post,
        flagSelectionList: this.flagSelectionList
      },
    })
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteCommentMethod(post)
      }
    })

  }
  deleteCommentMethod(post: any) {
    this.discussV2Svc.deletePost(post.type, post.discussionId).subscribe((_res: any) => {
      post.status = 'inactive'
      this._snackBar.open('Comment deleted successfully')
    }, (_err: any) => {
      this._snackBar.open('Something went wrong! please try again later.')
    })
  }

  editHandler(post: any) {
    if (this.cardConfig && this.levelConfig.cardConfig.editAsDialogue) {
      this.openEditDialogue(post)
    } else {
      this.editMode = true
    }
  }

  editEventsHandler(event: any) {
    if (event && event.cancelEdit) {
      this.editMode = false
    }
    if (event && event.edit) {
      event.post.createdBy = this.post.createdBy
      this.post = event.post
      this.editMode = false
    }
  }

  communityClick(communityId: string) {
    const community = {
      communityId: communityId
    }
    this.communityClickEvent.emit(community)
  }

  openEditDialogue(post: any) {

    let data = {
      communityId: this.post.communityId,
      communityName: this.userJoinedCommunityObject[this.post.communityId]
    }
    let postData: any = {
      type: this.type,
      panelClass: ['post-dialog', 'scrollable-dialog'], // Add scrollable class
      backdropClass: 'post-dialog-backdrop',
      parentDiscussionId: this.hierarchyPath.length ? this.hierarchyPath[0] : '',
      community: this.community || data,
      config: this.cardConfig,
      currentUser: { ...this.loogedInUserProfile, ...this.loggedInUserData },
      post: post,
      editMode: true,
      parentPost: this.parentPost,
      levelKey: this.levelKey,
      currentLevel: this.currentLevel
    }
    if (post.mentionedUsers && post.mentionedUsers.length) {
      postData['mentionedUsers'] = post.mentionedUsers
    }
    const newPostDialog = this.dialog.open(NewPostDialogueComponent, {
      width: '996px',
      maxHeight: '90vh',// Add maximum height (90% of viewport height)
      disableClose: true,
      data: postData
    })
    newPostDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.newComment.emit({ result: result.result, type: result.type })
      }
    })
  }

  updateRepliesData(eventData: any) {
    this.replyDataCopy = [...eventData.replyDataCopy]
    this.fetchedReplyData = [...eventData.replyData]
    return this.fetchedReplyData
  }

  newCommentEvent(event: any, level?: string) {
    if (event.result && event.result.discussionId) {
      this.loading = true
      // this.emptySearch()
      this.replyDataCopy.push(event.result.discussionId)
      this.replyDataCopy = this.replyDataCopy.slice()
      this.ref.markForCheck()
      this.answerPostPage = 0
      this.getListOfReplies()
      if (level) {
        this.newComment.emit({ response: event.response, type: level, replyData: this.replyDataCopy })
      }
    }
  }

  getFileExtension(file: string): string {
    return file.split('.').pop() || ''
  }

  getFileName(url: string): string {
    const filename = url.split('/').pop() || ''
    // Decode the URL-encoded filename
    return decodeURIComponent(filename)
  }

  getFileIcon(url: string): string {
    const extension = this.getFileExtension(url)
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf'
      case 'doc':
      case 'docx':
        return 'description'
      default:
        return 'insert_drive_file'
    }
  }

  openDocument(event: MouseEvent, url: string) {
    event.preventDefault()
    window.open(url, '_blank')
  }

  getEditorTextLength(content: any) {
    let test = content.replace(/<[^>]*>/g, '')
    test = test.replace(/&nbsp;/gi, ' ')
    test = test.trim()
    return test.length
  }
}
