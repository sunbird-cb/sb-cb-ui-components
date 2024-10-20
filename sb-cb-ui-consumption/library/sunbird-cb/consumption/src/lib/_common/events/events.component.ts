import { Component, Input, OnInit } from '@angular/core'
import { InsiteDataService } from '../../_services/insite-data.service'
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'sb-uic-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @Input() object: any
  @Input() nwlEventsConfig: any
  daysBetween: any = []
  events: any = []
  requestBody: any
  currentDay: any
  loader: boolean = false
  constructor(public insightSvc: InsiteDataService) { }

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
          startDate	: {
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
      if(currentDate.isSame(moment(), 'day')){
        this.currentDay = currentDate.format('YYYY-MM-DD')
      }
      currentDate.add(1, 'days').format('YYYY-MM-DD')
      this.daysBetween.push(localObj)
    }
    console.log("currentDay ", this.currentDay)
  }

  getEvents(slectedDate: any) {
    this.currentDay = slectedDate.target.value
    let nextDay = moment(slectedDate.target.value, 'YYYY-MM-DD')
    nextDay.add(1, 'days')
    this.requestBody.request.filters.startDate[">="] = this.currentDay
    this.requestBody.request.filters.startDate["<"] = nextDay.format('YYYY-MM-DD')
    this.loader = true
    this.insightSvc.fetchTrainingDetails(this.requestBody).subscribe((res: any)=> {
      this.events = []
      if (res && res.result && res.result.count > 0) {

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
    let nextDay = moment(this.currentDay, 'YYYY-MM-DD')
    nextDay.add(1, 'days')
    this.requestBody.request.filters.startDate[">="] = this.currentDay
    this.requestBody.request.filters.startDate["<"] = nextDay.format('YYYY-MM-DD')
    this.loader = true
    this.insightSvc.fetchTrainingDetails(this.requestBody).subscribe((res: any)=> {
      this.events = []
      if (res && res.result && res.result.count > 0) {
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
    return eventsdata.sort((a:any, b:any)=> {
      return (a.startTime === b.startTime)? 0 : b.startTime? -1 : 1;
    });
  }

  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }

}
