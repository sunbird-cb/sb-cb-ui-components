import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CommonAssessmentViewerComponent } from './common-assessment-viewer.component'
import { PracticePlModule } from './practice/practice.module'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

@NgModule({
  declarations: [CommonAssessmentViewerComponent],
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    PracticePlModule,
    CommonModule,
  ],
  exports: [CommonAssessmentViewerComponent, PracticePlModule],
})
export class CommonAssessmentViewerModule { }
