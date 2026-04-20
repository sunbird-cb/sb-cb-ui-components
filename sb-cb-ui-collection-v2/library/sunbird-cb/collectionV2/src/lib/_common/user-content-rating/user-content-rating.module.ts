import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserContentRatingComponent } from './user-content-rating.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { InViewPortModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [UserContentRatingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    InViewPortModule,
  ],
  exports: [UserContentRatingComponent],
})
export class UserContentRatingModule { }
