import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NsCardContent } from '../../../_models/card-content.model';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2';
import * as _ from "lodash";
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service';
 
@Component({
  selector: 'sb-uic-card-landscape',
  templateUrl: './card-landscape.component.html',
  styleUrls: ['./card-landscape.component.scss']
})
export class CardLandscapeComponent implements OnInit {

  @Input() widgetData!: NsCardContent.ICard;
  @Input() isLiveOrMarkForDeletion: any
  @Input() showIntranetContent: any
  @Input() isIntranetAllowedSettings: any
  @Input() isCardLoading: boolean = false
  @Output() contentData = new EventEmitter<any>()
  @Output() triggerTelemetry = new EventEmitter<any>()
  @Input()  cbPlanMapData: any
  isCardFlipped:boolean = false
  defaultThumbnail: any
  acbpConstants = NsCardContent.ACBPConst
  sourceLogos: any
  defaultSLogo: any
  showFlip = false
  widgetType: any = 'df'
  widgetSubType: any ='sdf'
  cbPlanInterval: any
  
  constructor(
    private snackBar: MatSnackBar,
    private events: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private configSvc: ConfigurationsService,) { 
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
    this.defaultSLogo =  this.widgetData?.content?.contentPartner?.contentPartnerName ? '/assets/icons/content/provider.svg':this.defaultSLogo

    this.cbPlanInterval = setInterval(() => {
      this.getCbPlanData()
    },                                1000)
  }

  showSnackbar() {
    if (this.showIntranetContent) {
      this.snackBar.open('Content is only available in intranet', 'X', { duration: 2000 })
    } else if (!this.isLiveOrMarkForDeletion) {
      this.snackBar.open('Content may be expired or deleted', 'X', { duration: 2000 })
    }
  }
  getRedirectUrlData(contentData: any){
    this.contentData.emit(contentData)
  }
  raiseTelemetry(content: any) {
    this.triggerTelemetry.emit(content)
  }


  getCbPlanData() {
    let cbpList: any={}
    if (localStorage.getItem('cbpData')) {
      let cbpListArr = JSON.parse(localStorage.getItem('cbpData') || '')
      if (cbpListArr && cbpListArr.length) {
        cbpListArr.forEach((data: any) => {
          cbpList[data.identifier] = data
        })
      }
      // this.cbPlanMapData = cbpList
      // this.karmaPointLoading = false
      clearInterval(this.cbPlanInterval)
    }
  }

  getProviderNames(providers: any[]): string {
    if (!providers || !providers.length) {
      return '';
    }
    return providers.map(p => p?.name).join(', ');
  }

}
