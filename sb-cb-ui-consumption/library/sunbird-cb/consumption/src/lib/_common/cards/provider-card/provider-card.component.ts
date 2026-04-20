import { Component, Input, OnInit } from '@angular/core';
import { NsCardContent } from '../../../_models/card-content.model';
import { Router } from '@angular/router';
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service';

@Component({
  selector: 'sb-uic-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['./provider-card.component.scss']
})
export class ProviderCardComponent implements OnInit {
  @Input() widgetData!: NsCardContent.ICard;
  @Input() randomColorApply: boolean = true
  @Input() isCardLoading: boolean = false

  colors = [
    '#EF941D', '#F97440', '#35B5B0', '#9988FF', '#816FEC',
    '#254092', '#926525', '#4F72DF'
  ];

  constructor(public router: Router, public contSvc: WidgetContentLibService) {}

  ngOnInit() {
    this.setRandomColor()
  }

  setRandomColor(){
    if(this.widgetData && this.widgetData.content) {
      if(this.randomColorApply){
        const randomIndex1 = Math.floor(Math.random() * Math.floor(this.colors.length))
        this.widgetData.content['bgColor'] = this.colors[randomIndex1]
      }else {
        this.widgetData.content['bgColor'] = '#1a4ca1'
      }
    }
  }
  

  redirectTo(content: any) {  
    let url = ''
    let queryParams = {}
    if(content?.internalOrgId) {
       url = `/app/learn/browse-by/provider/${content?.contentPartnerName|| content?.name}/${content?.internalOrgId}/micro-sites`
    } else if(!content?.internalOrgId && content?.isExternalProvider) {
      url = `app/seeAll/content`
      queryParams = {
        key: content?.contentDisplayType || 'extContent',
        provider: content?.id || '',
        providerName: content?.contentPartnerName || content?.partnerCode || ''
      }
    } else {
      url = `/app/learn/browse-by/provider/${content.name}/${content.orgId}/micro-sites`
    }
    this.router.navigate([url], { queryParams })
    content['typeOfTelemetry'] = this.widgetData?.context?.pageSection
    this.contSvc.changeTelemetryData(content)
  }


}