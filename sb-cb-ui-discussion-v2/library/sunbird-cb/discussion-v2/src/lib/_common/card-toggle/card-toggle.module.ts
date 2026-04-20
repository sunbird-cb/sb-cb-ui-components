import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardToggleComponent } from './card-toggle.component';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    CardToggleComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [
    CardToggleComponent
  ]
})
export class CardToggleModule { }
