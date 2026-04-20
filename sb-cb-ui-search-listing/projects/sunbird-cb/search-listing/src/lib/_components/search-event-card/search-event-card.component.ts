import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2';
import { SearchListingService } from '../../_services/search-listing.service';
import { SearchListingConfig } from '../../_models/search-listing.model';
import * as _ from 'lodash';

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const NEW_CONTENT_THRESHOLD_DAYS = 14;
@Component({
  selector: 'ws-app-search-event-card',
  templateUrl: './search-event-card.component.html',
  styleUrls: ['./search-event-card.component.scss'],
  providers: [DatePipe],
})
export class SearchEventCardComponent implements OnInit, OnChanges {
  @Input() content: any;
  @Input() cbpPlans: any[] = [];
  @Output() telemetry = new EventEmitter<any>();
  defaultThumbnail = '/assets/instances/eagle/app_logos/default.png';
  defaultSLogo = '/assets/instances/eagle/app_logos/igot-katmayogi-logo.svg';
  formattedTime: string | null = '';
  contentBookmarked = false;
  isIgot = false;
  eventDuration = '';
  constructor(
    private router: Router,
    private translate: TranslateService,
    private langTranslations: MultilingualTranslationsService,
    private datePipe: DatePipe,
    private searchListingService: SearchListingService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en');
      const lang = localStorage.getItem('websiteLanguage')!;
      this.translate.use(lang);
    }
  }

  ngOnInit(): void {
    this.formatStartTime();
    this.getDurationFromStartandEndDates()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cbpPlans'] && changes['cbpPlans'].currentValue) {
      if (this.cbpPlans?.length && this.content) {
        this.isIgot = this.cbpPlans.some(
          (ele: any) => ele.identifier === this.content.identifier
        );
      } else {
        this.isIgot = false;
      }
    }
  }

  translateLabels(label: string, type: any) {
    if (label) {
      return this.langTranslations.translateLabel(label, type, '');
    }
  }

  formatStartTime() {
    if (this.content?.startTime) {
      const timeStr = this.content.startTime;
      const date = new Date();

      if (timeStr.includes('Z')) {
        // UTC format (e.g., "14:00:00Z")
        const time = timeStr.split('Z')[0];
        const [hours, minutes, seconds] = time.split(':').map(Number);
        date.setUTCHours(hours, minutes, seconds, 0);
      } else {
        // Offset format (e.g., "17:30:00+05:30")
        const [time, _offset] = timeStr.split('+');
        const [hours, minutes, seconds] = time.split(':').map(Number);
        date.setHours(hours, minutes, seconds, 0);
      }

      this.formattedTime = this.datePipe.transform(date, 'h:mm a');
    }
  }

  isCurrentlyActive(): boolean {
    if (
      !this.content?.startDate ||
      !this.content?.startTime ||
      !this.content?.endDate ||
      !this.content?.endTime
    ) {
      return false;
    }

    const now = new Date();
    let startDateTime: Date;
    let endDateTime: Date;

    if (this.content.startTime.includes('Z')) {
      // UTC format
      startDateTime = new Date(
        `${this.content.startDate}T${this.content.startTime}`
      );
    } else {
      const [startTimeStr, startOffset] = this.content.startTime.split('+');
      startDateTime = new Date(
        `${this.content.startDate}T${startTimeStr}+${startOffset}`
      );
    }

    if (this.content.endTime.includes('Z')) {
      endDateTime = new Date(`${this.content.endDate}T${this.content.endTime}`);
    } else {
      const [endTimeStr, endOffset] = this.content.endTime.split('+');
      endDateTime = new Date(
        `${this.content.endDate}T${endTimeStr}+${endOffset}`
      );
    }

    return now >= startDateTime && now <= endDateTime;
  }

   navigateToEvent() {
    const eventId = this.content?.identifier;
    if(eventId) {
      this.content.contentType = 'Events';
      this.telemetry.emit(this.content);
      switch (this.searchListingService.searchConfig?.applicationName) {
        case SearchListingConfig.ApplicationNames.LearnerPortal:
          this.content.contentType = "Events";
          this.router.navigate([`/app/event-hub/home/${eventId}`]);
          this.telemetry.emit(this.content);
          break;
        case SearchListingConfig.ApplicationNames.MDOPortal:
          this.content.contentType = "Events";
          if (this.compareDatesForLive(this.content.startDateTime, this.content.endDateTime) && this.content.status === "Live") {
            this.router.navigate([`app/home/events/edit-event/${eventId}`], {
              queryParams: { mode: "view", pathUrl: "upcoming" }
            });
          } else if (this.content.endDateTime < this.getCurrentTimeInUTC && this.content.status === "Live") {
            this.router.navigate([`app/home/events/edit-event/${eventId}`], {
              queryParams: { mode: "edit", pathUrl: "past" }
            });
          } else {
            this.router.navigate([`app/home/events/edit-event/${eventId}`], {
              queryParams: this.getEventsQueryParams(this.content?.status)
            });
          }
          break;
        case SearchListingConfig.ApplicationNames.CBPPortal:
          const mode = _.get(this.content, 'status', '').toLowerCase() === 'live' ? 'pastRequests' : 'newRequests'
          this.router.navigate(['/app/event-details/', eventId, 'preview'], {
            queryParams: { mode: mode }
          })
          this.telemetry.emit(this.content);
          break;
      }
    }
  }

  getEventsQueryParams(status: string): { mode: string; pathUrl: string } {
    switch (status) {
      case "Draft":
        return { mode: "edit", pathUrl: "draft" };
      case "Live":
        return { mode: "edit", pathUrl: "upcoming" };
      case "Cancelled":
        return { mode: "view", pathUrl: "cancelled" };
      case "SentToPublish":
        return { mode: "view", pathUrl: "pending-approval" };
      case "Rejected":
        return { mode: "edit", pathUrl: "rejected" };
      case "Retired":
        return { mode: "view", pathUrl: "cancelled" };
      default:
        return { mode: "view", pathUrl: "past" };
    }
  }

  checkIfContentIsNew(createdOn: string): boolean {
    if (!createdOn) return false;
    const createdDate = new Date(createdOn);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - createdDate.getTime();
    const diffInDays = diffInMs / MILLISECONDS_IN_A_DAY;

    return diffInDays <= NEW_CONTENT_THRESHOLD_DAYS;
  }

  getDurationFromStartandEndDates() {
    if (!this.content?.startTime || !this.content?.endTime) {
      this.eventDuration = '';
      return;
    }

    let startDateTime: Date;
    let endDateTime: Date;

    if (this.content.startTime.includes('Z')) {
      startDateTime = new Date(`${this.content.startDate}T${this.content.startTime}`);
    } else {
      const [startTimeStr, startOffset] = this.content.startTime.split('+');
      startDateTime = new Date(`${this.content.startDate}T${startTimeStr}+${startOffset}`);
    }

    if (this.content.endTime.includes('Z')) {
      endDateTime = new Date(`${this.content.endDate}T${this.content.endTime}`);
    } else {
      const [endTimeStr, endOffset] = this.content.endTime.split('+');
      endDateTime = new Date(`${this.content.endDate}T${endTimeStr}+${endOffset}`);
    }

    const durationInSeconds = (endDateTime.getTime() - startDateTime.getTime()) / 1000;
    this.eventDuration = isNaN(durationInSeconds) ? '' : durationInSeconds.toString();
  }

  getSubTheme(content:any) {
    let arr:any = []
    content.map((item:any)=>{
      if(item?.competencySubThemeName) {
        arr.push(item?.competencySubThemeName)
      }      
    })
    let str = arr.toString()
    if(str.length > 150) {
      let str = arr.toString().substring(0,150)+'...'
      return str
    } else {
      return str
    }
    
  }

  get getCurrentTimeInUTC(): string {
    const currentDate = new Date()
    const isoString = currentDate.toISOString()
    return isoString.replace('Z', '+0000')
  }

  compareDatesForLive(startDateTime: string, endDateTime: string): boolean {
    const currentDate = new Date();
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    return currentDate >= start && currentDate <= end;
  }
}
