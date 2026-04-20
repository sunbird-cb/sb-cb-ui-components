import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CertificateDialogComponent } from './certificate-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditorQuillModule } from '../../discussion-forum/editor-quill/editor-quill.module'

import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { SvgEditorComponent } from './svg-editor/svg-editor.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [CertificateDialogComponent, SvgEditorComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        EditorQuillModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        PipeSafeSanitizerModule,
    ],
    exports: [
        CertificateDialogComponent,
    ]
})
export class CertificateDialogModule { }
