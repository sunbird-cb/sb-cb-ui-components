import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { CommentsService } from '../../_services/comments.service'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

// tslint:disable-next-line
import _ from 'lodash'

@Component({
  selector: 'd-v2-widget-comment',
  templateUrl: './widget-comment.component.html',
  styleUrls: ['./widget-comment.component.scss'],
})
export class WidgetCommentComponent implements OnInit, OnDestroy {
  commentData!: any
  loading = false
  loadingMore = false
  entityId = ''
  @Input() widgetData!: NsDiscussionV2.ICommentWidgetData | any
  @Input() commentId!: any
  commentTreeId = ''
  loogedInUserProfile: any = {}
  commentListLimit = 20
  commentListOffSet = 0
  commentsLength = 0
  isReversed = false
  userLikedComments: any = []
  commentUsersData: any = {}
  commentTree: any
  @Output() commentDataChange = new EventEmitter<any>()
  constructor(
    private commentSvc: CommentsService, private configSvc: ConfigurationsService, private _snackBar: MatSnackBar, private events: EventService
  ) { }

  ngOnInit() {
    // this.fetchInitialComments()
    this.loogedInUserProfile = this.configSvc.userProfile
    this.fetchInitialComments_v2()
    this.getLikedComments()
  }

  getLikedComments() {
    this.commentSvc.getAllLikedCommentIds(this.commentSvc.entityId).subscribe((res: any) => {
      if (res && res.result && res.result.commentId && res.result.commentId.length) {
        this.userLikedComments = res.result.commentId
      }
    })
  }

  fetchInitialComments() {
    this.loading = true
    this.entityId = this.widgetData.newCommentSection.commentTreeData.entityId || ''
    const entityType = this.widgetData.newCommentSection.commentTreeData.entityType || ''
    const workflow = this.widgetData.newCommentSection.commentTreeData.workflow || ''
    this.commentSvc.entityId = this.entityId
    this.commentSvc.entityType = entityType
    this.commentSvc.workflow = workflow
    this.commentSvc.fetchAllComment(entityType, this.entityId, workflow).subscribe(res => {
      // tslint:disable-next-line: no-console
      this.loading = false
      if (res && res.commentCount) {
        this.commentData = res
        this.commentSvc.commentTreeId = ''
        this.commentSvc.commentTreeId = this.commentData.commentTree.commentTreeId
        this.widgetData.newCommentSection.commentTreeData.commentTreeId = this.commentData.commentTree.commentTreeId
        if (this.widgetData.commentsList.repliesSection && this.widgetData.commentsList.repliesSection.newCommentReply) {
          // tslint:disable-next-line:max-line-length
          this.widgetData.commentsList.repliesSection.newCommentReply.commentTreeData.commentTreeId = this.commentData.commentTree.commentTreeId
        }
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = false
      }
      if (res && res.code === 'Not Found' || !res.commentCount) {
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = true
      }
    }, (err: any) => {
      this.loading = false
      // tslint:disable-next-line: no-console
      console.error('Error in fetching all comments', err)
    })
  }

  fetchInitialComments_v2(commentTreeId?: string, overrideCacheValue?: boolean) {
    this.loading = true
    this.entityId = this.widgetData.newCommentSection.commentTreeData.entityId || ''
    const entityType = this.widgetData.newCommentSection.commentTreeData.entityType || ''
    const workflow = this.widgetData.newCommentSection.commentTreeData.workflow || ''

    this.commentSvc.entityId = this.entityId
    this.commentSvc.entityType = entityType
    this.commentSvc.workflow = workflow


    const commentTreePayload = {
      entityType,
      workflow,
      "entityId": this.entityId,
    }
    if (this.entityId) {
      this.commentSvc.getCommentTree(commentTreePayload).subscribe((commentRes: any) => {
        let commentTreeDataLocal = commentRes.result
        if (this.commentId) {
          this.fetchCommentTreeAndComment_V3(commentTreeDataLocal, commentTreeId, overrideCacheValue, entityType, workflow)
        } else {
          this.fetchComments_V3(commentTreeDataLocal, commentTreeId, overrideCacheValue, entityType, workflow)
        }
      }, (err: any) => {
        if (err) {
          this.loadingMore = false
        }
        let commentTreeDataLocal = {}
        // tslint:disable-next-line: no-console
        this.fetchComments_V3(commentTreeDataLocal, commentTreeId, overrideCacheValue, entityType, workflow)
        // console.error('Error in fetching all comments', err)
      })
    } else {
      this.events.raiseInteractTelemetry(
        {
          type: 'click',
          subType: 'CommentTreeGet',
        },
        {
          pageUrl: window.location.href || window.location.pathname,

        },
        {
          pageIdExt: 'Comment',
          module: 'CommentTreeGet',
        })
    }

  }

