import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ConfigurationsService, NsUser } from "@sunbird-cb/utils-v2";

@Component({
  selector: "sb-cb-search-training-plans-card",
  templateUrl: "./training-plans-card.component.html",
  styleUrls: ["./training-plans-card.component.scss"]
})
export class TrainingPlansCardComponent implements OnInit {
  @Input() plan!: any;
  @Output() telemetry = new EventEmitter<any>();
  userProfile: NsUser.IUserProfile | null = null;

  constructor(private configService: ConfigurationsService, private router: Router) {}

  ngOnInit(): void {
    this.userProfile = { ...this.configService.userProfile, userRoles: this.configService.userRoles } as NsUser.IUserProfile;
  }

  public routeTrainingPlanDetails(plan: any): void {
    let url: string;
    if (
      (this.userProfile?.firstName === plan?.createdByName ||
        this.userProfile?.userRoles?.has("mdo_leader")) &&
      plan?.status?.toLowerCase() !== "retire"
    ) {
      url = `/app/training-plan/update-plan/${plan?.id}`;
    } else {
      url = `/app/training-plan/preview-plan-for-dashboard/${plan?.id}`;
    }

    this.router.navigate([url]);
    // this.telemetry.emit({ type: "trainingPlan", id: plan?.id ?? '', name: plan?.name ?? '' });
  }
}
