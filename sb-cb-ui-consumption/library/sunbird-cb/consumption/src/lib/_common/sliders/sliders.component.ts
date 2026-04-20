import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver-v2'
import { ICarousel, ICarouselStyle } from './sliders.model'
import { Subscription, interval } from 'rxjs'
import { EventService, WsEvents, ValueService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'sb-uic-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss'],
})
export class SlidersLibComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<ICarousel[]> {
  @Input() widgetData!: ICarousel[]
  @Input() styleData!: ICarouselStyle
  @Input() title: any = ''
  @Input() type: any
  @HostBinding('id')
  public id = `banner_${Math.random()}`
  private defaultMenuSubscribe: Subscription | null = null
  isLtMedium$ = this.valueSvc.isLtMedium$
  currentIndex = 0
  slideInterval: Subscription | null = null
  isMobile = false

  constructor(
    private events: EventService,
    private valueSvc: ValueService
  ) {
    super()
  }

  ngOnInit() {
    this.widgetData = this.widgetData && this.widgetData.filter((slide: any) => slide?.active)
    this.reInitiateSlideInterval()
    this.defaultMenuSubscribe = this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.isMobile = isLtMedium
    })
  }
  reInitiateSlideInterval() {
    if (this.widgetData && this.widgetData.length > 1) {
      try {
        if (this.slideInterval) {
          this.slideInterval.unsubscribe()
        }
      } catch (e) {
      } finally {
        this.slideInterval = interval(8000).subscribe(() => {
          if (this.currentIndex === this.widgetData.length - 1) {
            this.currentIndex = 0
          } else {
            this.currentIndex += 1
          }
        })
      }
    }
  }
  slideTo(index: number) {
    if (index >= 0 && index < this.widgetData.length) {
      this.currentIndex = index
    } else if (index === this.widgetData.length) {
      this.currentIndex = 0
    } else {
      this.currentIndex = this.widgetData.length + index
    }
    this.reInitiateSlideInterval()
  }

  get isOpenInNewTab() {
    const currentData = this.widgetData[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.widgetData[this.currentIndex].openInNewTab) {
      return true
    } return false
  }

  openInNewTab() {
    const currentData = this.widgetData[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.widgetData[this.currentIndex].openInNewTab) {
      window.open(currentData.redirectUrl)
    }
  }
  raiseTelemetry(bannerUrl: string | undefined) {
    this.openInNewTab()
    const path = window.location.pathname.replace('/', '')
    const url = path + window.location.search

    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'banner',
      },
      {
        pageUrl: url,
        bannerRedirectUrl: bannerUrl,
      },
      {
        pageIdExt: 'banner',
        module: WsEvents.EnumTelemetrymodules.CONTENT,
      })
  }

  ngOnDestroy() {
    if (this.defaultMenuSubscribe) {
      this.defaultMenuSubscribe.unsubscribe()
    }
  }
}
