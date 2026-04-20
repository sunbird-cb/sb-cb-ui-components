import { NgModule } from "@angular/core";
import { AccessSettingsComponent } from "./access-settings.component";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
@NgModule({
  declarations: [AccessSettingsComponent, SnackbarComponent],
  imports: [MatIconModule, CommonModule],
  exports: [AccessSettingsComponent]
})
export class AccessSettingsModule {}
export * from "./access-settings.component";
