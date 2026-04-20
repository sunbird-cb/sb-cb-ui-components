import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingTagsComponent } from './trending-tags.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';



@NgModule({
  declarations: [
    TrendingTagsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    
  ],
  exports: [TrendingTagsComponent]
})
export class TrendingTagsModule { }
