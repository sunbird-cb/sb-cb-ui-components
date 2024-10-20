import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule, MatIconModule, MatTabsModule } from '@angular/material';
import { SkeletonLoaderLibModule } from '../../skeleton-loader-lib/skeleton-loader-lib.module';
import { NationalLearningComponent } from './national-learning/national-learning.component';
import { CommonMethodsService } from '../../../_services/common-methods.service';
import { SlidersLibModule } from '../../sliders/sliders.module';
import { KeyHighlightsModule } from '../../key-highlights/key-highlights.module';
import { ContentStripWithTabsLibModule } from '../../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module';
import { EventsModule } from '../../events/events.module';
import { MdoLeaderboardModule } from '../../mdo-leaderboard/mdo-leaderboard.module';
import { DataPointsModule } from '../../data-points/data-points.module';
import { HighlightsOfWeekModule } from '../../highlights-of-week/highlights-of-week.module';
import { SpeakersModule } from '../../speakers/speakers.module';
import { UserProgressModule } from '../../user-progress/user-progress.module';
import { ContentStripFacetFilterModule } from '../../strips/content-strip-facet-filter/content-strip-facet-filter.module';



@NgModule({
  declarations: [NationalLearningComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    SkeletonLoaderLibModule,
    SlidersLibModule,
    MatTabsModule,
    KeyHighlightsModule,
    ContentStripWithTabsLibModule,
    DataPointsModule,
    EventsModule,
    MdoLeaderboardModule,
    HighlightsOfWeekModule,
    SpeakersModule,
    UserProgressModule,
    ContentStripFacetFilterModule
  ],
  exports: [
    NationalLearningComponent,
  ],
  providers:[
    CommonMethodsService
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class NationalLearningModule { }
