import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NsCardContent } from '../../../_models/card-content.model';
import { MatDialog, MatSnackBar } from '@angular/material'
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service';
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service';
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2';
import * as _ from "lodash";
import { CertificateService } from '../../../_services/certificate.service';
import { CertificateDialogComponent } from '../../dialog-components/certificate-dialog/certificate-dialog.component';

@Component({
  selector: 'sb-uic-card-progress-portrait-lib',
  templateUrl: './card-progress-portrait-lib.component.html',
  styleUrls: ['./card-progress-portrait-lib.component.scss']
})
export class CardProgressPortraitLibComponent implements OnInit {

  @Input() widgetData!: NsCardContent.ICard;
  @Input() isLiveOrMarkForDeletion: any
  @Input() showIntranetContent: any
  @Input() isIntranetAllowedSettings: any
  @Input() isCardLoading: boolean = false
  @Output() contentData = new EventEmitter<any>()
  @Input()  cbPlanMapData: any
  isCardFlipped:boolean = false
  acbpConstants = NsCardContent.ACBPConst
  defaultThumbnail: any
  sourceLogos: any
  defaultSLogo: any
  showFlip = false
  widgetType: any = 'df'
  widgetSubType: any ='sdf'
  downloadCertificateLoading: boolean = false

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private events: EventService,
    private langtranslations: MultilingualTranslationsService,
    private configSvc: ConfigurationsService,
    private contSvc: WidgetContentLibService,
    private certificateService: CertificateService,
    private dialog: MatDialog,
    ) { 
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
    // for telemetry
    if (this.widgetData && this.widgetData.context && this.widgetData.context.pageSection) {
      contentData['typeOfTelemetry'] = this.widgetData.context.pageSection
    }
    this.contSvc.changeTelemetryData(contentData)
    // for redirection
    this.contentData.emit(contentData)
  }

  translateLabels(label: string, type: any, subtype?: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, subtype)
  }
  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: `${this.widgetType}-${this.widgetSubType}`,
        id: `${_.camelCase(this.widgetData.content.primaryCategory)}-card`,
      },
      {
        id: this.widgetData.content.identifier,
        type: this.widgetData.content.primaryCategory,
        //context: this.widgetData.context,
        rollup: {},
        ver: `${this.widgetData.content.version}${''}`,
      },
      {
        pageIdExt: `${_.camelCase(this.widgetData.content.primaryCategory)}-card`,
        module: _.camelCase(this.widgetData.content.primaryCategory),
      })
  }

  downloadCertificate(certificateData: any) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'view-certificate',
        subType: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      },
      {
        id: certificateData.issuedCertificates[0].identifier,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      })
    if(certificateData.issuedCertificates.length > 0) {
      this.downloadCertificateLoading = true
      let certData: any = certificateData.issuedCertificates[0]
      this.certificateService.downloadCertificate_v2(certData.identifier).subscribe((res: any)=>{
        this.downloadCertificateLoading = false
        const cet = res.result.printUri
        this.dialog.open(CertificateDialogComponent, {
          width: '1300px',
          data: { cet, certId: certData.identifier },
        })
      })
    } else {
      this.downloadCertificateLoading = false
    }
  }

}
