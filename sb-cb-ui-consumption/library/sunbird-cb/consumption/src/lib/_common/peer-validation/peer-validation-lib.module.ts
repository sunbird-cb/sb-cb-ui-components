import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { PvDashboardComponent } from './component/pv-dashboard/pv-dashboard.component'
import { PvCreateComponent } from './component/pv-create/pv-create.component'
import { PvQuestionStepComponent } from './component/pv-question-step/pv-question-step.component'
import { PvConfigStepComponent } from './component/pv-config-step/pv-config-step.component'
import { HorizontalDynamicStepperModule } from '../horizontal-dynamic-stepper/horizontal-dynamic-stepper.module'



@NgModule({
  declarations: [
    PvDashboardComponent,
    PvCreateComponent,
    PvQuestionStepComponent,
    PvConfigStepComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    HorizontalDynamicStepperModule
  ],
  exports: [
    PvDashboardComponent,
    PvCreateComponent,
    PvQuestionStepComponent,
    PvConfigStepComponent
  ]
})
export class PeerValidationLibModule { }
