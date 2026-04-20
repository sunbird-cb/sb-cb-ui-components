import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightsOfWeekComponent } from './highlights-of-week.component';
import { ScrollableItemModule } from '../../_directives/scrollable-item/scrollable-item.module';
import { SlidersNgContentLibModule } from '../sliders-ng-content/sliders-ng-content.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';



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
