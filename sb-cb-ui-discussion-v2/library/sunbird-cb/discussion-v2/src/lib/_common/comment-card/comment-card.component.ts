import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { CommentsService } from '../../_services/comments.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { escapeHtml } from '../../_utils/sanitization.util'

// tslint:disable-next-line
import _ from 'lodash'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FlagDialogueComponent } from '../../_shared/flag-dialogue/flag-dialogue.component'
import { ConfirmDialogueComponent } from '../../_shared/confirm-dialogue/confirm-dialogue.component'


@Component({
  selector: 'd-v2-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit, OnChanges {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.ICommentCardConfig
  @Input() comment!: any
  @Input() replyData: any[] = []
  @Input() hierarchyPath = []
  @Input() userLikedComments: any = []
  @Input() replyParendtData: any = []
  @Input() commentUsersData: any = {}
  @Output() newReply = new EventEmitter<any>()
  @Output() likeUnlikeData = new EventEmitter<any>()

  @Input() tagUserData: any = {}
  reportPending = false
  showEmojiPicker = false

  data = {
    replyToggle: false,
  }
  replyDataCopy: any[] = []
  fetchedReplyData: any = []
  loogedInUserProfile: any = {}
  loading = false
  isEditMode: boolean = false
  editCommentData: any = ''
  replayCommentsCount: any = 10
  flagSelectionList = [
    // "Sexual content",
    // "Violent or repulsive content",
    // "Hateful or abusive content",
    // "Harassment or bullying",
    // "Harmful or dangerous acts",
    // "Misinformation",
    // "Child abuse",
    // "Promotes terrorism",
    // "Spam or misleading",
    // "Others"
  ]

  // Mention tracking
  @ViewChild('description') descriptionTextarea!: ElementRef<HTMLTextAreaElement>
  showMentionDropdown = false;
  mentionDropdownPosition = { top: 0, left: 0 };
  rootOrgId = ''
  mentionUsers: any[] = [];
  isMentioning = false;
  mentionSearchText = '';
  mentionStartPosition = 0;
  activeMentionIndex = 0;
  isLoadingUsers = false;
  mentionedUsers: any[] = []; // Track mentioned users for API

  constructor(
    public commentSvc: CommentsService,
    private configSvc: ConfigurationsService,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    if (this.configSvc
      && this.configSvc.userProfile
      && this.configSvc.userProfile.rootOrgId) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
  }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.replyDataCopy = [...this.replyData]

  }

  ngOnChanges(_changes: SimpleChanges): void {
    // if (changes.replyData && changes.replyData.currentValue) {
    //   this.replyDataCopy = [...changes.replyData.currentValue]
    // }
  }

  get getHierarchyPath() {
    return [...this.hierarchyPath, this.comment.commentId]
  }

  get getParentHierarchyPath() {
    return [...this.hierarchyPath, this.comment.parentCommentId]
  }

  newComment(event: any) {

    if (event.response && event.response.comment && event.response.comment.commentId) {
      this.loading = true
      this.emptySearch()
      this.replyDataCopy.push(event.response.comment.commentId)
      this.replyDataCopy = this.replyDataCopy.slice()
      this.ref.markForCheck()
      this.getListOfReplies()
      // this.newReply.emit({ response: event.response, type: 'reply', replyData: this.replyDataCopy })
    }
  }

  viewMoreOrLess(item: any) {
    if (item.comment.length > 152) {
      item.expanded = !item.expanded
    }
  }

  expandReplyComment() {
    this.data.replyToggle = !this.data.replyToggle
    if (this.data.replyToggle && this.replyData.length) {
      this.loading = true
      this.replayCommentsCount = 10
      this.getListOfReplies()
    }
  }

  getListOfReplies() {
    let reveseReplayDataCopy = [...this.replyDataCopy]
    reveseReplayDataCopy.reverse()
    let ids: any = reveseReplayDataCopy.slice(0, 10)
    this.commentSvc.getListOfCommentsById(ids).subscribe(res => {
      this.loading = false
      if (res.result && res.result.comments.length) {
        let taggedUsersList = res.result.taggedUsers
        this.tagUserData = { ...this.tagUserData, ..._.keyBy(taggedUsersList, 'user_id') }
        const reply = res.result.comments
        // parrent comment id is user for sencond level comments only
        const replayModified = reply.map((replayData: any) => ({ ...replayData, parentCommentId: this.comment.parentCommentId || this.comment.commentId }))
        this.fetchedReplyData = [...replayModified,]
        this.newReply.emit({ response: [], type: 'reply', replyDataCopy: this.replyDataCopy, replyData: this.fetchedReplyData })
        if (res.result && res.result.users && res.result.users.length) {
          let commentUsersDataObj = res.result.users
          this.commentUsersData = { ...this.commentUsersData, ..._.keyBy(commentUsersDataObj, 'user_id') }
        }
      }
    },
      () => {
        this.loading = false
      })
  }

  reportComment(flagDetails: any) {
    this.reportPending = true
    let requestData: any = {
      "commentId": this.comment.commentId
    }
    requestData = { ...requestData, ...flagDetails }

    this.commentSvc.reportComment(requestData).subscribe(res => {
      if (res && res.responseCode === 'OK') {
        this.loading = false
        this.emptySearch()
      }
      this.reportPending = false
      this.comment = res.result
      this._snackBar.open(_.get(this.cardConfig, 'reportIcon.successMsg') || 'Reported successfully! Thank you for reporting.')
    },
      () => {
        this._snackBar.open(_.get(this.cardConfig, 'reportIcon.errorMsg') || 'Something went wrong! please try reporting again later.')
        this.reportPending = false
        this.loading = false
      })
  }

  likeUnlikeComment(comment: any) {
    this.likeUnlikeData.emit(comment)
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
      flag,
      commentId,
      userId: this.loogedInUserProfile.userId,
      courseId: this.commentSvc.entityId
    }
    this.commentSvc.likeUnlikeComment(payload).subscribe(res => {
      if (res.responseCode === 'OK') {
        this.emptySearch()
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const comment = this.fetchedReplyData.find((comm: any) => comm.commentId === commentId)
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

  openFlagDialogue(comment: any) {
    this.getAllFlagList(comment)
    // const confirmDialog = this.dialog.open(FlagDialogueComponent, {
    //   width: '600px',
    //   panelClass: 'flag-dialog',
    //   backdropClass: 'flag-dialog-backdrop',
    //   data: { comment, flagSelectionList: this.flagSelectionList },
    // })
    // confirmDialog.afterClosed().subscribe((result: any) => {
    //   if (result) {
    //   }
    // })
  }

  getAllFlagList(comment: any) {
    this.commentSvc.fetchAllFlags().subscribe((res: any) => {
      if (res && res.result
        && res.result.response
        && res.result.response.value
        && res.result.response.value.length) {
        this.flagSelectionList = res.result.response.value
        const confirmDialog = this.dialog.open(FlagDialogueComponent, {
          width: '600px',
          panelClass: 'flag-dialog',
          backdropClass: '',
          data: { comment, flagSelectionList: this.flagSelectionList },
        })
        confirmDialog.afterClosed().subscribe((result: any) => {
          if (result) {
            this.emptySearch()
            this.reportComment(result)
          }
        })
      }
    })
  }
  openDeleteDialogue(comment: any) {
    const confirmDialog = this.dialog.open(ConfirmDialogueComponent, {
      width: '600px',
      panelClass: 'flag-dialog',
      backdropClass: '',
      data: {
        comment,
        flagSelectionList: this.flagSelectionList
      },
    })
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteCommentMethod(comment)
        this.emptySearch()
      }
    })

  }
  deleteCommentMethod(comment: any) {
    const index = this.replyData.findIndex((commentId: any) => commentId === comment.commentId)
    const parentInderx = this.replyData.findIndex((ele: any) => ele.commentId === comment.commentId)
    if (index !== -1) {
      this.replyData.splice(index, 1)
      this.replyData = this.replyData.slice()
      this.replyDataCopy = this.replyData
    }
    if (parentInderx !== -1) {
      this.replyParendtData.splice(parentInderx, 1)
      this.replyParendtData = this.replyParendtData.slice()
    }
    this.newReply.emit({ response: [], type: 'reply', replyDataCopy: this.replyDataCopy, replyData: this.replyParendtData, onlyDeleteCount: true })
    this.commentSvc.deleteComment(comment.commentId, this.commentSvc.entityType, this.commentSvc.entityId, this.commentSvc.workflow, comment.parentCommentId || '').subscribe((_res: any) => {
      comment.status = 'inactive'
      this._snackBar.open('Comment deleted successfully')
    }, (_err: any) => {
      this._snackBar.open('Something went wrong! please try again later.')
    })
  }

  toggelEdit(commentData: any) {
    this.editCommentData = {}
    this.editCommentData = { ...commentData }
    console.log(this.editCommentData)
    this.mentionedUsers = this.editCommentData.mentionedUsers
    console.log(this.mentionedUsers)
    this.isEditMode = true
    this.replayCommentsCount = this.replayCommentsCount + 10
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker
  }
  onFocus() {
    this.showEmojiPicker = false
  }
  addEmoji(event: any) {
    const text = `${this.editCommentData.comment}${event.emoji.native}`
    this.editCommentData['comment'] = text
  }

  getMentionedUsers(text: string) {
    const mentions = this.extractMentions(text)
    const users: any = []
    mentions.forEach(mention => {
      const username = mention.substring(1)
      const user = this.mentionedUsers.find(u => u.userName === username)
      if (user && user.userId) {
        users.push({
          userId: user.userId,
          userName: user.userName
        })
      }
    })
    return users
  }

  extractMentions(text: string): string[] {
    if (!text) {
      return []
    }
    const mentionRegex = /@\w+/g
    return text.match(mentionRegex) || []
  }

  updateComment() {
    const mentions = this.getMentionedUsers(this.editCommentData.comment)
    let requestData: any = {
      "commentTreeId": this.commentSvc.commentTreeId,
      "commentId": this.comment.commentId,
      "commentData": {
        "comment": this.editCommentData.comment,
        "commentResolved": this.editCommentData.commentResolved,
        "commentSource": this.editCommentData.commentSource,
        "taggedUsers": this.editCommentData.taggedUsers
      }
    }
    if (mentions.length > 0) {
      requestData.commentData['mentionedUsers'] = mentions
    }
    this.commentSvc.updateComment(requestData).subscribe((_res: any) => {
      this.isEditMode = false
      this.emptySearch()
      this.comment['lastUpdatedDate'] = new Date().toISOString()
      this.comment['commentData'] = this.editCommentData
      this._snackBar.open('Comment Updated successfully.')
    }, () => {
      this._snackBar.open('Comment Updated failed.')
    })
  }

  cancelComment() {
    this.isEditMode = false
    this.editCommentData
  }

  updateRepliesData(eventData: any) {
    this.replyDataCopy = eventData.replyDataCopy
    this.fetchedReplyData = [...eventData.replyData]
    return this.fetchedReplyData
  }
  loadMoreComments() {
    this.replayCommentsCount = this.replayCommentsCount + 10
    this.loadMoreReplies()
  }

  loadMoreReplies() {
    let start: number = this.replayCommentsCount - 10
    let reveseReplayDataCopy = [...this.replyDataCopy]
    reveseReplayDataCopy.reverse()
    let ids: any = reveseReplayDataCopy.slice(start, this.replayCommentsCount)

    this.commentSvc.getListOfCommentsById(ids).subscribe(res => {
      if (res.result && res.result.comments.length) {
        let taggedUsersList = res.result.taggedUsers
        this.tagUserData = { ...this.tagUserData, ..._.keyBy(taggedUsersList, 'user_id') }
        const reply = res.result.comments
        // parrent comment id is user for sencond level comments only
        const replayModified = reply.map((replayData: any) => ({ ...replayData, parentCommentId: this.comment.parentCommentId || this.comment.commentId }))
        this.fetchedReplyData = [...this.fetchedReplyData, ...replayModified]
        this.newReply.emit({ response: [], type: 'reply', replyDataCopy: this.replyDataCopy, replyData: this.fetchedReplyData })
        if (res.result && res.result.users && res.result.users.length) {
          let commentUsersDataObj = res.result.users
          this.commentUsersData = { ...this.commentUsersData, ..._.keyBy(commentUsersDataObj, 'user_id') }
        }
        this.loading = false
      }
    },
      () => {
        this.loading = false
      })
  }
  getCommentMsg(taggedUsers: any, commentText: any): string {
    let users: any = ''
    let replayData = ``
    if (taggedUsers && taggedUsers.length) {
      taggedUsers.forEach((tagUser: any) => {
        const firstName = this.tagUserData[tagUser]?.first_name
        if (firstName) users = users + firstName
      })
    }
    
    // Sanitize both users and commentText to prevent XSS
    const sanitizedUsers = escapeHtml(users)
    const sanitizedCommentText = escapeHtml(commentText)
    
    if (users) {
      replayData = `<span class="mr-2 font-semibold ws-mat-default-text">Replying to ${sanitizedUsers}</span>`
    }
    
    return replayData + sanitizedCommentText
  }
  emptySearch() {
    this.commentSvc.emptyCommentSearch().subscribe((_res: any) => { })
  }

  handleInput(event: Event): void {
    console.log('Input event:', event)
    if (this.descriptionTextarea?.nativeElement) {
      this.checkForMention()
    }
  }

  checkForMention(): void {
    if (!this.descriptionTextarea?.nativeElement) {
      return
    }
    const textarea = this.descriptionTextarea.nativeElement
    const text = textarea.value
    const cursorPosition = textarea.selectionStart

    // Find the start of the current word
    let startPos = cursorPosition
    while (startPos > 0 && text[startPos - 1] !== ' ' && text[startPos - 1] !== '\n') {
      startPos--
    }

    // Check if the current word starts with @
    if (startPos < cursorPosition && text[startPos] === '@') {
      const searchText = text.substring(startPos + 1, cursorPosition)

      if (!this.isMentioning) {
        this.isMentioning = true
        this.mentionStartPosition = startPos
        this.activeMentionIndex = 0
      }

      if (this.mentionSearchText !== searchText) {
        this.mentionSearchText = searchText
        this.searchUsers(searchText)
      }

      // Position the dropdown below the @ symbol
      this.positionMentionDropdown()
    } else {
      this.closeMentionDropdown()
    }
  }

  positionMentionDropdown(): void {
    const textarea = this.descriptionTextarea.nativeElement

    // Create a temporary element to calculate position
    const tempElement = document.createElement('div')
    tempElement.style.position = 'absolute'
    tempElement.style.visibility = 'hidden'
    tempElement.style.whiteSpace = 'pre-wrap'
    tempElement.style.width = textarea.clientWidth + 'px'
    tempElement.style.font = window.getComputedStyle(textarea).font
    tempElement.style.lineHeight = window.getComputedStyle(textarea).lineHeight
    tempElement.style.padding = window.getComputedStyle(textarea).padding

    // Add text up to cursor
    tempElement.textContent = textarea.value.substring(0, this.mentionStartPosition)

    // Add a span where the @ is to get position
    const atSpan = document.createElement('span')
    atSpan.textContent = '@'
    tempElement.appendChild(atSpan)

    document.body.appendChild(tempElement)

    // Get position of the @ character
    const rect = atSpan.getBoundingClientRect()
    const textareaRect = textarea.getBoundingClientRect()

    // Calculate position relative to textarea
    this.mentionDropdownPosition = {
      top: rect.bottom - textareaRect.top + 5,
      left: rect.left - textareaRect.left
    }

    // Clean up
    document.body.removeChild(tempElement)

    // Show dropdown
    this.showMentionDropdown = true
  }

  closeMentionDropdown(): void {
    this.showMentionDropdown = false
    this.isMentioning = false
    this.mentionSearchText = ''
  }

  searchUsers(query: string): void {
    this.isLoadingUsers = true

    // Call your API to search users
    this.commentSvc.searchUsers(query).subscribe(
      (data: any) => {
        this.isLoadingUsers = false
        if (data.result && data.result.response) {
          const users = data.result.response.content
          this.mentionUsers = users.map((user: any) => ({
            userId: user.userId,
            userName: `${user.userName}`,
          }))
        } else {
          this.mentionUsers = []
        }
      },
      (error) => {
        console.error('Error fetching users for mention:', error)
        this.isLoadingUsers = false
        this.mentionUsers = []
      }
    )
  }

  selectMention(user: any): void {
    const textarea = this.descriptionTextarea.nativeElement
    const originalValue = textarea.value
    // Add the selected user to mentioned users list for tracking
    if (!this.mentionedUsers.find(_user => _user && _user.userId === user.userId)) {
      this.mentionedUsers.push({
        userId: user.userId,
        userName: user.userName
      })
      // Replace the @query with @username
      const beforeMention = originalValue.substring(0, this.mentionStartPosition)
      const afterMention = originalValue.substring(textarea.selectionStart)
      const mentionText = `@${user.userName}`

      // Set new value
      const newValue = beforeMention + mentionText + afterMention

      // Update form control value
      this.editCommentData.comment = newValue
      textarea.value = newValue
      // Set cursor position after the inserted mention
      setTimeout(() => {
        textarea.focus()
        const newCursorPosition = this.mentionStartPosition + mentionText.length
        textarea.setSelectionRange(newCursorPosition, newCursorPosition)
      })
      // Close dropdown
      this.closeMentionDropdown()
    } else {
      //this._snackBar.open(`You have already tagged ${user.userName}`)
    }
  }

  onTextareaKeyUp(event: KeyboardEvent): void {
    // Handle navigation in mention dropdown
    if (this.showMentionDropdown) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.activeMentionIndex = Math.min(this.activeMentionIndex + 1, this.mentionUsers.length - 1)
          return
        case 'ArrowUp':
          event.preventDefault()
          this.activeMentionIndex = Math.max(this.activeMentionIndex - 1, 0)
          return
        case 'Enter':
          event.preventDefault()
          if (this.mentionUsers.length > 0) {
            this.selectMention(this.mentionUsers[this.activeMentionIndex])
          }
          return
        case 'Escape':
          event.preventDefault()
          this.closeMentionDropdown()
          return
      }
    }
  }
}
