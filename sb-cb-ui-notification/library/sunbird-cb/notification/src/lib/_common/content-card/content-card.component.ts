import { Component, Input } from '@angular/core';
import { LibNotificationsService } from '../../_services/lib-notifications.service';

@Component({
  selector: 'sb-uin-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent {
  @Input() skeletonLoader: boolean
  @Input() content: any
  defaultThumbnail: any
  defaultSLogo: any

  constructor(
    private libNotificationsService: LibNotificationsService,
  ) { }

  ngOnInit() {
    this.defaultThumbnail = '/assets/instances/eagle/app_logos/default.png'
    this.defaultSLogo = '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
  }


  getRedirectUrlData(content: any) {
    this.libNotificationsService.emitClick(content)
  }
}
