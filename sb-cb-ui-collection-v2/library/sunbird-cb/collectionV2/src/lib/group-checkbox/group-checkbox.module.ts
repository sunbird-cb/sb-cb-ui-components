import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatGridListModule } from '@angular/material/grid-list'
import { GroupCheckboxComponent } from './group-checkbox.component'
import { MatIconModule } from '@angular/material/icon'
@NgModule({
  declarations: [GroupCheckboxComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
  ],
  exports: [GroupCheckboxComponent],
})
export class GroupCheckboxModule { }
