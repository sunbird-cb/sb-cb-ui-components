import { Component, Input, OnInit } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { DiscussionV2Service } from '../../_services/discussion-v2.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'd-v2-widget-comment',
  templateUrl: './widget-comment.component.html',
  styleUrls: ['./widget-comment.component.scss'],
})
export class WidgetCommentComponent implements OnInit {
  commentData!: any
  loading = false
  entityId = ''
  @Input() widgetData!: NsDiscussionV2.ICommentWidgetData
  commentTreeId = ''
  loogedInUserProfile: any = {}
  commentListLimit = 20
  commentListOffSet = 0
  commentsLength = 0
  isReversed = false
  constructor(
    private discussV2Svc: DiscussionV2Service,  private configSvc: ConfigurationsService, private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // this.fetchInitialComments()
    this.loogedInUserProfile = this.configSvc.userProfile
    this.fetchInitialComments_v2()
  }

  fetchInitialComments() {
    this.loading = true
    this.entityId = this.widgetData.newCommentSection.commentTreeData.entityId || ''
    const entityType = this.widgetData.newCommentSection.commentTreeData.entityType || ''
    const workflow = this.widgetData.newCommentSection.commentTreeData.workflow || ''
    this.discussV2Svc.fetchAllComment(entityType, this.entityId, workflow).subscribe(res => {
      // tslint:disable-next-line: no-console
      console.log('fetchAllComment Response', res)
      this.loading = false
      if (res && res.commentCount) {
        this.commentData = res
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
    },                                                                               (err: any) => {
      this.loading = false
      // tslint:disable-next-line: no-console
      console.error('Error in fetching all comments', err)
    })
  }

  fetchInitialComments_v2(commentTreeId?: string) {
    this.loading = true
    this.entityId = this.widgetData.newCommentSection.commentTreeData.entityId || ''
    const entityType = this.widgetData.newCommentSection.commentTreeData.entityType || ''
    const workflow = this.widgetData.newCommentSection.commentTreeData.workflow || ''

    const payload = {
      entityType,
      workflow,
      commentTreeId: commentTreeId || '',
      entityId: this.entityId,
      limit: this.commentListLimit,
      offset: this.commentListOffSet,
    }

    this.discussV2Svc.fetchAllComment_V2(payload).subscribe(res => {
      // tslint:disable-next-line: no-console
      this.loading = false
      if (res && res.result.commentCount) {
        this.commentData = res.result
        this.commentsLength = this.commentData.commentTree.commentTreeData.comments.length || 0

        this.commentData.commentTree.commentTreeData.comments.reverse()

        this.widgetData.newCommentSection.commentTreeData.commentTreeId = this.commentData.commentTree.commentTreeId
        if (this.widgetData.commentsList.repliesSection && this.widgetData.commentsList.repliesSection.newCommentReply) {
          // tslint:disable-next-line:max-line-length
          this.widgetData.commentsList.repliesSection.newCommentReply.commentTreeData.commentTreeId = this.commentData.commentTree.commentTreeId
        }
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = false
      }
      if (res && res.code === 'Not Found' || !res.result.commentCount) {
        this.widgetData.newCommentSection.commentTreeData.isFirstComment = true
      }
    },                                                      (err: any) => {
      this.loading = false
      // tslint:disable-next-line: no-console
      console.error('Error in fetching all comments', err)
    })
  }

  fetchInitialComments_v2Addmore(commentTreeId?: string) {
    this.loading = true
    this.entityId = this.widgetData.newCommentSection.commentTreeData.entityId || ''
    const entityType = this.widgetData.newCommentSection.commentTreeData.entityType || ''
    const workflow = this.widgetData.newCommentSection.commentTreeData.workflow || ''

    const payload = {
      workflow,
      entityType,
      commentTreeId: commentTreeId || '',
      entityId: this.entityId,
      limit: this.commentListLimit,
      offset: this.commentListOffSet,
    }

    this.discussV2Svc.fetchAllComment_V2(payload).subscribe(res => {
        this.loading = false

        if (res && res.result.commentCount) {
          const newComments = res.result.comments

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

        if (res && (res.code === 'Not Found' || !res.result.commentCount)) {
          this.widgetData.newCommentSection.commentTreeData.isFirstComment = true
        }
      },                                                    (err: any) => {
        this.loading = false
        // tslint:disable-next-line: no-console
        console.error('Error in fetching all comments', err)
      }
    )
  }

  getReplies(comment: any) {
    let replies = []
    if (comment && comment.children) {
      // replies =  comment.children.map((child: any) => this.commentData.comments.find((c: any) => c.commentId === child.commentId))
      replies =  comment.children.map((ele: any) => ele.commentId)
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
    return []
  }

  refreshComments(_event: any) {
    this.commentListOffSet = 0
    this.fetchInitialComments_v2(_event.response.commentTree.commentTreeId)
  }

  likeUnlikeEvent(event: any) {

    this.discussV2Svc.checkIfUserlikedUnlikedComment(event.commentId, event.commentId).subscribe(res => {
      if (res.result && Object.keys(res.result).length > 0) {
        this.likeUnlikeCommentApi('unlike', event.commentId)
      } else {
        this.likeUnlikeCommentApi('like', event.commentId)
      }
    })

  }

  likeUnlikeCommentApi(flag: string, commentId: string) {
    const payload = {
      commentId,
      flag,
      userId: this.loogedInUserProfile.userId,
    }
    this.discussV2Svc.likeUnlikeComment(payload).subscribe(res => {
      // console.log(res, 'likeResponse')
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const comment = this.commentData.comments.find((commentEle: any) => commentEle.commentId === commentId)
        if (flag === 'like') {
          comment.like = comment.like ? comment.like + 1 : 1
        } else {
          comment.like = comment.like - 1
        }
      }
    })
  }

  loadMoreComments() {
    this.commentListOffSet = this.commentListOffSet + 1
    this.fetchInitialComments_v2Addmore(this.widgetData.newCommentSection.commentTreeData.commentTreeId)
  }

}
