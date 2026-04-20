import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CustumDateSortingPipePipe } from './custum-date-sorting-pipe.pipe'

@NgModule({
  declarations: [CustumDateSortingPipePipe],
  imports: [
    CommonModule,
  ],
  exports: [CustumDateSortingPipePipe],
})
export class CustumdateSortingModule { }
