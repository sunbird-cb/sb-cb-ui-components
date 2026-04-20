import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA, MatLegacySnackBarRef as MatSnackBarRef } from "@angular/material/legacy-snack-bar";

@Component({
  selector: "sb-uic-snackbar",
  templateUrl: "./snackbar.component.html",
  styleUrls: ["./snackbar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackbarComponent {
  public readonly data = inject<{ message: string; type: "success | error" }>(MAT_SNACK_BAR_DATA);

  constructor(public snackBarRef: MatSnackBarRef<SnackbarComponent>) {}
}
