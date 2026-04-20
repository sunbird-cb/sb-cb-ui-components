import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from './no-data.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    NoDataComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    NoDataComponent
  ]
})
export class NoDataModule { }
