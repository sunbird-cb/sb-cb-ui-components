import { Component, Inject, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-content-strip',
  templateUrl: './content-strip.component.html',
  styleUrls: ['./content-strip.component.scss']
})
export class ContentStripComponent {
  @Input() data: any
  @Input() isEdit: boolean
  @Output() viewAllResponse = new EventEmitter<any>();
  @Output() telemetryResponse = new EventEmitter<any>();

  constructor(
    @Inject('orgId') public orgId: string,
    @Inject('channelName') public channelName: string,
    @Inject('eventCallback') private eventCallback: (event: any) => void
  ) { }

  showAllContent(event: any) {
    this.viewAllResponse.emit({
      event: event,
      data: this.data
    })
    this.eventCallback({
      action: 'view-all',
      source: 'contentStrip',
      id: this.data?.sectionKey || 'content-section',
      data: event
    })
  }

  raiseTelemetryInteratEvent(event: any) {
    this.telemetryResponse.emit(event)
    this.eventCallback({
      action: 'telemetry',
      source: 'contentStrip',
      id: event.id || 'content-interaction',
      data: event
    })
  }
  hideContentStrip(event: any, contentStrip: any) {
    this.eventCallback({
      action: 'hide-content-strip',
      source: 'contentStrip',
      id: 'content-strip',
      data: contentStrip
    })
  }
}