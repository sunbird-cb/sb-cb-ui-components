import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of, Subject, throwError } from "rxjs";
import { ConfigurationsService } from "@sunbird-cb/utils-v2";
import {
  ACBPConst,
  IGOTConst,
  SearchTrainingPlansRequest,
  SearchCommunitiesRequest,
  SearchExternalRequest,
  SearchListingConfig,
  SearchNLP,
  SearchPeoplesRequest,
  SearchV4Request,
  SearchDesignationRequest
} from "../_models/search-listing.model";
import { catchError, map } from "rxjs/operators";
// import "rxjs/add/observable/of";
import * as lodash from "lodash";

const API_END_POINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  SEARCH_V4: `/apis/proxies/v8/sunbirdigot/v4/search`,
  SEARCH_EXT_CONTENT: `/apis/proxies/v8/cios/v1/search/content`,
  // SEARCH_PEOPLE: `/apis/protected/v8/connections/v2/connections/recommended`,
  SEARCH_PEOPLE: `/apis/proxies/v8/user/v5/public/search`,
  SEARCH_COMMUNITY: `/apis/proxies/v8/community/v1/search`,
  SEARCH_NLP: `/apis/proxies/v8/nlp/search`,
  RECENT_CREATE: `apis/proxies/v8/search/v1/recent/create`,
  RECENT_READ: `apis/proxies/v8/search/v1/recent/read`,
  RECENT_DELETE_BY_USERID: `apis/proxies/v8/search/v1/recent/delete`,
  RECENT_DELETE_BY_TIMESTAMP: (id: string) => {
    return `apis/proxies/v8/search/v1/recent/delete/timestamp/${id}`;
  },
  ENROLLMENT_API(userId: string): string {
    return `/apis/proxies/v8/learner/course/v4/user/enrollment/list/${userId}`;
  },
  FETCH_CPB_PLANS: `/apis/proxies/v8/user/v1/cbplan`,
  DOWNLOAD_CERTIFICATE_v2: (id: string) => `apis/protected/v8/cohorts/course/batch/cert/download/${id}`,
  SEARCH_USERS: `/apis/proxies/v8/user/v1/search`,
  SEARCH_TRAINING_PLANS: `/apis/proxies/v8/cbplan/v2/search`,
  BLOCK_USER: '/apis/proxies/v8/user/v1/block',
  UNBLOCK_USER: '/apis/proxies/v8/user/v1/unblock',
  CONTENT_GET: '/apis/proxies/v8/action/content/v3/hierarchy/',
  CONTENT_READ: '/apis/proxies/v8/action/content/v3/read/',
};

@Injectable({
  providedIn: "root"
})
export class SearchListingService {
  private removeFilter = new Subject<any>();
  searchConfig: SearchListingConfig.Config | null = null;
  /**
   * Observable string streams
   */
  notifyObservable$ = this.removeFilter.asObservable();
  environment!: any;
  constructor(@Inject("environment") environment: any, private http: HttpClient, private configSrv: ConfigurationsService) {
    this.environment = environment;
  }

  private rolesSubject = new BehaviorSubject<string[]>([])
  updatedUserRoles$: Observable<string[]> = this.rolesSubject.asObservable()

  // Subject to trigger setRolesForCategory from filters components
  private setRolesForCategorySubject = new Subject<{ category: string, roles?: string[] }>()
  setRolesForCategory$: Observable<{ category: string, roles?: string[] }> = this.setRolesForCategorySubject.asObservable()

  // userRoleIsFixed = new BehaviorSubject<boolean>(false)
  // userRoleIsFixed$: Observable<boolean> = this.userRoleIsFixed.asObservable()

  setUserRoles(roles: string[]) {
    this.rolesSubject.next(roles)
  }

  // Trigger setRolesForCategory in SearchInputHomeComponent
  triggerSetRolesForCategory(category: string, roles?: string[]) {
    this.setRolesForCategorySubject.next({ category, roles })
  }

  // setUserRoleIsFixed(fixed: boolean) {
  //   this.userRoleIsFixed.next(fixed)
  // }
  
