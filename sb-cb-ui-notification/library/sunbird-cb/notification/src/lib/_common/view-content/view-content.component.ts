import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibNotificationsService } from '../../_services/lib-notifications.service';
import * as _ from 'lodash'

@Component({
  selector: 'sb-uin-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.scss']
})
export class ViewContentComponent implements OnInit {
  @Input() notification: any
  contents: any[] = [];
  skeletonLoader: boolean = false
  skeletonLoaderArray = [1, 2, 3, 4]

  constructor(readonly route: ActivatedRoute,
    private libNotificationService: LibNotificationsService,
  ) { }

  ngOnInit(): void {
    let request: any = {
      request: {
        filters: { identifier: this.notification?.message?.data?.id },
        offset: 0,
        sort_by: {
          lastUpdatedOn: "desc"
        }
      },
      query: ""
    }
    this.skeletonLoader = true
    this.libNotificationService.searchContent(request).subscribe((res: any) => {
      this.contents = _.get(res, 'result.content', [])
      this.skeletonLoader = false
    }, (error: any) => {
      this.skeletonLoader = false
      console.error("Error searching content: ", error);
    });
  }
}
