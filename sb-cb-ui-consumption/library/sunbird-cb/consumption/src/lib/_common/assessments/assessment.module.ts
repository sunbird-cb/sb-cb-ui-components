import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatStepperModule } from '@angular/material/stepper'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { AssessmentMainComponent } from './components/assessment-main/assessment-main.component'
import { AssessmentBasicInfoComponent } from './components/assessment-basic-info/assessment-basic-info.component'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { AssessmentSessionsComponent } from './components/assessment-sessions/assessment-sessions.component'
import { SelectQuestionModalComponent } from './components/select-question-modal/select-question-modal.component'
import { AssessmentQuestionListComponent } from './components/assessment-question-list/assessment-question-list.component'
import { AssessmentRichTextComponent } from './components/assessment-rich-text/assessment-rich-text.component'
import { CKEditorModule } from 'ng2-ckeditor'
import { MultipleChoiceQuestionComponent } from './components/multiple-choice-question/multiple-choice-question.component'
import { MatchTheFollowingComponent } from './components/match-the-following/match-the-following.component'
import { FillUpTheBlanksComponent } from './components/fill-up-the-blanks/fill-up-the-blanks.component'
import { DialogComponentsModule } from '../dialog-components/dialog-components.module'
import { BulkUploadAllTypeQuestionComponent } from './components/bulk-upload-all-type-question/bulk-upload-all-type-question.component'



@NgModule({
  declarations: [
    AssessmentMainComponent,
    AssessmentBasicInfoComponent,
    AssessmentSessionsComponent,
    SelectQuestionModalComponent,
    AssessmentQuestionListComponent,
    AssessmentRichTextComponent,
    MultipleChoiceQuestionComponent,
    MatchTheFollowingComponent,
    FillUpTheBlanksComponent,
    BulkUploadAllTypeQuestionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    CKEditorModule,
    DialogComponentsModule
  ],
  exports: [
    AssessmentMainComponent
  ]
})
export class AssessmentModule { }