  handleError(error: ErrorEvent) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    }
    return throwError(errorMessage);
  }

  fetchSearchData(request: any): Observable<any> {
    //       This method is used to fetch search data based on the request parameters.
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, request);
  }
  fetchSearchDataByCategory(request: any): Observable<any> {
    // This method is used to fetch search data by category.
    return this.http.post<any>(API_END_POINTS.SEARCH_V4, request);
  }
  fetchSearchDataforCios(request: any): Observable<any> {
    // This method is used to fetch search data for CIOs.
    return this.http.post<any>(API_END_POINTS.SEARCH_EXT_CONTENT, request);
  }
  public notifyOther(data: any) {
    if (data) {
      this.removeFilter.next(data);
    }
  }

  async getSearchConfig(): Promise<any> {
    // This method fetches the search configuration from the server.
    if (!this.searchConfig) {
      const baseUrl = this.configSrv.sitePath;
      this.searchConfig = await this.http.get<any>(`${baseUrl}/feature/search-listing.json`).toPromise();
    }
    return of(this.searchConfig).toPromise();
  }

  searchCoursesv4(params: SearchV4Request): Promise<any> {
    // This method is used to search courses using the v4 API.
    return this.http.post(API_END_POINTS.SEARCH_V4, params).toPromise();
  }

  searchConnections(params: SearchPeoplesRequest): Promise<any> {
    // This method is used to search for people connections.
    return this.http.post(API_END_POINTS.SEARCH_PEOPLE, { request: params }).toPromise();
  }

  searchCommunity(params: SearchCommunitiesRequest): Promise<any> {
    // This method is used to search for communities.
    return this.http.post(API_END_POINTS.SEARCH_COMMUNITY, params).toPromise();
  }

  searchResource(params: SearchV4Request): Promise<any> {
    // This method is used to search resources.
    return this.http.post(API_END_POINTS.SEARCH_V6, params).toPromise();
  }

  nlpSearch(params: SearchNLP): Promise<any> {
    // This method is used to perform NLP-based search.
    return this.http.post(API_END_POINTS.SEARCH_NLP, params).toPromise();
  }

  recentCreate(req: any): Promise<any> {
    // This method is used to create a recent search entry.
    return this.http.post(API_END_POINTS.RECENT_CREATE, req).toPromise();
  }
  recentRead() {
    // This method is used to read recent search entries.
    return this.http.get(API_END_POINTS.RECENT_READ);
  }

  recentDeleteByUser() {
    // This method is used to delete recent search entries by user ID.
    return this.http.delete(API_END_POINTS.RECENT_DELETE_BY_USERID);
  }
  recentDeleteByTime(id: any) {
    // This method is used to delete recent search entries by timestamp.
    return this.http.delete(API_END_POINTS.RECENT_DELETE_BY_TIMESTAMP(id));
  }

  enrollment(request: any, userId: string): any {
    // This method is used to fetch enrollment data for a user.
    return this.http.post(API_END_POINTS.ENROLLMENT_API(userId), request);
  }

  searchExternalContent(params: SearchExternalRequest): Promise<any> {
    // This method is used to search for external content.
    return this.http.post(API_END_POINTS.SEARCH_EXT_CONTENT, params).toPromise();
  }
  searchUsersMDO(params: any): Promise<any> {
    // This method is used to search for users in the MDO.
    return this.http.post(API_END_POINTS.SEARCH_USERS, params).toPromise();
  }

  searchTrainingPlans(params: SearchTrainingPlansRequest): Promise<any> {
    // This method is used to search for training plans.
    return this.http.post(API_END_POINTS.SEARCH_TRAINING_PLANS, params).toPromise();
  }

  downloadCertificate_v2(id: string): Observable<any> {
    // This method is used to download a certificate by its ID.
    return this.http.get(`${API_END_POINTS.DOWNLOAD_CERTIFICATE_v2(id)}`);
  }

  fetchCbpPlanList() {
    // This method is used to fetch the list of CBP plans.
    if (this.checkStorageData("cbpService", "cbpData")) {
      const result: any = this.http.get(API_END_POINTS.FETCH_CPB_PLANS).pipe(
        catchError(this.handleError),
        map(async (data: any) => {
          return await this.mapData(data.result);
        })
      );
      this.setTime("cbpService");
      return result;
    }
    return this.getData("cbpData");
  }

  getData(key: any): Observable<any> {
    return of(JSON.parse(localStorage.getItem(key) || "{}"));
  }

  setTime(key: any) {
    const checkTime = localStorage.getItem("timeCheck");
    if (checkTime) {
      const parsedData = JSON.parse(checkTime);
      parsedData[key] = new Date().getTime();
      localStorage.setItem("timeCheck", JSON.stringify(parsedData));
    } else {
      const data: any = {};
      data[key] = new Date().getTime();
      localStorage.setItem("timeCheck", JSON.stringify(data));
    }
  }

  checkStorageData(key: any, dataKey: any): boolean {
    const checkTime = localStorage.getItem("timeCheck");
    if (checkTime) {
      const parsedData: { [key: string]: string } = JSON.parse(checkTime);
      if (parsedData[key]) {
        const storedTime = new Date(parsedData[key]);
        // Check if storedTime is a valid Date
        if (!isNaN(storedTime.getTime())) {
          const now = new Date();
          const diffMin = Math.floor((now.getTime() - storedTime.getTime()) / (1000 * 60));
          const timeCheck = this.environment?.apiCache || 0;
          if (diffMin >= timeCheck) {
            return true;
          }
          return localStorage.getItem(dataKey) ? false : true;
        }
      }
      return true;
    }
    return true;
  }

  async mapData(this: any, data: any): Promise<any[]> {
    const contentNew: any[] = [];
    const todayDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const enrollList: { [key: string]: any } = JSON.parse(localStorage.getItem("enrollmentMapData") || "{}");

    if (data && data.count) {
      data.content.forEach((c: any) => {
        c.contentList.forEach((childData: any) => {
          const childEnrollData = enrollList[childData.identifier];
          const endDate = new Date(c.endDate).toISOString().split("T")[0]; // Format as YYYY-MM-DD
          const daysCount = Math.floor((new Date(endDate).getTime() - new Date(todayDate).getTime()) / (1000 * 60 * 60 * 24));
          childData["planDuration"] = daysCount < 0 ? ACBPConst.OVERDUE : daysCount > 29 ? ACBPConst.SUCCESS : ACBPConst.UPCOMING;
          childData["endDate"] = c.endDate;
          childData["parentId"] = c.id;
          childData["planType"] = "cbPlan";
          if (childData.status !== IGOTConst.RETIRED) {
            contentNew.push(childData);
          } else {
            if (childEnrollData && childEnrollData.status === 2) {
              contentNew.push(childData);
            }
          }

          const competencyArea: string[] = [];
          const competencyTheme: string[] = [];
          const competencyThemeType: string[] = [];
          const competencySubTheme: string[] = [];
          const competencyAreaId: string[] = [];
          const competencyThemeId: string[] = [];
          const competencySubThemeId: string[] = [];
          childData["contentStatus"] = 0;
          if (childEnrollData) {
            childData["contentStatus"] = childEnrollData.status;
          }
          if (childData[this.compentencyKey]) {
            childData[this.compentencyKey].forEach((element: any) => {
              if (!competencyArea.includes(element.competencyArea)) {
                competencyArea.push(element.competencyArea);
                competencyAreaId.push(element.competencyAreaId);
              }
              if (!competencyTheme.includes(element.competencyTheme)) {
                competencyTheme.push(element.competencyTheme);
                competencyThemeId.push(element.competencyThemeId);
              }
              if (!competencyThemeType.includes(element.competencyThemeType)) {
                competencyThemeType.push(element.competencyThemeType);
              }
              if (!competencySubTheme.includes(element.competencySubTheme)) {
                competencySubTheme.push(element.competencySubTheme);
                competencySubThemeId.push(element.competencySubThemeId);
              }
            });
          }

          childData["competencyArea"] = competencyArea;
          childData["competencyTheme"] = competencyTheme;
          childData["competencyThemeType"] = competencyThemeType;
          childData["competencySubTheme"] = competencySubTheme;
          childData["competencyAreaId"] = competencyAreaId;
          childData["competencyThemeId"] = competencyThemeId;
          childData["competencySubThemeId"] = competencySubThemeId;
        });
      });

      if (contentNew.length > 1) {
        const sortedData = contentNew.sort((a: any, b: any) => {
          const firstDate = new Date(a.endDate);
          const secondDate = new Date(b.endDate);
          return secondDate > firstDate ? 1 : -1;
        });
        const uniqueUsersByID = lodash.uniqBy(sortedData, "identifier");
        const sortedByEndDate = lodash.orderBy(uniqueUsersByID, ["endDate"], ["asc"]);
        const sortedByStatus = lodash.orderBy(sortedByEndDate, ["contentStatus"], ["asc"]);
        localStorage.setItem("cbpData", JSON.stringify(sortedByStatus));
        return sortedByStatus;
      }
      localStorage.setItem("cbpData", JSON.stringify(contentNew));
      return contentNew;
    }
    localStorage.setItem("cbpData", JSON.stringify([]));
    return [];
  }

  searchDesignationV4(params: SearchDesignationRequest): Promise<any> {
    // This method is used to search courses using the v4 API.
    return this.http.post(API_END_POINTS.SEARCH_V4, params).toPromise();
  }

  blockUser(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.BLOCK_USER, request)
  }

  unblockUser(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UNBLOCK_USER, request)
  }

  getCourseDetails(contentId: string, mode: string, primaryCategory?: string): Observable<any> {
    if (primaryCategory === 'Learning Resource') {
      return this.http.get<any>(`${API_END_POINTS.CONTENT_READ}${contentId}`);
    } else if (mode) {
      return this.http.get<any>(`${API_END_POINTS.CONTENT_GET}${contentId}?mode=${mode}`);
    }
    return this.http.get<any>(`${API_END_POINTS.CONTENT_GET}${contentId}`);
  }
}
