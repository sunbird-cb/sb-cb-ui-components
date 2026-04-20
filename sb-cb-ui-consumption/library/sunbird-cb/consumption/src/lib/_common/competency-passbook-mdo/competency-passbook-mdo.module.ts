import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetencyPassbookMdoComponent } from './competency-passbook-mdo.component';
import { MatIconModule } from '@angular/material/icon';
import { PillsModule } from './../pills/pills.module';
import { CompetencyPassbookMdoService } from './competency-passbook-mdo.service';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';



@NgModule({
  declarations: [CompetencyPassbookMdoComponent],
  imports: [
    CommonModule,
    MatIconModule,
    PillsModule,
    SkeletonLoaderLibModule
  ],
  exports: [CompetencyPassbookMdoComponent],
  providers:[CompetencyPassbookMdoService]
})
export class CompetencyPassbookMdoModule { }
