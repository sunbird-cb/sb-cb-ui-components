import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { NgCircleProgressModule } from 'ng-circle-progress'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import {
  PipeDurationTransformModule, HorizontalScrollerV2Module,
  PipeRelativeTimeModule, PipeSafeSanitizerModule,
} from '@sunbird-cb/utils-v2'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { RatingSummaryModule } from '../rating-summary/rating-summary.module'
import { ContentProgressModule } from '../content-progress/content-progress.module'
import { CardCompetencyModule } from '../../card-competency/card-competency.module'
import { TocKpiValuesModule } from './toc-kpi-values/toc-kpi-values.module'
import { KarmaPointsModule } from './karma-points/karma-points.module'
import { AttendanceCardModule } from '../attendance-card/attendance-card.module'

import { ContentTocComponent } from './content-toc.component'
import { AppTocAboutComponent } from './app-toc-about/app-toc-about.component'
import { AppTocContentComponent } from './app-toc-content/app-toc-content.component'
import { ReviewsContentComponent } from './reviews-content/reviews-content.component'
import { AppTocContentCardV2Component } from './app-toc-content-card-v2/app-toc-content-card-v2.component'
import { TruncatePipe } from './pipes/truncate.pipe'
import { ReplaceNbspPipe } from './pipes/replace-nbsp.pipe'
import { AppTocSessionCardNewComponent } from './app-toc-session-card-new/app-toc-session-card-new.component'
import { AppTocSessionsNewComponent } from './app-toc-sessions-new/app-toc-sessions-new.component'
import { AppTocContentCardV2SkeletonComponent } from './app-toc-content-card-v2-skeleton/app-toc-content-card-v2-skeleton.component'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { AppTocTeachersNotesComponent } from './app-toc-teachers-notes/app-toc-teachers-notes.component'
import { AppTocReferenceNotesComponent } from './app-toc-reference-notes/app-toc-reference-notes.component'
// import { DiscussionV2Module } from '@sunbird-cb/discussion-v2'
@NgModule({
  declarations: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    AppTocTeachersNotesComponent,
    AppTocReferenceNotesComponent,
    AppTocContentCardV2Component,
    ReviewsContentComponent,
    AppTocSessionCardNewComponent,
    AppTocSessionsNewComponent,
    AppTocContentCardV2SkeletonComponent,
    TruncatePipe,
    ReplaceNbspPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatTabsModule,
    MatRadioModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SkeletonLoaderModule,
    AvatarPhotoModule,
    RatingSummaryModule,
    PipeDurationTransformModule,
    ContentProgressModule,
    NgCircleProgressModule.forRoot({}),
    PipeRelativeTimeModule,
    InfiniteScrollModule,
    CardCompetencyModule,
    HorizontalScrollerV2Module,
    SbUiResolverModule,
    AttendanceCardModule,
    MatTooltipModule,
    TocKpiValuesModule,
    KarmaPointsModule,
    PipeSafeSanitizerModule,
    // DiscussionV2Module
  ],
  exports: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    AppTocTeachersNotesComponent,
    ReviewsContentComponent,
    AppTocContentCardV2Component,
    TruncatePipe,
    ReplaceNbspPipe,
  ],
  providers: [
    {
      provide: 'environment',
      useFactory: () => {
        // This will be provided by the consuming application
        // The consuming app should provide environment configuration
        return (window as any).__env || {}
      }
    }
  ]
})

export class ContentTocModule { }
