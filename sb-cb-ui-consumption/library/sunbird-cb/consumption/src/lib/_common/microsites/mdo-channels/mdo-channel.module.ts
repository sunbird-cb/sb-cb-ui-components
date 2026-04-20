import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MdoChannelV1Component } from './mdo-channel-v1/mdo-channel-v1.component';
import { SkeletonLoaderLibModule } from '../../skeleton-loader-lib/skeleton-loader-lib.module';
import { HighlightsOfWeekModule } from '../../highlights-of-week/highlights-of-week.module';
import { EventsModule } from '../../events/events.module';
import { SpeakersModule } from '../../speakers/speakers.module';

import {
  AnnouncementsModule,
  CardsModule,
  CommonMethodsService,
  CommonStripModule,
  CompetencyPassbookModule,
  CompetencyPassbookMdoModule,
  ContentStripWithTabsLibModule,
  DataPointsModule,
  SlidersLibModule,
  TopLearnersModule,
  CbpPlanModule
} from './../../../../public-api'
import { MdoChannelV2Component } from './mdo-channel-v2/mdo-channel-v2.component';
import {  HttpClientModule } from '@angular/common/http';
import { UserProgressModule } from '../../user-progress/user-progress.module';
import { MdoLeaderboardModule } from '../../mdo-leaderboard/mdo-leaderboard.module';
import { KeyHighlightsModule } from '../../key-highlights/key-highlights.module';
import { OrderByPipeModule } from '../../../_pipes/order-by/order-by.pipe.module';
import { SafeUrlPipeModule } from '../../../_pipes/safe-url/safe-url.module';
import { VideoConferenceModule } from '../../video-conference/video-conference.module';
import { MdoChannelV3Component } from './mdo-channel-v3/mdo-channel-v3.component';

// Import any shared widgets/components
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2';
import { MatDialogModule } from '@angular/material/dialog'; // Updated to non-legacy module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // or MatMomentDateModule if you use moment.js
import { MicrositesComponentsModule } from '../micro-sites-components/microsites-components.module';

@NgModule({
  declarations: [MdoChannelV1Component, MdoChannelV2Component,
    MdoChannelV3Component
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    SkeletonLoaderLibModule,
    AnnouncementsModule,
    TopLearnersModule,
    CbpPlanModule,
    CardsModule,
    CommonStripModule,
    CompetencyPassbookModule,
    CompetencyPassbookMdoModule,
    ContentStripWithTabsLibModule,
    DataPointsModule,
    SlidersLibModule,
    HighlightsOfWeekModule,
    UserProgressModule,
    EventsModule,
    SpeakersModule,
    MdoLeaderboardModule,
    KeyHighlightsModule,
    MatTabsModule,
    OrderByPipeModule,
    SafeUrlPipeModule,
    VideoConferenceModule,
    SbUiResolverModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MicrositesComponentsModule
  ],
  exports: [MdoChannelV1Component, MdoChannelV2Component, MdoChannelV3Component],
  providers: [
    CommonMethodsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MDOChannelModule { }
