import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MicrositeV3Service } from '../../../../../_services/microsite-v3.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { v4 as uuid } from 'uuid'

@Component({
  selector: 'sb-uic-strip-add-content',
  templateUrl: './strip-add-content.component.html',
  styleUrls: ['./strip-add-content.component.scss']
})
export class StripAddContentComponent {
  searchText = '';
  selectedContents = 'all';
  allOrgContent = true;
  isEditingTitle = false;
  tempTitle = '';
  isEditMode = false;
  isAllOrgContentDisabled = false;

  contents = [
    { value: 'allContent', label: 'All Content' },
    { value: 'Course', label: 'Course' },
    { value: 'Moderated Course', label: 'Moderated Course' },
    { value: 'Curated Program', label: 'Curated Program' },
    { value: 'Blended Program', label: 'Blended Program' },
    { value: 'invite-only program', label: 'Invite Only Program' },
    { value: 'Moderated Program', label: 'Moderated Program' },
    { value: 'Standalone Assessment', label: 'Standalone Assessment' },
    { value: 'invite-only assessment', label: 'Invite Only Assessment' },
    { value: 'Moderated Assessment', label: 'Moderated Assessment' }
  ];
  contentsList: any[] = [];
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  currentSelectedType: any
  selectedContentItems: any[] = [];
  showPreview = false;

  constructor(
    public dialogRef: MatDialogRef<StripAddContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public micrositeV3Service: MicrositeV3Service,
    public configSvc: ConfigurationsService
  ) {
    if (Object.keys(this.data?.tabData || {})?.length > 0) {
      this.tempTitle = this.data?.tabData?.label || 'Add Section Name'
      this.checkAndLoadExistingTabData()
    } else {
      this.tempTitle = this.data?.sectionData?.strips?.[0]?.title || 'Add Section Name'
      this.checkAndLoadExistingData()
    }
    this.currentSelectedType = this.contents[0]
    this.checkAndLoadExistingData()
    this.getContentsList()
  }

  checkAndLoadExistingData(): void {
    if (this.data?.sectionData?.strips?.[0]?.request &&
      Object.keys(this.data.sectionData.strips[0].request).length > 0) {
      const request = this.data.sectionData.strips[0].request

      // Set edit mode to true when existing request data is found
      this.isEditMode = true

      // Check playlistRead.type to determine allOrgContent setting
      if (request.playlistRead?.type) {
        const playlistType = request.playlistRead.type

        if (playlistType.includes('ALLCONTENT_TRUE')) {
          this.allOrgContent = true
          this.isAllOrgContentDisabled = true
        } else if (playlistType.includes('ALLCONTENT_FALSE')) {
          this.allOrgContent = false
          this.isAllOrgContentDisabled = true
        }
      }

      // Check if apiUrl exists in the request
      if (request.apiUrl) {
        // Call the API to get existing playlist data
        this.micrositeV3Service.readPlaylistWithURL(request.apiUrl).subscribe(
          (response) => {
            // Handle the response and populate selectedContentItems
            if (response?.result?.content) {
              this.selectedContentItems = response.result.content
            }
          },
          (error) => {
            console.error('Error loading playlist data:', error)
          }
        )
      }
    }
  }

