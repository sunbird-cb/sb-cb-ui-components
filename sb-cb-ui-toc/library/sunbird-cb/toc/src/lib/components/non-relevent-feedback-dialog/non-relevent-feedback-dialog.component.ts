import { Component, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'

/**
 * NonReleventFeedbackDialogComponent - Stub component
 * Displays a dialog for collecting feedback when content is marked as not relevant
 */
@Component({
  selector: 'ws-non-relevent-feedback-dialog',
  templateUrl: './non-relevent-feedback-dialog.component.html',
  styleUrls: ['./non-relevent-feedback-dialog.component.scss'],
})
export class NonReleventFeedbackDialogComponent implements OnInit {
  feedbackForm: UntypedFormGroup

  constructor(
    public dialogRef: MatDialogRef<NonReleventFeedbackDialogComponent>
  ) {
    this.feedbackForm = new UntypedFormGroup({
      feedback: new UntypedFormControl('', [Validators.required]),
    })
  }

  ngOnInit() {}

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.dialogRef.close(this.feedbackForm.value.feedback)
    }
  }

  onCancel() {
    this.dialogRef.close()
  }
}
