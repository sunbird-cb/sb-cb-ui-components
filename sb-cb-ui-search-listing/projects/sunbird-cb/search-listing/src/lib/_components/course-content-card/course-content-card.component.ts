import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { ConfigurationsService, EventService, NsContent, WsEvents } from "@sunbird-cb/utils-v2";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { MatSnackBar as MatSnackbarNew } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { WidgetContentLibService } from "@sunbird-cb/consumption";
import { CertificateDialogComponent } from "@sunbird-cb/consumption";
import { ICompentencyKeys, SearchListingConfig, CBPstatusMapping } from "../../_models/search-listing.model";
import { SearchListingService } from "../../_services/search-listing.service";
import * as _ from "lodash";
// import { Subscription } from "rxjs";

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const NEW_CONTENT_THRESHOLD_DAYS = 14;
@Component({
  selector: "ws-app-course-content-card",
  templateUrl: "./course-content-card.component.html",
  styleUrls: ["./course-content-card.component.scss"]
})
export class CourseContentCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() content: any;
  @Input() enrollment: any[] = [];
  @Input() cbpPlans: any[] = [];
  @Input() applicationName = '';
  @Output() telemetry = new EventEmitter<any>();
  contentBookmarked = false;
  defaultThumbnail = "/assets/instances/eagle/app_logos/default.png";
  defaultSLogo = "/assets/instances/eagle/app_logos/igot-katmayogi-logo.svg";
  compentencyKey!: ICompentencyKeys;
  public cbpStatusMapping = CBPstatusMapping;

  courseEnrollment: any;
  downloadCertificateLoading = false;
  isIgot = false;
  environment!: any;
  contentStatus = ''
  mentList: {
    displayName: string,
    action: string,
  }[] = []
  currentUserRoles: string[] = [];
  // userRoleIsFixed = true;
  // roleFixedSubscription: Subscription | undefined = undefined;
  constructor(
    @Inject("environment") environment: any,
    private configSvc: ConfigurationsService,
    private dialog: MatDialog,
    private events: EventService,
    private router: Router,
    private contSvc: WidgetContentLibService,
    private searchListingService: SearchListingService,
    private matSnackbarNew: MatSnackbarNew
  ) {
    this.environment = environment;
  }

  ngOnInit(): void {
    this.compentencyKey = this.configSvc.compentency ?this.configSvc.compentency[this.environment.compentencyVersionKey] : undefined;
    // this.subscribeToUserRoleFixStatus();
  }

  // subscribeToUserRoleFixStatus() {
  //   if (!this.roleFixedSubscription) {
  //     this.roleFixedSubscription = this.searchListingService.userRoleIsFixed$.subscribe((isFixed: boolean) => {
  //       this.userRoleIsFixed = isFixed;
  //     });
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["enrollment"] && changes["enrollment"].currentValue) {
      if (this.enrollment?.length && this.content) {
        this.courseEnrollment = this.enrollment.find((ele: any) => ele.courseId === this.content.identifier) || null;
      }
    }
    if (changes["cbpPlans"] && changes["cbpPlans"].currentValue) {
      if (this.cbpPlans?.length && this.content) {
        this.isIgot = this.cbpPlans.some((ele: any) => ele.identifier === this.content.identifier);
      } else {
        this.isIgot = false;
      }
    }
    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal && changes['content'] && changes['content'].currentValue) {
      this.contentStatus = this.content.status || ''
      const userRoles = (this.configSvc as any)?.userRoles as Set<string> | string[] | undefined;
      this.currentUserRoles = userRoles instanceof Set ? Array.from(userRoles).map(role => role.toLowerCase()) : Array.isArray(userRoles) ? (userRoles as string[]).map(role => role.toLowerCase()) : [];
      if(this.content.status) {
        switch (this.content.status.toLowerCase()) {
          case 'draft':
            this.contentStatus = 'Draft'
            this.mentList = [
              
            ]
            break;
          case 'live':
            this.contentStatus = 'Live'
            this.mentList = [
              {
                displayName: 'Edit',
                action: 'edit'
              }
            ]
            break;
          case 'review':
            this.contentStatus = 'For Publish'
            this.mentList = [
              {
                displayName: 'Submit for Review',
                action: 'publish'
              }
            ]
            break;
          case 'Reviewed':
            this.contentStatus = 'For Publish'
            this.mentList = [
              {
                displayName: 'Publish',
                action: 'publish'
              }
            ]
            break;
        }
      }
    }
  }

  checkForCiosDuration(item: any) {
    if (item && item.contentId && item.contentId.includes("ext_")) {
      return item.duration * 60;
    }
    return item.duration;
  }

  downloadCertificate(certificateData: any) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: "view-certificate",
        subType: WsEvents.EnumInteractSubTypes.CERTIFICATE
      },
      {
        id: certificateData.issuedCertificates && certificateData.issuedCertificates.length && certificateData.issuedCertificates[0].identifier, // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE
      }
    );
    if (certificateData.issuedCertificates.length > 0) {
      this.downloadCertificateLoading = true;
      const certificate: any = certificateData.issuedCertificates.sort(
        (a: any, b: any) => new Date(a.lastIssuedOn).getTime() - new Date(b.lastIssuedOn).getTime()
      );
      let certData: any = certificate && certificate.length && certificate[0];
      this.searchListingService.downloadCertificate_v2(certData.identifier).subscribe((res: any) => {
        this.downloadCertificateLoading = false;
        const cet = res.result.printUri;
        this.dialog.open(CertificateDialogComponent, {
          width: "1300px",
          data: { cet, certId: certData.identifier }
        });
      });
    } else {
      this.downloadCertificateLoading = false;
    }
  }

  checkIfContentIsNew(createdOn: string): boolean {
    if (!createdOn) return false;
    const createdDate = new Date(createdOn);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - createdDate.getTime();
    const diffInDays = diffInMs / MILLISECONDS_IN_A_DAY;

    return diffInDays <= NEW_CONTENT_THRESHOLD_DAYS;
  }

  async getRedirectUrlData(content: any) {
    if(this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      const loggedInUserId = _.get(this.configSvc, 'userProfile.userId', '')
      this.telemetry.emit(content);
      // delegate to a dedicated handler that implements CBPPortal rules
      // if (this.userRoleIsFixed) {
      //   this.handleContentClick(content, loggedInUserId);
      // } else {
        this.setUserRoleBasedOnCourseStatus(content)
      // }
    } else if (content && content?.contentType === "Resource" && content?.identifier) {
      let resourceType;
      if (!content?.resourceType) {
        resourceType = "youtube";
      } else {
        resourceType = content?.resourceType === "MP4" ? "video" : content?.resourceType.toLowerCase();
      }
      this.telemetry.emit(content);
      this.router.navigate([`app/amrit-gyaan-kosh/player/${resourceType.toLowerCase()}/${content?.identifier}`], {
        queryParams: { primaryCategory: content?.primaryCategory }
      });
    } else {
      this.telemetry.emit(content);
      const urlData = await this.contSvc.getResourseLink(content);
      this.router.navigate([urlData.url], {
        queryParams: urlData.queryParams
      });
    }
  }

  generateCompetencySubThemeString(): string {
    if (this.content && this.content[this.compentencyKey?.vKey]) {
      return this.content[this.compentencyKey?.vKey].map((keyword: any) => keyword[this.compentencyKey?.vCompetencySubTheme]).join(" · ");
    }
    return "";
  }

  getBaseLanguageId(content: any) {
    if (content && content.languageMapV1) {
      const baseLanguage: any = Object.values(content.languageMapV1).find((lang: any) => lang.isBaseLang)
      return baseLanguage ? baseLanguage.id : null
    }
    return null
  }

  /**
   * Handle content click for CBPPortal application according to role and content status rules.
   * Contract:
   * - Inputs: userRolesArray (normalized), content object, loggedInUserId string
   * - Side effects: show snack messages or navigate using router
   */
  handleContentClick(content: any, loggedInUserId: string): void {
    // Helpers
    if (content && content.status && (content.status.toLowerCase() === 'failed' || content.status.toLowerCase() === 'retired')) {
      this.openSnackBar('You don\'t have access!');
      return;
    }
    const hasRole = (r: string) => this.currentUserRoles && this.currentUserRoles.includes(r.toLowerCase());
    const isCreator = hasRole("CONTENT_CREATOR") ;
    const isReviewer = hasRole("CONTENT_REVIEWER");
    const isPublisher = hasRole("CONTENT_PUBLISHER");
    const isSpvPublisher = hasRole("SPV_PUBLISHER");
    const isProgramCoordinator = hasRole("PROGRAM_COORDINATOR");
    const accessMessage = 'You don\'t have access!'
    const isCourseReview = content.status && content.status.toLowerCase() === 'review' ? true : false
    const reviewStatus = content.reviewStatus ? content.reviewStatus.toLowerCase() : ''
    let mode = '';
    if (
      (isCreator && content.createdBy !== loggedInUserId && content.status && content.status.toLowerCase() === 'draft') ||
      (isReviewer && isCourseReview && content.reviewStatus && reviewStatus === 'reviewed' && content.courseCategory !== 'Multilingual Course') || 
      ((isPublisher || isSpvPublisher) && isCourseReview && reviewStatus === 'inreview') 
    ) {
      this.openSnackBar('You don\'t have access!');
      return;
    }
    if (
      (isReviewer && content.reviewStatus && (reviewStatus === 'inreview' || reviewStatus === 'reviewed') && isCourseReview)||
      (isPublisher && isCourseReview && content.reviewStatus) ||
      (isSpvPublisher && isCourseReview && content.reviewStatus && 
        (
          reviewStatus === 'inreview' || 
          reviewStatus === 'reviewed'
        )
      ) ||
      ( isCreator && content.status && 
        (
          content.status.toLowerCase() === 'failed' ||
          content.status.toLowerCase() === 'retired' ||
          content.status.toLowerCase() === 'draft' ||
          (
            content.status.toLowerCase() === 'review' && 
            content.createdBy === loggedInUserId &&
            content.courseCategory === 'Multilingual Course'
          )
        )
      )
    ) {
      mode = 'edit';
    }
    if (content && content.identifier) {
      this.searchListingService.getCourseDetails(content.identifier, mode, content.primaryCategory).subscribe((res: any) => {
        if (res && res.params && res.params.status === 'successful') {

          const status = (content && content.status) ? String(content.status).toLocaleLowerCase() : "";
          const reviewStatus = (content && content.reviewStatus) ? String(content.reviewStatus).toLocaleLowerCase() : "";

          const showMessage = (msg: string) => {
            try {
              this.openSnackBar(msg);
              // this.matSnackbarNew.open(msg, "X", { duration: 3000 });
            } catch (e) {
              // fallback
              console.warn(msg);
            }
          };

          const goToEditor = () => {
            if (_.get(content, 'prevStatus', '').toLowerCase() !== 'live' &&
            content.status.toLowerCase() !== 'live' &&
            content.courseCategory === 'Multilingual Course' &&
            this.getBaseLanguageId(content)
        ) {
          this.router.navigate(['/author/editor/multilingual', 'edit', this.getBaseLanguageId(content)], {
            queryParams: {
              langEditId: content.identifier
            }
          })
        } else {
          this.router.navigateByUrl(`/author/editor/${content.identifier}`)
        }
          };

          const goToReview = () => {
            if (content.prevStatus && content.prevStatus.toLowerCase() === 'live') {
              this.router.navigate(['/author/editor/multilingual', 'edit', this.getBaseLanguageId(content)], {
                queryParams: {
                  langEditId: content.identifier
                }
              });
            } else {
              this.router.navigateByUrl(`/author/editor/${content.identifier}`);
            }
          };

          const goToOverviewV2 = () => {
            if (content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE &&
              content.resourceCategory !== 'Learning Resource') {
              localStorage.setItem('isStandaloneResource', 'true')
            } else {
              localStorage.setItem('isStandaloneResource', 'false')
            }
            {
              let url: any = `author/content-detail/${content.identifier}/overview-v2`
              this.router.navigateByUrl(url)
            }
          };

          // 1. Creator logic
          if (isCreator) {
            switch (status.toLocaleLowerCase()) {
              case "live":
                goToOverviewV2();
                break;
              case "review":
                if (reviewStatus.toLocaleLowerCase() === "inreview") {
                  goToEditor();
                } else if (reviewStatus.toLocaleLowerCase() === "reviewed") {
                  goToEditor();
                }
                break;
              case "draft":
              case "retired":
              case "failed":
                goToEditor()
                break;
              default:
                showMessage(accessMessage);
            }
            return;
          }

          // 2. Reviewer logic
          if (isReviewer) {
            // If reviewer and content.status is 'review' or 'accept' allow editor
            if (status.toLocaleLowerCase() === "review" && reviewStatus.toLocaleLowerCase() === "inreview") {

              goToEditor()
              return;
            } else if (status.toLocaleLowerCase() === "review" && reviewStatus.toLocaleLowerCase() === "reviewed") {
              goToEditor();
              return;
            } else if (status.toLocaleLowerCase() === "live") {
              goToOverviewV2();
              return;
            }
            showMessage(accessMessage);
            return;
          }

          // 3. Publisher logic
          if (isPublisher) {
            if (content.status && content.status.toLowerCase() === 'live') {
              goToOverviewV2();
              return;
            } else if (status.toLocaleLowerCase() === "review" && content.reviewStatus && reviewStatus === 'reviewed') {
              goToEditor();
              return;
            }
            showMessage(accessMessage);
            return;
          }

          // 4. SPV_PUBLISHER logic
          if (isSpvPublisher) {
            if (content.status && content.status.toLowerCase() === 'live') {
              goToOverviewV2();
              return;
            } else if (status=== 'review' && reviewStatus === 'reviewed') {
              goToEditor();
              return;
            }
            showMessage(accessMessage);
          }

          // 5. PROGRAM_COORDINATOR logic
          if (isProgramCoordinator) {
            if (content.status && content.status.toLowerCase() === 'live') {
              goToOverviewV2();
              return;
            }
            showMessage(accessMessage);
            return;
          }

          // Default: no special roles -> navigate to overview
          goToOverviewV2();
        } else {
          this.openSnackBar('You don\'t have access!');
        }
      }, () => {
        this.openSnackBar('You don\'t have access!');
      });
    }
  }

  setUserRoleBasedOnCourseStatus(content: any): void {
    if (content && content.status) {
      const userAllRoles = (this.configSvc as any)?.userAllRoles as Set<string> | string[] | undefined;
      const userRoles = userAllRoles instanceof Set ? Array.from(userAllRoles).map(role => role.toLowerCase()) : Array.isArray(userAllRoles) ? (userAllRoles as string[]).map(role => role.toLowerCase()) : [];
      const hasRole = (r: string) => userRoles && userRoles.includes(r.toLowerCase());
      const isCreator = hasRole("CONTENT_CREATOR") ;
      const isReviewer = hasRole("CONTENT_REVIEWER");
      const isPublisher = hasRole("CONTENT_PUBLISHER");
      const isSpvPublisher = hasRole("SPV_PUBLISHER");
      const isProgramCoordinator = hasRole("PROGRAM_COORDINATOR");
      let rolesToSet: string[] = [];

      switch (content.status.toLowerCase()) {
        case 'draft':
          if (isCreator) {
        rolesToSet = ['content_creator'];
          }
          break;
        case 'review':
          if (isSpvPublisher && content.reviewStatus && content.reviewStatus.toLowerCase() === 'reviewed') {
        rolesToSet = ['content_publisher'];
          } else if (isPublisher && content.reviewStatus && content.reviewStatus.toLowerCase() === 'reviewed') {
        rolesToSet = ['content_publisher'];
          } else if (isReviewer) {
        rolesToSet = ['content_reviewer'];
          } else if (isCreator) {
        rolesToSet = ['content_creator'];
          }
          break;
        case 'live':
          if (isSpvPublisher) {
        rolesToSet = ['spv_publisher'];
          } else if (isProgramCoordinator) {
        rolesToSet = ['program_coordinator'];
          } else if (isPublisher) {
        rolesToSet = ['content_publisher'];
          } else if (isReviewer) {
        rolesToSet = ['content_reviewer'];
          } else if (isCreator) {
        rolesToSet = ['content_creator'];
          }
          break;
        default:
          if (isCreator) {
        rolesToSet = ['content_creator'];
          }
      }
      this.configSvc.userRoles = new Set(rolesToSet);
      this.currentUserRoles = rolesToSet;
      this.searchListingService.setUserRoles(rolesToSet);
      this.handleContentClick(content, _.get(this.configSvc, 'userProfile.userId', ''));
    }
  }

  openSnackBar(message: string) {
    this.matSnackbarNew.open(message, 'X', {
      duration: 3000,
    });
  }

  ngOnDestroy(): void {
    // if (this.roleFixedSubscription) {
    //   this.roleFixedSubscription.unsubscribe();
    // }
  }
}
