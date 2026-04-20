import { HttpClient } from '@angular/common/http'
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren, Injector, OnChanges, SimpleChanges } from '@angular/core'
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '../../_services/multilingual-translations.service'

@Component({
  selector: 'sb-uic-cbp-plan',
  templateUrl: './cbp-plan.component.html',
  styleUrls: ['./cbp-plan.component.scss']
})
export class CbpPlanComponent implements OnInit, OnChanges {

  @Input() objectData: any
  @Input() layoutType: any
  @Input() mobileHeight: boolean = false
  @Input() fetchDataFromApi: boolean = false
  @Input() channelId: any
  @Input() isEdit: boolean = false;
  @Input() isEditable: boolean = false;
  @Output() openDialog = new EventEmitter<any>()
  @Output() editClicked = new EventEmitter<any>();
  isLoading: boolean = false
  currentIndex = 0
  styleData: any = {}
  contentdata: any = []

  // Will store the event callback function from the parent
  private eventCallback: Function | undefined

  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>

  constructor(
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private injector: Injector
  ) {
    try {
      // Get values from injector
      const isEditInput = this.injector.get('isEdit', false)
      const isEditableInput = this.injector.get('isEditable', false)
      const eventCallbackInput = this.injector.get('eventCallback', null)

      // Set edit flags from injector
      if (typeof isEditInput === 'boolean') {
        this.isEdit = isEditInput
      }
      if (typeof isEditableInput === 'boolean') {
        this.isEditable = isEditableInput
      }

      // Store the event callback function
      if (eventCallbackInput && typeof eventCallbackInput === 'function') {
        this.eventCallback = eventCallbackInput
      }
    } catch (e) {
      console.error('Error getting values from injector', e)
    }
  }

  ngOnInit() {
    this.loadContentData()
  }

  ngOnChanges(changes: SimpleChanges) {
    // Reload content data when objectData changes
    if (changes['objectData']) {
      this.loadContentData()
    }
  }

  /**
   * Load content data from objectData
   */
  private loadContentData() {
    this.styleData = this.objectData && this.objectData.sliderData && this.objectData.sliderData.styleData
    this.contentdata = []
    if (this.objectData && this.objectData.list) {
      this.objectData.list.forEach((contentEle: any) => {
        let localData = {}
        localData['title'] = contentEle.title
        localData['downloaUrl'] = contentEle.downloaUrl
        localData['cardSubType'] = "card-wide-lib"
        localData['cardCustomeClass'] = ""
        this.contentdata.push(localData)
      })
    }
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }

  getFileName(item: any) {
    return item.downloadUrl.split("/").at(-1)
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  downloadCBPPlan(item: any) {
    const downloadUrl = item.downloaUrl
    if (downloadUrl) {
      // Use fetch to download and convert to blob for forced download
      fetch(downloadUrl, {
        method: 'GET',
        mode: 'cors'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.blob()
        })
        .then(blob => {
          // Create a blob URL and trigger download
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = downloadUrl.split("/").at(-1) || 'document.pdf'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        })
        .catch(error => {
          console.error('Error downloading the PDF:', error)
          // Fallback: open in new tab if fetch fails
          window.open(downloadUrl, '_blank')
        })
    } else {
      console.error('Download URL is not available')
    }
  }

  /**
   * Handle edit button click
   * Emits an event to be handled by parent component (mdo-channel-v3)
   */
  onEdit() {
    const eventData = {
      source: 'cbpPlan',
      action: 'edit',
      data: {
        fieldName: 'cbpPlanConfig',
        displayName: 'CBP Plan Configuration',
        value: this.objectData,
        fieldType: 'cbpPlanConfig'
      }
    }

    // Use only the callback from injector which is the most reliable method
    if (this.eventCallback && typeof this.eventCallback === 'function') {
      this.eventCallback(eventData)
      return
    }

    // Fallback to global injector if direct callback isn't available
    if ((window as any).__INJECTOR_DATA?.eventCallback) {
      (window as any).__INJECTOR_DATA.eventCallback(eventData)
    }
  }
}
