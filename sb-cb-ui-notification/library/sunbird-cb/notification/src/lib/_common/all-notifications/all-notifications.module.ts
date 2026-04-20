import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { AllNotificationsComponent } from './all-notifications.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ViewContentComponent } from '../view-content/view-content.component';
import { ContentCardComponent } from '../content-card/content-card.component';
//import { DefaultThumbnailModule, PipeDurationTransformModule, PipePublicURLModule } from '@sunbird-cb/utils-v2';

@NgModule({
  declarations: [AllNotificationsComponent, ViewContentComponent, ContentCardComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    SkeletonLoaderLibModule,
    MatSnackBarModule,
    //PipePublicURLModule,
    //PipeDurationTransformModule,
    //DefaultThumbnailModule,
  ],
  exports: [
    AllNotificationsComponent
  ]
})
export class AllNotificationsModule { }
