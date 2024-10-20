import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HorizontalScrollerV2Module } from '../../horizontal-scroller-v2/horizontal-scroller-v2.module';

import {
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
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatAutocompleteModule} from '@angular/material';
import { ContentStripFacetFilterComponent } from './content-strip-facet-filter.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2';
import { HttpLoaderFactory1 } from '../content-strip-with-tabs-pills/content-strip-with-tabs-pills.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ContentStripFacetFilterComponent],
  imports: [
    SbUiResolverModule,
    CommonModule,
    RouterModule,
    HorizontalScrollerV2Module,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory1,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [ContentStripFacetFilterComponent],
  exports: [ContentStripFacetFilterComponent],
})
export class ContentStripFacetFilterModule { }
