import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// tslint:disable-next-line
import _ from 'lodash'
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';
import { Router } from '@angular/router';

@Component({
  selector: 'd-v2-widget-postdetails',
  templateUrl: './widget-postdetails.component.html',
  styleUrls: ['./widget-postdetails.component.scss']
})
export class WidgetPostdetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() widgetData!: NsDiscussionV2.IPostDetailsWidget | null
  @Input() discussionId!: string
  loogedInUserProfile: any = {}
  loadingPosts = false
  pageNumber = 0
  commentListLimit = 5
  commentListOffSet = 0
  commentsLength = 0
  posts: any[] = []
  loadingMore = false
  searchResults: any
  userJoinedCommunityList: any = []
  userJoinedCommunity: any
  communityId: string = ''
  constructor(
    private configSvc: ConfigurationsService,
    private discussV2Svc: DiscussionV2Service,
    private _snackBar: MatSnackBar,
    private userEnrollSvc: UserEnrollCommunityService,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.discussionId) {
      if(this.discussionId) {
        this.fetchPosts()
      }
    }
  }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile

  }

  fetchPosts() {
    this.loadingPosts = true
    const req = {
      "filterCriteriaMap": {
        "type": "question",
        "discussionId": this.discussionId,
        isActive: true // this is to get only active posts, deleted posts won't be returned
      },
      "requestedFields": [],
      "pageNumber": this.commentListOffSet,
      "pageSize": this.commentListLimit,
      "orderBy": "createdOn",
      "orderDirection": "ASC",
      "facets": []
    }
    this.discussV2Svc.searchPosts(req).subscribe(res => {
      this.loadingPosts = false
      this.searchResults = _.get(res, 'result.search_results') || {}
      this.posts = _.get(res, 'result.search_results.data') || []
      this.communityId = this.posts[0].communityId
      this.getUserJoinedCommunityList()
    }, (err: any) => {
      this.loadingPosts = false
      this._snackBar.open('Something went wrong! please try reporting again later.')
      console.error(err)
    })
  }

  newCommentEvent(event: any) {
    if (event && event.type === 'question') {
      this.fetchPosts()
    }
  }

  likeUnlikeEvent(event: any) {
    // if(this.userLikedComments.includes(event.commentId)) {
    //   this.likeUnlikeCommentApi('dislike', event.commentId)
    // } else {
    this.upVotePost('like', event.type, event.discussionId)
    // }
  }

  upVotePost(flag: string, type: string, discussionId: string) {
    this.discussV2Svc.upVotePost(type, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const post = this.posts.find((comm: any) => comm.discussionId === discussionId)
        if (flag === 'like') {
          post.upVoteCount = post.upVoteCount ? post.upVoteCount + 1 : 1
          // this.userLikedComments.push(commentId)
        } else {
          post.downVoteCount = post.downVoteCount ? post.downVoteCount + 1 : 1
          // const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          // this.userLikedComments.splice(index, 1)
        }
      }
    })
  }


  ngOnDestroy(): void {
    this.widgetData = null
  }

  async getUserJoinedCommunityList() {
    this.userJoinedCommunityList = await this.userEnrollSvc.getEnrollDataId()
    this.manageUserCommunityStatus()
  }


  manageUserCommunityStatus(){
    this.userJoinedCommunityList.forEach((community: any) => {
      if(community.communityid === this.communityId){
        this.userJoinedCommunity = community
      }
    })
  }

  navigateToCommunityPage() {
    this.router.navigate(['/app/discussion-forum-v2/community/', this.userJoinedCommunity.communityid])
  }
}
