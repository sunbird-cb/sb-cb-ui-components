import { Inject, Injectable } from '@angular/core';
import { DiscussionV2Service } from './discussion-v2.service';
// tslint:disable-next-line
import _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class PostCreateHelperService {
  environment: any


  constructor(
    private discussV2Svc: DiscussionV2Service,
    @Inject('environment') environment: any
  ) { }

  createAnswerPost(formData: any, type: string, categoryType: any, parentDiscussionId: any, community: any) {
    const req = this.createReq(formData, type, parentDiscussionId, community)
    this.discussV2Svc.createAnswerPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId; // Get the discussion ID
          if (categoryType.length) {
            this.uploadHandler(discussionId, res.result);
          } else {
            return;
          }
        }
      },
      error: (err: any) => {
        console.error('Create post failed', err);
      }
    });
  }

  createReq(formData: any, type: string, parentDiscussionId: any, community: any) {
    const req = {
      type,
      ...(parentDiscussionId ? { parentDiscussionId: parentDiscussionId } : null),
      communityId: community.communityId || '',
      // title: formData.value.title,
      description: formData.value.description,
      // categoryType: [...this.categoryType],
      // mediaCategory: this.mediaCategory,
      // targetTopic: 'testing',
      // tags: this.selectedTags,
      // mediaUrls: this.mediaUrls || []
    }
    return req;
  }
}
