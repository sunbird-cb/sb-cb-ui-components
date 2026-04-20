import { Component, Inject } from '@angular/core'
import { MatLegacyDialogRef, MAT_LEGACY_DIALOG_DATA } from '@angular/material/legacy-dialog'

type DialogData = {
  title?: string // title of the dialog
  description?: string // description or message of the dialog
  iconName?: string // mat icon name to be displayed in the dialog
  iconUrl?: string // custom icon url to be displayed in the dialog
  type?: string // type of the dialog - warning(orrange color) , primary(blue color)....
  buttonsPositionClass?: string // flex position class for buttons container Eg: 'justify-center, justify-end, justify-between, justify-start, items-center, mt-2 etc..'
  planeDescription?: string
  messages?: {
    message: string // list of messages to be displayed in the dialog in saparate lines
    classes?: string // additional classes for message styling
  }[]
  buttons?: { // list of buttons to be displayed in the dialog
    classes?: string // additional classes for button styling Eg: 'succes-button'(primary color background), 'btn-out-line'(primary color out lined)
    text?: string // button text
    response?: string | boolean // response to be sent when button is clicked
  }[]
}

@Component({
  selector: 'ws-widget-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  dialgoData: DialogData = {};

  constructor(
    private dialogRef: MatLegacyDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: DialogData,
  ) {
    this.dialgoData = data
  }

  closeDialog(response: string) {
    this.dialogRef.close(response)
  }

}
