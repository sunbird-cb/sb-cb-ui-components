import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbpPlanComponent } from './cbp-plan.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { MatIconModule } from '@angular/material/icon';
import { SlidersNgContentLibModule } from '../sliders-ng-content/sliders-ng-content.module';
import { ScrollableItemModule } from '../../_directives/scrollable-item/scrollable-item.module';



@NgModule({
  declarations: [CbpPlanComponent],
  imports: [
    CommonModule,
    SkeletonLoaderLibModule,
    MatIconModule,
    ScrollableItemModule,
    SlidersNgContentLibModule,
  ],
  exports: [CbpPlanComponent]
})
export class CbpPlanModule { }
