import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConfirmDialogComponent } from './confirm-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
@NgModule({
    declarations: [ConfirmDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
        TranslateModule,
    ],
    exports: [
        ConfirmDialogComponent,
    ],
})
export class ConfirmDialogModule { }
