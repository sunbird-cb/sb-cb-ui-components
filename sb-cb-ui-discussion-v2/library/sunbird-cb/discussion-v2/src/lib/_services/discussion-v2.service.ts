import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  FETCH_ALL_COMMENTS: (entityType: string, entityId: string, workflow: string) =>
    `/apis/proxies/v8/comment/v1/getAll?entityType=${entityType}&entityId=${entityId}&workflow=${workflow}`,
  FETCH_ALL_COMMENTS_V2: `/apis/proxies/v8/comment/search`,
  ADD_FIRST_COMMENT: `/apis/proxies/v8/comment/v1/addFirst`,
  ADD_NEW_COMMENT: '/apis/proxies/v8/comment/v1/addNew',
  LIST_COMMENT: '/apis/proxies/v8/comment/list',
  LIKE_UNLIKE_COMMENT: '/apis/proxies/v8/comment/v1/like',
  CHCECK_IF_LIKED_UNLIKED: (commentId: string, userId: string) =>
    `/apis/proxies/v8/comment/v1/like/read?commentId=${commentId}&userId=${userId}`,
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

  fetchAllComment_V2(payload: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.FETCH_ALL_COMMENTS_V2}`, payload)
  }

  addFirstComment(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.ADD_FIRST_COMMENT, req)
  }

  addNewComment(req: any) {
    return this.http.post(API_END_POINTS.ADD_NEW_COMMENT, req)
  }

  getListOfCommentsById(payload: string[]): Observable<any> {
    return this.http.post<any>(API_END_POINTS.LIST_COMMENT, payload)
  }

  likeUnlikeComment(payload: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.LIKE_UNLIKE_COMMENT, payload)

  }

  checkIfUserlikedUnlikedComment(commentId: string, userId: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.CHCECK_IF_LIKED_UNLIKED(commentId, userId))

  }
}
