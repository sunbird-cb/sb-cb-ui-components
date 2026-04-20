import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetCommunityHomeComponent } from './widget-community-home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { CardToggleModule } from '../../_common/card-toggle/card-toggle.module';
import { ShortcutsModule, TrendingDiscussionsModule } from '../../../public-api';
import { CommunityDetailsModule } from '../../_common/community-details/community-details.module';
import { MemberCardModule } from '../../_common/member-card/member-card.module';
import { SharedModule } from '../../_shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { PipesModule } from '../../_pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { HorizontalScrollerV2Module } from '@sunbird-cb/utils-v2';
import { CompetencyCardModule } from '../../_common/competency-card/competency-card.module';
import { SimilarCommunityCardModule } from '../../_common/similar-community-card/similar-community-card.module';



@NgModule({
  declarations: [
    WidgetCommunityHomeComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    CardToggleModule,
    ShortcutsModule,
    TrendingDiscussionsModule, 
    CommunityDetailsModule,
    MemberCardModule,
    SharedModule,
    MatButtonModule,
    MatMenuModule,
    PipesModule,
    TranslateModule,
    MatTooltipModule,
    HorizontalScrollerV2Module,
    CompetencyCardModule,
    SimilarCommunityCardModule
  ],
  exports: [
    WidgetCommunityHomeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetCommunityHomeModule { }
