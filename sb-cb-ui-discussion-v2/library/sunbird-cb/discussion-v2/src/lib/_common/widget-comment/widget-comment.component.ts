import { Component, Input, OnInit } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { DiscussionV2Service } from '../../_services/discussion-v2.service'

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

  constructor(
    private discussV2Svc: DiscussionV2Service
  ) { }

  ngOnInit() {
    this.fetchInitialComments()
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

  getReplies(comment: any) {
    let replies = []
    if (comment && comment.children) {
      replies =  comment.children.map((child: any) => this.commentData.comments.find((c: any) => c.commentId === child.commentId))
    }
    return replies
  }

  getComment(comment: any) {
    if (comment && comment.commentId) {
      return this.commentData.comments.find((c: any) => c.commentId === comment.commentId)
    }
  }

  get getHierarchyPath() {
    return []
  }

  refreshComments(_event: any) {
    this.fetchInitialComments()
  }

}
