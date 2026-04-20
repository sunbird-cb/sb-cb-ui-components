import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaginationComponent } from "./pagination.component";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";



@NgModule({
  declarations: [PaginationComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  exports: [PaginationComponent],
})
export class PaginationModule {}
