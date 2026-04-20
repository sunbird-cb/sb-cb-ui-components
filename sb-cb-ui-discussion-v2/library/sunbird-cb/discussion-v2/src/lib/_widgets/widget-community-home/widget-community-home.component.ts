import { Component, Input, OnInit, Inject, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'
import { DiscussionV2Service } from '../../_services/discussion-v2.service'
import { ConfigurationsService, UtilityService } from '@sunbird-cb/utils-v2'
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service'
import { FlagDialogueComponent } from '../../_shared/flag-dialogue/flag-dialogue.component'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
// tslint:disable-next-line
import _ from 'lodash'
import { ConfirmDialogueComponent } from '../../_shared/confirm-dialogue/confirm-dialogue.component'
import { CommunityGuideLinesComponent } from '../../_shared/community-guide-lines/community-guide-lines.component'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'd-v2-widget-community-home',
  templateUrl: './widget-community-home.component.html',
  styleUrls: ['./widget-community-home.component.scss']
})
export class WidgetCommunityHomeComponent implements OnInit, OnChanges {
  @Input() communityId!: string
  @Input() discussionId!: string
  @Input() feedWidgetData: any | undefined
  @Input() communityWidgetData: any | undefined
  @Output() similarCommunityClick = new EventEmitter<any>();
  defaultPosterThumbnail: string = ''
  communityData: any = {}
  userJoinedCommunityList: any = []
  userJoinedCommunity: boolean = false
  hideCardBody: boolean | undefined
  enableShare: boolean = false
  rootOrgId: String = ''
  compentencyKey: any
  environment: any
  competenciesObject: any = []
  competencySelected = ''
  userId: any
  flagSelectionList: any
  selectedTab = 0;
  selectedTabName: any = 'Feeds'
  shortCutData: any[] = [
    {
      name: "Saved Posts",
      icon: "bookmark_border",
      link: "/page/learn"
    },
    {
      name: "Posts By You",
      icon: "list_alt",
      link: ""
    },
    {
      name: "Pending Request",
      icon: "update",
      link: ""
    }
  ]

  strip: any = {
    key: 'blendedPrograms',
    logo: '',
    title: 'Blended Program',
    stripTitleLink: {
      link: '',
      icon: '',
    },
    sliderConfig: {
      showNavs: true,
      showDots: false,
    },
    loader: true,
    stripBackground: '',
    titleDescription: 'Blended Program',
    stripConfig: {
      cardSubType: 'standard',
    },
    viewMoreUrl: {
      path: '',
      viewMoreText: 'Show all',
      queryParams: '',
    },
    tabs: [],
    filters: [],
  }
  isExpandedView = false;
  loadedCommunitiesData: boolean = false
  isProfanity = false;
  guidelienesChecked = false
  toggleExpandedView() {
    this.isExpandedView = !this.isExpandedView
  }

  constructor(
    @Inject('environment') environment: any,
    private dialog: MatDialog,
    private discussV2Svc: DiscussionV2Service,
    private configSvc: ConfigurationsService,
    private userEnrollSvc: UserEnrollCommunityService,
    private snackbar: MatSnackBar,
    private utilitySvc: UtilityService,
    private route: ActivatedRoute
  ) {
    this.defaultPosterThumbnail = this.utilitySvc.isMobile ? 'assets/instances/eagle/banners/discussion/community-default-mb-banner.svg' : 'assets/instances/eagle/banners/discussion/community-default-pc-banner.svg'

    this.environment = environment
    if (this.configSvc
      && this.configSvc.userProfile
      && this.configSvc.userProfile.rootOrgId) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
    if (this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile?.userId) {
      this.userId = this.configSvc.userProfile.userId
    }
    this.compentencyKey = this.configSvc.compentency[environment.compentencyVersionKey]
    // this.communityData['competencies_v6'] = [
    //     {
    //         "competencyThemeIdentifier": "kcmfinal_fw_theme_92909bf6-2cea-47ea-b426-dc31803f2177",
    //         "competencyAreaIdentifier": "kcmfinal_fw_competencyarea_af8caa53-7f84-499e-86b2-e32e5b59908e",
    //         "competencyThemeRefId": "COMTHEME-000205",
    //         "competencyThemeType": "Core",
    //         "competencyThemeAdditionalProperties": {
    //             "displayName": "Administration Matters",
    //             "timeStamp": 1724675757333
    //         },
    //         "competencySubThemeName": "Handling Allowances & Reimbursement",
    //         "competencySubThemeIdentifier": "kcmfinal_fw_subtheme_35bf9d51-7299-45a5-ad99-1f7c7db1e4ba",
    //         "competencySubThemeDescription": "Handling Allowances & Reimbursement Competency Sub-Theme",
    //         "competencyThemeName": "Administration Matters",
    //         "competencyAreaName": "Functional",
    //         "competencyAreaRefId": "COMAREA-000003",
    //         "competencySubThemeAdditionalProperties": {
    //             "displayName": "Handling Allowances & Reimbursement",
    //             "timeStamp": 1724675891609
    //         },
    //         "competencySubThemeRefId": "COMSUBTHEME-000276",
    //         "competencyThemeDescription": "Administration Matters competency Theme",
    //         "competencyAreaDescription": "Functional competencies are common among many domains, cutting across MDOs, as well as roles and activities."
    //     }
    // ]
  }

