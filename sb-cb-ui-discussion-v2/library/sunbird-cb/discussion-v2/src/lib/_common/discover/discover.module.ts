import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscoverComponent } from './discover.component';
import { MatIconModule } from '@angular/material/icon';
import { CommunityCardModule } from '../community-card/community-card.module';
import { MatButtonModule } from '@angular/material/button';
import { TopicCardModule } from '../topic-card/topic-card.module';
import { ImageSlidersModule } from '../image-sliders/image-sliders.module';




@NgModule({
  declarations: [
    DiscoverComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    CommunityCardModule,
    MatButtonModule,
    TopicCardModule,
    ImageSlidersModule
  ], exports: [
    DiscoverComponent
  ]
})
export class DiscoverModule { }
