import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { PipeLimitToModule } from '@sunbird-cb/utils-v2';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule } from '@angular/material/legacy-list';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatLegacyButtonModule,
    MatLegacyListModule,
    MatLegacyCardModule,
    MatDividerModule,
    MatLegacyProgressSpinnerModule,
    PipeLimitToModule,
  ]
})
export class NotificationModule { }
