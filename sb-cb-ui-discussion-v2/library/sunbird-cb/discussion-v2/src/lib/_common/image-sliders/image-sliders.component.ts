import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { IImageCarouselStyle } from './image-sliders.model'
import { Subscription, interval } from 'rxjs'
import { EventService, WsEvents, ValueService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'd-v2-image-sliders',
  templateUrl: './image-sliders.component.html',
  styleUrls: ['./image-sliders.component.scss'],
})
export class ImageSlidersComponent implements OnInit, OnDestroy{
  @Input() styleData!: IImageCarouselStyle
  @Input() title: any = ''
  @Input() imageUrls: any[] = []
  @Input() objectArray: any[] = []
  @Output() imageClickEmit = new EventEmitter<any>();
  @Input() defaultImg: any
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
  }

  ngOnInit() {
    this.reInitiateSlideInterval()
    this.reInitiateObjectSlideInterval()
    this.defaultMenuSubscribe = this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.isMobile = isLtMedium
    })
  }
  reInitiateSlideInterval() {
    if(this.styleData && this.styleData.autoplay) {
      if (this.imageUrls && this.imageUrls.length > 1) {
        try {
          if (this.slideInterval) {
            this.slideInterval.unsubscribe()
          }
        } catch (e) {
        } finally {
          this.slideInterval = interval(8000).subscribe(() => {
            if (this.currentIndex === this.imageUrls.length - 1) {
              this.currentIndex = 0
            } else {
              this.currentIndex += 1
            }
          })
        }
      }
    }
  }
  slideTo(index: number) {
    if (index >= 0 && index < this.imageUrls.length) {
      this.currentIndex = index
    } else if (index === this.imageUrls.length) {
      this.currentIndex = 0
    } else {
      this.currentIndex = this.imageUrls.length + index
    }
    this.reInitiateSlideInterval()
  }

  get isOpenInNewTab() {
    const currentData = this.imageUrls[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.imageUrls[this.currentIndex].openInNewTab) {
      return true
    } return false
  }

  openInNewTab() {
    const currentData = this.imageUrls[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.imageUrls[this.currentIndex].openInNewTab) {
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

  changeToDefaultImg($event: any) {
    $event.target.src = this.defaultImg
  }



  reInitiateObjectSlideInterval() {
    if(this.styleData && this.styleData.autoplay) {
      if (this.objectArray && this.objectArray.length > 1) {
        try {
          if (this.slideInterval) {
            this.slideInterval.unsubscribe()
          }
        } catch (e) {
        } finally {
          this.slideInterval = interval(8000).subscribe(() => {
            if (this.currentIndex === this.objectArray.length - 1) {
              this.currentIndex = 0
            } else {
              this.currentIndex += 1
            }
          })
        }
      }
    }
  }
  slideToObject(index: number) {
    if (index >= 0 && index < this.objectArray.length) {
      this.currentIndex = index
    } else if (index === this.objectArray.length) {
      this.currentIndex = 0
    } else {
      this.currentIndex = this.objectArray.length + index
    }
    this.reInitiateObjectSlideInterval()
  }

  get isOpenObjectInNewTab() {
    const currentData = this.objectArray[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.objectArray[this.currentIndex].openInNewTab) {
      return true
    } return false
  }

  openInNewTabObject() {
    const currentData = this.objectArray[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.objectArray[this.currentIndex].openInNewTab) {
      window.open(currentData.redirectUrl)
    }
  }

  imageClick(slideData: any) {
    this.imageClickEmit.emit(slideData)
  }
}
