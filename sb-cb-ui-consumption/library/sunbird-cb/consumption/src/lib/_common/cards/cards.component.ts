import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver-v2'
import { NsCardContent } from '../../_models/card-content.model'
import { NsContent, UtilityService } from '@sunbird-cb/utils-v2'
import { WidgetContentLibService } from '../../_services/widget-content-lib.service'
import { Router } from '@angular/router'
import { VIEWER_ROUTE_FROM_MIME } from '../../_services/viewer-route-util'

@Component({
  selector: 'sb-uic-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {

  @Input() widgetData!: NsCardContent.ICard
  @Output() triggerTelemetry = new EventEmitter<any>()
  isIntranetAllowedSettings = false
  cbPlanMapData: any
  cbPlanInterval: any
  constructor(private utilitySvc: UtilityService,
    private contSvc: WidgetContentLibService,
    public router: Router
  ) {
    super()
  }

  ngOnInit() {
    this.cbPlanInterval = setInterval(() => {
      this.getCbPlanData()
    }, 1000)


  }

  get isLiveOrMarkForDeletion() {
    if (
      !this.widgetData.content.status ||
      this.widgetData.content.status === 'Live' ||
      this.widgetData.content.status === 'MarkedForDeletion'
    ) {
      return true
    }
    return false
  }

  get showIntranetContent() {
    if (this.widgetData.content.isInIntranet && this.utilitySvc.isMobile) {
      return !this.isIntranetAllowedSettings
    }
    return false
  }
  async getRedirectUrlData(content: any) {
    if (content?.primaryCategory === NsContent.EPrimaryCategory.RESOURCE) {
      let url = `app/amrit-gyaan-kosh/player/${VIEWER_ROUTE_FROM_MIME(content?.mimeType)}/${content?.identifier}`
      let queryParams = {
        primaryCategory: content?.primaryCategory
      }
      this.router.navigate([url], { queryParams })
    } else if (content.externalId) {
      this.router.navigate(
        [`app/toc/ext/${content.contentId}`])
    } else {
      let urlData = await this.contSvc.getResourseLink(content)
      const queryParams = {
        ...urlData.queryParams,
        ...(this.widgetData?.sakshamAIGenerated ? { recommendationId: this.widgetData?.sakshamAIGenerated } : {})
      }
      this.router.navigate(
        [urlData.url],
        // { queryParams: urlData.queryParams }
        { queryParams }
      )
    }

  }
  getCbPlanData() {
    let cbpList: any = {}
    if (localStorage.getItem('cbpData')) {
      let cbpListArr = JSON.parse(localStorage.getItem('cbpData') || '')
      if (cbpListArr && cbpListArr.length) {
        cbpListArr.forEach((data: any) => {
          cbpList[data.identifier] = data
        })
      }
      this.cbPlanMapData = cbpList
      // this.karmaPointLoading = false
      clearInterval(this.cbPlanInterval)
    }
  }



  raiseCardClick(data: any) {
    this.triggerTelemetry.emit(data)
  }

  redirectToNewVersion(identifier: any) {
    this.router.navigate(['app/toc', identifier, 'overview'])
  }
}
