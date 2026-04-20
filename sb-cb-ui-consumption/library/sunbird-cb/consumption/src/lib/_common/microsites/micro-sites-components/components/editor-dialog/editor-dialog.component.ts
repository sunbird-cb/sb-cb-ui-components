import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MicrositeV3Service } from '../../../../../_services/microsite-v3.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { map, switchMap } from 'rxjs/operators'

interface SliderItem {
  active: boolean
  banners: {
    l: string
    m: string
    s: string
    xl: string
    xs: string
    xxl: string
  }
  redirectUrl: string
  queryParams: any
  title: string
}

interface SliderData {
  sliders: SliderItem[]
  styleData: any
}

@Component({
  selector: 'app-editor-dialog',
  templateUrl: './editor-dialog.component.html',
  styleUrls: ['./editor-dialog.component.scss']
})
export class EditorDialogComponent implements OnInit {
  editorForm: FormGroup
  formType: string
  uploadStatus: string = '';
  isUploading: boolean = false;

  // Week Highlights specific properties

  // Slider specific properties
  sliderData: SliderData = {
    sliders: [],
    styleData: {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
  };
  sliderItemForm: FormGroup
  isEditingSlider: boolean = false;
  editingIndex: number = -1;

  // Speaker specific properties
  speakerForm: FormGroup
  isEditingSpeaker: boolean = false;
  editingSpeakerIndex: number = -1;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private micrositeService: MicrositeV3Service,
    public dialogRef: MatDialogRef<EditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public configSvc: ConfigurationsService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize with field type from data
    this.formType = data.fieldType || 'text'
  }

  get keyHighlightsArray(): FormArray {
    return this.editorForm.get('keyHighlights') as FormArray
  }

  get weekHighlightsList(): FormArray {
    return this.editorForm.get('list') as FormArray
  }

  get cbpPlanListArray(): FormArray {
    return this.editorForm.get('list') as FormArray
  }

  get announcementsList(): FormArray {
    return this.editorForm.get('list') as FormArray
  }

  get imageItemsArray(): FormArray {
    return this.editorForm?.get('items') as FormArray
  }

  get isMultipleImages(): boolean {
    return this.formType === 'image' && this.editorForm && this.editorForm.get('items') !== null
  }

  get isColorMode(): boolean {
    return this.editorForm?.get('inputType')?.value === 'color'
  }

  get isImageMode(): boolean {
    return this.editorForm?.get('inputType')?.value === 'image'
  }

  ngOnInit() {
    if (this.formType === 'keyHighlights') {
      this.initKeyHighlightsForm()
    } else {
      this.initForm()
      this.initSliderItemForm()

      // Initialize speaker form if needed
      if (this.formType === 'speakersConfig') {
        this.initSpeakerForm()
      }
    }
  }

