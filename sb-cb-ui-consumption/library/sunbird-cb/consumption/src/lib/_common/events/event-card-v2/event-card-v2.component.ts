import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { ConfigurationsService, NsInstanceConfig, MultilingualTranslationsService, NsContent, NsWidgetResolver } from '@sunbird-cb/utils-v2'
import { NsCardContent } from './event-card-v2.model'
/* tslint:disable*/
import * as _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { WidgetBaseComponent } from '@sunbird-cb/resolver-v2'
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service'

@Component({
  selector: 'ws-widget-event-card-v2',
  templateUrl: './event-card-v2.component.html',
  styleUrls: ['./event-card-v2.component.scss'],
})
export class EventCardV2Component extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {
  @Input() widgetData!: NsCardContent.ICard
  @HostBinding('id')
  primaryCategory = NsContent.EPrimaryCategory
  acbpConstants = NsCardContent.ACBPConst
  public id = `ws-card_${Math.random()}`
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  defaultThumbnail = ''
  defaultSLogo = ''

  sourceLogos: NsInstanceConfig.ISourceLogo[] | undefined
  eventDetails: any

  isIntranetAllowedSettings = false
  constructor(
    private configSvc: ConfigurationsService,
    private langtranslations: MultilingualTranslationsService,
    private translate: TranslateService,
    private router: Router,
    private widgetContentLibService: WidgetContentLibService

  ) {
    super()
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  async getRedirectUrlData(content: any) {
    this.router.navigate([`/app/event-hub/home/${content.identifier}`])
  }
  ngOnInit() {
    // this.widgetInstanceId=his.id
    this.eventDetails = _.get(this.widgetData, 'content.event', _.get(this.widgetData, 'content', {}))
    this.eventDetails['showLive'] = this.isLiveEvent(this.eventDetails)
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.sourceLogos = instanceConfig.sources
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    }
  }

  isLiveEvent(event: any) {
    if (event.startDate && event.endDate && event.startTime && event.endTime) {
      // Conver current time into milliseconds
      let currentTime = new Date().getTime() / 1000
      // Combining date and time for start event
      let evenStarttDate = new Date(`${event.startDate} ${event.startTime}`).getTime() / 1000
      // Combining date and time for end event
      let eventEndDate = new Date(`${event.endDate} ${event.endTime}`).getTime() / 1000
      return (currentTime <= eventEndDate && currentTime >= evenStarttDate)
    }
    return false
  }

  getTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}hr ${remainingMinutes}mins`;
  }

  getStartDate(startDate: any, startTime: any) {
    startTime = startTime ? startTime : '00:00:00+05:30'
    if(typeof(startDate) === 'string') {
      return `${startDate} ${startTime}`
    } else {
      const dateFormate = new Date(startDate)
      const year = dateFormate.getFullYear();
      const month = String(dateFormate.getMonth() + 1).padStart(2, '0');  // months are zero-based, so we add 1
      const day = String(dateFormate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} ${startTime}`
    }
  }

  redirectToUrl() {
    let url = window.location.href
    let indexValue = url.split('curatedCollections/')
    window.location.href = indexValue[0] + 'curatedCollections/' + this.widgetData.content.identifier

  }
  raiseTelemetry() {
    this.widgetContentLibService.changeTelemetryEventData(this.widgetData)
  }

  translateLabels(label: string, type: any, subtype: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, subtype)
  }

  translateLabel(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

}