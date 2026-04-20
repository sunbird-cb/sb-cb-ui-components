import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { AnnouncementsComponent } from './announcements.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [AnnouncementsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SkeletonLoaderLibModule
  ],
  exports: [AnnouncementsComponent],
})
export class AnnouncementsModule { }