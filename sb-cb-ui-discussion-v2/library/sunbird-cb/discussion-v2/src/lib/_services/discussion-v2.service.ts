import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  CREATE_POST: `/apis/proxies/v8/feedDiscussion/create`,
  CREATE_ANSWER_POST: `/apis/proxies/v8/feedDiscussion/answerPosts`,
  CREATE_ANSWER_POST_REPLY: `/apis/proxies/v8/feedDiscussion/answerPostReply/create`,
  READ_POST: (id: string) => `/apis/proxies/v8/feedDiscussion/read/${id}`,
  UPDATE_POST: `/apis/proxies/v8/feedDiscussion/update`,
  UPDATE_ANSWER_POST: `/apis/proxies/v8/feedDiscussion/updateAnswerPost`,
  UPDATE_ANSWER_POST_REPLY: `/apis/proxies/v8/feedDiscussion/answerPostReply/update`,
  SEARCH_POSTS: `/apis/proxies/v8/feedDiscussion/search`,
  FEED_POSTS: `/apis/proxies/v8/feedDiscussion/communityFeed`,
  UP_VOTE: (type: string, id: string) => `/apis/proxies/v8/feedDiscussion/${type}/like/${id}`,
  DOWN_VOTE: (type: string, id: string) => `/apis/proxies/v8/feedDiscussion/${type}/dislike/${id}`,
  DELETE_POST: (type: string, id: string) => `/apis/proxies/v8/feedDiscussion/${type}/delete/${id}`,
  REPORT_POST: `/apis/proxies/v8/feedDiscussion/report`,
  BOOKMARK_POST: (communityId: string, discussionId: string) => `/apis/proxies/v8/feedDiscussion/bookmark/${communityId}/${discussionId}`,
  UN_BOOKMARK_POST: (communityId: string, discussionId: string) => `/apis/proxies/v8/feedDiscussion/unbookmark/${communityId}/${discussionId}`,
  FLAG_LIST: `/apis/proxies/v8/data/v2/system/settings/get/commentReportReasonConfig`,
  DISCUSS_FLAG_LIST: `/apis/proxies/v8/data/v2/system/settings/get/discussionReportReasonConfig`,
  UPLOAD_FILE: (communityId: string, discussionId: string) => `/apis/proxies/v8/feedDiscussion/uploadFile/${communityId}/${discussionId}`,
  COMMUNITY_JOIN: `/apis/proxies/v8/community/v1/join`,
  COMMUNITY_UNJOIN: `apis/proxies/v8/community/v1/unjoin`,
  COMMUNITY_READ: (id: string) => `/apis/proxies/v8/community/v1/read/${id}`,
  COMMUNITY_SEARCH: `/apis/proxies/v8/community/v1/search`,
  COMMUNITY_USER_LIST: `/apis/proxies/v8/community/v1/community/listuser`,
  USERS_COMMUNITY_LIST: `/apis/proxies/v8/community/v1/user/communities`,
  TOPIC_WISE_COMMUNITIES: `/apis/proxies/v8/community/v1/category/listAll`,
  BOOKMART_LIST: `/apis/proxies/v8/feedDiscussion/bookmarkedDiscussions`,
  COMMUNITY_REPORT: `/apis/proxies/v8/community/v1/report`,
  USER_SEARCH: `/apis/proxies/v8/user/v1/search`,
  POPULAR_COMMUNITY: `/apis/proxies/v8/community/v1/popular`,
  GLOBAL_FEED: `/apis/proxies/v8/feedDiscussion/globalFeed`,
  ENRICH_DATA: `/apis/proxies/v8/feedDiscussion/v1/enrichData`,
  SEARCH_USERS: '/apis/proxies/v8/user/v1/search',
}


