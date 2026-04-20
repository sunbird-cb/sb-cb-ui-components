import { Component, Inject, Input } from '@angular/core'

@Component({
  selector: 'app-top-learners',
  templateUrl: './top-learners.component.html',
  styleUrls: ['./top-learners.component.scss']
})
export class TopLearnersComponent {
  objectData: any

  constructor(
    @Inject('sectionData') public data: any,
    @Inject('channelName') public channelName: string,
    @Inject('orgId') public orgId: string,
    @Inject('slwConfiguration') public slwConfig: any,
    @Inject('eventCallback') private eventCallback: any,
    @Inject('isEdit') public isEdit: boolean,
  ) {
    this.objectData = data
  }

  onEventFromLeaders(event: any) {
    this.eventCallback({
      action: 'top-learners',
      source: 'topLearners',
      id: event.id || 'learner-event',
      data: event
    })
  }

  onEdit() {
    this.eventCallback({
      action: 'edit',
      source: 'topLearners',
      id: 'top-learners-edit',
      data: {
        type: 'topLearnersConfig',
        config: this.objectData || {}
      }
    })
  }
}