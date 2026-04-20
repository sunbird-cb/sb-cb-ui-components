import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SingleLineTooltipDirective } from './single-line-tooltip.directive'


@NgModule({
  declarations: [SingleLineTooltipDirective],
  imports: [
    CommonModule,
  ],
  exports: [SingleLineTooltipDirective]
})
export class SingleLineTooltipModule { }
