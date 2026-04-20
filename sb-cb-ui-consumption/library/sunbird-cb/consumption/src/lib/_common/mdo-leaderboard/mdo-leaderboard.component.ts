import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Injector } from '@angular/core'
import { InsiteDataService } from '../../_services/insite-data.service'

@Component({
  selector: 'sb-uic-mdo-leaderboard',
  templateUrl: './mdo-leaderboard.component.html',
  styleUrls: ['./mdo-leaderboard.component.scss']
})
export class MdoLeaderboardComponent implements OnInit {

  currentTab: any = 'XL'
  result: any = []
  filteredData: any
  searchTerm: string = ''
  expand: boolean = true
  disableLeft: boolean = true
  disableRight: boolean = false
  @Input() orgId: any = ''

  @Input() object: any
  @Input() slwConfig: any = {}
  @Input() isEdit: boolean = false;
  @Input() isEditable: boolean = false;
  @Output() tabClicked = new EventEmitter<any>()
  @Output() editClicked = new EventEmitter<any>();
  @ViewChild('scrollableContent', { static: false }) scrollableContent: ElementRef

  // Will store the event callback function from the parent
  private eventCallback: Function | undefined

  constructor(
    private insiteDataService: InsiteDataService,
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
    this.currentTab = this.object.currentTab || this.currentTab
    if (this.slwConfig && this.slwConfig.enabled) {
      this.getSlwData()
    } else {
      this.getData()
    }
  }

  getSlwData() {
    let request = {
      "request": {
        "mdoId": this.orgId
      }
    }
    this.insiteDataService.fetchSlwLeaderboard(request).subscribe((res: any) => {
      if (res && res.result) {
        this.result = res.result
        this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
      }

    }, error => {
    })
  }

  getData() {
    this.insiteDataService.fetchLeaderboard().subscribe((res: any) => {
      if (res && res.result) {
        this.result = res.result
        this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
      }

    }, error => {
    })
  }

  getFilteredData(response: any) {
    if (response && response.length > 0) {
      return response.filter((user: any) => user.size === this.currentTab)
        .map(user => ({ ...user, children: [], selected: false })).slice(0, 5)
    }
    return []
  }
  getTabData(name: any) {
    this.currentTab = name
    this.searchTerm = ''
    this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
    let nameStr: any = ''
    if (this.object && this.object.options && this.object.options.length > 0) {
      nameStr = this.object.options.find((option: any) => option.value === name).label
    } else {
      switch (name) {
        case 'XL':
          nameStr = 'greater-than-50K'
          break
        case 'L':
          nameStr = '10K-50K'
          break
        case 'M':
          nameStr = '1K-10K'
          break
        case 'S':
          nameStr = '500-1K'
          break
        default:
          nameStr = 'less-than-500'
          break
      }
    }
    this.tabClicked.emit(nameStr)
  }

  getRank(rank: number) {
    return [1, 2, 3].includes(rank) ? `rank${rank}` : 'rank0'
  }

  getMedal(rank: number) {
    if (rank === 1) {
      return 'assets/images/national-learning/Medal1.svg'
    } else if (rank === 2) {
      return 'assets/images/national-learning/Medal2.svg'
    } else {
      return 'assets/images/national-learning/Medal3.svg'
    }
  }

  handleSearchQuery(e: any) {
    if (e.target.value && e.target.value.length > 0) {
      this.searchTerm = e.target.value
      this.filteredData = this.result.mdoLeaderBoard
        .filter(user => user.size === this.currentTab && user.org_name.toLowerCase().includes(e.target.value))
        .map(user => ({ ...user, children: [] })).slice(0, 5)
    } else {
      this.filteredData = this.result.mdoLeaderBoard
        .filter(user => user.size === this.currentTab)
        .map(user => ({ ...user, children: [] })).slice(0, 5)
    }
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

  scrollToRight() {
    this.scrollableContent.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth'
    })
    this.disableLeft = false
    this.disableRight = true
  }


  scrollToLeft() {
    this.scrollableContent.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    })
    this.disableLeft = true
    this.disableRight = false
  }

  /**
   * Handle edit button click
   * Emits an event to be handled by parent component (mdo-channel-v3)
   */
  onEdit() {
    const eventData = {
      source: 'mdoLeaderboard',
      action: 'edit',
      data: {
        fieldName: 'mdoLeaderboardConfig',
        displayName: 'MDO Leaderboard Configuration',
        value: this.object,
        fieldType: 'mdoLeaderboardConfig'
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

