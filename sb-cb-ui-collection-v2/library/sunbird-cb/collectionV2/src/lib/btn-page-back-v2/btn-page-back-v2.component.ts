import { animate, style, transition, trigger } from '@angular/animations'
import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver-v2'
import { ConfigurationsService, NsInstanceConfig } from '@sunbird-cb/utils-v2'
import { BtnPageBackV2Service } from './btn-page-back-v2.service'

type TUrl = undefined | 'none' | 'back' | 'doubleBack' | string

export interface IHomeConfig {
  label?: string
  icon?: string
  homeRoute?: string
  showHubs?: boolean
}

@Component({
  selector: 'ws-widget-btn-page-back-v2',
  templateUrl: './btn-page-back-v2.component.html',
  styleUrls: ['./btn-page-back-v2.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 0 }),
        animate('300ms', style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 1 }),
        animate('300ms', style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 0 })),
      ]),
    ]
    ),
  ],
})
export class BtnPageBackV2Component extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<{ url: TUrl }> {
  @Input() widgetData: { 
    url: TUrl
    titles?: NsWidgetResolver.ITitle[]
    homeConfig?: IHomeConfig
  } = { 
    url: 'none', 
    titles: [],
    homeConfig: {
      label: 'Home',
      icon: 'home',
      homeRoute: '/',
      showHubs: false
    }
  }
  
  presentUrl = ''
  
  @HostBinding('id')
  public id = 'nav-back-v2'
  
  visible = false
  enablePeopleSearch = true
  hubsList!: NsInstanceConfig.IHubs[]
  
  // Default home configuration
  homeConfig: IHomeConfig = {
    label: 'Home',
    icon: 'home',
    homeRoute: '/',
    showHubs: false
  }

  constructor(
    private btnBackSvc: BtnPageBackV2Service,
    private router: Router,
    private configSvc: ConfigurationsService,
  ) {
    super()
  }

  ngOnInit() {
    // Merge default config with provided config
    if (this.widgetData.homeConfig) {
      this.homeConfig = { ...this.homeConfig, ...this.widgetData.homeConfig }
    }

    // Load hubs configuration if showHubs is enabled
    if (this.homeConfig.showHubs) {
      const instanceConfig = this.configSvc.instanceConfig
      if (instanceConfig) {
        this.hubsList = (instanceConfig.hubs || []).filter(i => i.active)
      }
    }

    this.presentUrl = this.router.url
  }

  get backUrl(): { fragment?: string; routeUrl: string; queryParams: any } {
    // Handle special cases for explore page
    if (this.presentUrl === '/page/explore') {
      return {
        queryParams: undefined,
        routeUrl: this.homeConfig.homeRoute || '/',
      }
    }

    // Handle explicit home navigation
    if (this.widgetData.url === 'home') {
      return {
        queryParams: undefined,
        routeUrl: this.homeConfig.homeRoute || '/',
      }
    }

    // Handle double back navigation
    if (this.widgetData.url === 'doubleBack') {
      return {
        fragment: this.btnBackSvc.getLastUrl(2).fragment,
        queryParams: this.btnBackSvc.getLastUrl(2).queryParams,
        routeUrl: this.btnBackSvc.getLastUrl(2).route,
      }
    }

    // Handle single back navigation
    if (this.widgetData.url === 'back') {
      return {
        fragment: this.btnBackSvc.getLastUrl().fragment,
        queryParams: this.btnBackSvc.getLastUrl().queryParams,
        routeUrl: this.btnBackSvc.getLastUrl().route,
      }
    }

    // Handle custom URLs
    if (this.widgetData.url !== 'back' && this.widgetData.url !== 'doubleBack') {
      this.btnBackSvc.checkUrl(this.widgetData.url)
    }

    return {
      queryParams: undefined,
      routeUrl: this.widgetData.url ? this.widgetData.url : (this.homeConfig.homeRoute || '/'),
    }
  }

  toggleVisibility() {
    this.visible = !this.visible
  }
}
