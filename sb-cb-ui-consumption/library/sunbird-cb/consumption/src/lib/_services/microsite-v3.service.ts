import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const API_END_POINTS = {
  ORG_UPLOAD_FILE: 'apis/proxies/v8/storage/orgStoreUpload',
  CONTENT_SEARCH: 'apis/proxies/v8/sunbirdigot/v4/search',
  CREATE_PLAYLIST: 'apis/proxies/v8/playList/create',
  UPDATE_PLAYLIST: 'apis/proxies/v8/playList/update',
  READ_PLAYLIST: (playlistID: string, OrgId: string) => `apis/proxies/v8/playList/read/${playlistID}/${OrgId}`,
  UPDATE_MICROSITE: 'apis/v1/form/update',
  CREATE_MICROSITE: 'apis/v1/form/create',
  CREATE_ANNOUNCEMENTS: '/apis/proxies/v8/announcements/v1/create',
  READ_ANNOUNCEMENTS: (announceMentId: string) => `/apis/proxies/v8/announcements/v1/read/${announceMentId}`,
  UPDATE_ANNOUNCEMENTS: '/apis/proxies/v8/announcements/v1/update',
  DELETE_ANNOUNCEMENTS: (announceMentId: string) => `/apis/proxies/v8/announcements/v1/delete/${announceMentId}`,
  READ_ORGBOOKMARK: (bookmarkId: string) => `apis/proxies/v8/orgBookmark/v1/read/${bookmarkId}`,
  UPDATE_ORGBOOKMARK: `/apis/proxies/v8/orgBookmark/v1/update`,
}

@Injectable({
  providedIn: 'root'
})
export class MicrositeV3Service {

  constructor(
    private http: HttpClient,
    @Inject('environment') private environment: any
  ) { }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData()
    formData.append('file', file)
    return this.http.post<any>(`${API_END_POINTS.ORG_UPLOAD_FILE}`, formData)
      .pipe(
        map(response => {
          if (response.responseCode === 'OK' && response.result && response.result.url) {
            // Transform the URL
            return this.transformUrl(response.result.url)
          }
          throw new Error('Upload failed. Invalid response.')
        })
      )
  }

  private transformUrl(originalUrl: string): string {
    const googleStorageUrl = this.environment?.googleStorageUrl || ''
    const contentStoreUrl = `${this.environment?.mdoPath}/content-store` || ''

    return originalUrl.replace(googleStorageUrl, contentStoreUrl)
  }

  searchContent(requestBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CONTENT_SEARCH}`, requestBody)
  }

  getCreateSectionReq(nameValue: string, keyValue: string, enabledValue: boolean) {
    const req = {
      enabled: enabledValue,
      strips: [
        {
          active: true,
          key: keyValue,
          logo: 'school',
          title: nameValue,
          titleClass: 'mat-title',
          type: 'learningContent',
          disableTranslate: true,
          stripTitleLink: {
            link: '',
            icon: ''
          },
          sliderConfig: {
            showNavs: true,
            showDots: true,
            maxWidgets: 100,
            showNavsSpacing: true
          },
          stripBackground: '',
          titleDescription: 'For you',
          stripConfig: {
            cardSubType: 'card-portrait-lib',
            hideShowAll: true
          },
          viewMoreUrl: {},
          hideViewMoreUrl: true,
          loader: true,
          loaderConfig: {
            cardSubType: 'card-portrait-lib-skeleton'
          },
          tabs: [],
          filters: [],
          stripRequestType: 'post',
          stripRequestFor: 'search',
          onTabClickRequest: false,
          request: {}
        }
      ]
    }
    return req
  }

  createPlaylistApi(requestBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_PLAYLIST}`, requestBody)
  }

  readPlaylist(playlistID: string, OrgId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.READ_PLAYLIST(playlistID, OrgId)}`)
  }

  updatePlaylistApi(requestBody: any): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.UPDATE_PLAYLIST}`, requestBody)
  }

  readPlaylistWithURL(playlistURL: string): Observable<any> {
    return this.http.get<any>(playlistURL)
  }

  updateMicrosite(requestBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_MICROSITE}`, requestBody)
  }

  createMicrosite(requestBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_MICROSITE}`, requestBody)
  }

  createAnnouncements(requestBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ANNOUNCEMENTS}`, requestBody)
  }

  updateAnnouncements(requestBody: any): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.UPDATE_ANNOUNCEMENTS}`, requestBody)
  }

  deleteAnnouncements(announceMentId: string): Observable<any> {
    return this.http.delete<any>(`${API_END_POINTS.DELETE_ANNOUNCEMENTS(announceMentId)}`)
  }

  readAnnouncements(announceMentId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.READ_ANNOUNCEMENTS(announceMentId)}`)
  }

  readOrgBookmark(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.READ_ORGBOOKMARK(this.environment?.mdoChannelsBookmarkId)}`)
  }

  updateOrgBookmark(requestBody: any): Observable<any> {
    if (requestBody?.orgBookmarkId === '') {
      requestBody.orgBookmarkId = this.environment?.mdoChannelsBookmarkId
    }
    return this.http.post<any>(`${API_END_POINTS.UPDATE_ORGBOOKMARK}`, requestBody)
  }
}
