import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetCommunitySearchComponent } from './widget-community-search.component';
import { MatIconModule } from '@angular/material/icon';
import { CommunityCardModule } from '../../_common/community-card/community-card.module';
import { FormsModule } from '@angular/forms';
import { SortByModule } from '../../_common/sort-by/sort-by.module';
import { FilterModule } from '../../_common/filter/filter.module';
import { SimilarCommunityCardModule } from '../../_common/similar-community-card/similar-community-card.module';
import { PipesModule } from '../../_pipes/pipes.module';
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { NoDataModule } from '../../_common/no-data/no-data.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    WidgetCommunitySearchComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    CommunityCardModule,
    FormsModule,
    SortByModule,
    FilterModule,
    SimilarCommunityCardModule,
    PipesModule,
    MatBottomSheetModule,
    NoDataModule,
    MatButtonModule
  ],
  exports: [
    WidgetCommunitySearchComponent
  ],
  providers:[{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MatBottomSheetRef, useValue: {} },]
})
export class WidgetCommunitySearchModule { }
