import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver-v2'
import { ICarousel, ICarouselStyle } from './sliders-ng-content.model'
import { Subscription, interval } from 'rxjs'
import { EventService, WsEvents, ValueService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'sb-uic-sliders-ng-content',
  templateUrl: './sliders-ng-content.component.html',
  styleUrls: ['./sliders-ng-content.component.scss'],
})
export class SlidersNgContentLibComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<ICarousel[]> {
  @Input() widgetData!: ICarousel[]
  @Input() styleData!: ICarouselStyle
  @Input() title: any = ''
  @Input() loadNgContentData: boolean = false
  @Input() autoScroll: boolean = false
  @Input() customBanner: boolean = false
  @Output() currentIndexValue = new EventEmitter<any>()
  
  @HostBinding('id')
  public id = `banner_${Math.random()}`
  private defaultMenuSubscribe: Subscription | null = null
  isLtMedium$ = this.valueSvc.isLtMedium$
  @Input()  currentIndex = 0
  slideInterval: Subscription | null = null
  isMobile = false

  constructor(
    private events: EventService,
    private valueSvc: ValueService
  ) {
    super()
  }

  ngOnInit() {
    if(this.autoScroll) {
      this.reInitiateSlideInterval()
    }
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
            this.currentIndexValue.emit(this.currentIndex)
          } else {
            this.currentIndex += 1
            this.currentIndexValue.emit(this.currentIndex)
          }
        })
      }
    }
  }
  slideTo(index: number) {
    if (index >= 0 && index < this.widgetData.length) {
      this.currentIndex = index
      this.currentIndexValue.emit(this.currentIndex)
    } else if (index === this.widgetData.length) {
      this.currentIndex = 0
      this.currentIndexValue.emit(this.currentIndex)
    } else {
      this.currentIndex = this.widgetData.length + index
      this.currentIndexValue.emit(this.currentIndex)
    }
    if(this.autoScroll) {
      this.reInitiateSlideInterval()
    }
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
