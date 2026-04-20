import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const API_END_POINTS = {
  USER_ALL_ENROLL_EVENT_LIST: (userId: string) => `/apis/proxies/v8/user/events/v2/list/${userId}`
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  getUserEnrollEvents(userId: string, req: any) {
    return this.http.post<any>(`${API_END_POINTS.USER_ALL_ENROLL_EVENT_LIST(userId)}`, req)
  }
}
