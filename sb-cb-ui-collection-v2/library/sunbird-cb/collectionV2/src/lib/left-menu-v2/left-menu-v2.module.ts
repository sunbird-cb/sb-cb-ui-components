import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LeftMenuV2Component } from './left-menu-v2.component'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [LeftMenuV2Component],
    imports: [
        CommonModule,
        RouterModule,
        SbUiResolverModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatChipsModule,
        MatCardModule,
        MatListModule,
        MatExpansionModule,
    ],
    exports: [
        LeftMenuV2Component,
    ]
})
export class LeftMenuV2Module { }