  ngOnInit() {
    // this.fetchCommunityData(this.communityId)
    this.checkIsProfanity()

  }

  checkIsProfanity() {
    this.route.queryParams.subscribe(params => {
      if (params['profanity'] && params['profanity'] === 'PROFANITY_CHECK') {
        this.isProfanity = true
      } else {
        this.isProfanity = false
      }
    })
  }

  fetchCommunityData(id: string) {
    this.communityData = {}
    this.competenciesObject = []
    this.discussV2Svc.communityDetailRead(id).subscribe((resData: any) => {
      if (resData.result && resData.result.communityDetails) {
        this.communityData = { ...resData.result.communityDetails, ...resData.result.communityDetails.data }
        if (this.isProfanity && !this.guidelienesChecked) {
          this.joinCommunityPopUp()
        }
        this.loadCompetencies()
        this.checkUserJoinedCommunity()

      } else {
        this.loadedCommunitiesData = true
      }
    })
    // Fetch community data using id
  }

  async checkUserJoinedCommunity() {
    this.userJoinedCommunityList = await this.userEnrollSvc.getEnrollDataId()
    this.userJoinedCommunity = false
    this.manageUserCommunityStatus(true)
    this.loadedCommunitiesData = true
    this.isExpandedView = !this.userJoinedCommunity
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.communityId) {
      if (this.communityId) {
        this.fetchCommunityData(this.communityId)
      }
    }

  }


  async manageUserCommunityStatus(onLoad?: boolean) {
    this.userJoinedCommunityList.forEach((community: any) => {
      if (community.communityid === this.communityId) {
        this.userJoinedCommunity = true
      }
    })
    if (!onLoad) {
      this.userEnrollSvc.clearEnrollDataId()
      this.userJoinedCommunityList = await this.userEnrollSvc.getEnrollDataId()
    }
  }
  joinCommunity() {
    let request = {
      "communityId": this.communityId
    }
    this.discussV2Svc.communityJoin(request).subscribe((resData: any) => {

      if (resData.params && resData.params.status === 'success') {
        let resultData = [
          {
            "communityid": this.communityId,
            "communityName": this.communityData.communityName
          }
        ]
        this.userJoinedCommunityList = [...this.userJoinedCommunityList, ...resultData]
        this.userEnrollSvc.setEnrollDataId(this.userJoinedCommunityList)
        this.manageUserCommunityStatus()

        this.snackbar.open('You\’ve successfully joined the community.')
      }
    })
  }
  checkCommunityPresence(): boolean {
    return this.userJoinedCommunityList.some((community: any) => community.communityid === this.communityId)
  }
  unJoinCommunity() {
    const confirmDialog = this.dialog.open(ConfirmDialogueComponent, {
      width: '600px',
      panelClass: 'flag-dialog',
      backdropClass: 'flag-dialog-backdrop',
      data: {
        question: 'Are you sure you want to leave the community?',
        button: {
          confirm: 'Leave',
          cancel: 'Cancel'
        },
        infoMsg: 'This is a closed community, if you leave the community you wont be able to join again without the permission of SPV',
        flagSelectionList: this.flagSelectionList
      },
    })
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.deleteCommentMethod(post)
        let request = { "communityId": this.communityId }
        this.discussV2Svc.communityUnjoin(request).subscribe((resData: any) => {
          if (resData.params && resData.params.status === 'success') {
            const communityIndex = this.userJoinedCommunityList.findIndex((community: any) => community.communityid === this.communityId)
            if (communityIndex !== -1) {
              this.userJoinedCommunityList.splice(communityIndex, 1)
              this.userJoinedCommunity = false
            }
            this.userEnrollSvc.setEnrollDataId(this.userJoinedCommunityList)
            this.manageUserCommunityStatus()
            this.snackbar.open('You\'ve successfully left the community.')
          }

        })
      }
    })



  }

  getUserId() {
    let userId = ''
    if (this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile?.userId) {
      userId = this.configSvc.userProfile.userId
    }
    return userId
  }

  resetEnableShare(_event: any) {
    this.enableShare = false
  }



  loadCompetencies(): void {

    if (this.communityData && this.communityData[this.compentencyKey.vKey] && this.communityData[this.compentencyKey.vKey].length) {
      const competenciesObject: any = {}
      if (typeof this.communityData[this.compentencyKey.vKey] === 'string'
        && this.checkValidJSON(this.communityData[this.compentencyKey.vKey])) {
        this.communityData[this.compentencyKey.vKey] = JSON.parse(this.communityData[this.compentencyKey.vKey])
      }
      this.communityData[this.compentencyKey.vKey].forEach((_obj: any) => {
        if (competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]) {
          if (competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
          [_obj[this.compentencyKey.vCompetencyTheme]]) {
            const competencyTheme = competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
            [_obj[this.compentencyKey.vCompetencyTheme]]
            if (competencyTheme.indexOf(_obj[this.compentencyKey.vCompetencySubTheme]) === -1) {
              competencyTheme.push(_obj[this.compentencyKey.vCompetencySubTheme])
            }
          } else {
            competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
            [_obj[this.compentencyKey.vCompetencyTheme]] = []
            competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
            [_obj[this.compentencyKey.vCompetencyTheme]]
              .push(_obj[this.compentencyKey.vCompetencySubTheme])
          }
        } else {
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]] = {}
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]][_obj[this.compentencyKey.vCompetencyTheme]] = []
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]][_obj[this.compentencyKey.vCompetencyTheme]]
            .push(_obj[this.compentencyKey.vCompetencySubTheme])
        }
      })

      for (const key in competenciesObject) {
        if (competenciesObject.hasOwnProperty(key)) {
          const _temp: any = {}
          _temp['key'] = key
          _temp['value'] = competenciesObject[key]
          this.competenciesObject.push(_temp)
        }
      }
      this.handleShowCompetencies(this.competenciesObject[0])
    }
  }
  checkValidJSON(str: any) {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }
  handleShowCompetencies(item: any, _option?: any): void {
    this.competencySelected = item.key
    const valueObj = item.value
    const competencyArray = []
    for (const key in valueObj) {
      if (valueObj.hasOwnProperty(key)) {
        const _tempObj: any = {}
        _tempObj['key'] = key
        _tempObj['value'] = valueObj[key]
        competencyArray.push(_tempObj)
      }
    }

    this.strip['loaderWidgets'] = this.transformCompetenciesToWidget(this.competencySelected, competencyArray, this.strip)
  }

  private transformCompetenciesToWidget(
    competencyArea: string,
    competencyArrObject: any,
    strip: any) {
    return (competencyArrObject || []).map((content: any, idx: number) => (
      content ? {
        widgetType: 'card',
        widgetSubType: 'competencyCard',
        widgetHostClass: 'mr-4',
        widgetData: {
          content,
          competencyArea,
          cardCustomeClass: strip.customeClass ? strip.customeClass : '',
          context: { pageSection: strip.key, position: idx },
        },
      } : {
        widgetType: 'card',
        widgetSubType: 'competencyCard',
        widgetHostClass: 'mr-4',
        widgetData: {},
      }
    ))
  }
  onTabChange(event: any) {
    this.selectedTab = event.index
    this.selectedTabName = event.tab && event.tab.textLabel || 'Feeds'

  }

  similarCommunity(communityData: any) {
    this.similarCommunityClick.emit(communityData)
    this.communityId = communityData.communityId
    this.ngOnInit()
  }

  getAllFlagList() {
    this.discussV2Svc.fetchAllFlags().subscribe((res: any) => {
      if (res && res.result
        && res.result.response
        && res.result.response.value
        && res.result.response.value.length) {
        this.flagSelectionList = res.result.response.value
        const confirmDialog = this.dialog.open(FlagDialogueComponent, {
          width: '600px',
          panelClass: 'flag-dialog',
          backdropClass: 'flag-dialog-backdrop',
          data: { comment: {}, flagSelectionList: this.flagSelectionList },
        })
        confirmDialog.afterClosed().subscribe((result: any) => {
          if (result) {
            this.reportCommunity(result)
          }
        })
      }
    })
  }
  reportCommunity(flagDetails: any) {
    let requestData: any = {
      "communityId": this.communityId
    }
    requestData = { ...requestData, ...flagDetails }

    this.discussV2Svc.communityFlag(requestData).subscribe((_res: any) => {
      if (_res && _res.responseCode === 'OK') {
        // this.loading = false
      }
      this.snackbar.open(_.get(this.feedWidgetData, 'reportIcon.successMsg') || 'Reported successfully! Thank you for reporting.')
    },
      () => {
        this.snackbar.open(_.get(this.feedWidgetData, 'reportIcon.errorMsg') || 'Something went wrong! please try reporting again later.')
      })
  }

  changeToDefaultThumbnailImg($event: any) {
    $event.target.src = this.defaultPosterThumbnail
  }
  getDiscussionId(discussId: string) {
    this.discussionId = discussId
  }

  trendingDiscussionIdEmit(event: any) {
    if (this.discussionId === event) {
      this.scrollToElement(event)
    }
    this.discussionId = event
    this.selectedTab = 0
    this.selectedTabName = 'Feeds'
  }
  private scrollToElement(discussionId: string) {
    setTimeout(() => {
      const element = document.getElementById('post-' + discussionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 1000)
  }

  joinCommunityPopUp() {
    let dialogRef = this.dialog.open(CommunityGuideLinesComponent, {
      data: {
        community: this.communityData,
        isProfanity: this.isProfanity
      },
      width: window.innerWidth <= 768 ? '100%' : '600px',
      minWidth: window.innerWidth <= 768 ? '100%' : '400px',
      maxWidth: window.innerWidth <= 768 ? '100vw' : '40vw'
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      this.guidelienesChecked = true
      if (result) {
        this.joinCommunity()
      }
    })
  }
}
