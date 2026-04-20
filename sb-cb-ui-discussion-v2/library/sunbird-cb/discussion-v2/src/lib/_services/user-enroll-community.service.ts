import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_END_POINTS = {
  USERS_COMMUNITY_LIST: `/apis/proxies/v8/community/v1/user/communities`,
  COMMUNITY_SEARCH: `/apis/proxies/v8/community/v1/search`,
  USER_ENROLLED_COMMUNITY_ID_LIST: `/apis/proxies/v8/community/v1/user/communities/all`
}

@Injectable({
  providedIn: 'root'
})
export class UserEnrollCommunityService {

  userEnrolledCommunityList : any = [];
  userEnrolledCommunityDetailList : any = [];
  allCommunitiesList: any = []
  userEnrolledCommunityObjectData: any = {}
  userCommunityIdApiCall: boolean = false;
  constructor(private http: HttpClient) { }


  setEnrollDetailsData(data: any) {
    this.userEnrolledCommunityDetailList = data;
  }

  async getEnrollDetailsData() {
    if(this.userEnrolledCommunityDetailList.length) {
      return this.userEnrolledCommunityDetailList;
    } else {
      let userCommunityData = await this.getUserEnrolledCommunityList();
      this.userEnrolledCommunityDetailList = userCommunityData.communityDetails
      return this.userEnrolledCommunityDetailList
    }
  }

  clearEnrollDetailsData() {
    this.userEnrolledCommunityDetailList = [];
  }

  async getUserEnrolledCommunityList() {
    let emptyData = {
      communityId: [],
      communityDetails:[]
    } 
    return this.http.get<any>(`${API_END_POINTS.USERS_COMMUNITY_LIST}`).toPromise().then((res: any) => {
      if(res && res.result && res.result.communityId && res.result.communityId.length) {
        return res.result;
      } 
      return emptyData;  
    }).catch((err: any) => {
      console.error(err);
      return emptyData;
    });
  }






  setEnrollDataId(data: any) {
    this.userEnrolledCommunityList = data;
  }

  async getEnrollDataId() {
    if(this.userEnrolledCommunityList.length) {
      return this.userEnrolledCommunityList;
    } else {
      if(!this.userCommunityIdApiCall) {
        let userCommunityData = await this.getUserEnrolledCommunityIdData();
        this.userEnrolledCommunityList = userCommunityData.communityId
        return this.userEnrolledCommunityList
      } else {
        return this.userEnrolledCommunityList
      }
    }
  }

  clearEnrollDataId() {
    this.userEnrolledCommunityList = [];
    this.userCommunityIdApiCall = false;
  }

  async getUserEnrolledCommunityIdData() {
    let emptyData = {
      communityId: [],
      communityDetails:[]
    } 
    return this.http.get<any>(`${API_END_POINTS.USER_ENROLLED_COMMUNITY_ID_LIST}`).toPromise().then((res: any) => {
      this.userCommunityIdApiCall = true;
      if(res && res.result && res.result.communityId && res.result.communityId.length) {
        // Create a mapping of IDs to names for quick lookup
        const idToNameMap = res.result.communityId.reduce((acc: any, item:any) => {
          acc[item.communityid] = item.communityName;
          return acc;
        }, {});
        this.userEnrolledCommunityObjectData = idToNameMap;
        return res.result;
      } 
      return emptyData;  
    }).catch((err: any) => {
      console.error(err);
      return emptyData;
    });
  }



  async similarCommuninties(){
    let emptyData = {
      "filterCriteriaMap":{"status":"active"},
      "requestedFields":[],
      "pageNumber":0,
      "pageSize":500,
      "facets":[]
    }
    if(this.allCommunitiesList && this.allCommunitiesList.length){
      return this.allCommunitiesList
    } else {
      return this.http.post<any>(`${API_END_POINTS.COMMUNITY_SEARCH}`, emptyData).toPromise().then((res: any) => {
        if(res && res.result && res.result.search_results && res.result.search_results.data && res.result.search_results.data.length) {
          this.allCommunitiesList = res.result.search_results.data;
          return res.result.search_results.data;
        } 
        return emptyData;  
      }).catch((err: any) => {
        console.error(err);
        return emptyData;
      });
    }
  }
}
