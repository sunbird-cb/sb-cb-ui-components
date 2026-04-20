import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FilterByComponent } from './filter-by/filter-by.component'
import { SearchSortInputComponent } from './search-sort-input/search-sort-input.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyOptionModule } from '@angular/material/legacy-core'
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule } from '@angular/material/legacy-input'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { MatToolbarModule } from '@angular/material/toolbar'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpLoaderFactory } from '../../../public-api'
import { HttpClient } from '@angular/common/http'
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyRadioModule } from '@angular/material/legacy-radio'
import { MatLegacyListModule } from '@angular/material/legacy-list'



@NgModule({
  declarations: [
    FilterByComponent,
    SearchSortInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyOptionModule,
    MatLegacySelectModule,
    MatIconModule,
    MatLegacyCheckboxModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    MatLegacyRadioModule,
    MatLegacyListModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    FilterByComponent,
    SearchSortInputComponent
  ]
})
export class FiltersModule { }
