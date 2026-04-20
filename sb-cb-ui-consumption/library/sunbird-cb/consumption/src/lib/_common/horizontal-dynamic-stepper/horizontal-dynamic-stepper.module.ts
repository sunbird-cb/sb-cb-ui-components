import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatStepperModule } from '@angular/material/stepper'
import { HorizontalDynamicStepperComponent } from './horizontal-dynamic-stepper.component'



@NgModule({
  declarations: [
    HorizontalDynamicStepperComponent
  ],
  imports: [
    CommonModule,
    MatStepperModule
  ],
  exports: [
    HorizontalDynamicStepperComponent
  ]
})
export class HorizontalDynamicStepperModule { }
