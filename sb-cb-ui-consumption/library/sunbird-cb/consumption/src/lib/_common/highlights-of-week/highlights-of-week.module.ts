import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { HighlightsOfWeekComponent } from './highlights-of-week.component';
import { ScrollableItemModule } from '../../_directives/scrollable-item/scrollable-item.module';
import { SlidersNgContentLibModule } from '../sliders-ng-content/sliders-ng-content.module';



@NgModule({
  declarations: [HighlightsOfWeekComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    ScrollableItemModule,
    SlidersNgContentLibModule
  ],
  exports: [
    HighlightsOfWeekComponent
  ]
})
export class HighlightsOfWeekModule { }
