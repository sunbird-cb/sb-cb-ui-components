import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-support-section',
  templateUrl: './support-section.component.html',
  styleUrls: ['./support-section.component.scss']
})
export class SupportSectionComponent {
  constructor(
    @Inject('sectionData') public data: any,
    @Inject('eventCallback') private eventCallback: (event: any) => void
  ) {}
  
  onVideoEvent(event: any) {
    this.eventCallback({
      action: 'video-conference',
      source: 'supportSection',
      id: event.id || 'video-event',
      data: event
    });
  }
}