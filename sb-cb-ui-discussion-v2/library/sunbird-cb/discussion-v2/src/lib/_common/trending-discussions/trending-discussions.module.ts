import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingDiscussionsComponent } from './trending-discussions.component';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../_shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { CardToggleModule } from '../card-toggle/card-toggle.module';
import { PipesModule } from '../../_pipes/pipes.module';
import { NoDataModule } from '../no-data/no-data.module';



@NgModule({
  declarations: [
    TrendingDiscussionsComponent,
    
  ],
  imports: [
    CommonModule,
    MatCardModule,
    SharedModule,
    MatIconModule,
    CardToggleModule,
    PipesModule,
    NoDataModule
  ],
  exports:[TrendingDiscussionsComponent]
})
export class TrendingDiscussionsModule { }
