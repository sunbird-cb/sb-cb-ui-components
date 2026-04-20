import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { combineLatest } from 'rxjs';
import { communityConstants } from '../../_model/filter-constants.model'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { FilterComponent } from '../../_common/filter/filter.component';
import { UtilityService } from '@sunbird-cb/utils-v2';
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';
@Component({
  selector: 'd-v2-widget-community-search',
  templateUrl: './widget-community-search.component.html',
  styleUrls: ['./widget-community-search.component.scss']
})
export class WidgetCommunitySearchComponent  implements OnInit{

  searchTextValue: any = '';
  localSearchTextValue: any = '';
  globalSearchEnabled: boolean = false;
  communityDataList: any = [];
  communityDataListLoader: any = []
  topicName: any = ''
  orgDetails: any
  @Output() searchText = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  @Output() goBack = new EventEmitter<any>();
  isLoading: boolean = false;
  filterObjectList: any = {}
  constants: any
  filterKeys: any =[]
  sortOptionSelected: any= {}
  pageSize: any = 50
  pageNumber: any = 0
  totalCount: any = 0
  factesRequest: any = []
  filterApply: any = {}
  sortData: any
  isMobile: boolean = false

  userJoinedCommunityList: any = []
  constructor(private bottomSheet: MatBottomSheet,private activatedRoute: ActivatedRoute,
    private utilitySvc: UtilityService, private discussV2Svc: DiscussionV2Service, private userEnrollSvc: UserEnrollCommunityService) {
    this.isMobile = this.utilitySvc.isMobile
    this.sortData = [
      {
        key: "members",
        value:"Members",
        orderDirection: "desc",
        orderByKey:"countOfPeopleJoined",
        checked: true
      },
      {
        key: "name",
        value:"Name",
        orderDirection: "asc",
        orderByKey:"communityName",
        checked: false
      },
      {
        key: "activity",
        value:"Activity",
        orderDirection: "desc",
        orderByKey:"updatedOn",
        checked: false
      } ,
      {
        key: "date",
        value:"Date",
        orderDirection: "asc",
        orderByKey:"createdOn",
        checked: false
      } 
    ]
    this.sortOptionSelected = this.sortData[0]
    this.constants= communityConstants
    combineLatest([
      this.activatedRoute.queryParams,
      this.activatedRoute.paramMap
    ]).subscribe(([queryParams, params]) => {
      
      this.isLoading = true;
      this.communityDataListLoader = [0,1,2,3,4,5,6,7,8,9,10];
      // Check query params first
      if (queryParams['c'] || queryParams['c'] === '') {
        this.searchTextValue = queryParams['c'];
        this.fetchCommunityList(true,this.searchTextValue, '',this.sortOptionSelected);
        this.globalSearchEnabled = true
      } 
      else if (params.get('topicName')) {
        this.topicName = params.get('topicName')
        this.fetchCommunityList(true,this.searchTextValue, params.get('topicName'),this.sortOptionSelected);
        this.globalSearchEnabled = false
      } 
      // Default case
      else {
        this.fetchCommunityList(true,'', '',this.sortOptionSelected);
      }
      this.onSearch(this.searchTextValue,'t')
    });
   }

   async ngOnInit(){
    this.userJoinedCommunityList = await this.userEnrollSvc.getEnrollDataId()
   }

   fetchCommunityList(facetsRender: boolean,searchText?: any, topicName?:any, sortData?: any,loadMoreClick?: boolean, filterApply?:any,factesRequest?:any) {
    this.isLoading = true;
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [
      ],
      "pageNumber": this.pageNumber,
      "pageSize": this.pageSize,
    }
    if(facetsRender) {
      request['facets']= [
        "topicName",
        "orgName",
        "competencyArea"
      ]
    }
    if(searchText) {
      request['searchString'] = searchText
    }
    if(topicName) {
      request['filterCriteriaMap']['topicName'] = topicName
    }
    if(sortData && Object.keys(sortData).length){
      request['orderBy'] = sortData.orderByKey
      request['orderDirection']= sortData.orderDirection
    }

