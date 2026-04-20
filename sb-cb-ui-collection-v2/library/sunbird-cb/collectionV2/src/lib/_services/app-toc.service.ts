import { Injectable } from '@angular/core'
import { Subject, BehaviorSubject, Subscription } from 'rxjs'
// import { HttpClient } from '@angular/common/http'
import { NsContent } from './widget-content.model'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
// import { WidgetContentService } from './widget-content.service'
import * as _ from 'lodash'

export namespace NsAppToc {
  export interface IWsTocResponse {
    content: NsContent.IContent | null
    errorCode: EWsTocErrorCode | null
  }

  export enum EWsTocErrorCode {
    API_FAILURE = 'API_FAILURE',
    INVALID_DATA = 'INVALID_DATA',
    NO_DATA = 'NO_DATA',
  }

  export interface ITocStructure {
    assessment: number
    course: number
    handsOn: number
    interactiveVideo: number
    learningModule: number
    other: number
    pdf: number
    survey: number
    podcast: number
    quiz: number
    video: number
    webModule: number
    webPage: number
    youtube: number
    interactivecontent: number
    practiceTest: number
    finalTest: number
    offlineSession: number
    [key: string]: number
  }
}

@Injectable({
  providedIn: 'root',
})
export class AppTocService {
  analyticsReplaySubject: Subject<any> = new Subject()
  batchReplaySubject: Subject<any> = new Subject()
  setBatchDataSubject: Subject<any> = new Subject()
  getSelectedBatch: Subject<any> = new Subject()
  setWFDataSubject: Subject<any> = new Subject()
  resumeData: Subject<NsContent.IContinueLearningData | null> = new Subject<any>()
  private showSubtitleOnBanners = false
  private canShowDescription = false
  resumeDataSubscription: Subscription | null = null
  private updateReviews = new BehaviorSubject(false)
  updateReviewsObservable = this.updateReviews.asObservable()
  public serverDate = new BehaviorSubject('')
  currentServerDate = this.serverDate.asObservable()
  public contentLoader = new BehaviorSubject(false)
  contentLoader$ = this.contentLoader.asObservable()
  public getPageScroll = new BehaviorSubject(true)
  updatePageScroll = this.getPageScroll.asObservable()
  public hashmap: any = {}

  constructor(
    // Unused dependencies commented out - can be removed if confirmed not needed
    // private http: HttpClient,
    private configSvc: ConfigurationsService,
    // private widgetSvc: WidgetContentService
  ) {
    this.resumeDataSubscription = this.resumeData.subscribe(
      (_dataResult: any) => {
      })
  }

  get subtitleOnBanners(): boolean {
    return this.showSubtitleOnBanners
  }

  set subtitleOnBanners(val: boolean) {
    this.showSubtitleOnBanners = val
  }

  get showDescription(): boolean {
    return this.canShowDescription
  }

  set showDescription(val: boolean) {
    this.canShowDescription = val
  }

  updateBatchData() {
    this.batchReplaySubject.next()
  }

  setBatchData(data: NsContent.IBatchListResponse) {
    this.setBatchDataSubject.next(data)
  }

  setWFData(data: any) {
    this.setWFDataSubject.next(data)
  }

  updateResumaData(data: any) {
    this.resumeData.next(data)
  }

  changeUpdateReviews(state: boolean) {
    this.updateReviews.next(state)
  }

  getSelectedBatchData(data: any) {
    this.getSelectedBatch.next(data)
  }

  changeServerDate(state: any) {
    this.serverDate.next(state)
  }

  showStartButton(content: NsContent.IContent | null): { show: boolean; msg: string } {
    const status = {
      show: false,
      msg: '',
    }
    if (content) {
      if (
        content.artifactUrl && content.artifactUrl.match(/youtu(.)?be/gi) &&
        this.configSvc.userProfile &&
        this.configSvc.userProfile.country === 'China'
      ) {
        status.show = false
        status.msg = 'youtubeForbidden'
        return status
      }
      if (content.resourceType !== 'Certification') {
        status.show = true
        return status
      }
    }
    return status
  }

  initData(data: any, needResumeData: boolean = false): NsAppToc.IWsTocResponse {
    let content: NsContent.IContent | null = null
    let errorCode: NsAppToc.EWsTocErrorCode | null = null
    this.contentLoader.next(true)
    if (data.content && data.content.data && data.content.data.identifier) {
      content = data.content.data
      if (needResumeData) {
        this.resumeDataSubscription = this.resumeData.subscribe(
          (dataResult: any) => {
            if (dataResult && dataResult.length) {
              this.contentLoader.next(true)
              this.mapCompletionPercentage(content, dataResult)
            }
          },
          () => {
            // tslint:disable-next-line: no-console
            console.log('error on resumeDataSubscription')
          },
        )
      } else {
        this.contentLoader.next(false)
      }
    } else {
      this.contentLoader.next(false)
      if (data.error) {
        errorCode = NsAppToc.EWsTocErrorCode.API_FAILURE
      } else {
        errorCode = NsAppToc.EWsTocErrorCode.NO_DATA
      }
    }
    return {
      content,
      errorCode,
    }
  }

  mapCompletionPercentage(content: NsContent.IContent | null, dataResult: any) {
    if (content && content.children) {
      content.children.forEach((child: any) => {
        const foundContent = dataResult.find((el: any) => el.contentId === child.identifier)
        if (foundContent) {
          child.completionPercentage = foundContent.completionPercentage || foundContent.progress
          child.completionStatus = foundContent.status
        } else {
          this.mapCompletionPercentage(child, dataResult)
        }
      })
      this.contentLoader.next(false)
    } else {
      this.contentLoader.next(false)
    }
  }

  getTocStructure(
    content: NsContent.IContent,
    tocStructure: NsAppToc.ITocStructure,
  ): NsAppToc.ITocStructure {
    if (content && content.children && content.children.length) {
      _.each(content.children, child => {
        // tslint:disable-next-line: no-parameter-reassignment
        tocStructure = this.getTocStructure(child, tocStructure)
      })
    } else if (content) {
      switch (content.mimeType) {
        case NsContent.EMimeTypes.MP3:
          tocStructure.podcast += 1
          break
        case NsContent.EMimeTypes.MP4:
        case NsContent.EMimeTypes.M3U8:
        case NsContent.EMimeTypes.YOUTUBE:
          tocStructure.video += 1
          break
        case NsContent.EMimeTypes.PDF:
          tocStructure.pdf += 1
          break
        case NsContent.EMimeTypes.TEXT_WEB:
          tocStructure.webPage += 1
          break
        case NsContent.EMimeTypes.SURVEY:
          tocStructure.survey += 1
          break
        case NsContent.EMimeTypes.QUIZ:
        case NsContent.EMimeTypes.APPLICATION_JSON:
          tocStructure.assessment += 1
          break
        case NsContent.EMimeTypes.OFFLINE_SESSION:
          tocStructure.offlineSession += 1
          break
        case NsContent.EMimeTypes.PRACTICE_RESOURCE:
          tocStructure.practiceTest += 1
          break
        case NsContent.EMimeTypes.ZIP:
          tocStructure.interactivecontent += 1
          break
        default:
          tocStructure.other += 1
      }
    }
    return tocStructure
  }
}
