import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { UtilityService } from '@sunbird-cb/utils-v2';


@Component({
  selector: 'd-v2-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit, OnChanges {
  @Output() showAllByTopic = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  @Output() popularCommunityClick = new EventEmitter<any>();
  @Input() topicDataList: any = [];
  @Input() userCommunityList: any = []
  orgDetails: any;
  toppicWiseCommunities: any;
  loadTopicsCount: number = 3;
  topicDataLoading: boolean = false
  toppicWiseCommunitiesCopy: any = {}
  popularCommunities: any = [
  ]
  defaultPosterThumbnail: string = ''
  sliderStyleData: any = {
    styleData: {
      "bannerMetaClass": "meta",
      "bannerMeta": "visible",
      "bannerMetaAlign": "middle",
      "navigationArrows": "visible",
      "borderRadius": "12px",
      "customHeight": "141px",
      "customImgHeight": "141px",
      "customMinHeight": "141px",
      "arrowsPlacement": "middle-inline",
      autoplay: true,
      "responsive": {
        "bannerMetaClass": "meta",
        "customHeight": "141px",
        "bannerMetaAlign": "middle",
        "navigationArrows": "visible",
        "customImgHeight": "141px",
        "customMinHeight": "141px",
        "dots": "hidden",
        "arrowsPlacement": "middle-inline",
        autoplay: true,
      }
    }
  }

  ngOnInit(): void {

    this.getPopularCommunities()
      
  }

  constructor(private discussV2Svc:DiscussionV2Service, private utilitySvc: UtilityService) { 
    this.defaultPosterThumbnail = this.utilitySvc.isMobile ? 'assets/instances/eagle/banners/discussion/community-default-mb-banner.svg' : 'assets/instances/eagle/banners/discussion/community-default-pc-banner.svg'
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.topicDataList) {
      
      this.loadTopicData();  
    }
  }
  // topicWiseData() {
  //   this.discussV2Svc.topicWiseCommunities().subscribe((res: any) => {  
      
  //     console.log(res);
  //   })
  // }

  onCardClick(cardData: any){
    this.cardClick.emit(cardData);
  }

  showAllCommunitiesByTopic(topic: any) {
    this.showAllByTopic.emit(topic);
  }

  loadMoreTopics(){
    if(this.loadTopicsCount < this.topicDataList.length){
      let startIndex = this.loadTopicsCount
      this.loadTopicsCount += 3;
      this.loadCommunities(startIndex)
    }
  }




  async loadTopicData() {
    try {
      // let topicBycomunities: any = this.topicDataList.reduce((acc: any, element: any) => {
      //   acc[element.value] = {
      //     topicName: element.value,
      //     isLoading: true,
      //     communities: [],
      //     count: element.count,
      //     topicId: ''
      //   };
      //   return acc;
      // }, {});
      
      // this.toppicWiseCommunitiesCopy = topicBycomunities
      this.toppicWiseCommunities = {}
      for(const topic of this.topicDataList){
        this.toppicWiseCommunities[topic.value] =  {
          isLoading : true,
          communities : [],
          count : topic.count,
          topicName : topic.value,
          topicId  : '',
        }
      }
      await this.loadCommunities(0);
      
    } catch (error) {
      console.error('Error fetching topic data:', error);
    } finally {
      this.topicDataLoading = false;
    }
  }

  async loadCommunities(startIndex:number) {
    // let tempAllApiData: any = {}
    for(const topic of this.topicDataList.slice(startIndex, this.loadTopicsCount)){
      this.toppicWiseCommunities[topic.value]['isLoading'] = true;
      const data = await this.getCommunitiesByTopic(topic.value);
      this.toppicWiseCommunities[topic.value]['isLoading'] = false;
      this.toppicWiseCommunities[topic.value]['communities'] = data;
      this.toppicWiseCommunities[topic.value]['count'] = topic.count;
      this.toppicWiseCommunities[topic.value]['topicName'] = topic.value;
      if (data.length > 0) {
        this.toppicWiseCommunities[topic.value]['topicId']  = data[0].topicId;
      }
    }
    // for (const key of Object.keys(topicBycomunities).slice(startIndex, this.loadTopicsCount)) {
      
    //   let tempApiData : any= {}
    //   tempApiData[key] = {}
    //   tempApiData[key]['isLoading'] = true;
    //   tempAllApiData = { ...tempApiData,...tempAllApiData}
    //   this.toppicWiseCommunities = { ...this.toppicWiseCommunities,...tempAllApiData}
    //   const data = await this.getCommunitiesByTopic(key);
    //   tempApiData[key]['isLoading'] = false;
    //   tempApiData[key]['communities'] = data;
    //   tempApiData[key]['count'] = topicBycomunities[key].count;
    //   tempApiData[key]['topicName'] = topicBycomunities[key].topicName;
    //   if (data.length > 0) {
    //     tempApiData[key]['topicId']  = data[0].topicId;
    //   }
    //   tempAllApiData = { ...tempApiData,...tempAllApiData}
    // }
    // this.toppicWiseCommunities = { ...this.toppicWiseCommunities,...tempAllApiData}

  }

  async getCommunitiesByTopic(topic: any): Promise<any[]> {
    let request: any = {
      filterCriteriaMap: {
        status: 'active',
        topicName: topic
      },
      requestedFields: [],
      pageNumber: 0,
      pageSize: 200
    };

    try {
      const res: any = await this.discussV2Svc.communitySearch(request).toPromise();
      if (res.result && res.result.search_results && res.result.search_results.data) {
        if(res.result && res.result && res.result.search_results && res.result.search_results.additionalInfo && res.result.search_results.additionalInfo.length){
          this.orgDetails = {...this.orgDetails, ...this.discussV2Svc.convertOrgArrayToObject(res.result.search_results.additionalInfo)}
        }
        return res.result.search_results.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching communities by topic:', error);
      return [];
    }
  }
  async getPopularCommunities() {
    let request: any = {
      "field":"countOfPeopleJoined",
      "limit":5
    }

    try {
      const res: any = await this.discussV2Svc.popularCommunity(request).toPromise();
      
      if (res.result && res.result.data && res.result.data.length) {
          let newValues = res.result.data.map((v: any) => ({...v, name: v.communityName, banner: v.posterImageUrl}))
          this.popularCommunities = newValues.slice(0,5)
        
        return res.result.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching communities by topic:', error);
      return [];
    }
  }

  popularCommunity(popularData: any){
    this.popularCommunityClick.emit(popularData)
  }
}
