import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CertificateDialogComponent } from './certificate-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { SvgToPdfComponent } from './svg-to-pdf.component'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { HttpLoaderFactory } from '@sunbird-cb/consumption'
@NgModule({
    declarations: [CertificateDialogComponent, SvgToPdfComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatMenuModule,
        PipeSafeSanitizerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [
        CertificateDialogComponent,
    ]
})
export class CertificateDialogModule { }
