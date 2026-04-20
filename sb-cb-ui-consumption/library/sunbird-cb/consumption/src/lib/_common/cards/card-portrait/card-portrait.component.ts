import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NsCardContent } from '../../../_models/card-content.model'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2'
import * as _ from "lodash"
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service'
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service'
import { relevanceAnimation } from '../../_animations/relevance-animation'
import { CommonMethodsService } from '../../../_services/common-methods.service'

@Component({
  selector: 'sb-uic-card-portrait',
  templateUrl: './card-portrait.component.html',
  styleUrls: ['./card-portrait.component.scss'],
  animations: [relevanceAnimation]
})
export class CardPortraitComponent implements OnInit {
  @Input() widgetData!: NsCardContent.ICard
  @Input() isLiveOrMarkForDeletion: any
  @Input() showIntranetContent: any
  @Input() isIntranetAllowedSettings: any
  @Input() isCardLoading: boolean = false
  @Output() contentData = new EventEmitter<any>()
  @Input() cbPlanMapData: any
  isCardFlipped: boolean = false
  acbpConstants = NsCardContent.ACBPConst
  defaultThumbnail: any
  sourceLogos: any
  defaultSLogo: any
  showFlip = false
  widgetType: any = 'df'
  widgetSubType: any = 'sdf'
  isRelevent = false
  SAKSHAMAI_ICON_NORMAL = '/assets/images/sakshamAI/ai-icon.svg'
  SAKSHAMAI_ICON_SUCCESS = '/assets/images/sakshamAI/ai-icon-success.svg'
  SAKSHAMAI_ICON_LOADER = '/assets/images/sakshamAI/saksham_ai_loader.gif'
  isHovered = false
  showStatus = false
  CaCourseUnitIds: any = `[]`
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private configSvc: ConfigurationsService,
    private commonSvc: CommonMethodsService,
    private contSvc: WidgetContentLibService,) {
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
      this.defaultSLogo = '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
    }
    if (this.widgetData?.sakshamAIGenerated) {
      this.isRelevent = this.contSvc.getFeedbackData(this.widgetData?.content?.identifier) || false
    }
    this.CaCourseUnitIds = this.commonSvc.getCourseUnitIds()
    if (_.get(this.widgetData, 'content')) {

      const content = this.widgetData.content
      const startEpoch = _.get(content, 'startDateTimeInEpoch')
      const endEpoch = _.get(content, 'endDateTimeInEpoch')
      const now = Date.now()

      if (startEpoch && endEpoch) {
        this.showStatus = now >= startEpoch && now <= endEpoch
      } else {
        this.showStatus = false
      }
    }
  }

  showSnackbar() {
    if (this.showIntranetContent) {
      this.snackBar.open('Content is only available in intranet', 'X', { duration: 2000 })
    } else if (!this.isLiveOrMarkForDeletion) {
      this.snackBar.open('Content may be expired or deleted', 'X', { duration: 2000 })
    }
  }
  getRedirectUrlData(contentData: any) {
    // for telemetry
    if (this.widgetData && this.widgetData.context && this.widgetData.context.pageSection) {
      contentData['typeOfTelemetry'] = this.widgetData.context.pageSection
    }
    if (this.widgetData && this.widgetData.publicCard) {
      contentData['publicCard'] = this.widgetData.publicCard
    }
    if (this.widgetData && this.widgetData.sakshamAIGenerated) {
      contentData['sakshamAIGenerated'] = this.widgetData.sakshamAIGenerated
    }
    this.contSvc.changeTelemetryData(contentData)
    // for redirection
    this.contentData.emit(contentData)
  }

  handleAcceptRelevent(event: Event) {
    event.stopPropagation()
    if (!this.isRelevent) {
      this.isRelevent = true
      this.contSvc.setReleventNotReleventData({ isRelevent: true, widgetData: this.widgetData })
    }
  }

  handleDeclineRelevent(event: Event) {
    event.stopPropagation()
    this.contSvc.setReleventNotReleventData({ isRelevent: false, widgetData: this.widgetData })
  }

  getStartDate(startDate: any, startTime: any) {
    return `${startDate} ${startTime}`
  }

  getTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}hr ${remainingMinutes}mins`
  }
}
