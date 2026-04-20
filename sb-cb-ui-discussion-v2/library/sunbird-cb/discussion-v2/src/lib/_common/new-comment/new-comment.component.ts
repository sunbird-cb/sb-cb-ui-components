import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { UntypedFormControl } from '@angular/forms'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { CommentsService } from '../../_services/comments.service'
import { sanitizeTextInput } from '../../_utils/sanitization.util'

@Component({
  selector: 'd-v2-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
})
export class NewCommentComponent implements OnInit, OnDestroy {
  @Input() config!: NsDiscussionV2.INewCommentConfig
  @Input() hierarchyPath = []
  @Input() taggedUsers = []
  @Output() newComment = new EventEmitter<any>()
  @Input() disableActions: boolean = false

  addNewCommentBool: Boolean = false
  searchControl = new UntypedFormControl('')
  loogedInUserProfile: any = {}
  loggedInUserData: any = {}
  showEmojiPicker = false
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
  previousText: string = ''

  constructor(
    private configSvc: ConfigurationsService,
    public commentSvc: CommentsService
  ) {
    if (this.configSvc
      && this.configSvc.userProfile
      && this.configSvc.userProfile.rootOrgId) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
  }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.loggedInUserData = this.configSvc.unMappedUser
  }

  submitComment() {

    const sanitizedComment = sanitizeTextInput(this.searchControl.value)
    const req = this.createReq(sanitizedComment, [])
    if (!this.addNewCommentBool) {
      this.addNewCommentBool = true
      if (this.config.commentTreeData && this.config.commentTreeData.isFirstComment) {
        this.commentSvc.addFirstComment(req).subscribe(res => {
          this.addNewCommentBool = false
          this.performSuccessEvents(res)
          this.mentionedUsers = []
        }, (err: any) => {
          // tslint:disable-next-line: no-console
          console.error('Error in posting, please try again later!', err)
          this.addNewCommentBool = false
        })
      } else {
        this.commentSvc.addNewComment(req).subscribe(res => {
          this.addNewCommentBool = false
          this.performSuccessEvents(res)
          this.mentionedUsers = []
        }, (err: any) => {
          // tslint:disable-next-line: no-console
          console.error('Error in posting, please try again later!', err)
          this.addNewCommentBool = false
        })
      }
    }

  }

  extractMentions(text: string): string[] {
    if (!text) {
      return []
    }
    const mentionRegex = /@\w+/g
    return text.match(mentionRegex) || []
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

  createReq(comment: string, files: string[]) {
    let commentData: any = {}
    let commentTreeData = {}
    let commentTreeId = ''
    let hierarchyPath: any = []
    let designation: any = ''
    let profileStatus = ''
    if (this.loggedInUserData
      && this.loggedInUserData.profileDetails) {
      let profileDetails: any = this.loggedInUserData.profileDetails
      if (profileDetails
        && profileDetails.professionalDetails
        && profileDetails.professionalDetails.length) {
        designation = profileDetails.professionalDetails[0].designation
      }
      profileStatus = profileDetails.profileStatus

    }
    if (this.loogedInUserProfile) {
      commentData = {
        comment,
        file: files,
        commentSource: {
          userId: this.loogedInUserProfile.userId,
          userPic: this.loogedInUserProfile.profileImageUrl || this.loogedInUserProfile.firstName.substring(0, 2),
          userName: this.loogedInUserProfile.firstName,
          profileStatus: profileStatus,
          designation: designation,
          userRole: 'public', // TODO: replace original roles array
        },
        taggedUsers: this.taggedUsers
      }
      const mentions = this.getMentionedUsers(comment)
      if (mentions.length > 0) {
        commentData['mentionedUsers'] = mentions
      }

    }

    if (this.config.commentTreeData && this.config.commentTreeData.isFirstComment) {
      commentTreeData = {
        entityType: this.config.commentTreeData.entityType,
        entityId: this.config.commentTreeData.entityId,
        workflow: this.config.commentTreeData.workflow,
      }
    } else {
      commentTreeId = this.config.commentTreeData.commentTreeId || this.commentSvc.commentTreeId
      hierarchyPath = this.hierarchyPath && this.hierarchyPath.filter(item => item !== undefined && item !== null) || []
    }
    return {
      ...(commentTreeId ? { commentTreeId } : null),
      ...(hierarchyPath && hierarchyPath.length > 0 ? { hierarchyPath } : null),
      ...(Object.keys(commentTreeData).length > 0 ? { commentTreeData } : null),
      commentData,
    }
  }

  performSuccessEvents(res: any) {
    this.newComment.emit({ response: res, type: 'comment' })
    this.searchControl.setValue('')
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker
  }
  addEmoji(event: any) {
    const text = `${this.searchControl.value}${event.emoji.native}`
    this.searchControl.patchValue(text)
  }
  onFocus() {
    this.showEmojiPicker = false
  }

  ngOnDestroy(): void {
    this.config.commentTreeData.commentTreeId = ''
  }

  toggleDisable() {
    if (this.commentSvc && this.commentSvc.enrolledContent) {
      this.searchControl.enable()
    } else {
      this.searchControl.disable()
    }
  }

  get canShowSection(): boolean {
    if (this.config?.show || this.config?.showTopInfo) return true
    return false
  }

  handleInput(event: Event): void {
    console.log('Input event:', event)
    if (this.descriptionTextarea?.nativeElement) {
      const currentText = this.descriptionTextarea.nativeElement.value
      // Check for deleted mentions before processing new ones
      this.checkForDeletedMentions(currentText)
      this.checkForMention()
    }

  }

  checkForDeletedMentions(currentText: string): void {
    const currentMentions = this.extractMentions(currentText)
    const previousMentions = this.extractMentions(this.previousText)
    const deletedMentions = previousMentions.filter(mention => !currentMentions.includes(mention))
    deletedMentions.forEach(deletedMention => {
      const username = deletedMention.substring(1) // Remove @ symbol
      const userIndex = this.mentionedUsers.findIndex(user => user.userName === username)
      if (userIndex !== -1) {
        this.mentionedUsers.splice(userIndex, 1)
      }
    })
    this.checkForPartiallyDeletedMentions(currentMentions)
  }

  checkForPartiallyDeletedMentions(currentMentions: string[]): void {
    this.mentionedUsers = this.mentionedUsers.filter(user => {
      const userMention = `@${user.userName}`
      const stillExists = currentMentions.includes(userMention)
      if (!stillExists) {
        return false
      }
      return true
    })
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
          this.previousText = ''
        }
      },
      (error) => {
        console.error('Error fetching users for mention:', error)
        this.isLoadingUsers = false
        this.mentionUsers = []
        this.previousText = ''
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
      this.searchControl?.setValue(newValue)

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
}
