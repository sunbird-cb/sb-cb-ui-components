import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors, FormControl } from '@angular/forms'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatChipInputEvent } from '@angular/material/chips'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  type EditorConfig,
  ClassicEditor,
  Autosave,
  BlockQuote,
  Bold,
  Code,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  Mention,
  Paragraph,
  RemoveFormat,
  SpecialCharacters,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline,
  WordCount,
  MentionFeed
} from 'ckeditor5'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { DiscussionV2Service } from '../../_services/discussion-v2.service'
// tslint:disable-next-line
import _ from 'lodash'
import { MatSnackBar } from '@angular/material/snack-bar'
import { map, startWith } from 'rxjs/operators'
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

interface MentionFeedItem {
  id: string
  userName: string
  userId: string
}
interface ExtendedMentionFeed extends MentionFeed {
  onItemClick?: (item: MentionFeedItem) => { id: string, userId?: string, userName: string }
}

@Component({
  selector: 'd-v2-new-post-dialogue',
  templateUrl: './new-post-dialogue.component.html',
  styleUrls: ['./new-post-dialogue.component.scss']
})
export class NewPostDialogueComponent implements OnInit, OnDestroy {
  widgetData!: any
  uploadForm: FormGroup
  selectedFilesFinal: any = {}
  selectedTags: string[] = [];
  linkInput: any
  uploadControlVisibility: any = {
    document: false,
    image: false,
    link: false
  }
  // mediaUrls: string[] = [];
  categoryType: string[] = []
  mediaCategory: any = {}
  previewCategory: any = {}
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  postPreview: any = {
    // title: '',
    description: '',
    createdOn: new Date(),
    files: [],
    tags: [],
    createdBy: {},
    categoryType: [],
    mediaCategory: {},
    previewCategory: {}
  }
  public Editor = ClassicEditor;
  public editorConfig: EditorConfig = {};
  loaderMsg = 'Please wait...'
  environment: any
  loading: boolean = false
  showEmojiPicker: boolean = false
  @ViewChild('imageUpload', { static: false }) imageUpload!: ElementRef
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef

  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  private readonly MAX_DOC_SIZE = 50 * 1024 * 1024;   // 50MB in bytes
  public readonly MAX_TOTAL_FILES = 10;
  communityInfoText = "Select a community you’ve joined to start posting. You can only post in communities where you're a member."
  isGlobal = false

  communityCtrl = new FormControl('', [Validators.required, this.validCommunityValidator()]);
  filteredCommunities: any = [];
  originalCommunities: any = [
    // {value: 'community1', label: 'Community 1'},
    // {value: 'community2', label: 'Community 2'},
    // {value: 'community2', label: 'christy'},
    // {value: 'community2', label: 'david'},
    // {value: 'community2', label: 'Nathan'}

  ];

