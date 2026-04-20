import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_USERS: `apis/proxies/v8/user/v1/search`,
  CREATE_REQUEST_FORM: `/apis/proxies/v8/demand/content/create`,
  GET_LANGUAGES: `apis/v1/form/read`,
  GET_REQUEST_DATA_BYID: 'apis/proxies/v8/demand/content/read',
  GET_REQUEST_TYPE_LIST: '/apis/proxies/v8/org/v1/search',
}

@Injectable({
  providedIn: 'root'
})
export class CreateRequestService {

  constructor(
    private http: HttpClient,
  ) { }

  getUsers(req: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_USERS}`, req)
  }

  createRequestForm(req: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_REQUEST_FORM}`, req)
  }

  getLanguages(req: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_LANGUAGES}`, req)
  }

  getRequestDataById(demandId: any) {
    return this.http.get<any>(`${API_END_POINTS.GET_REQUEST_DATA_BYID}/${demandId}`).pipe(map(res => _.get(res, 'result.result')))
  }

  getRequestTypeList(request: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_REQUEST_TYPE_LIST}`, request).pipe(map(res => _.get(res, 'result.response.content')))
  }
}
