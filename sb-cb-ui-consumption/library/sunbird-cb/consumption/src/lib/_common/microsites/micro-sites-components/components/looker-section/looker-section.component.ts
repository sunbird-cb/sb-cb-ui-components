import { Component, OnInit, Inject } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-looker-section',
  templateUrl: './looker-section.component.html',
  styleUrls: ['./looker-section.component.scss']
})
export class LookerSectionComponent implements OnInit {
  lookerUrl: SafeResourceUrl
  iframeHeight: string

  constructor(
    @Inject('sectionData') public data: any,
    @Inject('isMobile') public isMobile: boolean,
    @Inject('isEdit') public isEdit: boolean,
    @Inject('eventCallback') public eventCallback: (event: any) => void,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.iframeHeight = `${window.innerWidth * 0.667}px`
    this.setLookerUrl()
  }

  setLookerUrl() {
    const url = this.isMobile ?
      this.data?.lookerProMobileUrl :
      this.data?.lookerProDesktopUrl

    if (url) {
      this.lookerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
      this.eventCallback({
        action: 'looker-loaded',
        source: 'lookerSection',
        id: 'looker-dashboard'
      })
    }
  }

  openEditor() {
    this.eventCallback({
      action: 'edit',
      source: 'lookerSection',
      id: 'lookerConfig',
      data: {
        fieldName: 'lookerConfig',
        displayName: 'Looker Configuration',
        value: this.data,
        fieldType: 'lookerConfig'
      }
    })
  }
}