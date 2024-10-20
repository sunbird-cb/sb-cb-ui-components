import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProgressComponent } from './user-progress.component';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { ScrollableItemModule } from '../../_directives/scrollable-item/scrollable-item.module';
import { SlidersNgContentLibModule } from '../sliders-ng-content/sliders-ng-content.module';



@NgModule({
  declarations: [UserProgressComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    ScrollableItemModule,
    SlidersNgContentLibModule,
  ],
  exports: [
    UserProgressComponent
  ]
})
export class UserProgressModule { }
