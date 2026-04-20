import { Component, EventEmitter, Input, Output } from "@angular/core";
// import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationsService, NsUser } from "@sunbird-cb/utils-v2";
import { SearchListingService } from "../../_services/search-listing.service";
import * as _ from "lodash";
import { MatSnackBar as MatSnackbarNew } from "@angular/material/snack-bar";
import { ConfirmationDialogComponent } from "@sunbird-cb/consumption";
import { MatLegacyDialog } from "@angular/material/legacy-dialog";

@Component({
  selector: "sb-cb-search-users-card",
  templateUrl: "./users-card.component.html",
  styleUrls: ["./users-card.component.scss"]
})
export class UsersCardComponent {
  @Input() user!: any;
  @Input() category!: any;
  @Input() applicationName = '';
  @Output() telemetry = new EventEmitter<any>();
  @Output() updateUser = new EventEmitter<string>();

  currentUser!: NsUser.IUserProfile;
  howerUser!: any;
  unmappedUser!: any;

  constructor(
    private configSvc: ConfigurationsService, 
    // private router: Router, 
    private translate: TranslateService,
    private searchListingService: SearchListingService,
    private matSnackbarNew: MatSnackbarNew,
    private dialog: MatLegacyDialog
  ) {
    if (localStorage.getItem("websiteLanguage")) {
      this.translate.setDefaultLang("en");
      const lang = localStorage.getItem("websiteLanguage")!;
      this.translate.use(lang);
    }
  }

  ngOnInit() {
    if (this.configSvc.userProfile) {
      this.currentUser = this.configSvc.userProfile;
    }

    this.howerUser = this.user;
    this.unmappedUser = this.user;
  }

  getUseravatarName() {
    let name = "";
    if (this.user && !this.user.personalDetails) {
      if (this.user.firstName) {
        if (this.user.lastName && this.user.lastName !== null && this.user.lastName !== undefined) {
          name = `${this.user.firstName} ${this.user.lastName}`;
        } else {
          name = `${this.user.firstName}`;
        }
      } else if (this.user.fullName) {
        name = `${this.user.fullName}`;
      } else {
        name = `${this.user.name}`;
      }
    } else if (this.user && this.user.personalDetails) {
      if (this.user.personalDetails.middlename) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename}`;
        }
      } else if (this.user.personalDetails.firstname) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstname}`;
        }
      } else if (this.user.personalDetails.firstName) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstName} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstName}`;
        }
      }
    }
    return name;
  }

  goToUserProfile(user: any) {
    if (this.applicationName !== 'CBP Portal' || !user.isDeleted) {
      user.contentType = "People";
      user.identifier = user.userId;
      this.telemetry.emit(user);
      this.updateUser.emit(user.userId || user.id || user.wid);
    } else {
      this.matSnackbarNew.open("User is Desactivated please activate to see the profile", "X", {
        duration: 3000,
        panelClass: ["success"]
      });
    }
  }

  get usr() {
    return this.howerUser;
  }

  get userDesignation(): string {
    const professionalDetails = this.user?.profileDetails?.professionalDetails;

    if (professionalDetails?.length) {
      const designationItem = professionalDetails.find((item: any) => "designation" in item);
      const designation = designationItem?.designation ?? "";
      // const rootOrgName = this.user?.rootOrgName ?? "";
      return designation ? `${designation}` : '';
    }

    return "";
  }

  get userEmail(): string {
    return this.user?.email || "";
  }

  get userPhone(): string {
    return this.user?.maskedPhone || "";
  }

  get isUserVerified(): boolean {
    return this.user?.profileDetails?.profileStatus === "VERIFIED";
  }

  get onboardingDate(): string {
    return this.user.createdDate || ''
  }

  /**
   * Handle activation toggle. The template may pass either a boolean (checked) or a
   * MatSlideToggleChange-like event. We open a confirmation dialog; if user confirms
   * we call updateUserStatus. If user cancels, we revert the UI toggle and restore
   * the previous user state so the toggle remains unchanged.
   */
  onUserActivationToggle(eventOrChecked: any, user: any) {
    if (!user) {
      return;
    }
    // Determine checked value and toggle source (if provided)
    const isEvent = eventOrChecked && typeof eventOrChecked === 'object' && 'checked' in eventOrChecked;
    const checked = isEvent ? eventOrChecked.checked : !!eventOrChecked;
    // Capture previous state to allow reversion
    const prevIsDeleted = !!user.isDeleted;
    const prevChecked = !prevIsDeleted; // assuming toggle checked === !user.isDeleted

    const data: any = {
      type: 'warning',
      iconName: 'info_outline',
      planeDescription: 'Are you sure you want to ' + (checked ? 'activate' : 'deactivate') + ' ' + (user.firstName || '') + '?',
      buttonsPositionClass: 'justify-center',
      buttons: [
        {
          classes: 'succes-button',
          text: 'Yes',
          response: true
        },
        {
          classes: 'btn-out-line',
          text: 'No',
          response: false
        }
      ]
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // user confirmed
        this.updateUserStatus(checked, user);
      } else {
        // user cancelled -> revert UI and restore previous state
        try {
          if (isEvent) {
            // MatSlideToggleChange has a source with checked property
            const source = eventOrChecked.source || eventOrChecked.toggle || eventOrChecked.target;
            if (source && typeof source.checked !== 'undefined') {
              source.checked = prevChecked;
            }
          } else {
            // Template passed a boolean; try to restore model-bound value
            user.isDeleted = prevIsDeleted;
          }
        } catch (e) {
          // best-effort revert
          user.isDeleted = prevIsDeleted;
        }
      }
    });
  }

updateUserStatus(checked: boolean, user: any) {
  const request ={
      request: {
        requestedBy: _.get(this.configSvc, 'userProfile.userId', ''),
        userId: this.user.userId || this.user.id || this.user.wid
      }
    }
    if (checked) {
      this.searchListingService.unblockUser(request).subscribe(_res => {
        user.isDeleted = false
        this.matSnackbarNew.open("User has been activated successfully", "X", {
          duration: 3000,
          panelClass: ["success"]
        });
      })
    } else {
      this.searchListingService.blockUser(request).subscribe(_res => {
        user.isDeleted = true
        this.matSnackbarNew.open("User has been deactivated successfully", "X", {
          duration: 3000,
          panelClass: ["success"]
        });
      })
    }
  }
}
