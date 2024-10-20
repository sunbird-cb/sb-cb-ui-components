import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService, WsEvents } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash'

@Component({
  selector: 'sb-uic-national-learning',
  templateUrl: './national-learning.component.html',
  styleUrls: ['./national-learning.component.scss']
})
export class NationalLearningComponent implements OnInit {
  @Input() sectionList:any = []
  @Input() configDetails: any
  @Input() nwlConfiguration: any
  providerId: string = '123456789'
  providerName: ''
  descriptionMaxLength = 500
  environment: any
  constructor(@Inject('environment') environment: any,public router: Router, private events: EventService) {
    this.environment = environment
   }

   ngOnInit(): void {
   }


  hideKeyHightlight(event: any, learnerReview: any) {
    if (event) {
      learnerReview['hideSection'] = true
    }
  }

  showAllContent(_stripData: any, columnData: any) {
    if (columnData && columnData.contentStrip && columnData.contentStrip.strips && columnData.contentStrip.strips.length) {
      const stripData: any = _stripData
        let tabSelected =  stripData.viewMoreUrl && stripData.viewMoreUrl.queryParams && stripData.viewMoreUrl.queryParams.tabSelected && stripData.viewMoreUrl.queryParams.tabSelected || ''
        this.router.navigate(
          [`app/learn/karmayogi-saptah/see-all`],
          { queryParams: {  pageDetails: true, tabSelected, key: columnData.sectionKey  } })

    } else {
       this.router.navigate(
        [`/app/learn/browse-by/provider/${this.providerName}/${this.providerId}/all-CBP`],
        { queryParams: { pageDetails: true } })
    }
  }

  hideContentStrip(event: any, contentStripData: any) {
    if (event) {
      contentStripData.contentStrip['hideSection'] = true
    }
  }

  raiseTabClick(event) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'mdo-leaderboard',
        id: `${event}-tab`,
      },
      {
      },
      {
        module: 'National Learning Week',
      }
    )
  }


  raiseTelemetryInteratEvent(event: any) {
    let  _subType = 'mandatory-courses'
    let _id = 'mandatory-courses-card'
    if (event.typeOfTelemetry === 'learningContent') {
      _subType = 'explore-learning-content'
      _id = 'explore-learning-content-card'
    } 
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: _subType,
        id: _id,
      },
      {
        id: event.identifier,
        type: event.primaryCategory,
      },
      {
        pageIdExt: _id,
        module: 'National Learning Week',
      }
    )
  }

}
