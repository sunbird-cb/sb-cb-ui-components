import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from './member-card.component';
import { SharedModule } from '../../_shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module';
import { MultiLineEllipsisModule } from '../../_directives/multi-line-ellipsis/multi-line-ellipsis.module';



@NgModule({
  declarations: [
    MemberCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatCardModule,
    SkeletonLoaderModule,
    MultiLineEllipsisModule
  ],
  exports:[
    MemberCardComponent
  ]
})
export class MemberCardModule { }