  checkAndLoadExistingTabData() {
    if (Object.keys(this.data?.tabData?.request).length > 0) {
      const request = this.data?.tabData?.request

      // Set edit mode to true when existing request data is found
      this.isEditMode = true

      // Check playlistRead.type to determine allOrgContent setting
      if (request.playlistRead?.type) {
        const playlistType = request.playlistRead.type

        if (playlistType.includes('ALLCONTENT_TRUE')) {
          this.allOrgContent = true
          this.isAllOrgContentDisabled = true
        } else if (playlistType.includes('ALLCONTENT_FALSE')) {
          this.allOrgContent = false
          this.isAllOrgContentDisabled = true
        }
      }

      // Check if apiUrl exists in the request
      if (request.apiUrl) {
        // Call the API to get existing playlist data
        this.micrositeV3Service.readPlaylistWithURL(request.apiUrl).subscribe(
          (response) => {
            // Handle the response and populate selectedContentItems
            if (response?.result?.content) {
              this.selectedContentItems = response.result.content
            }
          },
          (error) => {
            console.error('Error loading playlist data:', error)
          }
        )
      }
    }

  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onAdd(): void {
    // Send 'add' action with selected items
    this.dialogRef.close({
      action: 'add',
      selectedItems: this.selectedContentItems,
      allOrgContent: this.allOrgContent,
      tabDetails: this.data?.tabData || {}
    })
  }

  onUpdate(): void {
    // Send 'update' action with selected items and existing request data
    this.dialogRef.close({
      action: 'update',
      selectedItems: this.selectedContentItems,
      allOrgContent: this.allOrgContent,
      requestData: this.data?.sectionData?.strips?.[0]?.request,
      tabDetails: this.data?.tabData || {}
    })
  }

  onPreview(): void {
    this.showPreview = !this.showPreview
  }

  toggleSelection(content: any): void {
    const index = this.selectedContentItems.findIndex(item => item.identifier === content.identifier)
    if (index > -1) {
      this.selectedContentItems.splice(index, 1)
    } else {
      this.selectedContentItems.push(content)
    }
  }

  isSelected(content: any): boolean {
    return this.selectedContentItems.some(item => item.identifier === content.identifier)
  }

  removeSelectedItem(item: any): void {
    const index = this.selectedContentItems.findIndex(selected => selected.identifier === item.identifier)
    if (index > -1) {
      this.selectedContentItems.splice(index, 1)
    }
    // If in preview mode and no items left, go back to search
    if (this.showPreview && this.selectedContentItems.length === 0) {
      this.showPreview = false
    }
  }

  onSearch(): void {
    this.pageIndex = 0
    this.getContentsList()
  }

  onOrgContentToggle(): void {
    // Reset selected content items when toggle changes
    this.selectedContentItems = []
    // Trigger new search
    this.onSearch()
  }

  getContentsList(): void {
    const requestBody = {
      request: {
        limit: this.pageSize,
        offset: this.pageIndex * this.pageSize,
        query: this.searchText || '',
        facets: ['courseCategory'],
        filters: {
          must: {
            courseCategory: [
            ]
          },
          status: ['Live'],
          createdFor: []
        },
        sort_by: { 'lastUpdatedOn': 'desc' }
      }
    }
    if (!this.allOrgContent) {
      requestBody.request.filters.createdFor = [this.configSvc.userProfile.rootOrgId]
    }
    if (this.currentSelectedType?.value === 'allContent') {
      requestBody.request.filters.must.courseCategory = this.contents
        .filter(content => content.value !== 'allContent')
        .map(content => content.value)
    } else {
      requestBody.request.filters.must.courseCategory = [this.currentSelectedType?.value]
    }
    this.micrositeV3Service.searchContent(requestBody).subscribe((res: any) => {
      this.contentsList = res?.result?.content || []
      this.totalCount = res?.result?.count || 0
    })
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.getContentsList()
  }

  onContentTypeChange(): void {
    const selected = this.contents.find(c => c.value === this.selectedContents)
    if (selected) {
      this.currentSelectedType = selected
      this.pageIndex = 0
      this.getContentsList()
    }
  }

  startEditTitle(): void {
    this.isEditingTitle = true
  }

  saveTitle(): void {
    if (this.tempTitle.trim()) {
      const titleText = this.tempTitle.trim()
      const camelCaseKey = this.toCamelCase(titleText)
      if (this.data?.tabData) {
        this.data.tabData.label = titleText
        this.data.tabData.value = titleText
      } else if (this.data?.sectionData?.strips?.length > 0) {
        this.data.sectionData.strips[0].title = titleText
        // Only update key if no request or tabs exist
        if (!Object.keys(this.data.sectionData.strips[0]?.request || {}).length &&
          !this.data.sectionData.strips[0]?.tabs?.length) {
          this.data.sectionData.strips[0].key = `${camelCaseKey}_${uuid()}`
        }
      }
    }
    this.isEditingTitle = false
  }

  toCamelCase(str: string): string {
    // Remove special characters and split by spaces
    return str
      .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase()
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join('')
  }

  cancelEdit(): void {
    this.isEditingTitle = false
    this.tempTitle = ''
  }

  onTitleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveTitle()
    } else if (event.key === 'Escape') {
      this.cancelEdit()
    }
  }
}
