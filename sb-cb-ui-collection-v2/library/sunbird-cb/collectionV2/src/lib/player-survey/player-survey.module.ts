import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { BtnFullscreenModule } from '../btn-fullscreen/btn-fullscreen.module'
import { PlayerSurveyComponent } from './player-survey.component'
// import { MicroSurveyModule } from '@sunbird-cb/micro-surveys'
import { TranslateModule } from '@ngx-translate/core'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider'
import { SurveyFormQuestionComponent } from '../survey-form-question/survey-form-question.component'
import { SurveyFormSectionComponent } from '../survey-form-section/survey-form-section.component'
import { MatLegacyRadioModule } from '@angular/material/legacy-radio'
// REMOVED: MatDatepickerModule causes ng-packagr PickerModule resolution error
// Consumer applications must import MatDatepickerModule and MatNativeDateModule themselves
// import { MatDatepickerModule } from '@angular/material/datepicker'
// import { MatNativeDateModule } from '@angular/material/core'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
@NgModule({
    declarations: [
        PlayerSurveyComponent,
        SurveyFormQuestionComponent,
        SurveyFormSectionComponent
    ],
    imports: [
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatMenuModule,
        MatButtonModule,
        MatSliderModule,
        MatToolbarModule,
        ReactiveFormsModule,
        BtnFullscreenModule,
        MatInputModule,
        // MicroSurveyModule,
        MatLegacyRadioModule,
        // REMOVED: MatDatepickerModule causes ng-packagr build error
        // Consumer apps must import these modules:
        // MatNativeDateModule,
        // MatDatepickerModule,
        MatLegacySelectModule,
        MatLegacyCheckboxModule,
        MatLegacyProgressSpinnerModule,
        TranslateModule.forChild(),
    ],
    exports: [PlayerSurveyComponent],
})
export class PlayerSurveyModule { }