  getCommentById(commentTreeDataLocal: any) {
    this.commentSvc.getListOfCommentsById([this.commentId]).subscribe(res => {
      this.loading = false
      if (res && res.result.commentCount) {
        this.commentData = res.result
        this.commentData['commentTree'] = {
          commentTreeId: res.result.commentTreeId || this.commentTree,
          commentTreeData: commentTreeDataLocal
        }
        this.commentsLength = this.commentData.commentTree.commentTreeData.comments.length || 0
        if (res && res.result && res.result.courseDetails) {
          res.result.courseDetails['curators'] = []
          res.result.courseDetails['authors'] = []
          if (res.result.courseDetails.creatorDetails) {
            let creatorDetails = JSON.parse(res.result.courseDetails.creatorDetails)
            let creatorIds: any = []
            creatorDetails.forEach((ele: any) => {
              creatorIds.push(ele.id)
            })
            res.result.courseDetails['authors'] = creatorIds
          }
          if (res.result.courseDetails.creatorContacts) {
            let creatorContacts = JSON.parse(res.result.courseDetails.creatorContacts)
            let creatorContactsIds: any = []
            creatorContacts.forEach((ele: any) => {
              creatorContactsIds.push(ele.id)
            })
            res.result.courseDetails['curators'] = creatorContactsIds
          }
          this.commentSvc.courseDetails = res.result.courseDetails
        }
        this.commentData.commentTree.commentTreeData.comments.reverse()

        this.commentSvc.commentTreeId = ''
        this.commentSvc.commentTreeId = this.commentData.commentTree.commentTreeId
        this.widgetData.newCommentSection.commentTreeData.commentTreeId = this.commentData.commentTree.commentTreeId
        if (this.widgetData.commentsList.repliesSection && this.widgetData.commentsList.repliesSection.newCommentReply) {
          // tslint:disable-next-line:max-line-length
          this.widgetData.commentsList.repliesSection.newCommentReply.commentTreeData.commentTreeId = this.commentData.commentTree.commentTreeId
        }

        if (res.result && res.result.users && res.result.users.length) {
          let commentUsersDataObj = res.result.users
          this.commentUsersData = { ...this.commentUsersData, ..._.keyBy(commentUsersDataObj, 'user_id') }
        }
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = false
      }
      if (res && res.code === 'Not Found' || !res.result.commentCount) {
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = true
      }
      this.commentDataChange.emit({
        commentData: this.commentData,
        widgetData: this.widgetData,
      })
    }, (err: any) => {
      this.loading = false
      // tslint:disable-next-line: no-console
      console.error('Error in fetching all comments', err)
    })
  }

  fetchCommentTreeAndComment_V3(commentTreeDataLocal: any, commentTreeId?: string, overrideCacheValue?: boolean, entityType: string = '', workflow: string = '') {
    let payload: any = {
      entityType,
      workflow,
      commentTreeId: commentTreeId || '',
      entityId: this.entityId,
      limit: this.commentListLimit,
      offset: this.commentListOffSet,
      overrideCache: overrideCacheValue || false,

    }
    this.commentSvc.fetchAllComment_V3(payload).subscribe(res => {
      // tslint:disable-next-line: no-console
      this.loading = false
      if (res && res.result.commentCount) {
        this.commentTree = res.result.commentTreeId
        this.getCommentById(commentTreeDataLocal)
      }
    }, error => {
      this.loadingMore = false
      // tslint:disable-next-line: no-console
      console.log(error)
      this.getCommentById(commentTreeDataLocal)
    })
  }

