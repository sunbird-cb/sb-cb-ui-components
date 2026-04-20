import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// tslint:disable-next-line
import _ from 'lodash'

@Component({
  selector: 'd-v2-widget-discussionv2',
  templateUrl: './widget-discussionv2.component.html',
  styleUrls: ['./widget-discussionv2.component.scss']
})
export class WidgetDiscussionv2Component implements OnInit, OnDestroy {
  @Input() widgetData!: NsDiscussionV2.IDiscussV2WidgetData | null
  loogedInUserProfile: any = {}
  loadingPosts = false
  pageNumber = 0
  commentListLimit = 5
  commentListOffSet = 0
  commentsLength = 0
  posts: any[] = []
  loadingMore = false
  searchResults: any

  constructor(
    private configSvc: ConfigurationsService,
    private discussV2Svc: DiscussionV2Service,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // this.fetchInitialComments()
    this.loogedInUserProfile = this.configSvc.userProfile
    this.widgetData = {
      newPostSection: {
        "show": true,
        "type": "question",
        "openAsDialogue": true,
        "showTopInfo": false,
        "topInfo": {
          "icon": "forum",
          "text": "<span>Do you have any questions, suggestions or ideas in your mind?Post it.</span>"
        },
        "avatarPhoto": {
          "show": true,
          "size": "m",
          "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
          "name": "Christopher Fernandes",
          "color": "#006400"
        },
        "commentBox": {
          "placeholder": "Start a discussion"
        },
        "postBtn": {
          "text": "Post",
          "icon": "send",
          show: true
        },
        "styles": {
          "background-color": "#fff", 
          "border": "1px solid rgba(0, 0, 0, 0.08)"
        }
      },
      postsList: {
        "listType": "multiple", 
        "cardType": "topLevel",
        "type": "question",
        "showActions": true,
        "cardClick": {
          enabled: false,
          position: 'title',
          redirectUrl: '/post/',
          id:''
        },
        sliderData: {
          styleData: {
            "bannerMetaClass": "meta",
            "bannerMeta": "visible",
            "bannerMetaAlign": "middle",
            "navigationArrows": "visible",
            "borderRadius": "0",
            "customHeight": "360px",
            "arrowsPlacement": "middle-inline",
            autoplay: false,
            "responsive": {
              "bannerMetaClass": "meta",
              "customHeight": "232px",
              "bannerMetaAlign": "middle",
              "navigationArrows": "visible",
              "dots": "hidden",
              "arrowsPlacement": "middle-inline",
              autoplay: false,
            }
          }
        },
        "reportIcon": {
          "show": true,
          "icon": "report",
          "successMsg": "Reported successfully! Thank you for reporting.",
          "errorMsg": "Something went wrong! please try reporting again later.",
          "showToolTip": true,
          "toolTipText":"Report this comment"
        },
        "actions": {
          "like": {
            "show": true,
            "showCount": true,
            "icon": "thumb_up"
          },
          "comments": {
            "show": true,
            "showCount": true,
            "icon": "comment"
          },
          "avatarPhoto": {
            "show": true,
            "size": "ml",
            "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
            "name": "Christopher Fernandes",
            "color": "#006400"
          }
        },
        "repliesSection": {
          "show": true,
          "indented": true,
          "newPostReply": {
            "show": true,
            "type": "answerPost",
            "openAsDialogue": true,
            "showTopInfo": false,
            "topInfo": {
              "icon": "forum",
              "text": "<div>Do you have any questions, suggestions or ideas in your mind?Post it.</div>"
            },
            "avatarPhoto": {
              "show": true,
              "size": "m",
              "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
              "name": "Christopher Fernandes",
              "color": "#006400"
            },
            "commentBox": {
              "placeholder": "Add a comment"
            },
            "postBtn": {
              "text": "Post",
              "icon": "send",
              show: true
            },
            "styles": {
              "background-color": "#1B4CA10D", 
              "border": "none"
            }
          },
          "replyCardConfig": {
            "cardType": "reply",
            "type": "answerPost",
            "showActions": true,
            editAsDialogue: false,
            "reportIcon": {
              "show": true,
              "icon": "report",
              "successMsg": "Reported successfully! Thank you for reporting.",
              "errorMsg": "Something went wrong! please try reporting again later.",
              "showToolTip": true,
              "toolTipText":"Report this comment"
            },
            "actions": {
              "like": {
                "show": true,
                "showCount": true,
                "icon": "thumb_up"
              },
              "comments": {
                "show": true,
                "showCount": false,
                "icon": "comment"
              },
            },
  
            "repliesSection": {
              "show": false
            },
            "newPostReply": {
              "show": true,
              "showTopInfo": false,
              "type": "answerPost",
              "topInfo": {
                "icon": "forum",
                "text": "<div>Do you have any questions, suggestions or ideas in your mind?Post it.</div>"
              },
              "avatarPhoto": {
                "show": true,
                "size": "m",
                "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
                "name": "Christopher Fernandes",
                "color": "#006400"
              },
              "commentBox": {
                "placeholder": "Add a comment"
              },
              "postBtn": {
                "text": "Post",
                "icon": "send"
              },
              "styles": {
                "background-color": "#1B4CA10D", 
                "border": "none"
              }
            }
          }
        },
        "noPostsSection": {
          "text": "No posts found!"
        }
      }
    }
    this.fetchPosts()
  }

  fetchPosts() {
    this.loadingPosts = true
    const req = {
        "filterCriteriaMap": {
          "type": "question",
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
    },(err: any) => {
      this.loadingPosts = false
      this._snackBar.open('Something went wrong! please try reporting again later.')
      console.error(err)
    })
  }

  fetchPostsMore() {
    this.loadingMore = true
    const req = {
        "filterCriteriaMap": {
          "type": "question",
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
      this.loadingMore = false
      this.searchResults = _.get(res, 'result.search_results') || {}
      this.posts = [...this.posts, ...(_.get(res, 'result.search_results.data') || [])]
    },(err: any) => {
      this.loadingMore = false
      this._snackBar.open('Something went wrong! please try reporting again later.')
      console.error(err)
    })
  }

  newCommentEvent(event: any) {
    if(event && event.type === 'question'){
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
          post.downVoteCount = post.downVoteCount? post.downVoteCount + 1 : 1
          // const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          // this.userLikedComments.splice(index, 1)
        }
      }
    })
  }

  loadMoreComments() {
    this.commentListOffSet = this.commentListOffSet + 1
    this.fetchPostsMore()
  }

  ngOnDestroy(): void {
    this.widgetData = null
  }

}
