import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeakersComponent } from './speakers.component';
import { ScrollableItemModule } from '../../_directives/scrollable-item/scrollable-item.module';
import { SlidersNgContentLibModule } from '../sliders-ng-content/sliders-ng-content.module';
import { MatIconModule, MatTooltipModule } from '@angular/material';



@NgModule({
  declarations: [SpeakersComponent],
  imports: [
    CommonModule,
    ScrollableItemModule,
    SlidersNgContentLibModule,
    MatTooltipModule,
    MatIconModule,
  ],
  exports: [
    SpeakersComponent
  ]
})
export class SpeakersModule { }
