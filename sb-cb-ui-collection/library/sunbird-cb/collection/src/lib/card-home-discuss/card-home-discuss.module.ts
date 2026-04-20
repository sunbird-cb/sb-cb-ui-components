import { NgModule } from '@angular/core'
import { CardHomeDiscussComponent } from './card-home-discuss.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { BrowserModule } from '@angular/platform-browser'
import { CardDiscussComponent } from '../card-discuss/card-discuss.component'

@NgModule({
    declarations: [CardHomeDiscussComponent, CardDiscussComponent],
    imports: [BrowserModule, AvatarPhotoModule, MatButtonModule, MatCardModule, MatChipsModule,
        MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule]
})
export class CardHomeDiscussModule {

}
