import { Component, Input, OnInit } from '@angular/core';
import { DiscussionV2Service } from '../../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
// tslint:disable-next-line
import _ from 'lodash'

@Component({
  selector: 'd-v2-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.scss']
})
export class BookmarkListComponent implements OnInit{
  @Input() communityData: any
  @Input() widgetData: any
  @Input() communityId: any
  @Input() userJoinedCommunity: boolean = false
  page: any = 0
  pageSize: any = 10
  totalNumberOfBookmarksCount: any = 0

  bookmarkPosts: any = []
  constructor(private discussV2Svc: DiscussionV2Service, private _snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
    this.getBookmarkData()
  }

  getBookmarkData() { 
    let request : any = {
      "communityId": this.communityId,
    "page" : this.page,
      "pageSize" :  this.pageSize
    }
    this.discussV2Svc.getBookmarkDataList(request).subscribe((res: any) => {
      if(res && res.result && res.result.search_results 
        && res.result.search_results.data 
        && res.result.search_results.data.length) {
          const postsData = _.get(res, 'result.search_results.data') || []
      
          this.enrichData(postsData).subscribe(
            () => {
              let newData = postsData
              this.bookmarkPosts = [...this.bookmarkPosts, ...newData]
              this.totalNumberOfBookmarksCount = res.result.search_results.totalCount
            },
            () => {
              // On enrichData failure, fallback to original posts
              let newData = res.result.search_results.data.map((v: any) => ({...v, bookmark: true}))
              this.bookmarkPosts = [...this.bookmarkPosts, ...newData]
              this.totalNumberOfBookmarksCount = res.result.search_results.totalCount
            }
          )
      }
    })
  }
  loadMoreMembers(){
    if( !(this.bookmarkPosts.length >= this.totalNumberOfBookmarksCount)) {
      this.page = this.page + 1
      this.getBookmarkData()
    }
  }

  enrichData(posts: any) {
    const req = {
      request: {
        communityFilters: [{
          communityId: (this.communityData && this.communityData.communityId) || '',
          identifier: posts.map((post: any) => post.discussionId),
        }],
        "requestType": "question",
        "filters": [
          "likes",
          "bookmarks",
          "reported"
        ]
      }
    }
    return this.discussV2Svc.enrichData(req).pipe(
      map((res: any) => {
        const enrichedData = _.get(res, 'result.search_results')
        if (enrichedData) {
          posts.forEach((post: any) => {
            post.isLiked = enrichedData.likes[post.discussionId] || false
            post.isBookmarked = enrichedData.bookmarks[post.discussionId] || false
            post.isReported = enrichedData.reported[post.discussionId] || false
          })
        }
        return posts
      })
    )
  }

  bookmarkEvent(event: any) {
    this.unbookmarkPost(event.post)
  }
  unbookmarkPost(post: any) {
    const communityId = post.communityId
    const discussionId = post.discussionId
    this.discussV2Svc.UnBookmarkPost(communityId, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open('Post un-bookmarked successffuly!')
        const post = this.bookmarkPosts.find((comm: any) => comm.discussionId === discussionId)
        post.bookmark = false
        const postIndex = this.bookmarkPosts.findIndex((comm: any) => comm.discussionId === discussionId)
        this.bookmarkPosts.splice(postIndex, 1)
        this.totalNumberOfBookmarksCount =  this.totalNumberOfBookmarksCount-1
      }
    })
  }

  likeUnlikeEvent(event: any) {
    if(event && event.isLiked) {
      this.downVotePost('dislike', event.type, event.discussionId)
    } else {
      this.upVotePost('like', event.type, event.discussionId)
    }
  }

  upVotePost(flag: string, type: string,  discussionId: string) {
    this.discussV2Svc.upVotePost(type, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const post = this.bookmarkPosts.find((comm: any) => comm.discussionId === discussionId)
        if (flag === 'like') {
          post.upVoteCount = post.upVoteCount ? post.upVoteCount + 1 : 1
          // this.userLikedComments.push(commentId)
        } else {
          post.downVoteCount = post.downVoteCount? post.downVoteCount + 1 : 1
          // const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          // this.userLikedComments.splice(index, 1)
        }
      }
    })
  }

  downVotePost(flag: string, type: string, discussionId: string) {
    this.discussV2Svc.downVotePost(type, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const post = this.bookmarkPosts.find((comm: any) => comm.discussionId === discussionId)
        if (flag === 'like') {
          post.upVoteCount = post.upVoteCount ? post.upVoteCount + 1 : 1
          // this.userLikedComments.push(commentId)
        } else {
          post.upVoteCount = post.upVoteCount? post.upVoteCount - 1 : 0
          // const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          // this.userLikedComments.splice(index, 1)
        }
      }
    })
  }

  newCommentEvent(event: any){
    if(event && event.type === 'question'){
      this.getBookmarkData()
    }
  }

}
