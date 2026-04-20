import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
export interface Community {
  id: number;
  name: string;
  members: string;
  posts: string;
  status: 'open' | 'closed';
  image: string;
  category: string;
}

@Component({
  selector: 'd-v2-widget-discussionv2-home',
  templateUrl: './widget-discussionv2-home.component.html',
  styleUrls: ['./widget-discussionv2-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WidgetDiscussionv2HomeComponent implements OnInit {
  @Output() searchText = new EventEmitter<any>();
  @Output() showAllByTopic = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  @Output() topicCardClick = new EventEmitter<any>();
  @Output() showAllTopics = new EventEmitter<any>();
  @Output() popularCommunityData = new EventEmitter<any>();
  userEnrollDetailsData: any;
  topicDataList: any = []
  topicDataLoading: boolean = false
  totalCommunitiesCount: any = 0
 
  constructor(private userEnrollSvc: UserEnrollCommunityService,
    private discussV2Svc: DiscussionV2Service
  ) { }
  async ngOnInit() {
    this.getAllTopics()
      // let data = await this.userEnrollSvc.getEnrollDataId()
      this.userEnrollDetailsData = this.userEnrollSvc.userEnrolledCommunityDetailList
      // console.log(data)
  }

  onSearch(event: any): void {
    const searchValue = event.target.value;
    this.searchText.emit(searchValue);
    // Add your search logic here
  }

  showAllCommunitiesByTopic(topic: any) {
    this.showAllByTopic.emit(topic);
  }
  showAllTopicsMethod() {
    this.showAllTopics.emit();
  }

  onCardClick(cardData: any){
    this.cardClick.emit(cardData);
  }

  getAllTopics(){ 
    this.topicDataLoading = true
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": 0,
      "facets":["topicName"]
    }

    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      
      if(res.result && res.result && res.result.search_results && res.result.search_results.facets && res.result.search_results.facets.topicName && res.result.search_results.facets.topicName.length){
        this.topicDataList = res.result.search_results.facets.topicName;
        this.totalCommunitiesCount =  res.result.search_results.facets.topicName.reduce((sum: any, item: any) => sum + item.count, 0);
        this.topicDataLoading = false
      }
    })
  }
  topicCardMethod(topicData: any) {
    this.topicCardClick.emit(topicData)
  }


  popularCommunity(popularData: any) {
    this.popularCommunityData.emit(popularData)
  }

}
