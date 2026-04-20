import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MultiLineEllipsisDirective } from './multi-line-ellipsis.directive'


@NgModule({
  declarations: [MultiLineEllipsisDirective],
  imports: [
    CommonModule,
  ],
  exports: [MultiLineEllipsisDirective]
})
export class MultiLineEllipsisModule { }