  mentionedUsers: Array<{ userId: string, userName: string }> = []
  apiResponse: any
  rootOrgId = ''
  allUsers: any[] = []
  allProccessedUsers: any[] = []

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewPostDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private discussV2Svc: DiscussionV2Service,
    @Inject('environment') environment: any,
    private _snackBar: MatSnackBar,
    private enrollSvc: UserEnrollCommunityService,
    private configSvc: ConfigurationsService,
  ) {

    if (this.configSvc
      && this.configSvc.userProfile
      && this.configSvc.userProfile.rootOrgId) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
    this.editorConfig = {
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'blockQuote',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'fontSize',
          'fontFamily',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'outdent',
          'indent',
          'strikethrough',
          'subscript',
          'superscript',
          'code',
          'removeFormat',
          'highlight',
          '|',
          'specialCharacters',
          'insertTable',
        ],
        shouldNotGroupWhenFull: false
      },
      plugins: [
        Autosave,
        BlockQuote,
        Bold,
        Code,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        Heading,
        Highlight,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        Mention,
        Paragraph,
        RemoveFormat,
        SpecialCharacters,
        Strikethrough,
        Subscript,
        Superscript,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        Underline,
        WordCount
      ],
      fontFamily: {
        supportAllValues: true
      },
      fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true
      },
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph'
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1'
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2'
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3'
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4'
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5'
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6'
          }
        ]
      },
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          // toggleDownloadable: {
          // 	mode: 'manual',
          // 	label: 'Downloadable',
          // 	attributes: {
          // 		download: 'file'
          // 	}
          // }
        }
      },
      placeholder: 'What do you want to say?',
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
      },
      typing: {
        transformations: {
          include: []  // This prevents auto-transformations that might bypass our length check
        }
      },
      mention: {
        feeds: [
          {
            marker: '@',
            feed: this.getUsers.bind(this),
            minimumCharacters: 1,
            //itemRenderer: this.customItemRenderer,
            onItemClick: this.handleMentionClick.bind(this)
          } as ExtendedMentionFeed,
        ]
      }
    }
    this.widgetData = this.data.config
    this.isGlobal = this.data && this.data.isGlobal || false
    this.uploadForm = this.fb.group({
      community: this.isGlobal ? this.communityCtrl : [''],
      // title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, this.textLengthValidator()]],
      tags: [[]],
      files: [[]]
    })
    this.environment = environment

    if (this.data && this.data.editMode && this.data.post) {
      this.uploadForm.patchValue({
        // title: this.data.post.title,
        // community: this.isGlobal ? this.communityCtrl : [''],
        description: this.data.post.description,
        files: this.data.post.mediaUrls
      })

      if (this.data.mentionedUsers && this.data.mentionedUsers.length) {
        this.allProccessedUsers = this.data.mentionedUsers
        this.allUsers = this.data.mentionedUsers
      }

      // this.selectedFiles = this.data.post.mediaUrls.map((url: string) => ({
      //   name: url.split('/').slice(-1)[0],
      //   uploaded: true
      // }))
      if (this.data.post.mediaCategory && this.data.post.categoryType) {
        this.previewCategory = JSON.parse(JSON.stringify(this.data.post.mediaCategory))
        // this.mediaCategory = {...this.data.post.mediaCategory}
        this.categoryType = [...this.data.post.categoryType]
        this.categoryType.map((cat) => {
          if (this.data.post.mediaCategory[cat]) {
            this.selectedFilesFinal[cat] = this.selectedFilesFinal[cat] || []
            this.selectedFilesFinal[cat] = _.map(this.data.post.mediaCategory[cat] || [], function (url) {
              return {
                name: url.split('/').slice(-1)[0],
                uploaded: true,
                category: cat,
                previewUrl: url,
              }
            })
          }
        })
      }
      this.updatePostPreview(this.uploadForm.value)
    }
    // Set up the filter
    this.communityCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchText = typeof value === 'string' ? value.toLowerCase() : ''
        return this.originalCommunities &&
          this.originalCommunities.length &&
          this.originalCommunities.filter((community: any) =>
            community.communityName.toLowerCase().includes(searchText)
          )
      })
    ).subscribe(filtered => this.filteredCommunities = filtered)

    // Subscribe to form value changes
    this.uploadForm.valueChanges.subscribe(formValue => {
      this.updatePostPreview(formValue)
    })

  }

  async ngOnInit() {
    this.originalCommunities = await this.enrollSvc.getEnrollDataId()
    this.filteredCommunities = [...this.originalCommunities]
    // Set initial user data
    this.postPreview.user = {
      name: this.data.community?.currentUser?.name || '',
      photoUrl: this.data.community?.currentUser?.photoUrl || '',
      // Add other user properties you need
    }


  }

  customItemRenderer(item: any) {
    return `${item}`
  }

  handleMentionClick(eventInfo: MentionFeedItem) {
    const mentionedUser = {
      userId: eventInfo.id,
      userName: eventInfo.userName
    }

    // Add to mentioned users array if not already present
    const existingIndex = this.mentionedUsers.findIndex(user => user.userId === mentionedUser.userId)
    if (existingIndex === -1) {
      this.mentionedUsers.push(mentionedUser)
    }

    // Return the text to be inserted into the editor
    return {
      id: eventInfo.id,
      userName: eventInfo.userName
    }
  }

  getUsers(queryText: string) {
    return new Promise<Array<MentionFeedItem>>((resolve) => {
      // Replace this with your actual API call
      this.discussV2Svc.searchUsers(queryText).subscribe(
        (data: any) => {
          if (data.result && data.result.response) {
            this.apiResponse = data.result.response.content
            // this.allUsers = []
            // this.allProccessedUsers = []
            const mentionUsers: any[] = []
            this.apiResponse.forEach((apiData: any) => {
              if (apiData.profileDetails && apiData.profileDetails.personalDetails) {
                this.allUsers.push(`@${apiData.userName}`)
                mentionUsers.push(`@${apiData.userName}`)
                this.allProccessedUsers.push({
                  userId: apiData.userId,
                  userName: `${apiData.userName}`,
                })
              }
            })
            resolve(mentionUsers)
          }
        },
        (error: any) => {
          console.error('Error fetching users:', error)
          resolve([]) // Resolve with empty array on error
        }
      )
    })
  }

  private updatePostPreview(formValue: any): void {
    this.postPreview = {
      ...this.postPreview,
      // title: formValue.title,
      description: formValue.description,
      tags: this.selectedTags,
      files: formValue.files,
      categoryType: this.categoryType,
      mediaCategory: this.getLocalAndUploaded(),
      updatedOn: new Date()
    }
  }

  getLocalAndUploaded() {
    const mergedCategory: { [key: string]: any[] } = {}
    // Merge values from both objects
    // for (const key in this.mediaCategory) {
    //   if (this.mediaCategory.hasOwnProperty(key)) {
    //     mergedCategory[key] = [...(this.mediaCategory[key] || []), ...(this.previewCategory[key] || [])];
    //   }
    // }

    // for (const key in this.previewCategory) {
    //   if (this.previewCategory.hasOwnProperty(key) && !mergedCategory.hasOwnProperty(key)) {
    //     mergedCategory[key] = [...(this.previewCategory[key] || [])];
    //   }
    // }

    for (const key of this.categoryType) {
      mergedCategory[key] = [...(this.mediaCategory[key] || []), ...(this.previewCategory[key] || [])]
    }
    return mergedCategory
  }

  getNewAndOldMerged(newMedia: any, _oldMedia: any) {
    // Merge values from both objects
    let mergedVal: any = {}
    for (let cat of this.categoryType) {
      const oldUploaded = this.selectedFilesFinal[cat]
        .filter((x: any) => x.uploaded)
        .map((x: any) => x.previewUrl)
      // if(oldMedia[cat].uploaded) {
      mergedVal[cat] = []
      mergedVal[cat] = [...oldUploaded, ...newMedia[cat]]
      // }
    }
    return mergedVal
  }

  createPoll(): void {
    // Implement poll creation logic
  }

  addMedia(): void {
    this.uploadControlVisibility['image'] = true
    this.uploadControlVisibility['document'] = false
    this.uploadControlVisibility['link'] = false
  }

  addFile(): void {
    this.uploadControlVisibility['image'] = false
    this.uploadControlVisibility['document'] = true
    this.uploadControlVisibility['link'] = false
  }

  createLink(): void {
    this.uploadControlVisibility['image'] = false
    this.uploadControlVisibility['document'] = false
    this.uploadControlVisibility['link'] = true
  }

  onFileInputChange(event: any, category: string) {
    const files = event.target.files
    if (files) {
      this.selectedFilesFinal[category] = this.selectedFilesFinal[category] || []
      this.previewCategory[category] = this.previewCategory[category] || []
      // Calculate total files across all categories
      const totalFiles = (Object.values(this.selectedFilesFinal) as any[][])
        .reduce((sum: number, files: any[]) => sum + files.length, 0)

      // Check if adding new files would exceed the total limit
      if (totalFiles + files.length > this.MAX_TOTAL_FILES) {
        this._snackBar.open(`You can only upload up to ${this.MAX_TOTAL_FILES} files in total`, '', { duration: 3000 })
        return
      }

      Array.from(files as FileList).forEach(file => {
        // Check file size
        const maxSize = category === 'image' ? this.MAX_IMAGE_SIZE : this.MAX_DOC_SIZE
        if (file.size > maxSize) {
          const sizeInMB = maxSize / (1024 * 1024)
          this._snackBar.open(`${file.name} exceeds maximum ${category} size of ${sizeInMB}MB`, '', { duration: 3000 })
          return
        }

        // Add to selectedFilesFinal
        const previewUrl = URL.createObjectURL(file as Blob)
        this.previewCategory[category].push(previewUrl)
        this.selectedFilesFinal[category].push({
          file: file,
          name: file.name,
          category: category,
          previewUrl: previewUrl,
          uploaded: false
        })
      })

      this.uploadForm.patchValue({
        files: this.selectedFilesFinal
      })

      this.updateCategory(category)
      this.updatePostPreview(this.uploadForm.value)
    }
  }

  removeFileNew(index: number, category: string) {
    if (category) {
      if (this.selectedFilesFinal[category]) {
        this.selectedFilesFinal[category].splice(index, 1)
        this.previewCategory[category].splice(index, 1)
        // clear file input
        if (category === 'image') {
          if (this.imageUpload) {
            this.imageUpload.nativeElement.value = ''
          }
        } else if (category === 'document') {
          if (this.fileUpload) {
            this.fileUpload.nativeElement.value = ''
          }
        }
      }
    }

    this.uploadForm.patchValue({
      files: this.selectedFilesFinal
    })

    this.updatePostPreview(this.uploadForm.value)
    this.removeCategoryType(category)
  }

  removeCategoryType(category: string) {
    // if(this.mediaCategory && this.mediaCategory[category] && (this.mediaCategory[category].length === 0)) {
    //   delete this.mediaCategory[category]
    // }
    if (this.selectedFilesFinal[category] && this.selectedFilesFinal[category].length <= 0) {
      _.remove(this.categoryType, (cat) => cat === category)
    }
  }


  addNewUrl() {
    const category = 'link'
    this.updateCategory(category)
    this.selectedFilesFinal[category] = this.selectedFilesFinal[category] || []
    this.previewCategory[category] = this.previewCategory[category] || []

    const value = (this.linkInput || '').trim()
    if (value) {
      this.selectedFilesFinal['link'].push({
        name: value,
        previewUrl: value
      })
      this.previewCategory[category].push(value)
      // Update preview
      this.updatePostPreview(this.uploadForm.value)
    }
    // clearInput
    this.linkInput = ''
  }

  removeUrl(index: number) {
    this.selectedFilesFinal['link'].splice(index, 1)
    this.previewCategory['link'].splice(index, 1)
    // If all URLs are removed, add one empty field
    if (this.selectedFilesFinal['link'].length === 0) {
      _.remove(this.categoryType, 'link')
    }
    // Update preview
    this.updatePostPreview(this.uploadForm.value)
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim()
    if (value) {
      this.selectedTags.push(value)
      // Update preview
      this.updatePostPreview(this.uploadForm.value)
    }
    event.chipInput!.clear()
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag)
    if (index >= 0) {
      this.selectedTags.splice(index, 1)
      // Update preview
      this.updatePostPreview(this.uploadForm.value)
    }
  }

  updateCategory(type: string) {
    if (this.categoryType.indexOf(type) === -1) {
      this.categoryType.push(type)
    }
  }

  async onSubmit(): Promise<void> {
    if (this.uploadForm.valid) {
      if (this.data.editMode) {
        this.handleEditFlow()
      } else {
        this.handlePostCreation()
      }
    }
  }


  private handlePostCreation(): void {
    // For identifying initial update at BE
    const isInitialUpload: boolean = true
    switch (this.data.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.createPost(isInitialUpload)
        break
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.createAnswerPost(isInitialUpload)
        break
      case NsDiscussionV2.EPostType.ANSWER_POST_REPLY:
        this.createAnswerPostReply(isInitialUpload)
        break
    }
  }

  createPost(isInitialUpload: boolean) {
    this.loading = true
    this.loaderMsg = 'Creating the post!'
    const req = this.createReq(this.uploadForm, this.data.type)
    this.discussV2Svc.createPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result, isInitialUpload)
          } else {
            this.loading = false
            this.loaderMsg = 'Post created successfully!'
            this._snackBar.open('Post created successfully!')
            this.dialogRef.close({ result: res.result, type: this.data.type })
          }
        }
      },
      error: (err: any) => {
        console.error('Create post failed', err)
        this._snackBar.open('Post creation failed, please try again after sometime...!')
      }
    })
  }

  createAnswerPost(isInitialUpload: boolean) {
    const req = this.createReq(this.uploadForm, this.data.type)
    this.discussV2Svc.createAnswerPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result, isInitialUpload)
          } else {
            this.dialogRef.close({ result: res.result, type: this.data.type })
            this._snackBar.open('Post created successfully!')
          }
        }
      },
      error: (err: any) => {
        console.error('Create post failed', err)
        this._snackBar.open('Post creation failed, please try again after sometime...!')
      }
    })
  }

  createAnswerPostReply(isInitialUpload: boolean) {
    const req = this.createReq(this.uploadForm, this.data.type)
    console.error('req: ', req, isInitialUpload)
    this.discussV2Svc.createAnswerPostReply(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result, isInitialUpload)
          } else {
            this.dialogRef.close({ result: res.result, type: this.data.type })
            this._snackBar.open('Post created successfully!')
          }

        }
      },
      error: (err: any) => {
        console.error('Create post failed', err)
      }
    })
  }

  async uploadHandler(discussionId: string, postResult: any, isInitialUpload: boolean) {
    try {
      let temp: any = {}

      this.loading = true
      this.loaderMsg = 'Uploading the files...!'

      // Convert forEach to for...of for sequential processing
      for (const cat of this.categoryType) {
        // except link, for all follow below steps to upload and process URL
        if (cat !== 'link') {
          if (this.selectedFilesFinal[cat] && this.selectedFilesFinal[cat].length) {
            // Wait for all file uploads in this category to complete
            const uploadedUrls = await Promise.all(
              this.selectedFilesFinal[cat].map((fileObj: any) => {
                return new Promise<string>((resolve, reject) => {
                  if (fileObj.file) {
                    const formData = new FormData()
                    formData.append('file', fileObj.file)
                    const communityId = (postResult && postResult.communityId) ||
                      (this.data.community && (this.data.community.communityId || this.data.community.communityid))
                      || ''
                    this.discussV2Svc.uploadFile(formData, communityId, discussionId).subscribe({
                      next: (res: any) => {
                        if (res && res.result && res.result.url) {
                          const mainUrl = res.result.url.split(`discussionhub/`).pop() || ''
                          const finalURL = `${this.environment.contentHost}/${this.environment.dicussV2Bucket}/${mainUrl}`
                          resolve(finalURL)
                        } else {
                          reject('No URL in response')
                        }
                      },
                      error: (error) => reject(error)
                    })
                  } else {
                    resolve(fileObj.name)
                  }
                })
              })
            )

            temp[cat] = uploadedUrls
          }
        } else {
          if (this.selectedFilesFinal['link'] && this.selectedFilesFinal['link'].length) {
            temp['link'] = temp['link'] || []
            temp['link'] = this.selectedFilesFinal['link'].map((link: any) => { return link.previewUrl })
          }
        }
      }

      // After all categories are processed, update mediaCategory and call update
      this.mediaCategory = temp
      this.handlePostUpdation(discussionId, postResult, isInitialUpload)
    } catch (error) {
      this.loading = false
      this.loaderMsg = 'Uploading the files failed, Please try again later!'
      console.error('Error in upload handler:', error)
      this.dialogRef.close({ result: postResult, type: this.data.type })
    }
  }

  private handlePostUpdation(discussionId: string, postResult: any, isInitialUpload: boolean): void {
    switch (this.data.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.updatePostWithMediaUrls(discussionId, postResult, isInitialUpload)
        break
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.updateAnswerPostWithMediaUrls(discussionId, postResult, isInitialUpload)
        break
      case NsDiscussionV2.EPostType.ANSWER_POST_REPLY:
        this.updateAnswerPostReplyWithMediaUrls(discussionId, postResult, isInitialUpload)
        break
    }
  }

  updatePostWithMediaUrls(discussionId: string, postResult: any, isInitialUpload: boolean) {
    this.loading = true
    this.loaderMsg = 'Updating the post with files!'
    const communityId = postResult.communityId
    const updateReq = {
      discussionId,
      communityId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory,
      ...(isInitialUpload ? { isInitialUpload: true } : null),
    }
    this.discussV2Svc.updatePost(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this.loading = false
          this.loaderMsg = 'Post updated successfully!'
          this._snackBar.open('Post updated successfully!')
          this.dialogRef.close({ result: res.result, type: this.data.type })
        }
      },
      error: (err) => {
        this.loading = false
        this.loaderMsg = 'Post updation failed, please try agian later!'
        console.error('Error updating post with media URLs:', err)
        this._snackBar.open('Post updation failed, please try agian later!...!')
        // Even if update fails, the post was created
        this.dialogRef.close({ result: postResult, type: this.data.type })
      }
    })
  }

  updateAnswerPostWithMediaUrls(discussionId: string, postResult: any, isInitialUpload: boolean) {
    const updateReq = {
      answerPostId: discussionId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory,
      ...(isInitialUpload ? { isInitialUpload: true } : null),
    }

    this.discussV2Svc.updateAnswerPost(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this._snackBar.open('Post updated successfully!')
          this.dialogRef.close({ result: res.result, type: this.data.type })
        }
      },
      error: (err) => {
        console.error('Error updating post with media URLs:', err)
        this._snackBar.open('Post updation failed, please try agian later!...!')
        // Even if update fails, the post was created
        this.dialogRef.close({ result: postResult, type: this.data.type })
      }
    })
  }

  updateAnswerPostReplyWithMediaUrls(discussionId: string, _postResult: any, isInitialUpload: boolean) {
    const updateReq = {
      answerPostReplyId: discussionId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory,
      ...(isInitialUpload ? { isInitialUpload: true } : null),
    }

    this.discussV2Svc.updateAnswerPostReply(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this._snackBar.open('Post updated successfully!')
          this.dialogRef.close({ result: res.result, type: this.data.type })
        }
      },
      error: (err) => {
        console.error('Error updating post with media URLs:', err)
        // Even if update fails, the post was created
        this._snackBar.open('Error updating post with media URLs')
      }
    })
  }

  createReq(formData: any, type: string) {
    const communityId = this.isGlobal ? formData.value.community && formData.value.community.communityid : this.data.community.communityId || ''
    const req: any = {
      type,
      ...(this.data.parentDiscussionId && (type !== NsDiscussionV2.EPostType.ANSWER_POST_REPLY) ?
        { parentDiscussionId: this.data.parentDiscussionId } : null),
      ...(this.data.parentDiscussionId && (type === NsDiscussionV2.EPostType.ANSWER_POST_REPLY) ?
        { parentAnswerPostId: this.data.parentDiscussionId, parentDiscussionId: this.data.parentPost.discussionId || '' } : null),
      communityId: communityId,
      // title: formData.value.title,
      description: formData.value.description,
      // categoryType: [...this.categoryType],
      // mediaCategory: this.mediaCategory,
      // targetTopic: 'testing',
      // tags: this.selectedTags,
      // mediaUrls: this.mediaUrls || []
      ...(this.mentionedUsers.length > 0 ? { mentionedUsers: this.mentionedUsers } : {})
    }
    return req
  }

  handleEditFlow() {
    switch (this.data.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.editPost()
        break
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.editAnswerPost()
        break
      case NsDiscussionV2.EPostType.ANSWER_POST_REPLY:
        this.editAnswerPostReply()
        break
    }
  }

  private async editUploadHandler(discussionId: string) {
    try {
      const temp: any = {}
      for (const cat in this.selectedFilesFinal) {
        if (cat !== 'link') {
          if (this.selectedFilesFinal[cat] && this.selectedFilesFinal[cat].length) {
            const newFiles = this.selectedFilesFinal[cat].filter((x: any) => !x.uploaded)
            // Wait for all file uploads in this category to complete
            const uploadedUrls = await Promise.all(
              newFiles.map((fileObj: any) => {
                return new Promise<string>((resolve, reject) => {
                  if (fileObj.file) {
                    const formData = new FormData()
                    formData.append('file', fileObj.file)
                    const communityId = this.data.community.communityId || this.data.community.communityid || ''
                    this.discussV2Svc.uploadFile(formData, communityId, discussionId).subscribe({
                      next: (res: any) => {
                        if (res && res.result && res.result.url) {
                          const mainUrl = res.result.url.split(`discussionhub/`).pop() || ''
                          const finalURL = `${this.environment.contentHost}/${this.environment.dicussV2Bucket}/${mainUrl}`
                          resolve(finalURL)
                        } else {
                          reject('No URL in response')
                        }
                      },
                      error: (error) => reject(error)
                    })
                  } else {
                    resolve(fileObj.name)
                  }
                })
              })
            )
            temp[cat] = uploadedUrls
          }
        } else {
          if (this.selectedFilesFinal['link'] && this.selectedFilesFinal['link'].length) {
            temp['link'] = temp['link'] || []
            temp['link'] = this.selectedFilesFinal['link'].filter((l: any) => !l.uploaded).map((link: any) => { return link.previewUrl })
          }
        }
      }
      return temp
    } catch (error) {
      console.error('Error in edit  upload handler:', error)
    }


  }


  async editPost() {
    const newMedia = await this.editUploadHandler(this.data.post.discussionId)
    const mergedMediaCategory = this.getNewAndOldMerged(newMedia, this.data.post.mediaCategory)
    const updateReq: any = {
      discussionId: this.data.post.discussionId,
      communityId: this.data.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      // mediaUrls,
      categoryType: [...this.categoryType],
      mediaCategory: mergedMediaCategory,
      // tags: this.selectedTags
      ...(this.mentionedUsers.length > 0 ? { mentionedUsers: this.mentionedUsers } : {})
    }

    this.discussV2Svc.updatePost(updateReq).subscribe({
      next: (res) => {
        if (res?.result) {
          this._snackBar.open('Post updated successfully!')
          this.dialogRef.close({ result: res.result, type: this.data.type })
        }
      },
      error: (err) => {
        this._snackBar.open('Post updation failed, please try agian later!...!')
        console.error('Error updating post:', err)
      }
    })
  }

  async editAnswerPost() {
    const newMedia = await this.editUploadHandler(this.data.post.discussionId)
    const mergedMediaCategory = this.getNewAndOldMerged(newMedia, this.data.post.mediaCategory)
    const updateReq: any = {
      answerPostId: this.data.post.discussionId,
      // communityId: this.data.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      // mediaUrls,
      categoryType: [...this.categoryType],
      mediaCategory: mergedMediaCategory,
      // tags: this.selectedTags
    }
    this.discussV2Svc.updateAnswerPost(updateReq).subscribe({
      next: (res) => {
        if (res?.result) {
          this._snackBar.open('Post updated successfully!')
          this.dialogRef.close({ result: res.result, type: this.data.type })
        }
      },
      error: (err) => {
        this._snackBar.open('Post updation failed, please try agian later!...!')
        console.error('Error updating post:', err)
      }
    })
  }

  async editAnswerPostReply() {
    const newMedia = await this.editUploadHandler(this.data.post.discussionId)
    const mergedMediaCategory = this.getNewAndOldMerged(newMedia, this.data.post.mediaCategory)
    const updateReq: any = {
      answerPostReplyId: this.data.post.discussionId,
      // communityId: this.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      // mediaUrls,
      categoryType: [...this.categoryType],
      mediaCategory: mergedMediaCategory,
      // tags: this.selectedTags
    }
    this.discussV2Svc.updateAnswerPostReply(updateReq).subscribe({
      next: (res) => {
        if (res?.result) {
          this._snackBar.open('Post updated successfully!')
          this.dialogRef.close({ result: res.result, type: this.data.type })
        }
      },
      error: (err) => {
        this._snackBar.open('Post updation failed, please try agian later!...!')
        console.error('Error updating post:', err)
      }
    })
  }

  onReady(editor: any) {
    // You can customize the editor instance here
    editor.editing.view.change((writer: any) => {
      writer.setStyle(
        'min-height',
        '150px',
        editor.editing.view.document.getRoot()
      )
    })
    editor.model.document.on('change:data', () => {
      const content = editor.getData()
      this.mentionedUsers = []
      // Parse mentions from content using regex
      const mentionRegex = /<span[^>]*data-mention[^>]*>@([^<]+)<\/span>/g
      let match

      while ((match = mentionRegex.exec(content)) !== null) {
        const mentionName = match[1]
        const foundUser = this.allProccessedUsers.find(user => user.userName === mentionName)
        if (foundUser && !this.mentionedUsers.find(user => user.userId === foundUser.userId)) {
          this.mentionedUsers.push({
            userId: foundUser.userId,
            userName: foundUser.userName
          })
        }
      }
    })
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


  // Clean up URLs when component is destroyed
  ngOnDestroy() {
    // Revoke all object URLs to prevent memory leaks
    for (const key in this.previewCategory) {
      if (this.previewCategory.hasOwnProperty(key)) {
        this.previewCategory[key].forEach((url: any) => URL.revokeObjectURL(url))
      }
    }
  }

  onEditorChange(event: any): void {
    const editor = event.editor
    const currentLength = this.getEditorTextLength(editor.getData())

    if (currentLength > 3000) {
      // Store the last valid content
      const previousContent = editor.getData()
      // Find the point to truncate by counting characters
      let truncated = ''
      let count = 0
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = previousContent

      function processNode(node: Node) {
        if (count >= 3000) return
        if (node.nodeType === Node.TEXT_NODE) {
          const remaining = 3000 - count
          const text = node.textContent || ''
          truncated += text.slice(0, remaining)
          count += text.length
        } else {
          const children = Array.from(node.childNodes)
          truncated += node.nodeType === Node.ELEMENT_NODE ? `<${(node as Element).tagName.toLowerCase()}>` : ''
          children.forEach(child => processNode(child))
          truncated += node.nodeType === Node.ELEMENT_NODE ? `</${(node as Element).tagName.toLowerCase()}>` : ''
        }
      }

      Array.from(tempDiv.childNodes).forEach(node => processNode(node))

      // Set the truncated content back to editor
      editor.setData(truncated)

      // Move cursor to end
      const selection = editor.model.document.selection
      const position = editor.model.document.model.createPositionAt(editor.model.document.getRoot(), 'end')
      selection.setTo(position)
    }

    // Update preview
    this.updatePostPreview(this.uploadForm.value)
  }

  checkCharacterLimit(event: any) {
    const length = this.getEditorTextLength(this.uploadForm.get('description')?.value)
    if (length > 3000) {
      // Prevent further input
      event.editor.setData(event.editor.getData())
      // Optionally show an error message or handle the overflow
    }
  }
  getEditorTextLength(content: any) {
    let test = content.replace(/<[^>]*>/g, '')
    test = test.replace(/&nbsp;/gi, ' ')
    test = test.trim()
    return test.length
  }

  private textLengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const text = this.getEditorTextLength(control.value)
      if (text < 3) {
        return { minLength: true }
      }
      if (text > 3000) {
        return { maxLength: true }
      }
      return null
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker
  }
  addEmoji(event: any) {
    const text = `${this.uploadForm.controls.description.value}${event.emoji.native}`
    this.uploadForm.patchValue({
      description: text
    })
  }

  onFocus() {
    this.showEmojiPicker = false
  }

  displayFn(community: any): string {
    return community ? community.communityName : ''
  }

  validCommunityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value
      if (!value) return { required: true }

      // Check if the value is a valid community object
      const isValid = typeof value === 'object' &&
        value.communityName &&
        this.originalCommunities.some((c: any) => c.communityName === value.communityName)

      return isValid ? null : { invalidCommunity: true }
    }
  }
}
