import { Component, Input, OnInit, QueryList, ViewChildren, Output, EventEmitter, Inject, Optional, OnChanges, SimpleChanges } from '@angular/core'
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive'

@Component({
  selector: 'sb-uic-highlights-of-week',
  templateUrl: './highlights-of-week.component.html',
  styleUrls: ['./highlights-of-week.component.scss']
})
export class HighlightsOfWeekComponent implements OnInit, OnChanges {

  @Input() objectData: any
  @Input() isEdit: boolean = false;
  @Output() editEvent = new EventEmitter<any>();

  currentIndex = 0;
  contentdata: any = [];
  styleData: any = {};
  expand: boolean = true;

  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>

  private eventCallback: ((event: any) => void) | null = null;

  constructor() {
    // Manual property check from window.__INJECTOR__ (which will be set by MdoChannelV3Component)
    try {
      const injectorData = (window as any).__INJECTOR_DATA || {}

      // Set isEdit from global injector data
      if (injectorData.isEdit !== undefined) {
        this.isEdit = injectorData.isEdit
      }

      // Try to find the eventCallback
      if (typeof injectorData.eventCallback === 'function') {
        this.eventCallback = injectorData.eventCallback
      } else if ((window as any).INJECTED_CALLBACKS?.highlightsOfWeek) {
        this.eventCallback = (window as any).INJECTED_CALLBACKS.highlightsOfWeek
      } else if ((window as any).mdoChannelComponent?.handleSectionEvent) {
        this.eventCallback = (event: any) => (window as any).mdoChannelComponent.handleSectionEvent(event)
      }
    } catch (e) {
      console.error('Error accessing injector data:', e)
    }
  }

  ngOnInit() {
    // Check if we're injected with an eventCallback (from parent MDO component)
    try {
      // Check for isEdit from __INJECTOR_DATA again in ngOnInit
      const injectorData = (window as any).__INJECTOR_DATA || {}
      if (injectorData.isEdit !== undefined) {
        this.isEdit = injectorData.isEdit
      }

      // Try multiple methods to get the callback
      this.eventCallback = (window as any).INJECTED_CALLBACKS?.['highlightsOfWeek'] ||
        (window as any).__INJECTOR_DATA?.eventCallback ||
        null

    } catch (e) {
      console.error('Error finding event callback:', e)
    }

    this.styleData = this.objectData && this.objectData.sliderData && this.objectData.sliderData.styleData
    this.loadContentData()
  }

  // Helper method to load content data from objectData
  ngOnChanges(changes: SimpleChanges) {
    // Reload content data when objectData changes
    if (changes.objectData && !changes.objectData.firstChange) {
      this.loadContentData()
    }
  }

  loadContentData() {
    this.contentdata = []

    // Handle the case when list is provided directly
    if (this.objectData && this.objectData.list && Array.isArray(this.objectData.list)) {
      this.objectData.list.forEach((contentEle: any) => {
        const localData = {
          title: contentEle.title || '',
          videoUrl: contentEle.videoUrl || '',
          cardSubType: "card-wide-lib",
          description: contentEle.description || ''
        }
        this.contentdata.push(localData)
      })
    }
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }

  onEditClick() {
    // Prepare the data structure with the list of highlights
    const highlightsData = {
      title: this.objectData?.title || 'Week Highlights',
      list: this.contentdata.map(item => ({
        title: item.title || '',
        description: item.description || '',
        videoUrl: item.videoUrl || ''
      }))
    }

    // Option 1: Use EventEmitter if the component is used with a direct parent-child relationship
    const eventData = {
      source: 'weekHighlights',
      action: 'edit',
      data: {
        fieldName: 'weekHighlights',
        displayName: 'Week Highlights',
        value: highlightsData,
        fieldType: 'weekHighlights',
        section: 'weekHighlights'
      }
    }

    this.editEvent.emit(eventData)

    // Option 2: Use the eventCallback if the component is used with the injector pattern
    if (this.eventCallback) {
      this.eventCallback(eventData)
    } else {
      // Fallback to using window.__INJECTOR_DATA if it exists
      if ((window as any).__INJECTOR_DATA && typeof (window as any).__INJECTOR_DATA.eventCallback === 'function') {
        (window as any).__INJECTOR_DATA.eventCallback(eventData)
      } else {
        // Direct call to MdoChannelV3Component if it exists in window
        if ((window as any).mdoChannelComponent && typeof (window as any).mdoChannelComponent.handleSectionEvent === 'function') {
          (window as any).mdoChannelComponent.handleSectionEvent(eventData)
        } else {
          console.error('No way to handle edit event! Edit functionality will not work.')
          alert('Unable to open editor. Please try again or contact support.')
        }
      }
    }
  }
}
