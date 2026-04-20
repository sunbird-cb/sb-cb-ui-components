import { Component, Inject, ViewEncapsulation } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'd-v2-flag-dialogue',
  templateUrl: './flag-dialogue.component.html',
  styleUrls: ['./flag-dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlagDialogueComponent {
  selectedFlags: any = []
  othersTextData: any = ''
  constructor(
    public dialogRef: MatDialogRef<FlagDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  handleSelectedFlags(eventData: any, dataType: any) {
    if (eventData.checked) {
      if (dataType.includes('Others') || dataType.includes('others')) {
        this.selectedFlags = []
      }
      this.selectedFlags.push(dataType)
    } else {
      const index = this.selectedFlags.findIndex((x: any) => x === dataType)
      this.selectedFlags.splice(index, 1)
    }
   
  }

  submitFlag(): void {
    if (this.selectedFlags.includes('Others') || this.selectedFlags.includes('others')) {
      this.othersTextData = this.othersTextData
    } else {
      this.othersTextData = ''
    }
    let flagData: any = {
      reportedDueTo: this.selectedFlags,
      otherReasons: this.othersTextData
    }
    this.dialogRef.close(flagData)
  }
}
