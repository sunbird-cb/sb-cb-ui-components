import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash'
import { map } from 'rxjs/operators';

const API_END_POINTS = {
  GET_GROUPS: '/api/user/v1/groups',
  PROFILE_REGISTRY_V1: '/apis/proxies/v8/api/user/v2/read/',
  GET_ALL_ROLES: '/apis/proxies/v8/data/v1/system/settings/get/orgTypeList',
  GET_SUNBIRD_IGOT_SEARCH: '/apis/proxies/v8/sunbirdigot/v4/search',
  GET_SEARCH_DESIGNATIONS: '/apis/proxies/v8/designation/search',
  PROFILEAPPROVALSLIST: '/apis/protected/v8/workflowhandler/profileApprovalSearch',
  UPDATE_USER_DETAILS: '/apis/proxies/v8/user/v1/admin/extPatch',
  ADD_USER_ROLE: '/apis/proxies/v8/user/private/v1/assign/role',
  GET_MASTER_LANGUAGES: '/apis/protected/v8/user/profileRegistry/getMasterLanguages',
  WORKFLOW_HANDLER_V2: '/apis/protected/v8/workflowhandler/v2/transition'
}
@Injectable({
  providedIn: "root",
})
export class UserService {

  constructor(private http: HttpClient) { }

  getGroups(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_GROUPS)
  }

  getUserById(userid: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.PROFILE_REGISTRY_V1 + userid).pipe(map(resp => _.get(resp, 'result.response')))
  }

  getApprovalsList(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.PROFILEAPPROVALSLIST, request)
  }

  getAllRoles(): Observable<any> {
    return this.http.get(API_END_POINTS.GET_ALL_ROLES)
  }

  searchIgotDesignation(_req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_SUNBIRD_IGOT_SEARCH, _req)
  }

  searchDesignation(_req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_SEARCH_DESIGNATIONS, _req)
  }

  updateUserDetails(reqBody: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_USER_DETAILS}`, reqBody)
  }

  addUserToRole(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.ADD_USER_ROLE}`, req)
  }

  handleWorkflowV2(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.WORKFLOW_HANDLER_V2, request)
  }

  getMasterLanguages(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_MASTER_LANGUAGES)
  }


}
