import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { MatCardModule } from '@angular/material/card';
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../_pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { MultiLineEllipsisModule } from '../../_directives/multi-line-ellipsis/multi-line-ellipsis.module';



@NgModule({
  declarations: [
    FilterComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatLegacyCheckboxModule,
    MatIconModule,
    TranslateModule,
    PipesModule,
    MultiLineEllipsisModule
  ],
  exports:[
    FilterComponent
  ]
})
export class FilterModule { }
