import { Component, Input, OnChanges, OnInit, Inject } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

export interface ICompentencyKeys {
  vKey: string
  vCompetencyArea: string
  vCompetencyAreaDescription: string
  vCompetencyTheme: string
  vCompetencySubTheme: string
}

@Component({
  selector: 'sb-uic-competency-summary',
  templateUrl: './competency-summary.component.html',
  styleUrls: ['./competency-summary.component.scss']
})
export class CompetencySummaryComponent implements OnInit, OnChanges {
  @Input() contentData: any
  @Input() selectedContents: any
  selectedCardData: any[] = []
  competencySummaryObj: any = [{
    title: 'behavioural',
    behavioural: {
      listData: [],
      count: 0,
    },
  }, {
    title: 'functional',
    functional: {
      listData: [],
      count: 0,
    },
  }, {
    title: 'domain',
    domain: {
      listData: [],
      count: 0,
    },
  },
  ]
  selectedIndex = 0
  compentencyKey!: ICompentencyKeys
  environment!: any

  constructor(public configSvc: ConfigurationsService,
    @Inject('environment') environment: any,
  ) {
    this.environment = environment
    this.compentencyKey = this.configSvc.compentency[this.environment.compentencyVersionKey]
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedCardData = []
    this.competencySummaryObj = [{
      title: 'behavioural',
      behavioural: {
        listData: [],
        count: 0,
      },
    }, {
      title: 'functional',
      functional: {
        listData: [],
        count: 0,
      },
    }, {
      title: 'domain',
      domain: {
        listData: [],
        count: 0,
      },
    },
    ]
    if (this.selectedContents && this.selectedContents.length > 0) {
      this.selectedCardData = this.selectedContents
    }
    // let competencyThemeObj = {};

    if (this.selectedCardData && this.compentencyKey && this.compentencyKey.vKey) {
      let fObj = { competencyTheme: '', count: 0 }
      this.selectedCardData.forEach((sitem: any) => {
        if (sitem && sitem[this.compentencyKey.vKey]) {
          sitem[this.compentencyKey.vKey].map((fitem: any) => {
            if (fitem[this.compentencyKey.vCompetencyArea].toLowerCase() === 'behavioural') {
              const result = this.checkIfThemeNameExists(this.competencySummaryObj[0]['behavioural']['listData'], fitem)
              fObj = { competencyTheme: fitem[this.compentencyKey.vCompetencyTheme], count: 1 }
              if (result) {
                this.competencySummaryObj[0]['behavioural']['count'] = this.competencySummaryObj[0]['behavioural']['count'] + 1
                this.competencySummaryObj[0]['behavioural']['listData'].push(fObj)
              }
              this.selectedIndex = 0
            }
            if (fitem[this.compentencyKey.vCompetencyArea].toLowerCase() === 'functional') {
              const result = this.checkIfThemeNameExists(this.competencySummaryObj[1]['functional']['listData'], fitem)
              fObj = { competencyTheme: fitem[this.compentencyKey.vCompetencyTheme], count: 1 }
              if (result) {
                this.competencySummaryObj[1]['functional']['count'] = this.competencySummaryObj[1]['functional']['count'] + 1
                this.competencySummaryObj[1]['functional']['listData'].push(fObj)
              }
              this.selectedIndex = 1
            }
            if (fitem[this.compentencyKey.vCompetencyArea].toLowerCase() === 'domain') {
              const result = this.checkIfThemeNameExists(this.competencySummaryObj[2]['domain']['listData'], fitem)
              fObj = { competencyTheme: fitem[this.compentencyKey.vCompetencyTheme], count: 1 }
              if (result) {
                this.competencySummaryObj[2]['domain']['count'] = this.competencySummaryObj[2]['domain']['count'] + 1
                this.competencySummaryObj[2]['domain']['listData'].push(fObj)
              }
              this.selectedIndex = 2
            }
          })
        }

      })
    }
  }

  checkIfThemeNameExists(arr: any, fitem: any): boolean {
    let flag = true
    arr.map((sitem: any) => {
      if (sitem.competencyTheme === fitem[this.compentencyKey.vCompetencyTheme]) {
        sitem['count'] = sitem['count'] + 1
        flag = false
      }
    })
    return flag
  }
}
