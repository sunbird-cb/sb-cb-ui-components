import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-add-tab-dialog',
  templateUrl: './add-tab-dialog.component.html',
  styleUrls: ['./add-tab-dialog.component.scss']
})
export class AddTabDialogComponent {
  tabTitle: string = ''

  constructor(
    public dialogRef: MatDialogRef<AddTabDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.tabTitle = data.title
    }
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onAdd(): void {
    if (this.tabTitle && this.tabTitle.trim()) {
      this.dialogRef.close(this.tabTitle.trim())
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onAdd()
    } else if (event.key === 'Escape') {
      this.onCancel()
    }
  }
}
