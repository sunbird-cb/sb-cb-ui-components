import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NsCardUser } from '../../../_models/card-users.model';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2';
import * as _ from "lodash";
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service';

@Component({
  selector: 'sb-uic-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss']
})
export class CardUserComponent implements OnInit {
  @Input() widgetData!: NsCardUser.ICard;
  @Output() userData = new EventEmitter<any>()
  defaultThumbnail: any
  sourceLogos: any
  defaultSLogo: any
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
    }
  }

  getRedirectUrlData(userData: any){
    this.userData.emit(userData)
  }
  raiseTelemetry() {
    // if(this.forPreview){
    //   return
    // }
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: `${this.widgetType}-${this.widgetSubType}`,
        id: `${_.camelCase(this.widgetData.content.userId)}-card`,
      },
      {
        id: this.widgetData.content.userId,
        // type: this.widgetData.user.primaryCategory,
        //context: this.widgetData.context,
        rollup: {},
        // ver: `${this.widgetData.user.version}${''}`,
      },
      {
        pageIdExt: `${_.camelCase('user')}-card`,
        module: _.camelCase('user'),
      })
  }

}
