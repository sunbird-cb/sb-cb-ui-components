import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { map, retry } from 'rxjs/operators'
import * as _ from 'lodash'
import { Router } from '@angular/router'
import moment from 'moment'
import { NsContent } from './widget-content.model'
const API_END_POINTS = {
  NOTIFICATIONS_COUNT: `apis/proxies/v8/v1/notifications/unread/count`,
  RESET_NOTIFICATIONS_COUNT: `apis/proxies/v8/v1/notifications/reset/unread/count`,
  CONTENT_READ: (contentId: any) => `/apis/proxies/v8/action/content/v3/read/${contentId}`,
  CONNECTION_REQUEST: (pageNo: any, pageSize: any) => `apis/protected/v8/connections/v2/connections/requests/received?pageNo=${pageNo}&pageSize=${pageSize}`,
}

@Injectable({
  providedIn: 'root',
})

export class NotificationsService {
  closeDialogPop = new Subject()
  nofificationsCount = new Subject()
  constructor(private http: HttpClient, private router: Router,) { }

  getNotificationsData(): Observable<any> {
    return this.http.get(API_END_POINTS.NOTIFICATIONS_COUNT)
  }

  resetNotificationsCount(): Observable<any> {
    return this.http.get(API_END_POINTS.RESET_NOTIFICATIONS_COUNT, {})
  }

