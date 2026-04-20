import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
// import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// tslint:disable-next-line
import _ from 'lodash'
import { map } from 'rxjs/operators';

@Component({
  selector: 'd-v2-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss']
})
export class GlobalFeedComponent implements OnInit, OnChanges{
  @Input() widgetData: any = []
  @Input() userJoinedCommunity: boolean = false
  @Input() community!: any
  @Input() postCategoryTypeFilter: any
  @Input() showNewPost: boolean = true 
  @Input() selectedTab: string = 'Feeds' 
  @Input() discussionId: string = ''
  @Output() communityClickEvent = new EventEmitter<any>()
  loadingPosts: boolean = false
  loogedInUserProfile: any = {}
  pageNumber = 0
  commentListLimit = 10
  commentListOffSet = 0
  commentsLength = 0
  posts: any[] = []
  loadingMore = false
  searchResults: any

  constructor(
        // private configSvc: ConfigurationsService,
        private discussV2Svc: DiscussionV2Service,
        private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.fetchPosts()
  }


  ngOnChanges(_changes: SimpleChanges): void {
    
    // if (changes.community && Object.keys(changes.community.currentValue).length) {
    //   if(this.community) {
    //     this.fetchPosts()
    //   }
    // }
    
    // if (changes.discussionId && changes.discussionId.currentValue) {
    //   this.scrollToDiscussion();
    // }
  }


  fetchPosts(searchString?:any) {
    this.loadingPosts = true
    const req = this.fetchPostRequest(true, searchString)
    // const tabType = searchString ? '' : this.selectedTab
    this.discussV2Svc.getGlobalFeed(req).subscribe(res => {
      this.searchResults = _.get(res, 'result.search_results') || {}
      const postsData = _.get(res, 'result.search_results.data') || []
      
      if (postsData.length) {
        this.enrichData(postsData).subscribe(
          () => {
            this.posts = postsData
            this.loadingPosts = false
            if(this.discussionId){
              this.scrollToDiscussion()
            }
          },
          () => {
            // On enrichData failure, fallback to original posts
            this.posts = postsData
            this.loadingPosts = false
            if(this.discussionId){
              this.scrollToDiscussion()
            }
          }
        )
      } else {
        this.posts = []
        this.loadingPosts = false
      }
    },(err: any) => {
      
      this.loadingPosts = false
      if(err && err.error.params && err.error.params.errMsg){
        this._snackBar.open(err.error.params.errMsg)
      } else {
        this._snackBar.open('Something went wrong! please try reporting again later.')
      }
      // console.error(err)
    })
  }

  fetchPostsMore(searchString?: any) {
    this.loadingPosts = true
    
    const req = this.fetchPostRequest(false, searchString)
    this.discussV2Svc.getGlobalFeed(req).subscribe(res => {
      const newPosts = _.get(res, 'result.search_results.data') || []
      this.searchResults = _.get(res, 'result.search_results') || {}
      
      if (newPosts.length) {
        this.enrichData(newPosts).subscribe(
          () => {
            this.posts = [...this.posts, ...newPosts]
            this.loadingPosts = false
          },
          () => {
            // On enrichData failure, fallback to original posts
            this.posts = [...this.posts, ...newPosts]
            this.loadingPosts = false
          }
        )
      } else {
        this.loadingPosts = false
      }
    },(err: any) => {
      
      this.loadingPosts = false
      if(err && err.error.params && err.error.params.errMsg){
        this._snackBar.open(err.error.params.errMsg)
      } else {
        this._snackBar.open('Something went wrong! please try reporting again later.')
      }
    })
  }
  
  enrichData(posts: any) {
    const groupedDataRequest = this.groupByCommunityId(posts);
    return this.discussV2Svc.enrichData(groupedDataRequest).pipe(
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

  groupByCommunityId(posts: any) {
    const communityFilters: { [key: string]: { communityId: string; identifier: string[] } } = {};
  
    posts.forEach((post: any) => {
      const { communityId, discussionId } = post;
      if (!communityFilters[communityId]) {
        communityFilters[communityId] = { communityId, identifier: [] };
      }
      communityFilters[communityId].identifier.push(discussionId);
    });
  
    return {
      request: {
        communityFilters: Object.values(communityFilters),
        requestType: "question",
        filters: ["likes", "bookmarks", "reported"]
      }
    };
  }

  fetchPostRequest(pageReset: boolean, searchString?: string) {
      const req: any = {
        filterCriteriaMap: {
          type: "question"
        },
        "requestedFields": [],
        "pageNumber": pageReset? 0 : this.commentListOffSet,
        "pageSize": this.commentListLimit,
        "orderBy": "updatedOn",
        "orderDirection": "DESC",
        "facets": []
      }
      if(searchString?.length) {
        req['searchString'] = searchString
      }
      return req
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
        const post = this.posts.find((comm: any) => comm.discussionId === discussionId)
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
        const post = this.posts.find((comm: any) => comm.discussionId === discussionId)
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

  bookmarkEvent(event: any) {
    if(event.bookmark){
      this.bookmarkPost(event.post)
    } else {
      this.unbookmarkPost(event.post)
    }
  }

  bookmarkPost(post: any) {
    const communityId = post.communityId
    const discussionId = post.discussionId
    this.discussV2Svc.bookmarkPost(communityId, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open('Post bookmarked successffuly!')
        const post = this.posts.find((comm: any) => comm.discussionId === discussionId)
        post.isBookmarked = true
      }
    })
  }

  communityClick(event: any) {
    this.communityClickEvent.emit(event)
  }
  unbookmarkPost(post: any) {
    const communityId = post.communityId
    const discussionId = post.discussionId
    this.discussV2Svc.UnBookmarkPost(communityId, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open('Post un-bookmarked successffuly!')
        const post = this.posts.find((comm: any) => comm.discussionId === discussionId)
        post.isBookmarked = false
      }
    })
  }

  newCommentEvent(event: any){
    if(event && event.type === 'question'){
      this.fetchPosts()
    }
  }

  loadMoreComments() {
    this.commentListOffSet = this.commentListOffSet + 1
    this.fetchPostsMore()
  }

  onSearch(event: any){
    const searchValue = event.target.value;
    // Add your search logic here{
    this.fetchPosts(searchValue)

  }

  ngAfterViewInit() {
    // Get the discussion ID from route params or wherever it's coming from
    
    if (this.discussionId) {
      setTimeout(() => {
        const element = document.getElementById('post-' + this.discussionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1000); // Small delay to ensure content is loaded
    }
  }
  scrollToDiscussion() {
    const discussionExists = this.posts.find((comm: any) => comm.discussionId === this.discussionId);
  
    if (!discussionExists && this.discussionId) {
      // Fetch specific discussion if not found in current posts
      const req = {
        "filterCriteriaMap":{
          "type":"question",
          "communityId": this.community.communityId,
          "discussionId":this.discussionId,
          "isActive":true
        },
        "requestedFields":[],
        "pageNumber":0,
        "pageSize":5
      }
  
      this.discussV2Svc.getPosts(req, '').subscribe(res => {
        const discussionData = _.get(res, 'result.search_results.data') || [];
        if (discussionData.length) {
          this.posts = [ ...this.posts,discussionData[0]];
          this.scrollToElement();
        }
      }, (err: any) => {
        this._snackBar.open('Unable to fetch the discussion');
        console.error(err);
      });
    } else if (this.discussionId) {
      this.scrollToElement();
    }
  }
  private scrollToElement() {
    setTimeout(() => {
      const element = document.getElementById('post-' + this.discussionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1000);
  }
}
