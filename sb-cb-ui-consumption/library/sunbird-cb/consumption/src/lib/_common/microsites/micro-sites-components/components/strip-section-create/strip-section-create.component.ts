import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { StripAddContentComponent } from '../strip-add-content/strip-add-content.component'
import { AddTabDialogComponent } from '../add-tab-dialog/add-tab-dialog.component'
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MicrositeV3Service } from '../../../../../_services/microsite-v3.service'
import { v4 as uuid } from 'uuid'

@Component({
  selector: 'sb-uic-strip-section-create',
  templateUrl: './strip-section-create.component.html',
  styleUrls: ['./strip-section-create.component.scss']
})
export class StripSectionCreateComponent implements OnInit {
  @Input() sectionData: any
  @Input() sectionIndex: number = 0;
  @Input() providerId: string = '';
  @Input() channelName: string = '';
  @Output() removeSection = new EventEmitter<void>();
  @Output() playlistCreated = new EventEmitter<any>();

  isEditingTitle = false;
  tempTitle = '';
  tempEnabled = true

  constructor(private dialog: MatDialog,
    public configSvc: ConfigurationsService,
    public microSiteV3Service: MicrositeV3Service,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Initialize tempEnabled from sectionData
    if (this.sectionData && this.sectionData.hasOwnProperty('enabled')) {
      this.tempEnabled = this.sectionData.enabled
    }
  }

  onRemoveSection() {
    this.removeSection.emit()
  }

  onToggleSectionVisibility(event: any) {
    // Update sectionData.enabled with the new toggle value
    this.sectionData.enabled = !this.tempEnabled
  }

  startEditTitle() {
    this.isEditingTitle = true
    this.tempTitle = this.sectionData?.strips[0]?.title || 'Add Section Name'
  }

  saveTitle() {
    if (this.tempTitle.trim()) {
      const titleText = this.tempTitle.trim()
      const camelCaseKey = this.toCamelCase(titleText)
      if (this.sectionData?.strips?.length > 0) {
        this.sectionData.strips[0].title = titleText
        if (!Object.keys(this.sectionData?.strips[0]?.request || {}).length && !this.sectionData?.strips[0]?.tabs?.length) {
          this.sectionData.strips[0].key = `${camelCaseKey}_${uuid()}`
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

  cancelEdit() {
    this.isEditingTitle = false
    this.tempTitle = ''
  }

  onTitleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveTitle()
    } else if (event.key === 'Escape') {
      this.cancelEdit()
    }
  }

  openAddTabDialog() {
    const dialogRef = this.dialog.open(AddTabDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.trim()) {
        this.addTab(result.trim())
      }
    })
  }

  addTab(title: string) {
    // Initialize tabs array if it doesn't exist
    if (!this.sectionData.strips[0].tabs) {
      this.sectionData.strips[0].tabs = []
    }

    // Create new tab object with minimal structure for edit mode
    const newTab = {
      label: title,
      value: title,
      computeDataOnClick: false,
      disableTranslate: true,
      computeDataOnClickKey: "",
      requestRequired: true,
      showTabDataCount: false,
      maxWidgets: 100,
      nodataMsg: "No content available",
      contentShuffel: true,
      request: {
        apiUrl: '',
        playlistRead: {
          type: ''
        }
      }
    }

    // Add tab to array and trigger change detection by reassigning
    this.sectionData.strips[0].tabs = [...this.sectionData.strips[0].tabs, newTab]

    // Manually trigger change detection
    this.cdr.detectChanges()
  }

  removeTab(index: number) {
    if (!this.sectionData.strips[0].tabs) {
      return
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Remove Tab',
        message: 'Are you sure you want to remove this tab? This action cannot be undone.',
        confirmText: 'Remove',
        cancelText: 'Cancel',
      },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create new array without the item at index to trigger change detection
        this.sectionData.strips[0].tabs = this.sectionData.strips[0].tabs.filter((_, i) => i !== index)

        // Manually trigger change detection
        this.cdr.detectChanges()
      }
    })
  }

  openAddContentDialog(tabData?: any) {
    const dialogRef = this.dialog.open(StripAddContentComponent, {
      width: '1000px',
      height: '80vh',
      maxHeight: '800px',
      data: {
        sectionIndex: this.sectionIndex,
        sectionData: this.sectionData,
        tabData: tabData || {}
      },
      position: { top: '50px' },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.selectedItems && result.selectedItems.length > 0) {
        // Handle the result from the dialog
        const contentIds = []
        result.selectedItems.forEach((item: any) => {
          if (!contentIds.includes(item.identifier)) {
            contentIds.push(item.identifier)
          }
        })
        this.createPlaylist(contentIds, result.allOrgContent, result?.tabDetails || {})
      }
    })
  }

  createPlaylist(contentIds: string[], allOrgContent: boolean, tabDetails: any) {
    let tempType = ``
    if (tabDetails) {
      tempType = `MDO_${tabDetails?.value?.split(' ').join('_')}_${uuid()}_ALLCONTENT_${allOrgContent ? 'TRUE' : 'FALSE'}`
    } else {
      tempType = `MDO_${this.sectionData?.strips[0]?.key}_ALLCONTENT_${allOrgContent ? 'TRUE' : 'FALSE'}`
    }
    const requestBody = {
      type: tempType,
      orgId: this.configSvc.userProfile?.rootOrgId || '',
      ownerId: this.configSvc.userProfile?.userId,
      children: contentIds
    }
    this.microSiteV3Service.createPlaylistApi(requestBody).subscribe(
      (response) => {
        if (response?.result?.status?.toLowerCase() === 'created') {
          if (Object.keys(tabDetails).length > 0) {
            this.sectionData.strips[0].tabs = this.sectionData.strips[0].tabs.map((tab: any) => {
              if (tab.value === tabDetails.value) {
                tab.request = {
                  apiUrl: "/apis/proxies/v8/playList/read/<playlistKey>/<orgID>",
                  playlistRead: {
                    type: requestBody.type,
                  }
                }
              }
              return tab
            })
          } else {
            this.sectionData.strips[0].request = {
              apiUrl: "/apis/proxies/v8/playList/read/<playlistKey>/<orgID>",
              playlistRead: {
                type: requestBody.type,
              }
            }
          }

          // Emit the playlist created event to parent
          this.playlistCreated.emit({
            sectionIndex: this.sectionIndex,
            sectionData: this.sectionData,
            response: response
          })
        }
      },
      (error) => {
        console.error('Error creating playlist:', error)
      }
    )
  }
}
