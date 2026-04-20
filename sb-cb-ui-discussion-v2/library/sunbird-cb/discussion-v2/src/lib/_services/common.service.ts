import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_END_POINTS = {
  SEARCH_USERS: '/apis/proxies/v8/user/v1/search',
  SHARE_CONTENT: '/apis/proxies/v8/user/v1/content/recommend',
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }
  searchUser(value: string, rootOrgId: string) {
    const reqBody = {
      request: {
        query: value,
        filters: {
          rootOrgId,
        },
      },
    }

    return this.http.post<any>(`${API_END_POINTS.SEARCH_USERS}`, reqBody)
  }


  shareContent(reqBody: any) {
    return this.http.post<any>(`${API_END_POINTS.SHARE_CONTENT}`, reqBody)
  }
}
