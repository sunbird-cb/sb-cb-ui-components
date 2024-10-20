import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventCardComponent } from './event-card/event-card.component';
import { RouterModule } from '@angular/router';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { MatIconModule } from '@angular/material';



@NgModule({
  declarations: [EventsComponent, EventCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    SkeletonLoaderLibModule,
    MatIconModule
  ],
  exports: [EventsComponent, EventCardComponent]
})
export class EventsModule { }
