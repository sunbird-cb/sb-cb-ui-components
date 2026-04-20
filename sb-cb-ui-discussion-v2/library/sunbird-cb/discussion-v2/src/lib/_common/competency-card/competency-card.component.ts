import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'd-v2-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '104px',
        width: '320px',
      })),
      state('expanded', style({
        minHeight: '120px',
        width: '372px',
        height: 'auto',
      })),
      transition('collapsed <=> expanded', [
        animate('0.5s'),
      ]),
    ]),
  ],
})
export class CompetencyCardComponent  implements OnInit {

  @Input() widgetData!: any
  @Input() competencyArea = ''
  isExpanded = false

  constructor() {
  }

  ngOnInit() {
  }

  handleToggleSize(_viewMore?: any): void {
    this.isExpanded = !this.isExpanded
  }
}
