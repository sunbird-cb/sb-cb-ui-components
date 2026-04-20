import { Component, Input, OnInit, Output, EventEmitter, Injector } from '@angular/core'
import { InsiteDataService } from '../../_services/insite-data.service'
import moment from 'moment'


@Component({
  selector: 'sb-uic-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @Input() object: any
  @Input() nwlEventsConfig: any
  @Input() isEdit: boolean = false;
  @Input() isEditable: boolean = false;
  @Output() editClicked = new EventEmitter<any>();
  daysBetween: any = []
  events: any = []
  requestBody: any
  currentDay: any
  loader: boolean = false

  // Will store the event callback function from the parent
  private eventCallback: Function | undefined

  constructor(
    public insightSvc: InsiteDataService,
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
    this.requestBody = {
      locale: [
        'en',
      ],
      query: '',
      request: {
        query: '',
        filters: {
          status: ['Live'],
          contentType: 'Event',
          category: 'Event',
          startDate: {
            ">=": '',
            "<": ''
          }
        },
        sort_by: {
          startDate: 'desc',
        },
      },
    }
    this.getEventsList()
  }
  getDaysBetweenDates() {
    let currentDate = moment(this.nwlEventsConfig.startDate, 'DD-MM-YYYY')
    const endDate = moment(this.nwlEventsConfig.endDate, 'DD-MM-YYYY')
    while (currentDate.isSameOrBefore(endDate)) {
      let localObj = {}
      localObj['startDate'] = currentDate.format('YYYY-MM-DD')
      localObj['diplayFormat'] = currentDate.format('MMM DD, YYYY')
      if (currentDate.isSame(moment(), 'day')) {
        this.currentDay = currentDate.format('YYYY-MM-DD')
      }
      currentDate.add(1, 'days').format('YYYY-MM-DD')
      this.daysBetween.push(localObj)
    }
  }

  getEvents(slectedDate: any) {
    this.currentDay = slectedDate.target.value
    let nextDay = moment(slectedDate.target.value, 'YYYY-MM-DD')
    nextDay.add(1, 'days')
    let requestData: any = {}
    if (this.object && this.object.request && Object.keys(this.object.request).length > 0) {
      requestData = this.object.request
      let startDate = {
        ">=": this.currentDay,
        "<": nextDay.format('YYYY-MM-DD')
      }
      requestData.request.filters.startDate = startDate
    } else {
      this.requestBody.request.filters.startDate[">="] = this.currentDay
      this.requestBody.request.filters.startDate["<"] = nextDay.format('YYYY-MM-DD')
      requestData = this.requestBody
    }
    this.loader = true
    this.insightSvc.fetchTrainingDetails(requestData).subscribe((res: any) => {
      this.events = []
      if (res && res.result && res.result.count > 0) {
        res.result.Event.forEach((eveEle) => {
          eveEle['eventDate'] = this.customDateFormat(eveEle.startDate, eveEle.startTime)
          eveEle['eventendDate'] = this.customDateFormat(eveEle.endDate, eveEle.endTime)
        })
        this.events = this.sortItemByTime(res.result.Event)
        this.loader = false
      } else {
        this.loader = false
      }
    }, error => {
      this.loader = false
    })
  }

  getEventsList() {
    this.getDaysBetweenDates()
    let nextDay = this.currentDay ? moment(this.currentDay, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD')
    nextDay.add(1, 'days')
    this.loader = true
    let requestData: any = {}
    if (this.object && this.object.request && Object.keys(this.object.request).length > 0) {
      requestData = this.object.request
      let startDate = {
        ">=": this.currentDay,
        "<": nextDay.format('YYYY-MM-DD')
      }
      requestData.request.filters.startDate = startDate
    } else {
      this.requestBody.request.filters.startDate[">="] = this.currentDay
      this.requestBody.request.filters.startDate["<"] = nextDay.format('YYYY-MM-DD')
      requestData = this.requestBody
    }
    this.insightSvc.fetchTrainingDetails(requestData).subscribe((res: any) => {
      this.events = []
      if (res && res.result && res.result.count > 0) {
        res.result.Event.forEach((eveEle) => {
          eveEle['eventDate'] = this.customDateFormat(eveEle.startDate, eveEle.startTime)
          eveEle['eventendDate'] = this.customDateFormat(eveEle.endDate, eveEle.endTime)
        })

        this.events = this.sortItemByTime(res.result.Event)
        this.loader = false
      } else {
        this.loader = false
      }
    }, error => {
      this.loader = false
    })
  }

  sortItemByTime(eventsdata: any) {
    return eventsdata.sort((a: any, b: any) => {
      const firstDate: any = new Date(a.eventDate)
      const secondDate: any = new Date(b.eventDate)
      return secondDate < firstDate ? 1 : -1
    })
  }
  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }

  /**
   * Handle edit button click
   * Emits an event to be handled by parent component (mdo-channel-v3)
   */
  onEdit() {
    const eventData = {
      source: 'events',
      action: 'edit',
      data: {
        fieldName: 'eventsConfig',
        displayName: 'Events Configuration',
        value: this.object,
        fieldType: 'eventsConfig'
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

