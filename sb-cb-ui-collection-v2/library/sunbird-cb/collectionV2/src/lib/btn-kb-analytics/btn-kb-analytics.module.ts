import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnKbAnalyticsComponent } from './btn-kb-analytics.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'

@NgModule({
    declarations: [BtnKbAnalyticsComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
    ],
    exports: [BtnKbAnalyticsComponent]
})
export class BtnKbAnalyticsModule { }
