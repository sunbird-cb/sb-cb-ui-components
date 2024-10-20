import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdoLeaderboardComponent } from './mdo-leaderboard.component';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { InsiteDataService } from '../../_services/insite-data.service';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [MdoLeaderboardComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SkeletonLoaderLibModule,
    FormsModule,
    MatTooltipModule
  ],
  exports: [
    MdoLeaderboardComponent
  ],
  providers: [InsiteDataService]
})
export class MdoLeaderboardModule { }
