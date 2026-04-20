import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetencyPassbookComponent } from './competency-passbook.component';
import { MatIconModule } from '@angular/material/icon';
import { PillsModule } from './../pills/pills.module';
import { CompetencyPassbookService } from './competency-passbook.service';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';



@NgModule({
  declarations: [CompetencyPassbookComponent],
  imports: [
    CommonModule,
    MatIconModule,
    PillsModule,
    SkeletonLoaderLibModule
  ],
  exports: [CompetencyPassbookComponent],
  providers:[CompetencyPassbookService]
})
export class CompetencyPassbookModule { }
