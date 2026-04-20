import { DatePipe } from '@angular/common'
import {  Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
import * as _ from 'lodash'

@Component({
  selector: 'sb-uic-providers-v2',
  templateUrl: './providers-v2.component.html',
  styleUrls: ['./providers-v2.component.scss']
})
export class ProvidersV2Component implements OnInit  {

  @Input() sectionList:any = []
  providerName = ''
  providerId = ''
  navList: any
  hideCompetencyBlock = false
  // sectionList: any = []
  currentMonthAndYear: any
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: `All Providers`,
      url: `/app/learn/browse-by/provider/all-providers`,
      icon: '', disableTranslate: true,
    },
  ]

  descriptionMaxLength = 500
  isTelemetryRaised = false

  constructor(private route: ActivatedRoute,
              public router: Router, private datePipe: DatePipe, private events: EventService) {

  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.formData
      && this.route.snapshot.data.formData.data
      && this.route.snapshot.data.formData.data.result
      && this.route.snapshot.data.formData.data.result.form
      && this.route.snapshot.data.formData.data.result.form.data
      && this.route.snapshot.data.formData.data.result.form.data.sectionList
    ) {
      this.sectionList = this.route.snapshot.data.formData.data.result.form.data.sectionList
    }
    this.route.params.subscribe(params => {
      this.providerName = params['provider']
      this.providerId = params['orgId']
      this.titles.push({
        title: this.providerName, icon: '', url: 'none', disableTranslate: true,
      })
    })
    this.getNavitems()
    this.currentMonthAndYear = this.datePipe.transform(new Date(), 'MMMM y')
  }

  getNavitems() {
    this.navList = this.sectionList.filter(
      (obj: any) => obj.enabled && obj.navigation && obj.navOrder).sort(
        (a: any, b: any) => a.navOrder - b.navOrder)
  }

  scrollToSection(name:  string) {
    let section: HTMLElement | any
    section = document.getElementById(name)
    if (section) {
      // section.scrollIntoView({ behavior: 'smooth', block: 'start',inline: 'nearest', offsetTop: yOffset  })
      window.scrollTo({
        top: section.offsetTop - 121,
        behavior: 'smooth',
      })
    }
  }
  hideCompetency(event: any, columnData: any) {
    if (event) {
      this.hideCompetencyBlock = true
      columnData['navigation'] = false
      columnData['enabled'] = false
      this.navList.forEach((navItem: any) => {
       navItem.column.forEach((colEle: any) => {
          if (colEle.key === columnData.key) {
            navItem['navigation'] = false
          }
       })
      })
    }
  }
  hideContentStrip(event: any, contentStripData: any) {
    if (event) {
      contentStripData.contentStrip['hideSection'] = true
    }
  }
  hideLearnerReview(event: any, learnerReview: any) {
    if (event) {
      learnerReview['hideSection'] = true
    }
  }

  showAllContent(_stripData: any, columnData: any) {
    if (columnData && columnData.contentStrip && columnData.contentStrip.strips && columnData.contentStrip.strips.length) {
      const stripData: any = _stripData
        let tabSelected =  stripData.viewMoreUrl && stripData.viewMoreUrl.queryParams && stripData.viewMoreUrl.queryParams.tabSelected && stripData.viewMoreUrl.queryParams.tabSelected || ''
        this.router.navigate(
          [`/app/learn/browse-by/provider/${this.providerName}/${this.providerId}/all-content`],
          { queryParams: {  pageDetails: true, tabSelected, key: columnData.sectionKey  } })

    } else {
       this.router.navigate(
        [`/app/learn/browse-by/provider/${this.providerName}/${this.providerId}/all-CBP`],
        { queryParams: { pageDetails: true } })
    }
  }

  raiseTelemetryInteratEvent(event: any) {
    if (event && event.viewMoreUrl) {
      this.raiseTelemetry(`${event.stripTitle} ${event.viewMoreUrl.viewMoreText}`)
    }
    if (!this.isTelemetryRaised && event && !event.viewMoreUrl) {
      this.events.raiseInteractTelemetry(
        {
          type: 'click',
          subType: 'ATI/CTI',
          id: `${_.kebabCase(event.typeOfTelemetry.toLocaleLowerCase())}-card`,
        },
        {
          id: event.identifier,
          type: event.primaryCategory,
        },
        {
          pageIdExt: `${_.kebabCase(event.primaryCategory.toLocaleLowerCase())}-card`,
          module: WsEvents.EnumTelemetrymodules.LEARN,
        }
      )
      this.isTelemetryRaised = true
    }
  }

  raiseCompetencyTelemetry(name: string) {
    this.raiseTelemetry(`${name} core expertise`)
  }

  raiseTelemetry(name: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'ATI/CTI',
        id: `${_.kebabCase(name).toLocaleLowerCase()}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }

  raiseNavTelemetry(name: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'ATI/CTI',
        id: `${_.kebabCase(name).toLocaleLowerCase()}-navigation`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }
}
