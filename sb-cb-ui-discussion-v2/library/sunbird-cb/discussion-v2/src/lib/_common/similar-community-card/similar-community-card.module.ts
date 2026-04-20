import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimilarCommunityCardComponent } from './similar-community-card.component';
import { CardToggleModule } from '../card-toggle/card-toggle.module';
import { SharedModule } from '../../_shared/shared.module';
import { NoDataModule } from '../no-data/no-data.module';
import { SingleLineTooltipModule } from '../../_directives/single-line-tooltip/single-line-tooltip.module';



@NgModule({
  declarations: [
    SimilarCommunityCardComponent
  ],
  imports: [
    CommonModule,
    CardToggleModule,
    SharedModule,
    NoDataModule,
    SingleLineTooltipModule
  ],
  exports: [
    SimilarCommunityCardComponent
  ]
})
export class SimilarCommunityCardModule { }