  fetchComments_V3(commentTreeDataLocal: any, commentTreeId?: string, overrideCacheValue?: boolean, entityType: string = '', workflow: string = '') {
    let payload: any = {
      entityType,
      workflow,
      commentTreeId: commentTreeId || '',
      entityId: this.entityId,
      limit: this.commentListLimit,
      offset: this.commentListOffSet,
      overrideCache: overrideCacheValue || false,

    }
    this.commentSvc.fetchAllComment_V3(payload).subscribe(res => {
      // tslint:disable-next-line: no-console
      this.loading = false
      if (res && res.result.commentCount) {
        this.commentTree = res.result.commentTreeId
        this.commentData = res.result
        this.commentData['commentTree'] = {
          commentTreeId: res.result.commentTreeId,
          commentTreeData: commentTreeDataLocal
        }
        this.commentsLength = this.commentData.commentTree.commentTreeData.comments.length || 0
        if (res && res.result && res.result.courseDetails) {
          res.result.courseDetails['curators'] = []
          res.result.courseDetails['authors'] = []
          if (res.result.courseDetails.creatorDetails) {
            let creatorDetails = JSON.parse(res.result.courseDetails.creatorDetails)
            let creatorIds: any = []
            creatorDetails.forEach((ele: any) => {
              creatorIds.push(ele.id)
            })
            res.result.courseDetails['authors'] = creatorIds
          }
          if (res.result.courseDetails.creatorContacts) {
            let creatorContacts = JSON.parse(res.result.courseDetails.creatorContacts)
            let creatorContactsIds: any = []
            creatorContacts.forEach((ele: any) => {
              creatorContactsIds.push(ele.id)
            })
            res.result.courseDetails['curators'] = creatorContactsIds
          }
          this.commentSvc.courseDetails = res.result.courseDetails
        }
        this.commentData.commentTree.commentTreeData.comments.reverse()

        this.commentSvc.commentTreeId = ''
        this.commentSvc.commentTreeId = this.commentData.commentTree.commentTreeId
        this.widgetData.newCommentSection.commentTreeData.commentTreeId = this.commentData.commentTree.commentTreeId
        if (this.widgetData.commentsList.repliesSection && this.widgetData.commentsList.repliesSection.newCommentReply) {
          // tslint:disable-next-line:max-line-length
          this.widgetData.commentsList.repliesSection.newCommentReply.commentTreeData.commentTreeId = this.commentData.commentTree.commentTreeId
        }

        if (res.result && res.result.users && res.result.users.length) {
          let commentUsersDataObj = res.result.users
          this.commentUsersData = { ...this.commentUsersData, ..._.keyBy(commentUsersDataObj, 'user_id') }
        }
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = false
      }
      if (res && res.code === 'Not Found' || !res.result.commentCount) {
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = true
      }
      this.commentDataChange.emit({
        commentData: this.commentData,
        widgetData: this.widgetData,
      })
    }, (err: any) => {
      this.loading = false
      // tslint:disable-next-line: no-console
      console.error('Error in fetching all comments', err)
    })
  }

  fetchInitialComments_v2Addmore(commentTreeId?: string) {
    this.loadingMore = true
    this.entityId = this.widgetData.newCommentSection.commentTreeData.entityId || ''
    const entityType = this.widgetData.newCommentSection.commentTreeData.entityType || ''
    const workflow = this.widgetData.newCommentSection.commentTreeData.workflow || ''

    this.commentSvc.entityId = this.entityId
    this.commentSvc.entityType = entityType
    this.commentSvc.workflow = workflow
    const payload = {
      entityType,
      workflow,
      commentTreeId: commentTreeId || '',
      entityId: this.entityId,
      limit: this.commentListLimit,
      offset: this.commentListOffSet,
    }
    this.commentSvc.fetchAllComment_V3(payload).subscribe(res => {
      if (res && res.result.commentCount) {
        const newComments = res.result.comments
        if (res && res.result && res.result.courseDetails) {

          res.result.courseDetails['curators'] = []
          res.result.courseDetails['authors'] = []
          if (res.result.courseDetails.creatorDetails) {
            let creatorDetails = JSON.parse(res.result.courseDetails.creatorDetails)
            let creatorIds: any = []
            creatorDetails.forEach((ele: any) => {
              creatorIds.push(ele.id)
            })
            res.result.courseDetails['authors'] = creatorIds
          }
          if (res.result.courseDetails.creatorContacts) {
            let creatorContacts = JSON.parse(res.result.courseDetails.creatorContacts)
            let creatorContactsIds: any = []
            creatorContacts.forEach((ele: any) => {
              creatorContactsIds.push(ele.id)
            })
            res.result.courseDetails['curators'] = creatorContactsIds
          }
          if (res.result && res.result.users && res.result.users.length) {
            let commentUsersDataObj = res.result.users
            this.commentUsersData = { ...this.commentUsersData, ..._.keyBy(commentUsersDataObj, 'user_id') }
          }
          this.commentSvc.courseDetails = res.result.courseDetails
        }

        if (!this.commentData) {
          this.commentData = res.result
        } else {
          const existingCommentIds = this.commentData.comments.map(
            (comment: any) => comment.commentId
          )

          const filteredNewComments = newComments.filter(
            (comment: any) => !existingCommentIds.includes(comment.commentId)
          )

          this.commentData.comments.push(...filteredNewComments)
        }

        if (this.commentListOffSet === 0 && !this.isReversed) {
          this.commentData.commentTree.commentTreeData.comments.reverse()
          this.isReversed = true
        }

        this.commentSvc.commentTreeId = ''
        this.commentSvc.commentTreeId = this.commentData.commentTree.commentTreeId
        this.widgetData.newCommentSection.commentTreeData.commentTreeId =
          this.commentData.commentTree.commentTreeId

        if (
          this.widgetData.commentsList.repliesSection &&
          this.widgetData.commentsList.repliesSection.newCommentReply
        ) {
          this.widgetData.commentsList.repliesSection.newCommentReply.commentTreeData.commentTreeId =
            this.commentData.commentTree.commentTreeId
        }

        this.widgetData.newCommentSection.commentTreeData.isFirstComment = false
      }

      if (res && (res.code === 'NOT_FOUND' || !res.result.commentCount)) {
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = true
      }

      this.loadingMore = false

    },
      () => {
        this.loadingMore = false

      }
    )
  }

