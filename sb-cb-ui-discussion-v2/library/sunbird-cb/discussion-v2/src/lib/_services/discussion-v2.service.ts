import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  FETCH_ALL_COMMENTS: (entityType: string, entityId: string, workflow: string) =>
    `/apis/proxies/v8/comment/v1/getAll?entityType=${entityType}&entityId=${entityId}&workflow=${workflow}`,
  ADD_FIRST_COMMENT: `/apis/proxies/v8/comment/v1/addFirst`,
  ADD_NEW_COMMENT: '/apis/proxies/v8/comment/v1/addNew',
}

@Injectable({
  providedIn: 'root',
})
export class DiscussionV2Service {
  baseUrl = this.configSvc.sitePath

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  fetchAllComment(entityType: string, entityId: string, workflow: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.FETCH_ALL_COMMENTS(entityType, entityId, workflow)}`)
  }

  addFirstComment(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.ADD_FIRST_COMMENT, req)
  }

  addNewComment(req: any) {
    return this.http.post(API_END_POINTS.ADD_NEW_COMMENT, req)
  }
}
