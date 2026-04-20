import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetTopicsAllComponent } from './widget-topics-all.component';
import { TopicCardModule } from '../../_common/topic-card/topic-card.module';
import { SortByModule } from '../../_common/sort-by/sort-by.module';
import { SimilarCommunityCardModule } from '../../_common/similar-community-card/similar-community-card.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../_pipes/pipes.module';
import { NoDataModule } from '../../_common/no-data/no-data.module';



@NgModule({
  declarations: [
    WidgetTopicsAllComponent
  ],
  imports: [
    CommonModule,
    TopicCardModule,
    SortByModule,
    SimilarCommunityCardModule,
    MatIconModule,
    FormsModule,
    PipesModule,
    NoDataModule
  ],
  exports:[
    WidgetTopicsAllComponent
  ]
})
export class WidgetTopicsAllModule { }