@Injectable({
  providedIn: 'root',
})
export class DiscussionV2Service {
  baseUrl = this.configSvc.sitePath
  enrolledContent: boolean = false
  entityId: string = ''
  entityType: string = ''
  workflow: string = ''
  commentTreeId: string = ''
  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  createPost(req: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_POST}`, req)
  }

  createAnswerPost(req: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ANSWER_POST}`, req)
  }

  createAnswerPostReply(req: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ANSWER_POST_REPLY}`, req)
  }

  readPost(id: string) {
    return this.http.get<any>(`${API_END_POINTS.READ_POST(id)}`)
  }

  updatePost(req: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_POST}`, req)
  }

  updateAnswerPost(req: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_ANSWER_POST}`, req)
  }

  updateAnswerPostReply(req: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_ANSWER_POST_REPLY}`, req)
  }

  searchPosts(req: any) {
    return this.http.post<any>(`${API_END_POINTS.SEARCH_POSTS}`, req)
  }

  feedPosts(req: any) {
    return this.http.post<any>(`${API_END_POINTS.FEED_POSTS}`, req)
  }

  upVotePost(type: string, id: string) {
    return this.http.post<any>(`${API_END_POINTS.UP_VOTE(type, id)}`, {})
  }

  downVotePost(type: string, id: string) {
    return this.http.post<any>(`${API_END_POINTS.DOWN_VOTE(type, id)}`, {})
  }

  deletePost(type: string, id: string) {
    return this.http.delete<any>(`${API_END_POINTS.DELETE_POST(type, id)}`)
  }

  fetchAllFlags(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.DISCUSS_FLAG_LIST}`)
  }
  communityFlag(request: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.COMMUNITY_REPORT}`, request)
  }

  reportPost(requestData: any) {
    return this.http.post<any>(`${API_END_POINTS.REPORT_POST}`, requestData)
  }

  bookmarkPost(communityId: string, discussionId: string) {
    return this.http.get<any>(`${API_END_POINTS.BOOKMARK_POST(communityId, discussionId)}`)
  }

  UnBookmarkPost(communityId: string, discussionId: string) {
    return this.http.post<any>(`${API_END_POINTS.UN_BOOKMARK_POST(communityId, discussionId)}`, {})
  }

  uploadFile(req: any, communityId: string, discussionId: string): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.UPLOAD_FILE(communityId, discussionId)}`, req)
  }

  communityJoin(req: any) {
    return this.http.put<any>(`${API_END_POINTS.COMMUNITY_JOIN}`, req)
  }

  communityUnjoin(req: any) {
    return this.http.put<any>(`${API_END_POINTS.COMMUNITY_UNJOIN}`, req)
  }

  communityDetailRead(communityId: any) {
    return this.http.get<any>(`${API_END_POINTS.COMMUNITY_READ(communityId)}`)
  }

  communityUserList(requestData: any) {
    return this.http.post<any>(`${API_END_POINTS.COMMUNITY_USER_LIST}`, requestData)
  }

  usersJoinedCommunityList() {
    return this.http.get<any>(`${API_END_POINTS.USERS_COMMUNITY_LIST}`)
  }

  communitySearch(req: any) {
    return this.http.post<any>(`${API_END_POINTS.COMMUNITY_SEARCH}`, req)
  }

  topicWiseCommunities() {
    return this.http.get<any>(`${API_END_POINTS.TOPIC_WISE_COMMUNITIES}`)
  }

  getBookmarkDataList(req: any) {
    return this.http.post<any>(`${API_END_POINTS.BOOKMART_LIST}`, req)
  }

  getGlobalFeed(req: any) {
    return this.http.post<any>(`${API_END_POINTS.GLOBAL_FEED}`, req)
  }

  enrichData(req: any) {
    return this.http.post<any>(`${API_END_POINTS.ENRICH_DATA}`, req)
  }

  convertOrgArrayToObject(data: any) {
    return data.reduce((acc: any, item: any) => {
      acc[item.id] = item
      return acc
    }, {})
  }

  /**
   * Searches for users based on the request parameters.
   * @param req - The request object containing search parameters.
   * @returns An observable containing the search results.
   */
  userSearch(req: any) {
    // Make a POST request to the USER_SEARCH endpoint with the request data
    return this.http.post<any>(`${API_END_POINTS.USER_SEARCH}`, req)
  }

  getPosts(req: any, type: any) {
    let requestUrl = type === 'Feeds' ? API_END_POINTS.FEED_POSTS : API_END_POINTS.SEARCH_POSTS
    return this.http.post<any>(`${requestUrl}`, req)
  }

  /**
   * Retrieves the popular communities based on the request parameters.
   * @param req - The request object containing search parameters.
   * @returns An observable containing the popular communities.
   */
  popularCommunity(req: any) {
    // Make a POST request to the POPULAR_COMMUNITY endpoint with the request data
    return this.http.post<any>(`${API_END_POINTS.POPULAR_COMMUNITY}`, req)
  }


  searchUsers(value: string): Observable<any> {
    const reqBody = {
      request: {
        query: value,
        filters: {
          status: 1,
        },
      },
    }
    return this.http.post<any>(`${API_END_POINTS.SEARCH_USERS}`, reqBody)
  }

}






