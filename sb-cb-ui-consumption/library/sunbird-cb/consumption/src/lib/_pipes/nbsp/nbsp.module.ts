import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbspPipe } from './nbsp.pipe';



@NgModule({
    declarations: [
    NbspPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [NbspPipe]
})
export class NbspModule { }
