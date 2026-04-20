import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mobile-sections',
  templateUrl: './mobile-sections.component.html',
  styleUrls: ['./mobile-sections.component.scss']
})
export class MobileSectionsComponent {
  @Input() myProgressData: any;
  @Input() speakersData: any;
  @Input() leaderboardData: any;
  @Input() rootOrgId: string;
  @Input() orgId: string;
  @Input() slwConfig: any;
  
  @Output() leaderboardTabClicked = new EventEmitter<string>();
  
  onTabClicked(event: string) {
    this.leaderboardTabClicked.emit(event);
  }
}