    if(filterApply && Object.keys(filterApply).length){
      request['filterCriteriaMap'] = {...request['filterCriteriaMap'],...filterApply}
    }
    if(factesRequest && factesRequest.length) {
      request['facets']= factesRequest
    }
    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      if(res.result && res.result && res.result.search_results && res.result.search_results.additionalInfo && res.result.search_results.additionalInfo.length ) {
        this.orgDetails = this.discussV2Svc.convertOrgArrayToObject(res.result.search_results.additionalInfo)
      }
      
      if(res.result && res.result && res.result.search_results && res.result.search_results.data && res.result.search_results.data){
        if(loadMoreClick) {
          this.communityDataList = [...this.communityDataList, ...res.result.search_results.data];
        } else {
          this.communityDataList = res.result.search_results.data
        }
        this.totalCount = res.result.search_results.totalCount
      }
      if(facetsRender) {
        this.getFilterFacets(res.result.search_results.facets)
      }
      if(factesRequest && factesRequest.length) {
        let facets: any = res.result.search_results.facets
        Object.keys(facets).forEach((ele: any) => {
          let tempFilter: any = {}
          tempFilter['label'] = this.constants[`${ele}Label`]
          let newValues = []
          if(facets[ele] && facets[ele].length ){
            newValues = facets[ele].map((v: any) => ({...v, checked: false}))
          }
          tempFilter['values'] = newValues
          this.filterObjectList[ele] =  tempFilter
        })
        if(this.filterObjectList[this.constants.competencyTheme].values && this.filterObjectList[this.constants.competencyTheme].values.length === 0  ) {
          this.filterObjectList[this.constants.competencySubTheme].values = []
        }
      }
      this.isLoading = false;
    },(_err: any) => {
      this.isLoading = false;
      this.communityDataList = []
    })
   }

  onSearch(searchEvent: any, option?:any){
    if(option){
      this.searchTextValue = this.searchTextValue
    } else {
      this.searchTextValue = searchEvent.target.value;
      this.searchText.emit(this.searchTextValue);
    }
  }

  onCardClick(community: any){
    this.cardClick.emit(community);
  }
  sortOptionSelection(sortData: any){
    this.sortOptionSelected = sortData
    this.fetchCommunityList(false,this.searchTextValue,this.topicName,sortData,false,this.filterApply, this.factesRequest)
  }

  // getFilterFacets(facetsData: any) {
  //   this.filterObjectList = {
  //     [this.constants.orgId] : {},
  //     [this.constants.topicName] : {},
  //     [this.constants.competencyArea] : {},
  //     [this.constants.competencyTheme] : {},
  //     [this.constants.competencySubTheme] : {}
  //   }
    
  //   this.filterKeys  = [this.constants.orgId,this.constants.competencyArea,this.constants.competencyTheme, this.constants.competencySubTheme]
  //   if(!this.topicName) {
  //     this.filterKeys.splice(1, 0, this.constants.topicName);
  //   }
  //     if(facetsData ){
  //       let emptyData = {
  //         competencyTheme: [],
  //         competencySubTheme:[]
  //       }
  //       let facets: any = {...facetsData,...emptyData}
  //       Object.keys(facets).forEach((ele: any) => {
  //         let tempFilter: any = {}
  //         tempFilter['label'] = this.constants[`${ele}Label`]
  //         let newValues = []
  //         if(facets[ele] && facets[ele].length ){
  //           newValues = facets[ele].map((v: any) => ({...v, checked: false}))
  //         }
  //         tempFilter['values'] = newValues
  //         if(ele === 'topicName') {
  //           newValues.forEach((element: any) => {
  //             if(element.value === this.topicName ){
  //               element['checked']= true
  //             }
  //           });
  //         }
  //         this.filterObjectList[ele] =  tempFilter
  //       })
  //     }
  // }

  getFilterFacets(facetsData: any) {
    this.filterObjectList = {
      [this.constants.orgName] : {},
      [this.constants.topicName] : {},
      [this.constants.competencyArea] : {},
      [this.constants.competencyTheme] : {},
      [this.constants.competencySubTheme] : {}
    }
    
    this.filterKeys  = [this.constants.orgName,this.constants.competencyArea,this.constants.competencyTheme, this.constants.competencySubTheme]
    if(!this.topicName) {
      this.filterKeys.splice(1, 0, this.constants.topicName);
    }
      if(facetsData ){
        let emptyData = {
          competencyTheme: [],
          competencySubTheme:[]
        }
        let facets: any = {...facetsData,...emptyData}
        Object.keys(facets).forEach((ele: any) => {
          let tempFilter: any = {}
          tempFilter['label'] = this.constants[`${ele}Label`]
          let newValues: any = []
          if(facets[ele] && facets[ele].length ){
            // Add "All" option at the beginning
            newValues = [
              { value: `All ${this.constants[`${ele}Label`]}`, id: 'all', count: 0, checked: true },
              ...facets[ele].map((v: any) => ({...v, id: v.value.toLowerCase(), checked: false}))
            ]
          }
          tempFilter['values'] = newValues
          if(ele === 'topicName') {
            newValues.forEach((element: any) => {
              if(element.value === this.topicName ){
                element['checked']= true
              }
            });
          }
          this.filterObjectList[ele] =  tempFilter
        })
      }
  }

  selectedFilters(filterData: any){
    
    let filterRequest = filterData.selectedOptions
    let recentRequestKey = filterData.recentSelectedKey|| ''
    // let recentRequestOption = filterData.recentSelectedOption
    
    let filterObject: any = {}
    let factesRequest: any = []

    if(!filterRequest[this.constants.competencyArea].length) {
      filterRequest[this.constants.competencySubTheme] = []
      filterRequest[this.constants.competencyTheme] = []
      this.filterObjectList[this.constants.competencyTheme].values = []
      this.filterObjectList[this.constants.competencySubTheme].values = []
    }
    Object.keys(filterRequest).forEach((_ele: any)=> {
      if(filterRequest[_ele] && filterRequest[_ele].length) {
        let data = {
          [_ele]: filterRequest[_ele]
        }
        filterObject = {...filterObject, ...data}
      }
    })
    if(recentRequestKey === this.constants.competencyArea 
      && filterRequest[this.constants.competencyArea].length){
      factesRequest.push(this.constants.competencyTheme)
    } else if(recentRequestKey === this.constants.competencyTheme
      && filterRequest[this.constants.competencyTheme].length
     )
    {
      factesRequest.push(this.constants.competencySubTheme)
    }
    this.filterApply = filterObject
    this.factesRequest = factesRequest
    this.fetchCommunityList(false,this.searchTextValue, this.topicName, this.sortOptionSelected,false, filterObject,factesRequest)

  }


  // Bottom sheet open only in mobileview
  openBottomSheet(): void {
    const bottomSheetRef = this.bottomSheet.open(FilterComponent, {
      data: {
        filterObjectList: this.filterObjectList,
        filterKeys: this.filterKeys,
        loadBottomSheet: true
      },
      panelClass: 'filter-bottomsheet',
    })
    bottomSheetRef.afterDismissed().subscribe((result: any) => {
     if (result) {
      const filter = result.filter

      this.selectedFilters({selectedOptions:filter})
     }
    })
  }
  loadMoreMembers(){
    
    if( !(this.communityDataList.length >= this.totalCount)) {
      this.pageNumber = this.pageNumber + 1
      this.fetchCommunityList(false,this.searchTextValue, this.topicName, this.sortOptionSelected, true)
    }
  }

  goBackMethod() {
  this.goBack.emit('home')
  }
  
}
