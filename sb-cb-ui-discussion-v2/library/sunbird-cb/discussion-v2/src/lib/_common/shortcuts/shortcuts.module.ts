import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortcutsComponent } from './shortcuts.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ShortcutsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  exports: [ShortcutsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShortcutsModule { }
