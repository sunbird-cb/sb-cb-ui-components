import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicCardComponent } from './topic-card.component';
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module';
import { PipesModule } from '../../_pipes/pipes.module';
import { MultiLineEllipsisModule } from '../../_directives/multi-line-ellipsis/multi-line-ellipsis.module';



@NgModule({
  declarations: [
    TopicCardComponent
  ],
  imports: [
    CommonModule,
    SkeletonLoaderModule,
    PipesModule,
    MultiLineEllipsisModule
  ],
  exports: [
    TopicCardComponent
  ]
})
export class TopicCardModule { }
