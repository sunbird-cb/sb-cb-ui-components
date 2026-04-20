import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { AccessControlService } from "../../../_services/access-control.service";
import { NsAccessControlConfig } from "../../../_models/access-control.model";

@Component({
  selector: "sb-uic-access-control-guide",
  templateUrl: "./access-control-guide.component.html",
  styleUrls: ["./access-control-guide.component.scss"]
})
export class AccessControlGuideComponent implements OnInit {
  accessControlGuideConfig: NsAccessControlConfig.IAccessControlGuide;
  constructor(public dialogRef: MatDialogRef<AccessControlGuideComponent>, private accessControlService: AccessControlService) {}

  ngOnInit(): void {
    this.accessControlGuideConfig = this.accessControlService.accessControlConfig().accessControlGuide;
  }

  onClose() {
    this.dialogRef.close();
  }
}
