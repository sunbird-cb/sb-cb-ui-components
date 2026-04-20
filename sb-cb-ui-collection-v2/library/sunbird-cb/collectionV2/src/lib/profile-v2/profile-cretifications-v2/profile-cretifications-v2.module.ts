import { NgModule } from '@angular/core'
import { ProfileCretificationsV2Component } from './profile-cretifications-v2.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { BrowserModule } from '@angular/platform-browser'

@NgModule({
    declarations: [ProfileCretificationsV2Component],
    imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule,
        MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule]
})
export class ProfileCretificationsV2Module {

}
