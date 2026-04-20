import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CreateRequestFormComponent } from './components/create-request-form/create-request-form.component'
import { CreateRequestContentDetailsComponent } from './components/create-request-content-details/create-request-content-details.component'
import { CreateRequestAdditionalDetailsComponent } from './components/create-request-additional-details/create-request-additional-details.component'
import { AddAuthorsComponent } from './dialogs/add-authors/add-authors.component'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyOptionModule } from '@angular/material/legacy-core'
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule } from '@angular/material/legacy-input'
import { MatLegacyRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip'
import { HorizontalDynamicStepperModule } from '../horizontal-dynamic-stepper/horizontal-dynamic-stepper.module'
import { OrderByPipeModule } from '../../_pipes/order-by/order-by.pipe.module'



@NgModule({
  declarations: [
    CreateRequestFormComponent,
    CreateRequestContentDetailsComponent,
    CreateRequestAdditionalDetailsComponent,
    AddAuthorsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatLegacyFormFieldModule,
    MatIconModule,
    MatLegacyChipsModule,
    MatLegacyOptionModule,
    MatLegacySelectModule,
    MatLegacyInputModule,
    MatLegacyButtonModule,
    MatLegacyCheckboxModule,
    MatLegacyDialogModule,
    MatLegacyCardModule,
    MatLegacyRadioModule,
    MatLegacyTooltipModule,
    HttpClientModule,
    HorizontalDynamicStepperModule,
    OrderByPipeModule,
  ],
  exports: [
    CreateRequestFormComponent,
    AddAuthorsComponent
  ]
})
export class CreateRequestModule { }
