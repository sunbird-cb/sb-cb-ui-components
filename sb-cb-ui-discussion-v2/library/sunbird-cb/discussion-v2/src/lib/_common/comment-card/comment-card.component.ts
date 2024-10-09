import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'

@Component({
  selector: 'd-v2-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.ICommentCardConfig
  @Input() comment!: any
  @Input() replyData = []
  @Input() hierarchyPath = []
  @Output() newReply = new EventEmitter<any>()

  data = {
    replyToggle: false,
  }

  constructor() { }

  ngOnInit() {
  }

  get getHierarchyPath() {
    return [...this.hierarchyPath, this.comment.commentId]
  }

  newComment(event: any) {
    this.newReply.emit({ response: event.response, type: 'reply' })
  }

}
