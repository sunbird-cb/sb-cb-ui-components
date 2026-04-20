import { Injectable } from '@angular/core'
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs'
import { NsContent } from '../_services/widget-content.model'

export interface IViewerTocCard {
  identifier: string
  viewerUrl: string
  thumbnailUrl: string
  title: string
  duration: number
  type: string
  mimeType: NsContent.EMimeTypes
  complexity: string
  children: null | IViewerTocCard[]
  primaryCategory: NsContent.EPrimaryCategory
  collectionId: string | null
  collectionType: string,
  batchId: string | number,
  viewMode: string,
  optionalReading: boolean,
  channelId: string
}

export interface IViewerTocChangeEvent {
  tocAvailable: boolean
  nextResource: IViewerTocCard | null
  prevResource: IViewerTocCard | null
  queryMLParams: any
}

export interface IViewerResourceOptions {
  page?: {
    min: number
    max: number
    current: number
    queryParamKey: string
  }
  zoom?: {
    min: number
    max: number
    current: number
    queryParamKey: string
  }
}

export type TStatus = 'pending' | 'done' | 'error' | 'none'

@Injectable({
  providedIn: 'root',
})
export class ViewerDataService {
  resourceId: string | null = null
  resource: NsContent.IContent | null = null
  primaryCategory: string | null = null
  collectionId: string | null = null
  error: any
  status: TStatus = 'none'
  resourceChangedSubject = new Subject<string>()
  optionalReading = false
  changedSubject = new ReplaySubject(1)
  tocChangeSubject = new ReplaySubject<IViewerTocChangeEvent>(1)
  navSupportForResource = new ReplaySubject<IViewerResourceOptions>(1)
  isSkipBtn = new BehaviorSubject<boolean>(false)

  constructor() { }

  reset(resourceId: string | null = null, status: TStatus = 'none', primaryCategory?: string, collectionId?: string) {
    this.resourceId = resourceId
    this.resource = null
    this.error = null
    this.status = status
    this.primaryCategory = primaryCategory || ''
    this.collectionId = collectionId || ''
    this.changedSubject.next(undefined)
    this.optionalReading = false
  }

  updateResource(resource: NsContent.IContent | null = null, error: any | null = null) {
    if (resource) {
      this.resource = resource
      if (resource && resource.identifier) {
        this.resourceId = resource.identifier
        this.primaryCategory = resource.primaryCategory
        this.optionalReading = resource.optionalReading || false
        this.isSkipBtn.next(this.optionalReading)
      }
      this.error = null
      this.status = 'done'
    } else {
      this.resource = null
      this.error = error
      this.status = 'error'
    }
    this.changedSubject.next(undefined)
  }

  updateNextPrevResource(isValid = true, prev: IViewerTocCard | null = null, next: IViewerTocCard | null = null, queryMLParams: any) {
    this.tocChangeSubject.next({
      tocAvailable: isValid,
      nextResource: next,
      prevResource: prev,
      queryMLParams: queryMLParams
    })
  }
}
