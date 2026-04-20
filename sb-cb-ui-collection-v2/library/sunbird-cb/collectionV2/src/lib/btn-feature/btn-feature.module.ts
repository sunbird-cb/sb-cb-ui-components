import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnFeatureComponent } from './btn-feature.component'
import { RouterModule } from '@angular/router'
import { MatBadgeModule } from '@angular/material/badge'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { WidgetUrlResolverDirective } from './widget-url-resolver.directive'

@NgModule({
    declarations: [BtnFeatureComponent, WidgetUrlResolverDirective],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatCardModule,
        MatMenuModule,
        MatRippleModule,
        MatBadgeModule,
    ],
    exports: [BtnFeatureComponent]
})
export class BtnFeatureModule {}
