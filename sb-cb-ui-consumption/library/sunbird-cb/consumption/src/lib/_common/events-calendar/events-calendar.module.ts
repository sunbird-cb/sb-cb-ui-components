import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

// Material modules
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'

import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

// Sunbird modules
import { PipeHtmlTagRemovalModule, PipeFilterV2Module, PipePublicURLModule } from '@sunbird-cb/utils-v2'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'

// Events module dependencies
import { EventsCalendarComponent } from './events-calendar.component'
import { HttpLoaderFactory } from '../../../public-api'
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module'
import { EventsService } from '../../_services/events.service'

@NgModule({
  declarations: [
    EventsCalendarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatLegacySnackBarModule,
    MatBottomSheetModule,
    MatTooltipModule,
    PipeHtmlTagRemovalModule,
    PipeFilterV2Module,
    PipePublicURLModule,
    SkeletonLoaderLibModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    EventsCalendarComponent
  ],
  providers: [
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MatBottomSheetRef, useValue: {} },
    EventsService,
    DatePipe
  ]
})
export class EventsCalendarModule { }