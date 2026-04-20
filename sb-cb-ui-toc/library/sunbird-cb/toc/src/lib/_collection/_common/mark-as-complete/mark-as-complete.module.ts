import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarkAsCompleteComponent } from './mark-as-complete.component'
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module'
import { RouterModule } from '@angular/router'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
// import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

@NgModule({
    declarations: [MarkAsCompleteComponent],
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        RouterModule,
        ConfirmDialogModule,
    ],
    exports: [MarkAsCompleteComponent]
})
export class MarkAsCompleteModule { }
