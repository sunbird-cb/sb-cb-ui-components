import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { SearchListingService } from "../../_services/search-listing.service";
import { SearchListingConfig } from "../../_models/search-listing.model";

@Component({
  selector: "sb-cb-search-designation-card",
  templateUrl: "./designation-card.component.html",
  styleUrls: ["./designation-card.component.scss"]
})
export class DesignationCardComponent {
  @Input() designation!: any;
  @Input() category!: any;
  @Output() telemetry = new EventEmitter<any>();

  constructor(private router: Router, private searchListingService: SearchListingService) {}

  formatAdditionalInfo(info: string): any {
    if (typeof info === "string") {
      return JSON.parse(info);
    } else {
      return info;
    }
  }

  navigateToDesignation(): void {
    if (this.searchListingService.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal) {
      this.router.navigate(["app/home/odcs-mapping"], { queryParams: { name: this.designation?.name, identifier: this.designation?.identifier } });
    }
  }
}
