import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetDiscussionv2HomeComponent } from './widget-discussionv2-home.component';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatBadgeModule } from '@angular/material/badge';
import { CommunityCardModule } from '../../_common/community-card/community-card.module';
import { ShortcutsModule } from '../../_common/shortcuts/shortcuts.module';
import { TrendingDiscussionsModule } from '../../_common/trending-discussions/trending-discussions.module';
import { TrendingTagsModule } from '../../_common/trending-tags/trending-tags.module';
import { DiscoverModule } from '../../_common/discover/discover.module';
import { TopicCardModule } from '../../_common/topic-card/topic-card.module';
import { SimilarCommunityCardModule } from '../../_common/similar-community-card/similar-community-card.module';
import { NoDataModule } from '../../_common/no-data/no-data.module';


@NgModule({
  declarations: [
    WidgetDiscussionv2HomeComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTabsModule,
    MatBadgeModule,
    CommunityCardModule,
    ShortcutsModule,
    TrendingDiscussionsModule,
    TrendingTagsModule,
    DiscoverModule,
    TopicCardModule,
    SimilarCommunityCardModule,
    NoDataModule
  ],
  exports: [
    WidgetDiscussionv2HomeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetDiscussionv2HomeModule { }
