import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NsCardContent } from '../../../_models/card-content.model';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2';
import * as _ from "lodash";
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service';

@Component({
  selector: 'sb-uic-card-wide-v2',
  templateUrl: './card-wide-v2.component.html',
  styleUrls: ['./card-wide-v2.component.scss']
})
export class CardWideV2Component implements OnInit {

  @Input() widgetData!: NsCardContent.ICard;
  @Input() isLiveOrMarkForDeletion: any
  @Input() showIntranetContent: any
  @Input() isIntranetAllowedSettings: any
  @Input() cbPlanMapData: any
  @Input() isCardLoading: boolean = false
  @Output() contentData = new EventEmitter<any>()
  @Output() triggerTelemetry = new EventEmitter<any>()
  isCardFlipped:boolean = false
  acbpConstants = NsCardContent.ACBPConst
  defaultThumbnail: any
  sourceLogos: any
  defaultSLogo: any
  showFlip = false
  widgetType: any = 'df'
  widgetSubType: any ='sdf'
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
  raiseTelemetry(contentData: any) {
   this.triggerTelemetry.emit(contentData)
  }

}
