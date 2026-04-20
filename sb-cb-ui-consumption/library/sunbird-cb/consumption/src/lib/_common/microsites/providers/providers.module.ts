import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SkeletonLoaderLibModule } from '../../skeleton-loader-lib/skeleton-loader-lib.module';
import {
  CalenderModule,
  CardsModule, 
  CommonMethodsService, 
  CommonStripModule, 
  CompetencyPassbookModule, 
  ContentStripWithTabsLibModule,
   DataPointsModule, 
   HttpLoaderFactory, 
   SlidersLibModule, 
   UserContentRatingLibModule 
} from './../../../../public-api'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ProvidersV2Component } from './providers-v2/providers-v2.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ProvidersV2Component],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatChipsModule,
    SkeletonLoaderLibModule,
    CalenderModule,
    CardsModule,
    CommonStripModule,
    CompetencyPassbookModule,
    UserContentRatingLibModule,
    ContentStripWithTabsLibModule,
    DataPointsModule,
    SlidersLibModule,
    MatTabsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [ProvidersV2Component],
  providers:[
    CommonMethodsService],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProvidersModule { }
