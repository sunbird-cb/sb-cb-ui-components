import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HorizontalScrollerV2Module } from '@sunbird-cb/utils-v2'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { ContentStripWithTabsComponent } from './content-strip-with-tabs.component'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
// REMOVED: MatDatepickerModule not used in this component
// import { MatNativeDateModule } from '@angular/material/core'
// import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

// tslint:disable-next-line:function-name
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http)
}

@NgModule({
    declarations: [ContentStripWithTabsComponent],
    imports: [
        CommonModule,
        RouterModule,
        HorizontalScrollerV2Module,
        SbUiResolverModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatListModule,
        MatSidenavModule,
        MatCardModule,
        MatExpansionModule,
        MatRadioModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSnackBarModule,
        MatSelectModule,
        // REMOVED: MatDatepickerModule not used
        // MatDatepickerModule,
        // MatNativeDateModule,
        MatTableModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatButtonToggleModule,
        MatTabsModule,
        MatAutocompleteModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [ContentStripWithTabsComponent],
    providers: [
        {
            provide: 'environment',
            useFactory: () => {
                // This will be provided by the consuming application
                // The consuming app should provide environment configuration
                return (window as any).__env || {}
            }
        }
    ]
})
export class ContentStripWithTabsModule { }
