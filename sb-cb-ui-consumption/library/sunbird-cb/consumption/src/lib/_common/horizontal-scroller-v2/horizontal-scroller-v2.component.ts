import { Component, OnInit, OnChanges, OnDestroy, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import {
  fromEvent,
  Subscription,
  timer,
} from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { TFetchStatus } from '../../_constants/misc.constants';
import { ValueService } from '@sunbird-cb/utils-v2';
import { NsCommonStrip } from '../common-strip/common-strip.model';
import { NsContentStripMultiple } from '../../_models/content-strip-multiple.model';
import { TranslateService } from '@ngx-translate/core';
import { SakshamAI } from '../../consumption.config';

@Component({
  selector: 'sb-uic-horizontal-scroller-v2',
  templateUrl: './horizontal-scroller-v2.component.html',
  styleUrls: ['./horizontal-scroller-v2.component.scss'],
})

export class HorizontalScrollerV2Component implements OnInit, OnChanges, OnDestroy {

  @Input() loadStatus: TFetchStatus = 'fetching';
  @Input() id: string = '';
  @Input() onHover = false;
  @Input() sliderConfig: any = {
    showNavs: true,
    showDots: true,
    cerificateCardMargin: false,
    justifyCenter: false,
  };
  @Output() loadNext = new EventEmitter();
  @Input() widgetsLength: any;
  @Input() defaultMaxWidgets: any;
  @Input() stripConfig: any;
  @Input() extraMeta: any;
  @ViewChild('horizontalScrollElem', { static: true })
  horizontalScrollElem: ElementRef | null = null;

  enablePrev = false;
  enableNext = false;
  activeNav = 0;
  cardSubType = 'standard';
  bottomDotsArray: any = [];
  private scrollObserver: Subscription | null = null;
  isMobile = false
  private defaultMenuSubscribe: Subscription | null = null
  isLtMedium$ = this.valueSvc.isLtMedium$
  sakshamAIEnum = SakshamAI
  constructor(private valueSvc: ValueService, private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en');
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'));
      lang = lang.replace(/\"/g, '');
      this.translate.use(lang);
    }
   }

  ngOnInit() {
    this.cardSubType = this.stripConfig && this.stripConfig.cardSubType ? this.stripConfig.cardSubType : 'standard';
    if (this.horizontalScrollElem) {
      const horizontalScrollElem = this.horizontalScrollElem;
      this.scrollObserver = fromEvent(
        horizontalScrollElem.nativeElement,
        'scroll',
      )
      .pipe(debounceTime(100), throttleTime(100))
      .subscribe(_ => {
        this.updateNavigationBtnStatus(horizontalScrollElem
          .nativeElement as HTMLElement);
      });
      setTimeout(() => {
        this.getBottomDotsArray();
      }, 700);
    }
    this.defaultMenuSubscribe = this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.isMobile = isLtMedium
    })

  }

  ngOnChanges() {
    timer(100).subscribe(() => {
      if (this.horizontalScrollElem) {
        this.updateNavigationBtnStatus(this.horizontalScrollElem
          .nativeElement as HTMLElement);
      }
    });
    setTimeout(() => {
      this.getBottomDotsArray();
    }, 700);
  }

  ngOnDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver.unsubscribe();
    }
    if (this.defaultMenuSubscribe) {
      this.defaultMenuSubscribe.unsubscribe()
    }
  }

  showPrev() {
    // const elem = this.horizontalScrollElem.nativeElement
    // elem.scrollLeft -= 0.20 * elem.clientWidth
    if (this.horizontalScrollElem) {
      // const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth * 0.24)
      const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth);
      this.horizontalScrollElem.nativeElement.scrollTo({
        left: this.horizontalScrollElem.nativeElement.scrollLeft - clientWidth,
        behavior: 'smooth',
      });
      
      const elem = this.horizontalScrollElem.nativeElement
      if (elem.scrollLeft !== 0 && (elem.scrollWidth !== elem.clientWidth + elem.scrollLeft)) {
        this.activeNav -= 1;
      } else {
        if(this.sliderConfig.arrowsAlwaysOn) {
          if(this.horizontalScrollElem.nativeElement.scrollLeft === 0){
            this.horizontalScrollElem.nativeElement.scrollTo({
              left: elem.scrollWidth,
              behavior: 'smooth',
            });
            this.activeNav = this.bottomDotsArray.length - 1;
          }
        }
      }
    }
  }

  showNext() {
    // const elem = this.horizontalScrollElem.nativeElement
    // elem.scrollLeft += 0.20 * elem.clientWidth
    if (this.horizontalScrollElem) {
      // const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth * 0.24)
      const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth);
      this.horizontalScrollElem.nativeElement.scrollTo({
        left: this.horizontalScrollElem.nativeElement.scrollLeft + clientWidth,
        behavior: 'smooth',
      });
      const elem = this.horizontalScrollElem.nativeElement
      if (elem.scrollLeft !== 0 && (elem.scrollWidth !== elem.clientWidth + elem.scrollLeft)) {
        this.activeNav += 1;
      } else {
        if(this.sliderConfig.arrowsAlwaysOn) {
          if(this.horizontalScrollElem.nativeElement.scrollLeft !== 0 && elem.clientWidth + elem.scrollLeft >= elem.scrollWidth ){
            this.horizontalScrollElem.nativeElement.scrollTo({
              left: 0,
              behavior: 'smooth',
            });
            this.activeNav = 0;
          }
        }
      }
    }
  }

  private updateNavigationBtnStatus(elem: HTMLElement) {
    this.enablePrev = true;
    this.enableNext = true;
    if (elem.scrollLeft === 0) {
      if(!this.sliderConfig.arrowsAlwaysOn) {
        this.enablePrev = false;
      }
      this.activeNav = 0;
    }
    // if (elem.scrollWidth === Math.round(elem.clientWidth + elem.scrollLeft)) {
    //   if (this.loadStatus === 'hasMore') {
    //     this.loadNext.emit();
    //   } else {
    //     if(!this.sliderConfig.arrowsAlwaysOn) {
    //       this.enableNext = false;
    //     }
    //     if (this.bottomDotsArray.length) {
    //       this.activeNav = this.bottomDotsArray.length - 1;
    //     }
    //   }
    // }
    // if (elem.scrollLeft !== 0 && (elem.scrollWidth !== elem.clientWidth + elem.scrollLeft)) {
    //   this.activeNav = Math.ceil(elem.scrollLeft / elem.clientWidth);
    // }


    const widthDiff = Math.abs(elem.scrollWidth - Math.round(elem.clientWidth + elem.scrollLeft))
    if (widthDiff === 0 || widthDiff === 1) {
      if (this.loadStatus === 'hasMore') {
        this.loadNext.emit()
      } else {
        this.enableNext = false
        if (this.bottomDotsArray.length) {
          this.activeNav = this.bottomDotsArray.length - 1
        }
      }
    }
    if (elem.scrollLeft !== 0 && (elem.scrollWidth !== elem.clientWidth + elem.scrollLeft)) {
      this.activeNav = Math.ceil(elem.scrollLeft / elem.clientWidth)
    }
  }

  slideTo(ele: any) {
    const diff = ele - this.activeNav;
    // if (ele > this.activeNav && ele !== this.activeNav) {
    //   if (this.horizontalScrollElem) {
    //     const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
    //     this.horizontalScrollElem.nativeElement.scrollTo({
    //       left: this.horizontalScrollElem.nativeElement.scrollLeft + (clientWidth*diff),
    //       behavior: 'smooth',
    //     })
    //   }
    //   this.activeNav = ele
    // } else {
    //   if (this.horizontalScrollElem && ele >= 0 && ele !== this.activeNav) {
    //     const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth)
    //     this.horizontalScrollElem.nativeElement.scrollTo({
    //       left: this.horizontalScrollElem.nativeElement.scrollLeft - (clientWidth*diff),
    //       behavior: 'smooth',
    //     })
    //   }
    //   this.activeNav = ele
    // }
    if (this.horizontalScrollElem) {
      const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth);
      this.horizontalScrollElem.nativeElement.scrollTo({
        left: this.horizontalScrollElem.nativeElement.scrollLeft + (clientWidth * diff),
        behavior: 'smooth',
      });
    }
    this.activeNav = ele;
  }

  getBottomDotsArray() {
    if (this.horizontalScrollElem) {
    this.cardSubType = this.stripConfig && this.stripConfig.cardSubType ? this.stripConfig.cardSubType : 'standard';
      this.bottomDotsArray = [];
      let cardWidth;
      let arrLength;
      if (this.cardSubType !== 'card-wide-v2') {
        cardWidth = this.cardSubType === 'standard' ? 245 :
        ((document.getElementsByClassName(this.cardSubType) &&
         document.getElementsByClassName(this.cardSubType)[0] !== undefined)
        ? document.getElementsByClassName(this.cardSubType)[0].clientWidth : 245);
        if (document.getElementById(`${this.id}`)) {
          const scrollerWidth = document.getElementById(`${this.id}`).clientWidth;
          const totalCardsLength = cardWidth * this.widgetsLength;
          if (totalCardsLength > scrollerWidth) {
            arrLength = Math.round(scrollerWidth / cardWidth);
            this.defaultMaxWidgets = this.defaultMaxWidgets ?  this.widgetsLength < this.defaultMaxWidgets ?
              this.widgetsLength : this.defaultMaxWidgets : this.defaultMaxWidgets;
            arrLength = this.defaultMaxWidgets / arrLength;
            for (let i = 0; i < arrLength; i += 1) {
              this.bottomDotsArray.push(i);
            }
          }
        }
      } else {
        setTimeout(() => {
          this.bottomDotsArray = []
          arrLength = document.getElementsByClassName(this.cardSubType).length;
          for (let i = 0; i < arrLength; i += 1) {
            this.bottomDotsArray.push(i);
          }
        },         1000);
      }
    }
  }
}
