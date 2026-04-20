import { Component, EventEmitter, Output } from '@angular/core';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';

@Component({
  selector: 'd-v2-widget-topics-all',
  templateUrl: './widget-topics-all.component.html',
  styleUrls: ['./widget-topics-all.component.scss']
})
export class WidgetTopicsAllComponent {
  localSearchTextValue: any = ''
  sortOptionSelected: any
  topicDataLoading: boolean = false
  topicDataList: any = []
  sortData: any = []
    @Output() topicCardClick = new EventEmitter<any>();
    @Output() goBack = new EventEmitter<any>();
    @Output() communityCardClick = new EventEmitter<any>();
  constructor(private discussV2Svc: DiscussionV2Service){

    this.getAllTopics()
    this.sortData = [
      {
        key: "communities",
        value:"Communities",
        orderDirection: "desc",
        orderByKey:"countOfPeopleJoined",
        checked: false
      },
      {
        key: "name",
        value:"Name",
        orderDirection: "asc",
        orderByKey:"communityName",
        checked: false
      }
    ]
  }
  sortOptionSelection(sortData: any){
    this.sortOptionSelected = sortData
    if(sortData && sortData.orderDirection === 'asc') {
      this.topicDataList = [...this.topicDataList].sort((a, b) => a.value.localeCompare(b.value));
    } else {
      this.topicDataList = [...this.topicDataList].sort((a, b) => b.count - a.count);
    }

  }

  getAllTopics(){ 
    this.topicDataLoading = true
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": 1,
      "facets":["topicName"]
    }

    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      
      if(res.result && res.result && res.result.search_results && res.result.search_results.facets && res.result.search_results.facets.topicName && res.result.search_results.facets.topicName.length){
        this.topicDataList = res.result.search_results.facets.topicName;
        this.topicDataLoading = false
      }
    })
  }

  topicCardMethod(topicData: any) {
    this.topicCardClick.emit(topicData)
  }


  sortBy(_sortType: any) {

    // Sort by name (alphabetically)
    // const sortByName = [...items].sort((a, b) => a.name.localeCompare(b.name));

    // Sort by count (numerically)
    // const sortByCount = [...items].sort((a, b) => a.count - b.count);

    // Sort by count descending (highest to lowest)
    // const sortByCountDesc = [...items].sort((a, b) => b.count - a.count);
  }

  onCommunityClick(communityData: any){
    this.communityCardClick.emit(communityData)
  }
  goBackMethod() {
    this.goBack.emit()
  }
}