  getReplies(comment: any) {
    let replies = []
    if (comment && comment.children) {
      // replies =  comment.children.map((child: any) => this.commentData.comments.find((c: any) => c.commentId === child.commentId))
      replies = comment.children.map((ele: any) => ele.commentId)
    }
    return replies
  }

  getComment(comment: any) {
    if (comment && comment.commentId) {
      return this.commentData.comments.find((c: any) => c.commentId === comment.commentId)
    }
  }

  isCommentPresent(commentId: any) {
    if (commentId) {
      const comment = this.commentData.comments.find((c: any) => c.commentId === commentId)
      return comment ? true : false
    }
    return false
  }

  get getHierarchyPath() {
    this.commentSvc.enrolledContent = this.widgetData.enrolledContent
    return []
  }

  refreshComments(_event: any) {
    this.commentListOffSet = 0
    if (_event.response
      && _event.response.commentTree
      && _event.response.commentTree.commentTreeId) {
      this.fetchInitialComments_v2(_event.response.commentTree.commentTreeId, true)
    }
  }

  updateRepliesData(_event: any) {
    //
  }

  likeUnlikeEvent(event: any) {

    // this.commentSvc.checkIfUserlikedUnlikedComment(event.commentId, event.commentId).subscribe(res => {
    //   if (res.result && Object.keys(res.result).length > 0) {
    //     this.likeUnlikeCommentApi('unlike', event.commentId)
    //   } else {
    //     this.likeUnlikeCommentApi('like', event.commentId)
    //   }
    // })
    if (this.userLikedComments.includes(event.commentId)) {
      this.likeUnlikeCommentApi('dislike', event.commentId)
    } else {
      this.likeUnlikeCommentApi('like', event.commentId)
    }
  }

  likeUnlikeCommentApi(flag: string, commentId: string) {
    const payload = {
      commentId,
      flag,
      userId: this.loogedInUserProfile.userId,
      courseId: this.commentSvc.entityId
    }
    this.commentSvc.likeUnlikeComment(payload).subscribe(res => {
      if (res.responseCode === 'OK') {
        this.emptySearch()
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const comment = this.commentData.comments.find((comm: any) => comm.commentId === commentId)
        if (flag === 'like') {
          comment.commentData.like = comment.commentData.like ? comment.commentData.like + 1 : 1
          this.userLikedComments.push(commentId)
        } else {
          comment.commentData.like = comment.commentData.like - 1
          const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          this.userLikedComments.splice(index, 1)
        }
      }
    })
  }

  loadMoreComments() {
    this.commentListOffSet = this.commentListOffSet + 1
    this.fetchInitialComments_v2Addmore(this.widgetData.newCommentSection.commentTreeData.commentTreeId)
  }

  ngOnDestroy(): void {
    this.widgetData = null
  }

  emptySearch() {
    this.commentSvc.emptyCommentSearch().subscribe((_res: any) => { })
  }

}
