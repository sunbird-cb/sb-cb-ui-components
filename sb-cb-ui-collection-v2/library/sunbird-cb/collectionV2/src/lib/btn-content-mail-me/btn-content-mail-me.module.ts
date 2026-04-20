import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { BtnContentMailMeComponent } from './btn-content-mail-me.component'
import { BtnContentMailMeDialogComponent } from './btn-content-mail-me-dialog/btn-content-mail-me-dialog.component'

@NgModule({
    declarations: [BtnContentMailMeComponent, BtnContentMailMeDialogComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
    ],
    exports: [BtnContentMailMeComponent]
})
export class BtnContentMailMeModule { }
