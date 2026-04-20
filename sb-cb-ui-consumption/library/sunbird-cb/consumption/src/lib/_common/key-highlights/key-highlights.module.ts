import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyHighlightsComponent } from './key-highlights.component';
import { SlidersNgContentLibModule } from '../sliders-ng-content/sliders-ng-content.module';
import { ScrollableItemModule } from '../../_directives/scrollable-item/scrollable-item.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [KeyHighlightsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SlidersNgContentLibModule,
    ScrollableItemModule
  ],
  exports: [
    KeyHighlightsComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class KeyHighlightsModule { }
