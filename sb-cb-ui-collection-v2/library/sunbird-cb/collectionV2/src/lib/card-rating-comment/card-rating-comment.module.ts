import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardRatingCommentComponent } from './card-rating-comment.component'

import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { PipeCountTransformModule, PipeRelativeTimeModule } from '@sunbird-cb/utils-v2'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
  declarations: [CardRatingCommentComponent],
  imports: [
    CommonModule,
    PipeCountTransformModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    AvatarPhotoModule,
    PipeRelativeTimeModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  exports: [
    CardRatingCommentComponent,
  ],
})
export class CardRatingCommentModule { }
