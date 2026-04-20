import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CompetencySummaryComponent } from './competency-summary.component'
import { MatExpansionModule } from '@angular/material/expansion'



@NgModule({
  declarations: [
    CompetencySummaryComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule
  ],
  exports: [
    CompetencySummaryComponent
  ]
})
export class CompetencySummaryModule { }
