
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { CommunitySuggestionsComponent } from './community-suggestions.component';
import { PluralModule } from '../../_pipes/plural/plural.module';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NumberShortenerModule } from '../../_pipes/number-shortener/number-shortener.module';
import { HttpLoaderFactory } from '../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';


@NgModule({
  declarations: [CommunitySuggestionsComponent],
  imports: [
    CommonModule,
    MatLegacyCardModule,
    TranslateModule,
    NumberShortenerModule,
    PluralModule,
    SkeletonLoaderLibModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
        },
    }),
  ],
  exports: [CommunitySuggestionsComponent],
})
export class CommunitySuggestionsModule {

}