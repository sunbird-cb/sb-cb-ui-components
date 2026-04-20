import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimilarCommunityCardModule } from '../../_common/similar-community-card/similar-community-card.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../_pipes/pipes.module';
import { NoDataModule } from '../../_common/no-data/no-data.module';
import { WidgetDiscussionv2LandingPageComponent } from './widget-discussionv2-landing-page.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { TrendingDiscussionsModule } from '../../../public-api';
import { CommunityDetailsModule } from '../../_common/community-details/community-details.module';
import { DiscoverModule } from '../../_common/discover/discover.module';
import { TopicCardModule } from '../../_common/topic-card/topic-card.module';
import { CommunityCardModule } from '../../_common/community-card/community-card.module';
import { GlobalFeedModule } from '../../_common/global-feed/global-feed.module';
@NgModule({
  declarations: [
    WidgetDiscussionv2LandingPageComponent
  ],
  imports: [
    CommonModule,
    SimilarCommunityCardModule,
    MatIconModule,
    FormsModule,
    PipesModule,
    NoDataModule,
    MatTabsModule,
    TrendingDiscussionsModule,
    CommunityDetailsModule,
    DiscoverModule,
    TopicCardModule,
    CommunityCardModule,
    GlobalFeedModule
  ],
  exports:[
    WidgetDiscussionv2LandingPageComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetDiscussionv2LandingPageModule { }
