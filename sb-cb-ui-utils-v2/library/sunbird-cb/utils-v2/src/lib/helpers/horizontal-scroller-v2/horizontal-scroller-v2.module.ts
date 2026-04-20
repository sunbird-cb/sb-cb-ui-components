import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HorizontalScrollerV2Component } from './horizontal-scroller-v2.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

@NgModule({
  declarations: [HorizontalScrollerV2Component],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [HorizontalScrollerV2Component],
})
export class HorizontalScrollerV2Module { }
