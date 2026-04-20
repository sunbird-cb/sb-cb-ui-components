import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-column-section-display',
  templateUrl: './column-section-display.component.html',
  styleUrls: ['./column-section-display.component.scss']
})
export class ColumnSectionDisplayComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() orgId: string;
  @Input() channelName: string;
  @Input() isEdit: boolean;
  @Output() competencyEvent = new EventEmitter<boolean>();
  @Output() competencyTelemetry = new EventEmitter<string>();
  @Output() contentTelemetry = new EventEmitter<any>();
  @Output() viewAllEvent = new EventEmitter<any>();
  
  filteredData: any[] = [];
  
  ngOnInit() {
    this.filteredData = this.data?.filter(section => section?.enabled) || [];
  }
  
  onCompetencyEvent(event: boolean) {
    this.competencyEvent.emit(event);
  }
  
  onCompetencyTelemetry(event: string) {
    this.competencyTelemetry.emit(event);
  }
  
  onContentTelemetry(event: any) {
    this.contentTelemetry.emit(event);
  }
  
  onViewAllEvent(event: any, data: any) {
    this.viewAllEvent.emit({
      event: event,
      data: data
    });
  }
}