import { Component, HostListener, Input, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
/* tslint:disable */
import * as _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'sb-uic-mdo-channel-v2',
  templateUrl: './mdo-channel-v2.component.html',
  styleUrls: ['./mdo-channel-v2.component.scss']
})
export class MdoChannelV2Component  implements OnInit {
  @Input() sectionList:any = []
  channnelName = ''
  orgId = ''
  selectedIndex = 0
  hideCompetencyBlock: boolean = false
  contentTabEmptyResponseCount: number = 0
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    {
      title: `MDO Channels`,
      url: `/app/learn/mdo-channels/all-channels`,
      icon: '', disableTranslate: true,
    },
  ]
  showModal: boolean = false
  descriptionMaxLength = 500
  isTelemetryRaised: boolean = false
  stripWidth: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
  ) { 
    if (this.route.snapshot.data && this.route.snapshot.data.formData
      && this.route.snapshot.data.formData.data
      && this.route.snapshot.data.formData.data.result
      && this.route.snapshot.data.formData.data.result.form
      && this.route.snapshot.data.formData.data.result.form.data
      && this.route.snapshot.data.formData.data.result.form.data.sectionList
    ) {
      this.sectionList = this.route.snapshot.data.formData.data.result.form.data.sectionList
    }
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  @HostListener('window:resize')
  onResize() {
    this.setWidth()
  }

  setWidth() {
    this.stripWidth = `${(window.innerWidth - 1200 + 135)/2}px`

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.channnelName = params['channel']
      this.orgId = params['orgId']
      this.titles.push({
        title: this.channnelName, icon: '', url: 'none', disableTranslate: true,
      })
    })
    this.setWidth()
  }

  public tabClicked(tabEvent: MatTabChangeEvent) {
    this.raiseTelemetry(`${tabEvent.tab.textLabel} tab`)
  }
  hideContentStrip(event: any, colData: any) {
    if (event) {
      colData.contentStripData['hideSection'] = true
      this.contentTabEmptyResponseCount = this.contentTabEmptyResponseCount + 1
      // if(this.contentTabEmptyResponseCount === 4 ) {
      //   this.selectedIndex = 1
      // }
    }
  }

  triggerOpenDialog(event: boolean) {
    if(event) {
      this.showModal = true
      document.body.style.overflow = 'hidden'
    }
    this.raiseTelemetry('btn open key annoucements')
  }

  onClose() {
    this.showModal = false
    document.body.style.overflow = 'auto'
    this.raiseTelemetry('btn close key annoucements')
  }

  raiseTelemetryInteratEvent(event: any) {
    if (event && event.viewMoreUrl) {
      this.raiseTelemetry(`${event.stripTitle} ${event.viewMoreUrl.viewMoreText}`)
    }
    if (!this.isTelemetryRaised && event && !event.viewMoreUrl) {
      this.eventSvc.raiseInteractTelemetry(
        {
          type: 'click',
          subType: 'mdo-channel',
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
    this.eventSvc.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'mdo-channel',
        id: `${_.kebabCase(name).toLocaleLowerCase()}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }

  hideCompetency(event: any) {
    if (event) {
      this.hideCompetencyBlock = true
    }
  }

  showAllContent(_stripData: any, columnData: any) {
    if (columnData && columnData.contentStrip && columnData.contentStrip.strips && columnData.contentStrip.strips.length) {
      const stripData: any = _stripData
        let tabSelected =  stripData.viewMoreUrl && stripData.viewMoreUrl.queryParams && stripData.viewMoreUrl.queryParams.tabSelected && stripData.viewMoreUrl.queryParams.tabSelected || ''
        this.router.navigate(
          [`/app/learn/mdo-channels/${this.channnelName}/${this.orgId}/all-content`],
          { queryParams: { tabSelected, key: columnData.sectionKey  } })
    }
  }

}
