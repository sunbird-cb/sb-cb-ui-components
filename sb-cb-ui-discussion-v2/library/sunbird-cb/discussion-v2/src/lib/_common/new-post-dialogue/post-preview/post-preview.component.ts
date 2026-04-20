import { Component, Input } from '@angular/core';
// tslint:disable-next-line
import _ from 'lodash'
import { NsDiscussionV2 } from '../../../_model/discussion-v2.model';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';

@Component({
  selector: 'd-v2-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})
export class PostPreviewComponent {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.IDiscussV2WidgetDataV2
  @Input() type!: string
  @Input() post!: any
  @Input() levelKey!: string
  @Input() currentLevel: number = 0
  viewMoreLength = 160

  loogedInUserProfile: any = {}
  levelConfig: any;
  constructor(
    private configSvc: ConfigurationsService,
  ) {

  }

  ngOnInit() {
    this.loogedInUserProfile = {...this.configSvc.userProfile, ...this.configSvc.unMappedUser}
    this.levelConfig = this.cardConfig.levelConfigs[this.levelKey as keyof typeof this.cardConfig.levelConfigs];
  }

  viewMoreOrLess(item: any) {
    if (this.getEditorTextLength(item.description) > this.viewMoreLength) {
      item.expanded = !item.expanded
    }
  }

  getEditorTextLength(content: any) {
    let test = content.replace(/<[^>]*>/g, '')
    test = test.replace(/&nbsp;/gi, ' ')
    test = test.trim()
    return test.length
  }

  getFileExtension(file: string): string {
    return file.split('.').pop() || '';
  }

  getFileName(url: string): string {
    const filename = url.split('/').pop() || '';
    // Decode the URL-encoded filename
    return decodeURIComponent(filename);
  }

  getFileIcon(url: string): string {
    const extension = this.getFileExtension(url);
    switch(extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      default:
        return 'insert_drive_file';
    }
  }

}
