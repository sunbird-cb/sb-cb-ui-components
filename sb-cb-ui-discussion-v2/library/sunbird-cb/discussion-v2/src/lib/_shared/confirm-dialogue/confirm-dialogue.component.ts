import { Component, Inject, ViewEncapsulation } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'd-v2-confirm-dialogue',
  templateUrl: './confirm-dialogue.component.html',
  styleUrls: ['./confirm-dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogueComponent {
  selectedFlags: any = []
  othersTextData: any = ''
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  cancel() {
    this.dialogRef.close(false)
  }

  submit(): void {
    this.dialogRef.close(true)
  }
}
