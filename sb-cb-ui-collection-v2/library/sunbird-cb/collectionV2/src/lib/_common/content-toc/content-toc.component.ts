import { AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NsContent } from '../../_services/widget-content.model'
import { ConfigurationsService, UtilityService } from '@sunbird-cb/utils-v2'
import { Subscription } from 'rxjs'

import { LoadCheckService } from '../../_services/load-check.service'
import { MatLegacyTabChangeEvent as MatTabChangeEvent, MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs'
import { NsDiscussionV2 } from '@sunbird-cb/discussion-v2'
// COMMENTED OUT: Missing dependency @ws-widget/utils
// import { ConfigurationsService as ConfigurationsServiceUtilsV1 } from '@ws-widget/utils'

@Component({
  selector: 'ws-widget-content-toc',
  templateUrl: './content-toc.component.html',
  styleUrls: ['./content-toc.component.scss'],
})

export class ContentTocComponent implements OnInit, AfterViewInit, OnChanges {

  tabChangeValue: any = ''
  @Input() content!: NsContent.IContent
  @Input() contentReadData!: NsContent.IContent
  @Input() initialRouteData: any
  @Input() changeTab = false
  routeSubscription: Subscription | null = null
  @Input() forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true') ||
    window.location.href.includes('&status=Draft')
  @Input() contentTabFlag = true
  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  @Input() skeletonLoader = false
  @Input() tocStructure: any = {}
  @Input() pathSet: any
  @Input() fromViewer = false
  @Input() hierarchyMapData: any = {}
  @ViewChild('stickyMenu') tabElement!: MatTabGroup
  @Input() condition: any
  @Input() kparray: any
  @Input() selectedBatchData: any
  @Input() config: any
  @Input() componentName!: string
  @Input() isEnrolled: boolean = true
  sticky = false
  menuPosition: any
  isMobile = false
  selectedTabIndex = 0
  displayTeachersContent = true
  teacherNotesFlag = false
  referenceNotesFlag = false
  discussWidgetData!: NsDiscussionV2.ICommentWidgetData
  commentId?: string = ''
  batchId: string = ''

  constructor(
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private loadCheckService: LoadCheckService,
    private configService: ConfigurationsService,
    // COMMENTED OUT: Missing dependency @ws-widget/utils
    // private configSvc: ConfigurationsServiceUtilsV1,

  ) { }

  ngOnInit() {
    // COMMENTED OUT: configSvc not available
    // if (this.configSvc && this.configSvc.userProfile) {
    //   this.configService.userProfile = this.configSvc.userProfile
    // }

    if (this.route.snapshot.data.pageData && this.route.snapshot.data.pageData.data) {
      this.config = this.route.snapshot.data.pageData.data
    }
    this.batchId = this.route.snapshot.queryParams.batchId ?
      this.route.snapshot.queryParams.batchId : ''
    if (this.batchId) {
      this.selectedTabIndex = 1
    }
    this.commentId = this.route.snapshot.queryParams.commentId ? this.route.snapshot.queryParams.commentId : ''
    if (this.commentId) {
      this.selectedTabIndex = 2
    }
    if (this.configService && this.configService.userRoles) {
      // tslint:disable-next-line:max-line-length
      this.displayTeachersContent = (
        this.configService.userRoles.has('MENTOR') ||
        this.configService.userRoles.has('mentor') ||
        this.configService.userRoles.has('Mentor')
        && this.content.courseCategory === NsContent.ECourseCategory.CASE_STUDY) ? true : false
    } else {
      if (this.content && this.content.courseCategory) {
        this.displayTeachersContent = this.route.snapshot.queryParams.editMode &&
          this.content.courseCategory === NsContent.ECourseCategory.CASE_STUDY
      }
    }

    if (this.contentReadData && this.contentReadData.referenceNodes) {
      this.contentReadData.referenceNodes.forEach((item: any) => {
        if (item && item.resourceCategory && item.resourceCategory === 'Reference Resource') {
          this.referenceNotesFlag = true
        }
        if (item && item.resourceCategory && item.resourceCategory === 'Teachers Resource') {
          this.teacherNotesFlag = true
        }
      })
    }
    if (this.config && this.config.discussWidgetData) {
      this.discussWidgetData = this.config.discussWidgetData
      if (this.content && this.content.identifier) {
        this.discussWidgetData.newCommentSection.commentTreeData.entityId = this.content.identifier
        if (this.discussWidgetData.commentsList.repliesSection && this.discussWidgetData.commentsList.repliesSection.newCommentReply) {
          this.discussWidgetData.commentsList.repliesSection.newCommentReply.commentTreeData.entityId = this.content.identifier
        }
      }

      this.discussWidgetData = { ...this.discussWidgetData }
    }

    // }
  }

  ngAfterViewInit() {
    this.isMobile = this.utilityService.isMobile
    this.menuPosition = this.tabElement._elementRef.nativeElement.offsetTop
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.changeTab && changes.changeTab.currentValue) {
      this.selectedTabIndex = 1
    }
    // console.log('this.content', this.content)
    // if (this.content) {
    //   this.content = Object.assign(this.content)
    // }

    // console.log('this.content', this.content)
    // console.log('this.batchData', this.batchData)
    // console.log('this.hierarchyMapData', this.hierarchyMapData)
    if (this.config && this.config.discussWidgetData) {
      this.discussWidgetData = this.config.discussWidgetData

      if (this.content && this.content.identifier) {
        this.discussWidgetData.newCommentSection.commentTreeData.entityId = this.content.identifier
        if (this.discussWidgetData.commentsList.repliesSection && this.discussWidgetData.commentsList.repliesSection.newCommentReply) {
          this.discussWidgetData.commentsList.repliesSection.newCommentReply.commentTreeData.entityId = this.content.identifier
        }
      }
      if (this.isEnrolled) {
        // this.discussWidgetData.enrolledContent = true
        this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Start a discussion'
      } else {
        // this.discussWidgetData.enrolledContent = false
        this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Enrol to add your comments'
      }
      // COMMENTED OUT: configSvc not available
      // if (this.config?.canPerformActionCommentsRoles && this.config?.canPerformActionCommentsRoles?.length) {
      //   if (this.canPerformAction(this.config.canPerformActionCommentsRoles, this.configSvc.userAllRoles)) {
      //     this.discussWidgetData.commentsList.repliesSection.newCommentReply.show = true
      //     this.discussWidgetData.commentsList.repliesSection.replyCardConfig.newCommentReply.show = true

      //     this.discussWidgetData.commentsList.actions.like.canLike = true
      //     this.discussWidgetData.commentsList.repliesSection.replyCardConfig.actions.like.canLike = true

      //     this.discussWidgetData.commentsList.actions.flagComment.show = true
      //     this.discussWidgetData.commentsList.repliesSection.replyCardConfig.actions.flagComment.show = true
      //   }
      // }

      this.discussWidgetData = { ...this.discussWidgetData }
    }
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.scrollY
    if (windowScroll >= (this.menuPosition - ((this.isMobile) ? 96 : 104))) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  handleTabChange(event: MatTabChangeEvent): void {
    this.tabChangeValue = event.tab
    this.selectedTabIndex = event.index
    this.loadCheckService.componentLoaded(true)
  }

  onCommentDataChange(event: any) {
    if (!event?.commentData || event?.commentData?.commentCount === 0) {
      this.config.commentsTab = false
    }
  }

  canPerformAction(canPerformActionCommentsRoles: string[], userRoles: Set<string>): boolean {
    if (!canPerformActionCommentsRoles || !userRoles) {
      return false
    }
    return canPerformActionCommentsRoles.some(role => userRoles.has(role.toLowerCase()))
  }

  clearCommentIdFromUrl(): void {
    const currentQueryParams = { ...this.route.snapshot.queryParams }
    delete currentQueryParams.commentId
    this.commentId = ''
  }
}
