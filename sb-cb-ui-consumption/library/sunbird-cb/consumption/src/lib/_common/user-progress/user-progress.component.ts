import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { InsiteDataService } from '../../_services/insite-data.service';
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';

@Component({
  selector: 'sb-uic-user-progress',
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.scss']
})
export class UserProgressComponent implements OnInit {

  @Input() objectData: any
  @Input() rootOrgId: any
  insitesData = []
  currentIndex = 0
  styleData: any = {}
  userProgress: any = {}
  expand: boolean = true
  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>
  constructor(public insightSvc: InsiteDataService, private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    this.styleData = this.objectData.insights.data.sliderData.styleData
    this.getUserProgress()
    this.getInsightsData()
  }

  getUserProgress() {
    this.insightSvc.fetchUserProgress().subscribe((res: any) => {
      if(res && res.result && res.result.userLeaderBoard) {
        this.userProgress = res.result.userLeaderBoard
        if (!this.userProgress.fullname && this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile.firstName) {
          this.userProgress['fullname'] = this.configSvc.userProfile.firstName
          this.userProgress['profile_image'] = this.configSvc.userProfile.profileImageUrl
        }
      }
    }, error => {
      this.userProgress['fullname'] = this.configSvc.userProfile.firstName
      this.userProgress['profile_image'] = this.configSvc.userProfile.profileImageUrl
    })
  }
  getInsightsData() {
    const request = {
      request: {
        filters: {
          primaryCategory: 'programs',
          organisations: [
            'across',
            this.rootOrgId,
            //"01390354700029132834"
          ],
        },
      },
    }
    this.insightSvc.fetchInsightsData(request).subscribe((res: any) => {
      if (res && res.result && res.result.response && res.result.response.nudges) {
        this.insitesData = res.result.response.nudges
        this.insitesData = this.insitesData.map((obj: any) => {
          return {...obj, cardSubType: 'card-wide-lib'}
        })
      }
    })
  }

  roundTo(number: any) {
    return Math.round(number * 100 /100)
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }

  createInititals(name: string) {
    let initials = ''
    const array = name.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      for (let i = 0; i < name.length; i += 1) {
        if (name.charAt(i) === ' ') {
          continue
        }
        if (name.charAt(i) === name.charAt(i)) {
          initials += name.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    return initials.toUpperCase()
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

}
