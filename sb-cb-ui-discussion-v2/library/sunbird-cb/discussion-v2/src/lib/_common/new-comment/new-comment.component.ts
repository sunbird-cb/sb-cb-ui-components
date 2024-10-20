import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { DiscussionV2Service } from '../../_services/discussion-v2.service'

@Component({
  selector: 'd-v2-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
})
export class NewCommentComponent implements OnInit {
  @Input() config!: NsDiscussionV2.INewCommentConfig
  @Input() hierarchyPath = []
  @Output() newComment = new EventEmitter<any>()

  searchControl = new FormControl('')
  loogedInUserProfile: any = {}

  constructor(
    private configSvc: ConfigurationsService,
    private discussV2Svc: DiscussionV2Service
  ) { }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
  }

  submitComment() {
    const req = this.createReq(this.searchControl.value, [])
    if (this.config.commentTreeData && this.config.commentTreeData.isFirstComment) {
      this.discussV2Svc.addFirstComment(req).subscribe(res => {
        this.performSuccessEvents(res)
      },                                               (err: any) => {
        // tslint:disable-next-line: no-console
        console.error('Error in posting, please try again later!', err)
      })
    } else {
      this.discussV2Svc.addNewComment(req).subscribe(res => {
        this.performSuccessEvents(res)
      },                                             (err: any) => {
        // tslint:disable-next-line: no-console
        console.error('Error in posting, please try again later!', err)
      })
    }

  }

  createReq(comment: string, files: string[]) {
    let commentData = {}
    let commentTreeData = {}
    let commentTreeId = ''
    let hierarchyPath: any = []
    if (this.loogedInUserProfile) {
      commentData = {
        comment,
        file: files,
        commentSource: {
          userId: this.loogedInUserProfile.userId,
          userPic: this.loogedInUserProfile.profileImageUrl || this.loogedInUserProfile.firstName.splice(0, 2),
          userName: this.loogedInUserProfile.firstName,
          userRole: 'public', // TODO: replace original roles array
        },
      }
    }
    if (this.config.commentTreeData && this.config.commentTreeData.isFirstComment) {
      commentTreeData =  {
        entityType: this.config.commentTreeData.entityType,
        entityId: this.config.commentTreeData.entityId,
        workflow: this.config.commentTreeData.workflow,
      }
    } else {
      commentTreeId =  this.config.commentTreeData.commentTreeId
      hierarchyPath = this.hierarchyPath
    }
    return {
      ...(commentTreeId ? { commentTreeId } : null),
      ...(hierarchyPath && hierarchyPath.length > 0 ? { hierarchyPath } : null),
      ...(Object.keys(commentTreeData).length > 0 ? { commentTreeData }  : null),
      commentData,
    }
  }

  performSuccessEvents(res: any) {
    this.newComment.emit({ response: res, type: 'comment' })
    this.searchControl.setValue('')
  }

}
