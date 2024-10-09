import { Component, Inject, Input } from '@angular/core'
import { Router } from '@angular/router'
import * as moment_ from 'moment'
const moment = moment_

@Component({
  selector: 'sb-uic-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {

  @Input() objectData: any
  @Input() eventDetails: any
  environment!: any
  @Input() loader: any
  descriptionMaxLength: number = 50
  constructor(@Inject('environment') environment: any, private router: Router) {
    this.environment = environment
   }

  getEventDate(event: any) {
    let timeString = event.startTime.split(":")
    let dataString = `${moment(event.startDate).format('MMM DD, YYYY')} ${timeString[0]}:${timeString[1]}`
    return dataString
  }

  getPublicUrl(url: string): string {
    const mainUrl = url.split('/content').pop() || ''
    return `${this.environment.contentHost}/${this.environment.contentBucket}/content${mainUrl}`
  }

  redirectTo(event: any) {
    this.router.navigate(["/app/event-hub/home/", event.identifier]);
  }

}
