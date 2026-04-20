import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { TourComponent } from './tour-guide.component'

@NgModule({
  declarations: [TourComponent],
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
  ],
  exports: [TourComponent],
})
export class TourModule { }
