import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { PillsComponent } from './pills.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';



@NgModule({
  declarations: [PillsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    SkeletonLoaderLibModule
  ],
  exports: [PillsComponent]
})
export class PillsModule { }
