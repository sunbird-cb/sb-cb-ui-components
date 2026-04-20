import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DisplayContentsComponent } from './display-contents.component'
import { DisplayContentTypeModule } from '../display-content-type/display-content-type.module'
import { PipeDurationTransformModule, PipeLimitToModule, DefaultThumbnailModule } from '@sunbird-cb/utils-v2'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [DisplayContentsComponent],
  imports: [
    CommonModule,
    DefaultThumbnailModule,
    DisplayContentTypeModule,
    PipeDurationTransformModule,
    PipeLimitToModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  exports: [
    DisplayContentsComponent,
  ],
})
export class DisplayContentsModule { }
