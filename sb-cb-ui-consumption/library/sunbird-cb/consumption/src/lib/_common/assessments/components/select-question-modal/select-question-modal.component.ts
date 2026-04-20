import { Component, Inject } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'

export interface QuestionTypeData {
  title?: string
  isOptionWeightage?: boolean
  isBasicAssessment?: boolean
}

@Component({
  selector: 'sb-uic-select-question-modal',
  templateUrl: './select-question-modal.component.html',
  styleUrls: ['./select-question-modal.component.scss']
})
export class SelectQuestionModalComponent {

  constructor(
    public dialogRef: MatDialogRef<SelectQuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuestionTypeData
  ) { }

  get isOptionWeightage(): boolean {
    return this.data?.isOptionWeightage || false
  }

  get isBasicAssessment(): boolean {
    return this.data?.isBasicAssessment || false
  }

  onQuestionTypeSelect(questionType: string): void {
    this.dialogRef.close(questionType)
  }

}
