import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserContentDetailedRatingComponent } from './user-content-detailed-rating.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { InViewPortModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [UserContentDetailedRatingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    InViewPortModule,
    MatProgressBarModule,
  ],
  exports: [UserContentDetailedRatingComponent],
})
export class UserContentDetailedRatingModule { }
