import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-competency',
  templateUrl: './competency.component.html',
  styleUrls: ['./competency.component.scss']
})
export class CompetencyComponent {
  @Input() competency: any;
  @Output() emptyResponse = new EventEmitter<boolean>();
  @Output() telemetryResponse = new EventEmitter<string>();
  
  hideCompetencyBlock = false;
  
  constructor(
    @Inject('orgId') public orgId: string,
    @Inject('eventCallback') private eventCallback: (event: any) => void
  ) {}
  
  hideCompetency(event: any) {
    this.hideCompetencyBlock = event;
    this.emptyResponse.emit(event);
    this.eventCallback({
      action: 'hide-competency',
      source: 'competency',
      id: 'competency-block'
    });
  }
  
  raiseCompetencyTelemetry(name: string) {
    this.telemetryResponse.emit(name);
    this.eventCallback({
      action: 'competency-click',
      source: 'competency',
      id: `${name}-core-expertise`
    });
  }
}