  // Helper method to create a form group for a week highlight item
  createWeekHighlightItem(item: any = {}): FormGroup {
    return this.fb.group({
      title: [item.title || '', [Validators.required]],
      description: [item.description || '', [Validators.required]],
      videoUrl: [item.videoUrl || '', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/)
      ]]
    })
  }

  // Methods for week highlights management
  addWeekHighlightItem(): void {
    this.weekHighlightsList.push(this.createWeekHighlightItem())
  }

  removeWeekHighlightItem(index: number): void {
    this.weekHighlightsList.removeAt(index)
  }

  dropWeekHighlightItem(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.weekHighlightsList.controls, event.previousIndex, event.currentIndex)
    this.weekHighlightsList.updateValueAndValidity()
  }

  // Methods for CBP plan management
  addCbpPlanItem(): void {
    this.cbpPlanListArray.push(this.fb.group({
      title: ['', [Validators.required]],
      downloaUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    }))
  }

  removeCbpPlanItem(index: number): void {
    this.cbpPlanListArray.removeAt(index)
  }

  dropCbpPlanItem(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.cbpPlanListArray.controls, event.previousIndex, event.currentIndex)
    this.cbpPlanListArray.updateValueAndValidity()
  }

  // Methods for announcements management
  addAnnouncementItem(announcement: any = {}): void {
    this.announcementsList.push(this.fb.group({
      name: [announcement.name || '', [Validators.required]],
      description: [announcement.description || '', [Validators.required]],
      category: [announcement.category || '', [Validators.required]],
      announcementId: [announcement.announcementId || '']
    }))
  }

  removeAnnouncementItem(index: number): void {
    const tempValue = this.announcementsList.at(index).value
    if (tempValue.announcementId) {
      this.micrositeService.deleteAnnouncements(tempValue.announcementId).subscribe({
        next: () => {
          this.announcementsList.removeAt(index)
        },
        error: (error) => {
          console.error('Error removing announcement:', error)
        }
      })
    } else {
      this.announcementsList.removeAt(index)
    }
  }

  dropAnnouncementItem(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.announcementsList.controls, event.previousIndex, event.currentIndex)
    this.announcementsList.updateValueAndValidity()
  }

  // Methods for image logo items management
  addImageLogoItem(): void {
    if (this.imageItemsArray) {
      this.imageItemsArray.push(this.fb.group({
        url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
      }))
    }
  }

  removeImageLogoItem(index: number): void {
    if (this.imageItemsArray) {
      this.imageItemsArray.removeAt(index)
    }
  }

  dropImageLogoItem(event: CdkDragDrop<any[]>): void {
    if (this.imageItemsArray) {
      moveItemInArray(this.imageItemsArray.controls, event.previousIndex, event.currentIndex)
      this.imageItemsArray.updateValueAndValidity()
    }
  }

  onImageLogoSelected(event: any, index: number): void {
    const file = event.target.files[0]
    if (file) {
      // Set current index for error display
      this.currentUploadingIndex = index

      // Validate file type (only jpg, jpeg, and png)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        this.uploadStatus = 'Error: Only JPG and PNG files are allowed'
        setTimeout(() => {
          this.uploadStatus = ''
          this.currentUploadingIndex = -1
        }, 3000)
        event.target.value = '' // Reset file input
        return
      }

      // Validate file size (max 100KB)
      const maxSize = 100 * 1024 // 100KB in bytes
      if (file.size > maxSize) {
        this.uploadStatus = `Error: File size must be less than 100KB (current: ${(file.size / 1024).toFixed(2)}KB)`
        setTimeout(() => {
          this.uploadStatus = ''
          this.currentUploadingIndex = -1
        }, 3000)
        event.target.value = '' // Reset file input
        return
      }

      this.uploadImageLogo(file, index)
    }
  }

  uploadImageLogo(file: File, index: number): void {
    this.isUploading = true
    this.uploadStatus = 'Uploading image...'

    this.micrositeService.uploadFile(file).subscribe({
      next: (transformedUrl) => {
        this.isUploading = false

        // Update the url form field for the specific item
        if (this.imageItemsArray && this.imageItemsArray.at(index)) {
          this.imageItemsArray.at(index).get('url')?.setValue(transformedUrl)
        }
        this.uploadStatus = 'Image uploaded successfully!'

        // Clear status after 3 seconds
        setTimeout(() => {
          this.uploadStatus = ''
          this.currentUploadingIndex = -1
        }, 3000)
      },
      error: (error) => {
        this.isUploading = false
        this.uploadStatus = 'Upload failed. Please try again.'
        this.currentUploadingIndex = -1
        console.error('Image upload error:', error)
      }
    })
  }



  initForm() {
    // Create form based on field type
    switch (this.formType) {
      case 'weekHighlights':
        const weekHighlightsValue = this.data.value || {}

        // Initialize with an empty array if list doesn't exist
        const highlightsList = weekHighlightsValue.list || []

        this.editorForm = this.fb.group({
          title: [weekHighlightsValue.title || 'Week Highlights', [Validators.required]],
          list: this.fb.array(
            highlightsList.map((item: any) => this.createWeekHighlightItem(item))
          )
        })
        break
      case 'textarea':
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required]]
        })
        break
      case 'color':
        // Treat as banner image field with URL validation
        const isDefaultBanner = this.data.value === '/assets/images/default_banner.png'
        this.editorForm = this.fb.group({
          value: [this.data.value || '', [Validators.required, Validators.pattern(/^https?:\/\/.+|^\/assets\/.+/)]],
          useDefaultBanner: [isDefaultBanner]
        })
        break
      case 'image':
        // Check if value is an array (multiple items) or single value
        const imageValue = this.data.value || []
        const isArray = Array.isArray(imageValue)

        if (isArray) {
          // Multiple highlight items
          this.editorForm = this.fb.group({
            items: this.fb.array(
              imageValue.map((item: any) => this.fb.group({
                url: [item.url || item || '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
              }))
            )
          })
        } else {
          // Single image URL
          this.editorForm = this.fb.group({
            value: [imageValue, [Validators.required]]
          })
        }
        break
      case 'boolean':
        this.editorForm = this.fb.group({
          value: [!!this.data.value]
        })
        break
      case 'metrics':
        const metricsValue = this.data.value || {}
        this.editorForm = this.fb.group({
          enabled: [metricsValue.enabled !== undefined ? metricsValue.enabled : true],
          background: [metricsValue.background || '#FFFFFF'],
          data: [metricsValue.data || {}]
        })
        break
      case 'topLearnersConfig':
        // Get top learners data or set defaults
        const topLearnersValue = this.data.value || {}
        this.editorForm = this.fb.group({
          enabled: [topLearnersValue.enabled !== undefined ? topLearnersValue.enabled : true],
          title: [topLearnersValue.title || 'Top Learners'],
          titleFontColor: [topLearnersValue.titleFontColor || '#000000'],
          customClass: [topLearnersValue.customClass || ''],
          cardHeight: [topLearnersValue.cardHeight || '134px'],
          cardMinHeight: [topLearnersValue.cardMinHeight || '134px'],
          hideEle: [topLearnersValue.hideEle || []],
          kpIcon: [topLearnersValue.kpIcon || '']
        })
        break
      case 'userProgressConfig':
        // Get user progress data or set defaults
        const userProgressValue = this.data.value || {}

        // Handle both direct structure and nested structure with 'data'
        const progressData = userProgressValue.data || userProgressValue

        this.editorForm = this.fb.group({
          enabled: [userProgressValue.enabled !== undefined ? userProgressValue.enabled : true],
          data: this.fb.group({
            title: [progressData.title || 'My Progress'],
            infoText: [progressData.infoText || 'User progress information'],
            infoIcon: [progressData.infoIcon || ''],
            profleDetails: [progressData.profleDetails || {}],
            hideEle: [progressData.hideEle || []],
            insights: [progressData.insights || { disable: false, data: { sliderData: { styleData: {} } } }]
          })
        })
        break
      case 'speakersConfig':
        // Get speakers data or set defaults
        const speakersValue = this.data.value || {}

        // Handle both direct structure and nested structure with 'data'
        const speakerData = speakersValue.data || speakersValue
        this.editorForm = this.fb.group({
          enabled: [speakersValue.enabled !== undefined ? speakersValue.enabled : true],
          data: this.fb.group({
            title: [speakerData.title || ''], // Empty default
            infoText: [speakerData.infoText || ''], // Empty default
            infoIcon: [speakerData.infoIcon || ''],
            list: [speakerData.list || []]
          })
        })
        break
      case 'eventsConfig':
        // Get events data or set defaults
        const eventsValue = this.data.value || {}

        this.editorForm = this.fb.group({
          enabled: [eventsValue.enabled !== undefined ? eventsValue.enabled : true]
        })
        break
      case 'mdoLeaderboardConfig':
        // Get mdo leaderboard data or set defaults
        const mdoLeaderboardValue = this.data.value || {}

        this.editorForm = this.fb.group({
          enabled: [mdoLeaderboardValue.enabled !== undefined ? mdoLeaderboardValue.enabled : true]
        })
        break
      case 'cbpPlanConfig':
        // Get CBP plan data or set defaults
        const cbpPlanValue = this.data.value || {}
        const cbpPlanList = cbpPlanValue.list || []

        this.editorForm = this.fb.group({
          list: this.fb.array([])
        })

        // Populate existing CBP plan items
        if (cbpPlanList.length > 0) {
          cbpPlanList.forEach((item: any) => {
            this.cbpPlanListArray.push(this.fb.group({
              title: [item.title || '', [Validators.required]],
              downloaUrl: [item.downloaUrl || '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
            }))
          })
        } else {
          // Add one empty item by default
          this.addCbpPlanItem()
        }
        break
      case 'lookerConfig':
        // Get looker data or set defaults
        const lookerValue = this.data.value || {}
        const headerData = lookerValue.header || {}

        // Parse height values - remove 'px' suffix if present
        const parseHeight = (value: any, defaultValue: number): number => {
          if (typeof value === 'string') {
            return parseInt(value.replace('px', ''), 10) || defaultValue
          }
          return value || defaultValue
        }

        this.editorForm = this.fb.group({
          enabled: [lookerValue.enabled !== undefined ? lookerValue.enabled : true],
          headerText: [headerData.headerText || '', [Validators.maxLength(100)]],
          headerDescription: [headerData.description || '', [Validators.maxLength(300)]],
          desktopHeight: [parseHeight(lookerValue.desktopHeight, 600), [Validators.required, Validators.min(100)]],
          mobileHeight: [parseHeight(lookerValue.mobileHeight, 400), [Validators.required, Validators.min(100)]],
          lookerProDesktopUrl: [lookerValue.lookerProDesktopUrl || '', [
            Validators.required,
            Validators.pattern(/^https:\/\/lookerstudio\.google\.com\/.*$/)
          ]],
          lookerProMobileUrl: [lookerValue.lookerProMobileUrl || '', [
            Validators.required,
            Validators.pattern(/^https:\/\/lookerstudio\.google\.com\/.*$/)
          ]]
        })
        break
      case 'announcementsConfig':
        // Get announcements data or set defaults
        const announcementsValue = this.data.value || {}

        this.editorForm = this.fb.group({
          enabled: [announcementsValue.enabled !== undefined ? announcementsValue.enabled : true],
          title: [announcementsValue.title || ''],
          list: this.fb.array([])
        })
        // Initialize announcements list if exists
        if (announcementsValue.list && Array.isArray(announcementsValue.list)) {
          announcementsValue.list.forEach((announcement: any) => {
            this.addAnnouncementItem(announcement)
          })
        }
        break
      case 'slider':
        // Initialize slider data from the input or use defaults
        if (this.data.value && this.data.value.sliders && this.data.value.styleData) {
          this.sliderData = this.data.value
        } else if (this.data.sliderData) {
          this.sliderData = this.data.sliderData
        }

        this.editorForm = this.fb.group({
          value: [this.sliderData]
        })
        break
      default:
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required]]
        })
    }
  }

  initKeyHighlightsForm() {
    const config = this.data.value || {}
    this.editorForm = this.fb.group({
      enabled: [config.enabled ?? true],
      backgroundColor: [config.backgroundColor ?? '#FFFFFF', [Validators.required]],
      titleMaxLength: [config.titleMaxLength ?? 200, [Validators.required, Validators.min(1)]],
      keyHighlights: this.fb.array(
        (config.content || []).map((item: any) =>
          this.fb.control(item.title, [
            Validators.required,
            Validators.maxLength(config.titleMaxLength ?? 200)
          ])
        )
      ),
      sliderData: this.fb.group({
        styleData: this.fb.group({
          borderRadius: [config.sliderData?.styleData?.borderRadius ?? '0'],
          customHeight: [config.sliderData?.styleData?.customHeight ?? '100px'],
          bannerMeta: [config.sliderData?.styleData?.bannerMeta ?? 'visible'],
          dots: [config.sliderData?.styleData?.dots ?? 'hidden'],
          arrowsPlacement: [config.sliderData?.styleData?.arrowsPlacement ?? 'middle-inline'],
          responsive: this.fb.group({
            customHeight: [config.sliderData?.styleData?.responsive?.customHeight ?? '80px'],
            bannerMetaAlign: [config.sliderData?.styleData?.responsive?.bannerMetaAlign ?? 'left'],
            navigationArrows: [config.sliderData?.styleData?.responsive?.navigationArrows ?? 'visible'],
            dots: [config.sliderData?.styleData?.responsive?.dots ?? 'hidden'],
            arrowsPlacement: [config.sliderData?.styleData?.responsive?.arrowsPlacement ?? 'middle-inline']
          })
        })
      })
    })
  }

  initSliderItemForm(item?: SliderItem) {
    this.sliderItemForm = this.fb.group({
      active: [item?.active !== undefined ? item.active : true],
      banners: this.fb.group({
        l: [item?.banners?.l || '', [Validators.required]],
        m: [item?.banners?.m || ''],
        s: [item?.banners?.s || ''],
        xl: [item?.banners?.xl || ''],
        xs: [item?.banners?.xs || ''],
        xxl: [item?.banners?.xxl || '']
      }),
      redirectUrl: [item?.redirectUrl || ''],
      queryParams: [item?.queryParams || {}],
      title: [item?.title || '']
    })
  }

  // Initialize the speaker form
  initSpeakerForm(speaker: any = {}) {
    // Ensure we handle undefined or null values
    const safeTitle = speaker && speaker.title !== undefined ? speaker.title : ''
    const safeDesc = speaker && speaker.description !== undefined ? speaker.description : ''
    const safeImage = speaker && speaker.profileImage !== undefined ? speaker.profileImage : ''
    const safeId = speaker && speaker.identifier !== undefined ? speaker.identifier : ''

    // Simplified URL validation pattern
    const urlPattern = /^https?:\/\/.+/

    this.speakerForm = this.fb.group({
      title: [safeTitle, [Validators.required]],
      description: [safeDesc, [Validators.required]],
      profileImage: [safeImage, {
        validators: [Validators.pattern(urlPattern)],
        updateOn: 'blur'  // Only validate when user leaves the field
      }],
      identifier: [safeId]
    })
  }

  // Helper method to safely get speakers list
  getSpeakersList(): any[] {
    try {
      if (!this.editorForm) {
        console.warn('Editor form not initialized')
        return []
      }

      const dataControl = this.editorForm.get('data')
      if (!dataControl) {
        console.warn('Data form group not found')
        return []
      }

      const listControl = dataControl.get('list')
      if (!listControl) {
        console.warn('List control not found')
        return []
      }

      const list = listControl.value

      if (!Array.isArray(list)) {
        console.warn('List is not an array:', list)
        return []
      }

      return list
    } catch (error) {
      console.error('Error getting speakers list:', error)
      return []
    }
  }

  // Methods for managing speakers
  addNewSpeaker() {
    this.isEditingSpeaker = true
    this.editingSpeakerIndex = -1
    this.initSpeakerForm()
  }

  editSpeaker(index: number) {
    try {
      // Get current list
      const speakersList = this.editorForm.get('data.list')?.value || []

      // Validate index
      if (index >= 0 && index < speakersList.length) {
        const speaker = speakersList[index]

        // Set editing state
        this.isEditingSpeaker = true
        this.editingSpeakerIndex = index

        // Initialize form with speaker data
        this.initSpeakerForm(speaker)
      } else {
        console.warn(`Invalid speaker index: ${index}`)
      }
    } catch (error) {
      console.error('Error editing speaker:', error)
    }
  }

  removeSpeaker(index: number) {
    try {
      // Get current list
      let speakersList = this.editorForm.get('data.list')?.value

      // Handle case where the list might be null or undefined
      if (!Array.isArray(speakersList)) {
        console.warn('Speaker list is not an array, initializing empty array')
        speakersList = []
      } else {
        if (index >= 0 && index < speakersList.length) {
          // Remove the speaker at the specified index
          speakersList.splice(index, 1)

          // Update the form control with a new array
          this.editorForm.get('data.list')?.setValue([...speakersList])
        } else {
          console.warn(`Invalid index: ${index} for list of length ${speakersList.length}`)
        }
      }
    } catch (error) {
      console.error('Error removing speaker:', error)
    }
  }

  // Method to remove all speakers
  removeAllSpeakers() {
    try {
      this.editorForm.get('data.list')?.setValue([])
    } catch (error) {
      console.error('Error removing all speakers:', error)
    }
  }

  saveSpeaker() {
    if (this.speakerForm.valid) {
      try {
        // Extract speaker data from form
        const speakerData = {
          title: this.speakerForm.get('title')?.value,
          description: this.speakerForm.get('description')?.value,
          profileImage: this.speakerForm.get('profileImage')?.value,
          identifier: this.speakerForm.get('identifier')?.value
        }

        // Create a deep copy of the current speakers list
        const currentList = this.editorForm.get('data.list')?.value || []
        const speakersList = JSON.parse(JSON.stringify(currentList))

        if (this.editingSpeakerIndex === -1) {
          // Add new speaker
          speakersList.push(speakerData)
        } else {
          // Update existing speaker
          speakersList[this.editingSpeakerIndex] = speakerData
        }

        // Update the form with the new list - use a new array reference for change detection
        this.editorForm.get('data.list')?.setValue([...speakersList])

        // Reset the speaker form
        this.cancelSpeakerEdit()
      } catch (error) {
        console.error('Error saving speaker:', error)
      }
    } else {
      console.warn('Speaker form is invalid:', this.speakerForm.errors)
    }
  }

  cancelSpeakerEdit() {
    this.isEditingSpeaker = false
    this.editingSpeakerIndex = -1
    this.speakerForm.reset()
  }

  // Handle speaker image upload
  onSpeakerImageSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      // Validate file type (only jpg, jpeg, and png)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        this.uploadStatus = 'Error: Only JPG and PNG files are allowed'
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
        event.target.value = '' // Reset file input
        return
      }

      // Validate file size (max 100KB)
      const maxSize = 100 * 1024 // 100KB in bytes
      if (file.size > maxSize) {
        this.uploadStatus = `Error: File size must be less than 100KB (current: ${(file.size / 1024).toFixed(2)}KB)`
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
        event.target.value = '' // Reset file input
        return
      }

      this.uploadSpeakerImage(file)
    }
  }

  uploadSpeakerImage(file: File) {
    this.isUploading = true
    this.uploadStatus = 'Uploading...'

    this.micrositeService.uploadFile(file).subscribe({
      next: (transformedUrl) => {
        this.isUploading = false

        // Update the form with the new URL
        this.speakerForm.get('profileImage')?.setValue(transformedUrl)
        this.uploadStatus = 'Upload successful!'

        // Clear status after 3 seconds
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
      },
      error: (error) => {
        this.isUploading = false
        this.uploadStatus = 'Upload failed. Please try again.'
        console.error('Upload error:', error)
      }
    })
  }

  // Color picker change handler
  onColorPickerChange(event: any) {
    const hexColor = event.target.value
    this.editorForm.get('value')?.setValue(hexColor)
  }

  // Banner image upload for color/banner field
  onBannerImageSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        this.uploadStatus = 'Error: Only JPG and PNG files are allowed'
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
        event.target.value = ''
        return
      }

      // Validate file size (max 700KB)
      const maxSize = 700 * 1024
      if (file.size > maxSize) {
        this.uploadStatus = `Error: File size must be less than 700KB (current: ${(file.size / 1024).toFixed(2)}KB)`
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
        event.target.value = ''
        return
      }

      this.uploadBannerImage(file)
    }
  }

  uploadBannerImage(file: File) {
    this.isUploading = true
    this.uploadStatus = 'Uploading...'

    this.micrositeService.uploadFile(file).subscribe({
      next: (transformedUrl) => {
        this.isUploading = false
        this.editorForm.get('value')?.setValue(transformedUrl)
        this.editorForm.get('useDefaultBanner')?.setValue(false)
        this.uploadStatus = 'Upload successful!'
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
      },
      error: (error) => {
        this.isUploading = false
        this.uploadStatus = 'Upload failed. Please try again.'
        console.error('Upload error:', error)
      }
    })
  }

  onDefaultBannerToggle(event: any) {
    const isChecked = event.checked
    if (isChecked) {
      this.editorForm.get('value')?.setValue('/assets/images/default_banner.png')
    } else {
      this.editorForm.get('value')?.setValue('')
    }
  }

  // General image upload methods
  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      // Validate file type (only jpg, jpeg, and png)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        this.uploadStatus = 'Error: Only JPG and PNG files are allowed'
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
        event.target.value = '' // Reset file input
        return
      }

      // Validate file size (max 100KB)
      const maxSize = 100 * 1024 // 100KB in bytes
      if (file.size > maxSize) {
        this.uploadStatus = `Error: File size must be less than 100KB (current: ${(file.size / 1024).toFixed(2)}KB)`
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
        event.target.value = '' // Reset file input
        return
      }

      this.uploadImage(file)
    }
  }

  uploadImage(file: File) {
    this.isUploading = true
    this.uploadStatus = 'Uploading...'

    this.micrositeService.uploadFile(file).subscribe({
      next: (transformedUrl) => {
        this.isUploading = false

        // Update the form with the new URL
        this.editorForm.get('value')?.setValue(transformedUrl)
        this.uploadStatus = 'Upload successful!'

        // Clear status after 3 seconds
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
      },
      error: (error) => {
        this.isUploading = false
        this.uploadStatus = 'Upload failed. Please try again.'
        console.error('Upload error:', error)
      }
    })
  }

  // PDF upload methods for CBP Plan
  currentUploadingIndex: number = -1

  onPdfFileSelected(event: any, index: number) {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      this.currentUploadingIndex = index
      this.uploadPdfFile(file, index)
    } else {
      this.uploadStatus = 'Please select a valid PDF file.'
    }
  }

  uploadPdfFile(file: File, index: number) {
    this.isUploading = true
    this.uploadStatus = 'Uploading PDF...'

    this.micrositeService.uploadFile(file).subscribe({
      next: (transformedUrl) => {
        this.isUploading = false

        // Update the downloaUrl form field for the specific item
        const listArray = this.editorForm.get('list') as FormArray
        if (listArray && listArray.at(index)) {
          listArray.at(index).get('downloaUrl')?.setValue(transformedUrl)
        }
        this.uploadStatus = 'PDF uploaded successfully!'

        // Clear status after 3 seconds
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
      },
      error: (error) => {
        this.isUploading = false
        this.uploadStatus = 'Upload failed. Please try again.'
        console.error('PDF upload error:', error)
      }
    })
  }

  onVideoFileSelected(event: any, index: number) {
    const file = event.target.files[0]
    if (file && file.type === 'video/mp4') {
      this.currentUploadingIndex = index
      this.uploadVideoFile(file, index)
    } else {
      this.uploadStatus = 'Please select a valid MP4 video file.'
    }
  }

  uploadVideoFile(file: File, index: number) {
    this.isUploading = true
    this.uploadStatus = 'Uploading video...'

    this.micrositeService.uploadFile(file).subscribe({
      next: (transformedUrl) => {
        this.isUploading = false

        // Update the videoUrl form field for the specific item
        const listArray = this.editorForm.get('list') as FormArray
        if (listArray && listArray.at(index)) {
          listArray.at(index).get('videoUrl')?.setValue(transformedUrl)
        }
        this.uploadStatus = 'Video uploaded successfully!'

        // Clear status after 3 seconds
        setTimeout(() => {
          this.uploadStatus = ''
          this.currentUploadingIndex = -1
        }, 3000)
      },
      error: (error) => {
        this.isUploading = false
        this.uploadStatus = 'Upload failed. Please try again.'
        this.currentUploadingIndex = -1
        console.error('Video upload error:', error)
      }
    })
  }

  // Slider specific methods
  onSliderClick(event: any) {
    // Slider click handling
  }

  onSliderImageSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      // Validate file type (only jpg, jpeg, and png)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        this.uploadStatus = 'Error: Only JPG and PNG files are allowed'
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
        event.target.value = '' // Reset file input
        return
      }

      // Validate file size (max 500KB)
      const maxSize = 500 * 1024 // 500KB in bytes
      if (file.size > maxSize) {
        this.uploadStatus = `Error: File size must be less than 500KB (current: ${(file.size / 1024).toFixed(2)}KB)`
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
        event.target.value = '' // Reset file input
        return
      }

      this.uploadSliderImage(file)
    }
  }

  uploadSliderImage(file: File) {
    this.uploadStatus = 'Uploading...'

    this.micrositeService.uploadFile(file).subscribe({
      next: (transformedUrl) => {
        // Update all banner sizes with the same URL
        const bannersControl = this.sliderItemForm.get('banners')
        if (bannersControl) {
          bannersControl.get('l')?.setValue(transformedUrl)
          bannersControl.get('m')?.setValue(transformedUrl)
          bannersControl.get('s')?.setValue(transformedUrl)
          bannersControl.get('xl')?.setValue(transformedUrl)
          bannersControl.get('xs')?.setValue(transformedUrl)
          bannersControl.get('xxl')?.setValue(transformedUrl)
        }

        this.uploadStatus = 'Upload successful!'

        // Clear status after 3 seconds
        setTimeout(() => {
          this.uploadStatus = ''
        }, 3000)
      },
      error: (error) => {
        this.uploadStatus = 'Upload failed. Please try again.'
        console.error('Upload error:', error)
      }
    })
  }

  addSliderItem() {
    this.isEditingSlider = true
    this.editingIndex = -1
    this.initSliderItemForm()
  }

  editSliderItem(index: number) {
    this.isEditingSlider = true
    this.editingIndex = index
    this.initSliderItemForm(this.sliderData.sliders[index])
  }

  removeSliderItem(index: number) {
    this.sliderData.sliders.splice(index, 1)
    this.updateEditorFormValue()
  }

  saveSliderItem() {
    if (this.sliderItemForm.valid) {
      const item: SliderItem = this.sliderItemForm.value

      // Ensure all banner sizes have the same URL if not already set
      const mainImageUrl = item.banners.l
      if (mainImageUrl) {
        item.banners.m = item.banners.m || mainImageUrl
        item.banners.s = item.banners.s || mainImageUrl
        item.banners.xl = item.banners.xl || mainImageUrl
        item.banners.xs = item.banners.xs || mainImageUrl
        item.banners.xxl = item.banners.xxl || mainImageUrl
      }

      // Ensure queryParams is an object
      if (!item.queryParams || typeof item.queryParams !== 'object') {
        item.queryParams = {}
      }

      if (this.editingIndex === -1) {
        // Add new item
        this.sliderData.sliders.push(item)
      } else {
        // Update existing item
        this.sliderData.sliders[this.editingIndex] = item
      }

      this.updateEditorFormValue()
      this.cancelSliderItemEdit()
    }
  }

  cancelSliderItemEdit() {
    this.isEditingSlider = false
    this.editingIndex = -1
  }

  updateEditorFormValue() {
    // Update the main form with the new slider data
    this.editorForm.get('value')?.setValue({ ...this.sliderData })
  }

  transformImageUrl(originalUrl: string): string {
    // Replace 'https://storage.googleapis.com/igotqa/' with 'https://portal.qa.karmayogibharat.net/content-store/'
    return originalUrl.replace('https://storage.googleapis.com/igotqa/', 'https://portal.qa.karmayogibharat.net/content-store/')
  }

  addKeyHighlight() {
    this.keyHighlightsArray.push(
      this.fb.control('', [
        Validators.required,
        Validators.maxLength(this.editorForm.get('titleMaxLength')?.value || 200)
      ])
    )
  }

  removeKeyHighlight(index: number) {
    this.keyHighlightsArray.removeAt(index)
  }

  dropKeyHighlight(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.keyHighlightsArray.controls, event.previousIndex, event.currentIndex)
    this.keyHighlightsArray.updateValueAndValidity()
  }

  async onSubmit() {
    if (this.formType === 'keyHighlights') {
      const formValue = this.editorForm.value
      const updatedConfig = {
        enabled: formValue.enabled,
        backgroundColor: formValue.backgroundColor,
        titleMaxLength: formValue.titleMaxLength,
        content: formValue.keyHighlights.map((title: string) => ({ title })),
        sliderData: {
          styleData: formValue.sliderData.styleData
        }
      }
      this.dialogRef.close(updatedConfig)
    } else if (this.formType === 'weekHighlights') {
      if (this.editorForm.valid) {
        // Create structured data for week highlights with proper list format
        const formValue = this.editorForm.value
        const updatedConfig = {
          title: formValue.title,
          list: formValue.list
        }
        this.dialogRef.close(updatedConfig)
      }
    } else if (this.formType === 'metrics') {
      if (this.editorForm.valid) {
        // Create structured data for metrics with enabled flag
        const formValue = this.editorForm.value
        const updatedConfig = {
          enabled: formValue.enabled,
          background: formValue.background,
          data: formValue.data
        }
        this.dialogRef.close(updatedConfig)
      }
    } else if (this.formType === 'topLearnersConfig') {
      if (this.editorForm.valid) {
        // Create structured data for top learners with enabled flag
        this.data.value.enabled = this.editorForm.value.enabled
        this.dialogRef.close(this.data.value) // Return all form values as config
      }
    } else if (this.formType === 'userProgressConfig') {
      if (this.editorForm.valid) {
        // Return structured data matching the expected format:
        // { enabled: true, data: { title, infoText, infoIcon, profleDetails, hideEle, insights } }
        const formValue = this.editorForm.value
        this.dialogRef.close(formValue) // Return the form value with enabled and nested data
      }
    } else if (this.formType === 'eventsConfig') {
      if (this.editorForm.valid) {
        // Return structured data with enabled flag
        this.data.value.enabled = this.editorForm.value.enabled
        this.dialogRef.close(this.data.value) // Return the form value with enabled flag
      }
    } else if (this.formType === 'mdoLeaderboardConfig') {
      if (this.editorForm.valid) {
        // Return structured data with enabled flag
        const formValue = this.editorForm.value
        this.data.value.enabled = formValue.enabled
        this.dialogRef.close(this.data.value) // Return the data value with updated enabled flag
      }
    } else if (this.formType === 'cbpPlanConfig') {
      if (this.editorForm.valid) {
        // Return structured data with list of CBP plans
        const formValue = this.editorForm.value
        this.data.value.list = formValue.list

        this.dialogRef.close(this.data.value)
      }
    } else if (this.formType === 'lookerConfig') {
      if (this.editorForm.valid) {
        // Return looker configuration data
        const formValue = this.editorForm.value
        this.data.value.enabled = formValue.enabled

        // Update header data
        if (!this.data.value.header) {
          this.data.value.header = {}
        }
        this.data.value.header.headerText = formValue.headerText
        this.data.value.header.description = formValue.headerDescription

        this.data.value.desktopHeight = formValue.desktopHeight
        this.data.value.mobileHeight = formValue.mobileHeight
        this.data.value.lookerProDesktopUrl = formValue.lookerProDesktopUrl
        this.data.value.lookerProMobileUrl = formValue.lookerProMobileUrl

        this.dialogRef.close(this.data.value)
      }
    } else if (this.formType === 'announcementsConfig') {
      if (this.editorForm.valid) {
        // Return structured data with enabled, title, and list
        const formValue = this.editorForm.value
        this.data.value.enabled = formValue.enabled
        this.data.value.title = formValue.title
        if (Array.isArray(formValue.list) && formValue.list.length > 0) {
          const announcementPromises: Promise<any>[] = []
          announcementPromises.push(this.checkAndCreateAnnouncementItem(formValue.list))
          await Promise.all(announcementPromises)
        }
        this.dialogRef.close(this.data.value)
      }
    } else if (this.formType === 'speakersConfig') {
      if (this.editorForm.valid) {
        try {
          // Get form values
          const formValue = this.editorForm.value

          // Get speakers list and create a deep copy to avoid reference issues
          const speakersList = this.getSpeakersList()
          const speakersListCopy = JSON.parse(JSON.stringify(speakersList))

          // Return with the speakerOftheDay structure format
          const speakerConfig = {
            speakerOftheDay: {
              enabled: formValue.enabled,
              data: {
                title: formValue.data.title,
                infoText: formValue.data.infoText,
                infoIcon: formValue.data.infoIcon,
                list: speakersListCopy  // Use the deep copied list
              }
            }
          }
          this.dialogRef.close(speakerConfig)
        } catch (error) {
          console.error('Error submitting speakers form:', error)
        }
      }
    } else if (this.formType === 'image') {
      this.dialogRef.close(this.editorForm.value.items)
    } else if (this.editorForm.valid) {
      this.dialogRef.close(this.editorForm.value.value)
    }
  }

  checkAndCreateAnnouncementItem(list: any[]) {
    return new Promise<boolean>((resolve) => {
      if (Array.isArray(list) && list.length > 0) {
        list.forEach(item => {
          if (item.name && item.description && !item.announcementId) {
            // Create announcement item
            const reqBody = {
              name: item.name || '',
              description: item.description || '',
              category: item.category || '',
              createdBy: this.configSvc.userProfile?.userId || '',
              sourceName: this.configSvc.userProfile?.departmentName || '',
              createdFor: [this.configSvc.userProfile?.rootOrgId || ''],
              channel: this.configSvc.userProfile?.rootOrgId || ''
            }
            this.micrositeService.createAnnouncements(reqBody).subscribe({
              next: () => {
                resolve(true)
              },
              error: (error) => {
                console.error('Error creating announcement:', error)
                resolve(false)
              }
            })
          } else if (item.announcementId) {
            // Check if announcement item has changed by comparing with existing data
            const existingItem = this.data.value.list?.find((existing: any) => existing.announcementId === item.announcementId)

            if (existingItem) {
              // Check if any field has changed
              const hasChanged = existingItem.name !== item.name ||
                existingItem.description !== item.description ||
                existingItem.category !== item.category

              if (hasChanged) {
                // Update announcement item

                this.micrositeService.readAnnouncements(item.announcementId).pipe(
                  switchMap((existingAnnouncement: any) => {
                    const tempData = existingAnnouncement?.result?.data || {}
                    const updateReqBody = {
                      announcementId: item.announcementId,
                      name: item.name || '',
                      description: item.description || '',
                      category: item.category || '',
                      createdBy: tempData.createdBy || '',
                      sourceName: tempData.sourceName || '',
                      imgUrl: tempData.imgUrl || '',
                      createdFor: tempData.createdFor || [],
                      channel: tempData.channel || ''
                    }
                    return this.micrositeService.updateAnnouncements(updateReqBody).pipe(
                      map((updateRes: any) => {
                        return { existingAnnouncement, updateRes }
                      })
                    )
                  })
                ).subscribe({
                  next: () => {
                    resolve(true)
                  },
                  error: (error) => {
                    console.error('Error updating announcement:', error)
                    resolve(false)
                  }
                })
              } else {
                resolve(true)
              }
            } else {
              console.warn('No existing item found for announcementId:', item.announcementId)
              resolve(true)
            }
          }
        })
      }
    })
  }

  onCancel() {
    this.dialogRef.close()
  }

  dropSliderItem(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sliderData.sliders, event.previousIndex, event.currentIndex)
    this.updateEditorFormValue()
  }
}