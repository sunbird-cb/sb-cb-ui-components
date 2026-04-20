import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { TOCMultiLingualDialogComponent } from './toc-multi-lingual-dialog.component';



@NgModule({
  declarations: [
    TOCMultiLingualDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule,
  ],
  exports: [
    TOCMultiLingualDialogComponent
  ]
})
export class TOCMultiLingualDialogModule { }
