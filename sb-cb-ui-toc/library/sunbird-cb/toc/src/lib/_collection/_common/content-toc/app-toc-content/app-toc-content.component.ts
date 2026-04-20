import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { ActivatedRoute, Data } from '@angular/router'
import { NsWidgetResolver } from '@sunbird-cb/resolver-v2'
import { ConfigurationsService, NsContent } from '@sunbird-cb/utils-v2'
import { AppTocService } from '../../../../services/app-toc.service'
import { Subscription } from 'rxjs'
// import { NsAppToc } from '../models/app-toc.model'

@Component({
  selector: 'ws-widget-app-toc-content',
  templateUrl: './app-toc-content.component.html',
  styleUrls: ['./app-toc-content.component.scss'],
})

export class AppTocContentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() batchId!: string
  @Input() content!: NsContent.IContent
  @Input() forPreview = false
  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  @Input() skeletonLoader = false
  @Input() tocStructure: any
  @Input() config: any
  @Input() hierarchyMapData: any = {}
  @Input() pathSet: any
  @Input() componentName!: string
  @Input() isPreAssessment = false
  @Input() baseContentReadData!: any
  @Input() contentReadData!: any
  isPlayable = false
  contentPlayWidgetConfig: NsWidgetResolver.IRenderConfigWithTypedData<any> | null = null
  defaultThumbnail = ''
  // errorCode: NsAppToc.EWsTocErrorCode | null = null
  private routeSubscription: Subscription | null = null
  private routeQuerySubscription: Subscription | null = null
  private hashmapUpdatedSubscription: Subscription | null = null
  contentParents: NsContent.IContentMinimal[] = []
  expandAll = false
  expandPartOf = false
  contextId!: string
  contextPath!: string
  contentLoader = false

  typesOfContent: any
  selectedTabType: any = 'content'
  nsContent: any =  NsContent
  otherResourse = 0

  constructor(
    private route: ActivatedRoute,
    private tocSvc: AppTocService,
    private configSvc: ConfigurationsService
  ) {
    this.tocSvc.resumeData.subscribe((res: any) => {
      this.resumeData = res
      // this.getLastPlayedResource()
    })
  }

  ngOnInit() {
    // this.forPreview = window.location.href.includes('/author/')
    this.routeQuerySubscription = this.route.queryParamMap.subscribe(qParamsMap => {
      // console.log('qParamsMap--', qParamsMap)
      // console.log('this.content--', this.content)
      // console.log('this.hierarchyMapData', this.hierarchyMapData)
      
      // Parse preEnrolmentResources if it exists as a string
      // Note: This is separate from preliminary assessment which is in children array with isPreAssessment flag
      if(this.content && this.content?.preEnrolmentResources && typeof this.content?.preEnrolmentResources === 'string') {
        this.content['preEnrolmentResources'] =  JSON.parse(this.content?.preEnrolmentResources)
      }
      const contextId = qParamsMap.get('contextId')
      const contextPath = qParamsMap.get('contextPath')
      const batchId = qParamsMap.get('batchId')
      const primaryCategory = qParamsMap.get('primaryCategory')
      const preAssessment = qParamsMap.get('preAssessment')
      if(preAssessment === 'true') {
        this.isPreAssessment = true
      }
      if (contextId && contextPath) {
        this.contextId = contextId
        this.contextPath = contextPath
      }
      if (batchId) {
        this.batchId = batchId
      }
      if(primaryCategory ) {
        this.selectedTabType = primaryCategory === this.nsContent.EPrimaryCategory.OFFLINE_SESSION ? 'session' : 'content'
      }
    })
    if (this.route && this.route.parent) {
      this.routeSubscription = this.route.parent.data.subscribe((data: Data) => {
        this.initData(data)
      })
    }
    this.tocSvc.contentLoader$.subscribe((val: any) => {
      this.contentLoader = val
    })
    
    // Subscribe to hashmap updates for real-time progress synchronization
    this.hashmapUpdatedSubscription = this.tocSvc.hashmapUpdated$.subscribe((update) => {
      if (update && update.hashmap) {
        // Update hierarchyMapData with the latest hashmap from the service
        this.hierarchyMapData = update.hashmap
      }
    })
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.typesOfContent = [
      {
        name: 'Self-paced',
        id: 'content',
        disabled: false,
      },
      {
        name: 'Instructor-led',
        id: 'session',
        disabled: false,
      },
    ]
    this.otherResourse = 0
    if (this.tocStructure) {
      Object.keys(this.tocStructure).forEach((ele: any) => {
        if (ele === 'offlineSession' || ele === 'learningModule') {
        } else {

          this.otherResourse = this.otherResourse + this.tocStructure[ele]
        }
      })
      if (!this.otherResourse) {
        setTimeout(() => {
          this.selectedTabType = 'session'
          this.typesOfContent[0].disabled = true
        },         1000)
      } else {
        this.typesOfContent[1].disabled =  this.tocStructure['offlineSession'] ? false : true
      }
    }
  }

  private initData(_data: Data) {
    // not required init now because new implementation of  hashmap already has mapped the completion percent
    // const initData = this.tocSvc.initData(data, true)
    // this.content = initData.content
    // this.errorCode = initData.errorCode
    if (this.content) {
      if (!this.contextId || !this.contextPath) {
        this.contextId = this.content.identifier
        this.contextPath = this.content.primaryCategory
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'resumeData') {
        // this.getLastPlayedResource()
      }
    }
  }

  get isEnrolled(): boolean {
    // Check both batchId and batchData.enrolled to support Learning Pathways
    // where batchId might not be directly set but user is enrolled in courses within the pathway
    return this.batchId ? true : (this.batchData?.enrolled || false)
  }

  // private processCollectionForTree() {
  //     this.pathSet = new Set()
  // }

  // getLastPlayedResource() {
  //   let firstPlayableContent
  //   let resumeDataV2: any
  //   if (this.resumeData && this.resumeData.length > 0 && this.content) {
  //     if (this.content.completionPercentage === 100) {
  //       resumeDataV2 = this.getResumeDataFromList('start')
  //     } else {
  //       resumeDataV2 = this.getResumeDataFromList()
  //     }
  //     this.expandThePath(resumeDataV2.identifier)
  //   } else {
  //     firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(this.content)
  //     this.expandThePath(firstPlayableContent.identifier)
  //   }
  // }

  // expandThePath(resourceId: string) {
  //   if (this.content && resourceId) {
  //     const path = this.utilitySvc.getPath(this.content, resourceId)
  //     // console.log('Path :: :: : ', path)
  //     this.pathSet = new Set(path.map((u: { identifier: any }) => u.identifier))
  //     // console.log('pathSet ::: ', this.pathSet)
  //     // path.forEach((node: IViewerTocCard) => {
  //     //   this.nestedTreeControl.expand(node)
  //     // })
  //   }
  // }

  // private getResumeDataFromList(type?: string) {
  //   if (!type) {
  //     // tslint:disable-next-line:max-line-length
  //     const lastItem = this.resumeData && this.resumeData.sort((a: any, b: any) =>
  // new Date(b.lastAccessTime).getTime() - new Date(a.lastAccessTime).getTime()).shift()
  //     return {
  //       identifier: lastItem.contentId,
  //       mimeType: lastItem.progressdetails && lastItem.progressdetails.mimeType,
  //     }
  //   }

  //   const firstItem = this.resumeData && this.resumeData.length && this.resumeData[0]
  //   return {
  //     identifier: firstItem.contentId,
  //     mimeType: firstItem.progressdetails && firstItem.progressdetails.mimeType,
  //   }
  // }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.routeQuerySubscription) {
      this.routeQuerySubscription.unsubscribe()
    }
    if (this.hashmapUpdatedSubscription) {
      this.hashmapUpdatedSubscription.unsubscribe()
    }
  }

    getMilestoneCompletedOrNot(identifier: string): boolean {
    if (!this.content || !this.hierarchyMapData) {
      return false
    }
    const milestoneData = this.hierarchyMapData[identifier]
    if(milestoneData && milestoneData?.primaryCategory === NsContent.EPrimaryCategory.FINAL_ASSESSMENT) {
      return milestoneData?.completionStatus === 2
    }
    if (!milestoneData) {
      return false
    }

    // Check if all mandatory content AND milestone assessment are completed
    let hasMandatoryContent = false
    let allMandatoryComplete = true
    let hasMilestoneAssessment = false
    let milestoneAssessmentComplete = false

    // Check all direct children of the milestone
    for (const key of Object.keys(this.hierarchyMapData)) {
      const item = this.hierarchyMapData[key]

      // Only check direct children
      if (item.parent !== identifier) continue

      // Check if this is the milestone assessment
      const isAssessment = 
        item.primaryCategory === 'Course Assessment' ||
        item.primaryCategory === 'Final Assessment' ||
        item.primaryCategory === 'Standalone Assessment'

      if (isAssessment) {
        hasMilestoneAssessment = true
        const isCompleted = item.completionStatus === 2 || item.status === 2 || 
                           item.completionPercentage >= 100 || item.progress >= 100
        if (isCompleted) {
          milestoneAssessmentComplete = true
        }
        continue // Skip to next item
      }

      // Check if this is mandatory content (courses/collections)
      if (item.primaryCategory === 'Course' || item.isCollection) {
        const isMandatory = item.isMandatory !== false // Default is mandatory
        
        if (isMandatory) {
          hasMandatoryContent = true
          const isCompleted = item.completionStatus === 2 || item.status === 2 || 
                             item.completionPercentage >= 100 || item.progress >= 100
          if (!isCompleted) {
            allMandatoryComplete = false
          }
        }
      }
    }

    // Milestone is complete when:
    // 1. All mandatory content is completed (or no mandatory content exists)
    // 2. Milestone assessment is completed (or no assessment exists)
    const mandatoryCheck = !hasMandatoryContent || allMandatoryComplete
    const assessmentCheck = !hasMilestoneAssessment || milestoneAssessmentComplete

    return mandatoryCheck && assessmentCheck
  }

  /**
   * Check if multi-line text is truncated (has ellipsis)
   * @param element The HTMLElement to check
   * @returns true if text is truncated, false otherwise
   */
  isMultiLineTruncated(element: HTMLElement): boolean {
    if (!element) return false
    return element.scrollHeight > element.clientHeight
  }
}
