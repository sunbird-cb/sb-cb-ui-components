import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { WidgetUserServiceLib } from '../../../../_services/widget-user.service';
import { ConfigurationsService, NsContent } from '@sunbird-cb/utils-v2';
import { WidgetContentLibService } from '../../../../_services/widget-content-lib.service';

@Component({
  selector: 'sb-uic-card-assessment',
  templateUrl: './card-assessment.component.html',
  styleUrls: ['./card-assessment.component.css']
})

// @Directive({
//   selector: '[callFunctionOnInit]'
// })
export class CardAssessmentComponent implements OnInit {
  @Input() widgetData!: NsContent.IContent;
  @Output() contentData = new EventEmitter<any>()
  @Input() isCardLoading: boolean = false
  stripData: any = []
  enrollList: any = []
  activeResource: any = []
  defaultThumbnail: any
  defaultSLogo: any
  daysRemaining: number = 0;
  startDate: any
  endDate: any
  daysPending: boolean = false
  daysFinish: boolean = false
  private intervalId: any;
  days: number;
  hours: number;
  minutes: number;
  constructor(private configSvc: ConfigurationsService, private contSvc: WidgetContentLibService,) { }

  ngOnInit(): void {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    }
  }

  startCountdown(data: any): void {
    let startDate = data.startDate
    this.updateCountdown(startDate);
    // this.intervalId = setInterval(() => {
    //   this.updateCountdown(startDate);
    // }, 1000);
  }

  // Method to update the countdown values
  updateCountdown(startDate: any): void {
    let now = new Date().getTime()
    let startingDate: any = new Date(startDate).getTime()
    // startingDate.setHours(startingDate.getHours() - 5);
    // startingDate.setMinutes(startingDate.getMinutes() - 30);
    // startingDate = startingDate.getTime()
    const distance = startingDate - now; 
    if (distance > 0) {
      this.daysPending = true
      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    } else {
      this.daysRemaining = 0;
      this.daysPending = false
    }

  }

  ngOnDestroy(): void {
  }

  getRedirectUrlData(contentData: any) {
    // for telemetry
    if (this.widgetData && this.widgetData.context && this.widgetData.context.pageSection) {
      contentData['typeOfTelemetry'] = this.widgetData.context.pageSection
    }
    this.contSvc.changeTelemetryData(contentData)
    // for redirection
    this.contentData.emit(contentData)
  }

}
