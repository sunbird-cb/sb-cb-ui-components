import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { KarmaPointsComponent } from './karma-points.component'
import { SlidersDynamicModule } from '../../../sliders-dynamic/sliders-dynamic.module'

@NgModule({
  declarations: [KarmaPointsComponent],
  imports: [
    CommonModule,
    SlidersDynamicModule,
  ],
  exports: [
    KarmaPointsComponent,
  ],
})
export class KarmaPointsModule { }
