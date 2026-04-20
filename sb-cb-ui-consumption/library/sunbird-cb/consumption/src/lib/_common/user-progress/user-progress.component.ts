import { Component, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core'
import { InsiteDataService } from '../../_services/insite-data.service'
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'sb-uic-user-progress',
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.scss']
})
export class UserProgressComponent implements OnInit {

  @Input() objectData: any
  @Input() rootOrgId: any
  @Input() isEdit: boolean = false;
  @Input() isEditable: boolean = false;
  @Output() editClicked = new EventEmitter<any>();
  insitesData = []
  currentIndex = 0
  styleData: any = {}
  userProgress: any = {}
  expand: boolean = true
  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>
  // Will store the event callback function from the parent
  private eventCallback: Function | undefined

  constructor(
    public insightSvc: InsiteDataService,
    private configSvc: ConfigurationsService,
    private injector: Injector
  ) {
    try {
      // Get values from injector
      const isEditInput = this.injector.get('isEdit', false)
      const isEditableInput = this.injector.get('isEditable', false)
      const sectionData = this.injector.get('sectionData', null)
      const orgIdInput = this.injector.get('orgId', null)
      const eventCallbackInput = this.injector.get('eventCallback', null)

      // Set edit flags from injector
      if (typeof isEditInput === 'boolean') {
        this.isEdit = isEditInput
      }
      if (typeof isEditableInput === 'boolean') {
        this.isEditable = isEditableInput
      }

      // Set objectData from sectionData if available
      if (sectionData) {
        this.objectData = sectionData
      }

      // Set rootOrgId from injector
      if (orgIdInput) {
        this.rootOrgId = orgIdInput
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
    // Ensure objectData is defined and has the expected structure
    if (this.objectData?.insights?.data?.sliderData?.styleData) {
      this.styleData = this.objectData.insights.data.sliderData.styleData
    } else {
      // Set default style data if not available
      this.styleData = {
        borderRadius: '8px',
        backgroundColor: '#ffffff'
      }
    }

    this.getUserProgress()
    this.getInsightsData()

    // Clear any additional event callbacks that might be causing duplicate modals
    if (!this.eventCallback) {
      try {
        this.eventCallback = this.injector.get('eventCallback')
      } catch (e) {
      }
    }
  }

  getUserProgress() {
    if (!this.userProgress.fullname && this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile.firstName) {
      this.userProgress['fullname'] = this.configSvc.userProfile.firstName
      this.userProgress['profile_image'] = this.configSvc.userProfile.profileImageUrl
    }
    this.insightSvc.fetchUserProgress().subscribe((res: any) => {

      if (res && res.result && res.result.userLeaderBoard) {
        this.userProgress = { ...this.userProgress, ...res.result.userLeaderBoard }
      }
    }, error => {
      this.userProgress['fullname'] = this.configSvc.userProfile.firstName
      this.userProgress['profile_image'] = this.configSvc.userProfile.profileImageUrl
    })
  }
  getInsightsData() {
    const request = {
      request: {
        filters: {
          primaryCategory: 'programs',
          organisations: [
            'across',
            this.rootOrgId,
            //"01390354700029132834"
          ],
        },
      },
    }
    this.insightSvc.fetchInsightsData(request).subscribe((res: any) => {
      if (res && res.result && res.result.response && res.result.response.nudges) {
        this.insitesData = res.result.response.nudges
        this.insitesData = this.insitesData.map((obj: any) => {
          return { ...obj, cardSubType: 'card-wide-lib' }
        })
      }
    })
  }

  roundTo(number: any) {
    return Math.round(number * 100 / 100)
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }

  createInititals(name: string) {
    let initials = ''
    const array = name.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      for (let i = 0; i < name.length; i += 1) {
        if (name.charAt(i) === ' ') {
          continue
        }
        if (name.charAt(i) === name.charAt(i)) {
          initials += name.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    return initials.toUpperCase()
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

  formatNumber(value: any): string {
    if (!value) {
      return '0'
    }

    const num = Number(value)
    if (isNaN(num)) {
      return '0'
    }

    // Check if number is decimal (has fractional part)
    if (num % 1 !== 0) {
      // Round to 2 decimal places
      return num.toFixed(2)
    }

    // Return as integer if no decimal part
    return num.toString()
  }

  /**
   * Handle edit button click
   * Emits an event to be handled by parent component (mdo-channel-v3)
   */
  onEdit() {
    const eventData = {
      source: 'userProgress',
      action: 'edit',
      data: {
        fieldName: 'userProgressConfig',
        displayName: 'User Progress Configuration',
        value: this.objectData,
        fieldType: 'userProgressConfig'
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