  getContentData(contentId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.CONTENT_READ(contentId)}`).pipe(
      map((data: any) => {
        return data.result.content
      }),
      retry(1))
  }

  handleReviewStatus(res: any, notification: any, roles: string[], snackBar: any): void {
    switch (res.reviewStatus) {
      case 'InReview': {
        if (roles.includes('CONTENT_REVIEWER')) {
          if (res.courseCategory === NsContent.ECourseCategory.MULTILINGUAL_COURSE) {
            const baseContent: any = Object.values(res.languageMapV1 || {}).find((item: any) => item.isBaseLang)
            this.router.navigate(['/author/editor/multilingual', 'edit', baseContent.id], {
              queryParams: {
                langEditId: res.identifier
              }
            })
          } else {
            this.router.navigate([`/author/editor/${notification.message.data.id}/collectionV2`], {
              queryParams: {
                preview: true, editMode: true,
                status: 'Review',
                reviewStatus: res.reviewStatus
              }
            })
          }
        } else {
          snackBar.open("You are not authorized to view this content.")
        }
        break
      } case 'Reviewed': {
        if (roles.includes('CONTENT_PUBLISHER')) {
          if (res.courseCategory === NsContent.ECourseCategory.MULTILINGUAL_COURSE) {
            const baseContent: any = Object.values(res.languageMapV1 || {}).find((item: any) => item.isBaseLang)
            this.router.navigate(['/author/editor/multilingual', 'edit', baseContent.id], {
              queryParams: {
                langEditId: res.identifier
              }
            })
          } else {
            this.router.navigate([`/author/editor/${notification.message.data.id}/collectionV2`])
          }
        } else {
          snackBar.open("You are not authorized to view this content.")
        }
        break
      }
    }
  }

  handleEventRedirection(notification: any, environment: any): void {
    if (notification.sub_category === 'EVENT_PUBLISHED') {
      let url = `${environment.portalsForNotifications.learner}/app/event-hub/home/${notification.message.data.id}`
      window.open(url, '_blank')
    } else if (notification.sub_category === 'EVENT_ENROLLED') {
      let url = `${environment.portalsForNotifications.mdo}/app/home/events`
      window.open(url, '_blank')
    }
  }

  handleDiscussionRedirection(notification: any, environment: any, roles: any[]): void {
    if (notification.sub_category === 'LEARN_DISCUSSION_POST_COMMENT' || notification.sub_category === 'LEARN_DISCUSSION_POST_REPLY') {
      if (roles.includes('CONTENT_CREATOR')) {
        this.router.navigate([`/author/content-detail/${notification.message.data.id}/overview-v2`],
          {
            queryParams: {
              preview: true,
              editMode: true,
              commentId: notification.message.data.commentId
            }
          }
        )
      } else {
        let url = `${environment.portalsForNotifications.learner}/app/toc/${notification.message.data.id}?commentId=${notification.message.data.commentId}`
        window.open(url, '_blank')
      }
    } else {
      let url = `${environment.portalsForNotifications.learner}/app/discussion-forum-v2/community/${notification.message.data.communityId}/${notification.message.data.discussionId}`
      window.open(url, '_blank')
    }
  }

  getMyRequests(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.CONNECTION_REQUEST(0, 100)}`).pipe(
      map((data: any) => {
        return data.result.data
      }),
      retry(1))
  }

  handleNetworkRedirection(notification: any, environment: any, snackBar: any): void {
    if (notification.sub_category === 'REJECTED_CONNECTION_REQUEST') {
      snackBar.open('This request has been resolved or is no longer available.')
    } else if (notification.sub_category === 'SEND_CONNECTION_REQUEST') {
      this.getMyRequests().subscribe((res: any) => {
        if (res && res.length) {
          const connection = res.find((item: any) => item.userId === notification.message.data.id)
          if (connection) {
            let url = `${environment.portalsForNotifications.learner}/app/network-v2/connections`
            window.open(url, '_blank')
          } else {
            snackBar.open('This request has been resolved or is no longer available.')
          }
        } else {
          snackBar.open('This request has been resolved or is no longer available.')
        }
      })
    } else {
      let url = `${environment.portalsForNotifications.learner}/app/network-v2/connections`
      window.open(url, '_blank')
    }
  }

  handleTocRedirection(notification: any, environment: any, snackBar: any): void {
    if (notification.sub_category === 'CONTENT_RETIRE') {
      if (notification.message.data.retiredDate) {
        const retireOn = moment(notification.message.data.retiredDate).format('MMMM D, YYYY')
        const today = moment().format('MMMM D, YYYY')
        if (moment(retireOn).isSameOrAfter(today)) {
          let url = `${environment.portalsForNotifications.learner}/app/toc/${notification.message.data.id}`
          window.open(url, '_blank')
        } else {
          snackBar.open(`This content is scheduled to be retired on ${retireOn}. You can not access it now.`)
        }
      } else {
        snackBar.open('Something went wrong. Please try again later.')
      }
    } else if (notification.sub_category === 'CONTENT_RETIRED') {
      snackBar.open(`This content is retired. You can not access it now.`)
    } else {
      let url = `${environment.portalsForNotifications.learner}/app/toc/${notification.message.data.id}`
      window.open(url, '_blank')
    }
  }

  handleRedirection(notification: any, environment: any, roles: any[], snackBar: any): void {
    if (notification?.category?.includes('CONTENT')) {
      if (['RETIRE_SCHEDULED', 'RETIRE_APPROVED', 'RETIRE_REJECTED'].includes(notification.sub_category)) {
        this.router.navigate([`author/cbp/me`],
          {
            queryParams: { status: 'live' }
          }
        )
      } else {
        this.getContentData(notification.message.data.id).subscribe((res: any) => {
          if (res) {
            if (res.primaryCategory === 'Learning Resource' &&
              res.resourceCategory !== 'Learning Resource') {
              localStorage.setItem('isStandaloneResource', 'true')
            } else {
              localStorage.setItem('isStandaloneResource', 'false')
            }
            if (res.status === 'Live') {
              if (notification.sub_category === 'BP_ASSIGNMENT_SUBMIT' || notification.sub_category === 'BP_ADD_INSTRUCTOR') {
                this.router.navigate([`/author/content-detail/${notification.message.data.id}/batches/${notification.message.data.batchId}/assignments`])
              } else {
                this.router.navigate([`/author/content-detail/${notification.message.data.id}/overview-v2`])
              }
            } else if (res.status === 'Draft') {
              if (roles.includes('CONTENT_CREATOR')) {
                this.router.navigate([`/author/editor/${notification.message.data.id}/collectionV2`])
              } else {
                snackBar.open('You are not authorized to view this content.')
              }
            } else if (res.status === 'Review') {
              this.handleReviewStatus(res, notification, roles, snackBar)
            } else if (res.status === 'Retired') {
              snackBar.open('This content is retired.')
            }
          } else {
            snackBar.open('Something went wrong')
          }
        })
      }

    } else if (notification.category === 'LEARN') {
      this.handleTocRedirection(notification, environment, snackBar)
    } else if (notification.category === 'EVENT') {
      this.handleEventRedirection(notification, environment)
    } else if (notification.category === 'DISCUSSION') {
      this.handleDiscussionRedirection(notification, environment, roles)
    } else if (notification.category === 'NETWORK') {
      this.handleNetworkRedirection(notification, environment, snackBar)
    } else {
      snackBar.open('Something went wrong')
    }
  }


}
