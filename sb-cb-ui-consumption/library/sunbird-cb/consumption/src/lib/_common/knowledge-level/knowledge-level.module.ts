import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeLevelComponent } from './knowledge-level.component';



@NgModule({
  declarations: [
    KnowledgeLevelComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KnowledgeLevelComponent
  ]
})
export class KnowledgeLevelModule { }
