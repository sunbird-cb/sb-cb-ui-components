import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from "lodash";
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationsService, EventService, MultilingualTranslationsService, NsContent } from '@sunbird-cb/utils-v2';
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service';
import { Router } from '@angular/router';


@Component({
  selector: 'sb-uic-card-mdo-channel-v1',
  templateUrl: './card-mdo-channel-v1.component.html',
  styleUrls: ['./card-mdo-channel-v1.component.scss']
})
export class CardMdoChannelV1Component implements OnInit {
  @Input() widgetData!: NsContent.IContent;
  @Output() channelData = new EventEmitter<any>()
  @Output() emitTelemetry = new EventEmitter<any>()
  @Input() isCardLoading: boolean = false
  defaultThumbnail: any
  sourceLogos: any
  defaultSLogo: any
  widgetType: any = ''
  widgetSubType: any =''

  constructor(
    private events: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private configSvc: ConfigurationsService,
    private contSvc: WidgetContentLibService,
    public router: Router) { 
      this.langtranslations.languageSelectedObservable.subscribe(() => {
        if (localStorage.getItem('websiteLanguage')) {
          this.translate.setDefaultLang('en')
          const lang = localStorage.getItem('websiteLanguage')!
          this.translate.use(lang)
        }
      })
    }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.sourceLogos = instanceConfig.sources
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    } else {
      this.defaultThumbnail = '/assets/instances/eagle/app_logos/default.png'
      this.defaultSLogo =  '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
    }
  }

  raiseTelemetry(contentData: any) {
    this.emitTelemetry.emit(contentData)
    if (this.widgetData) {
      contentData['typeOfTelemetry'] = 'mdo-channel'
    }
    this.contSvc.changeTelemetryData(contentData)
  }
  channelClick(channeldata:any) {
    this.channelData.emit(channeldata)
  }

  redirectTo(content: any) {
    this.router.navigate([`/app/learn/mdo-channels/${content.orgName}/${content.identifier}/micro-sites`])
  }

}
