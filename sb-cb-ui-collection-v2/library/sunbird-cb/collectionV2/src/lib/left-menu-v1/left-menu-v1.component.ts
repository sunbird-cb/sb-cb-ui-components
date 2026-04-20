import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver-v2'
import { ILeftMenu, IMenu } from './left-menu-v1.model'
// import * as defaultImg from './base64.json'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
@Component({
  selector: 'ws-widget-left-menu-v1',
  templateUrl: './left-menu-v1.component.html',
  styleUrls: ['./left-menu-v1.component.scss'],
})
export class LeftMenuV1Component extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<ILeftMenu> {
  @Input() widgetData!: ILeftMenu
  // @Input() Source
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private configSvc: ConfigurationsService,
  ) {
    super()
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.')
  }

  ngOnInit(): void {
  }

  changeToDefaultImg($event: any) {
    if ($event && $event.target && this.configSvc.instanceConfig) {
      $event.target.src = this.configSvc.instanceConfig.logos.defaultSourceLogo || ''
    }
  }
  public isLinkActive(url?: string, index?: number): boolean {
    let returnVal = false
    if (url && index) {
      returnVal = (this.activatedRoute.snapshot.fragment === url)
    } else if (index === 0) {
      returnVal = true
    } else {
      returnVal = false
    }
    return returnVal
  }
  public isLinkActive2(url?: string): boolean {
    let returnval = false
    if (url) {
      const st = this.router.url.split('?')
      if (st && st[0] && st[0] === (url)) {
        returnval = true
      }
      // if(route.url.con)
    }
    return returnval
  }

  public preserve = 'preserve'

  getLink(tab: IMenu) {
    if (tab && tab.customRouting && this.activatedRoute.snapshot && this.activatedRoute.snapshot.firstChild && tab.paramaterName) {
      return (tab.routerLink.replace('<param>', this.activatedRoute.snapshot.firstChild.params[tab.paramaterName]))
    }
    return null
  }

  isAllowed(tab: IMenu): boolean {
    let returnValue = false
    if (tab.requiredRoles && tab.requiredRoles.length > 0) {
      (tab.requiredRoles).forEach(v => {
        if ((this.widgetData.userRoles || new Set()).has(v)) {
          returnValue = true
        }
      })
    } else {
      returnValue = true
    }
    return returnValue
  }
}
