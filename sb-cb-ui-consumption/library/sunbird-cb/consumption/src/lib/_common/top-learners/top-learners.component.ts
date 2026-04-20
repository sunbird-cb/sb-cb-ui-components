import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import moment from 'moment'
import { InsiteDataService } from '../../_services/insite-data.service'
@Component({
  selector: 'sb-uic-top-learners',
  templateUrl: './top-learners.component.html',
  styleUrls: ['./top-learners.component.scss']
})
export class TopLearnersComponent implements OnInit {

  @Input() objectData: any
  @Input() channelId: any
  @Input() channnelName: any
  @Input() slwConfig: any = {}
  @Input() isEdit: boolean = false;
  @Input() isEditable: boolean = false;
  @Output() editClicked = new EventEmitter<any>;

  loading: boolean = false
  month: string = ''
  results: any = []

  colors: any = [
    '#EB7181', // red
    '#306933', // green
    '#000000', // black
    '#3670B2', // blue
    '#4E9E87',
    '#7E4C8D',
    '#EB7181', // red
    '#306933', // green
    '#000000', // black
    '#3670B2', // blue
  ]

  constructor(
    public insightSvc: InsiteDataService,
  ) {
    // Try to access global injector data
    if (window && (window as any).__INJECTOR_DATA) {

      // Check if isEdit or isEditable is provided in global injector
      const injectorData = (window as any).__INJECTOR_DATA
      if (injectorData.isEditable !== undefined) {
        this.isEditable = injectorData.isEditable
      }

      if (injectorData.isEdit !== undefined) {
        this.isEdit = injectorData.isEdit
      }
    }
  }

  ngOnInit() {
    if (this.slwConfig && this.slwConfig.enabled) {
      this.getSlwData()
    } else {
      this.getData()
    }
    this.month = new Date().toLocaleString('default', { month: 'long' })
  }

  getData() {
    this.loading = true
    this.insightSvc.fetchLearner(this.channelId).subscribe((res: any) => {
      if (res && res.result && res.result.result && res.result.result.length) {
        this.results = res.result.result
        this.getMonth(res.result.result)
      }
      this.loading = false
    }, (_error: any) => {
      // tslint:disable-next-line: align
      this.loading = false
    })
  }

  getSlwData() {
    this.loading = true
    this.insightSvc.fetchSlwLearner(this.channelId).subscribe((res: any) => {
      if (res && res.result && res.result.result && res.result.result.length) {
        this.results = res.result.result
        this.getMonth(res.result.result)
      }
      this.loading = false
    }, (_error: any) => {
      // tslint:disable-next-line: align
      this.loading = false
    })
  }
  getMonth(response: any) {
    if (response && response.length && response[0].month) {
      this.month = moment().month(Number(response[0].month) - 1).format('MMMM')
    } else {
      this.month = new Date().toLocaleString('default', { month: 'long' })
    }

  }
  getRank(rank: number) {
    if (rank === 1) {
      return "1st"
    }
    if (rank === 2) {
      return "2nd"
    }
    if (rank === 3) {
      return "3rd"
    } else {
      return `${rank}th`
    }
  }

  getColor() {
    let circleColor = ''
    const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length))
    circleColor = this.colors[randomIndex]
    return circleColor
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

  onEdit() {
    const eventData = {
      source: 'topLearners',
      action: 'edit',
      data: {
        fieldName: 'topLearnersConfig',
        displayName: 'Top Learners Configuration',
        value: this.objectData,
        fieldType: 'topLearnersConfig'
      }
    }
    this.editClicked.emit(eventData)

    // If window.__INJECTOR_DATA exists and has eventCallback, use that as well
    if (window && (window as any).__INJECTOR_DATA && (window as any).__INJECTOR_DATA.eventCallback) {
      (window as any).__INJECTOR_DATA.eventCallback(eventData)
    }
  }

}
