import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NsAccessControlConfig } from "../../../_models/access-control.model";

@Component({
  selector: "sb-uic-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"]
})
export class ConfirmDialogComponent {
  public readonly data = inject<{ additionalData: string; type: "delete" | "confirm-access-type" | "confirm-reset-fields" }>(MAT_DIALOG_DATA);
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  confirmNo(): void {
    this.dialogRef.close({ action: NsAccessControlConfig.IActions.Reject });
  }
  confirmYes(): void {
    this.dialogRef.close({ action: NsAccessControlConfig.IActions.Confirm });
  }
}
