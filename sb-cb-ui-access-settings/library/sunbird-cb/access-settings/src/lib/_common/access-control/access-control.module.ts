import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRippleModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";

import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyRadioModule as MatRadioModule } from "@angular/material/legacy-radio";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";

import { DragDropDirective } from "../../_directives/drag-drop.directive";

import { AccessControlComponent } from "./access-control.component";
import { ListTableComponent } from "../../components/list-table/list-table.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { BulkUploadKarmayogiComponent } from "../../components/bulk-upload-karmayogi/bulk-upload-karmayogi.component";

import { InviteUsersComponent } from "../dialogs/invite-users/invite-users.component";
import { EntitySelectionsComponent } from "../dialogs/entity-selections/entity-selections.component";
import { ConfirmDialogComponent } from "../dialogs/confirm-dialog/confirm-dialog.component";
import { AccessControlGuideComponent } from "../dialogs/access-control-guide/access-control-guide.component";

@NgModule({
  declarations: [
    AccessControlComponent,
    InviteUsersComponent,
    ListTableComponent,
    PaginationComponent,
    BulkUploadKarmayogiComponent,
    DragDropDirective,
    EntitySelectionsComponent,
    ConfirmDialogComponent,
    AccessControlGuideComponent
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRippleModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTooltipModule
  ],
  exports: [AccessControlComponent, PaginationComponent]
})
export class AccessControlModule {}
