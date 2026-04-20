import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopLearnersComponent } from './top-learners.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [TopLearnersComponent],
  imports: [
    CommonModule,
    SkeletonLoaderLibModule,
    MatTooltipModule,
    MatIconModule
  ],
  exports: [TopLearnersComponent],
})
export class TopLearnersModule { }