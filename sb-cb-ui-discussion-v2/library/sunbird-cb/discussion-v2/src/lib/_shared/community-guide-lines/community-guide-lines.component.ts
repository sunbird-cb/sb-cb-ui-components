import { Component, Inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'd-v2-community-guide-lines',
  templateUrl: './community-guide-lines.component.html',
  styleUrls: ['./community-guide-lines.component.scss']
})
export class CommunityGuideLinesComponent {
  selectedFlags: any = []
  othersTextData: any = ''
  isProfanity: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CommunityGuideLinesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isProfanity = data?.isProfanity || false
  }
  cancel() {
    this.dialogRef.close(false)
  }

  submit(): void {
    this.dialogRef.close(true)
  }
}