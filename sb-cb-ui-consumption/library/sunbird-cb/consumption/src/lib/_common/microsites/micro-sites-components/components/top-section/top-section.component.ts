import { Component, OnInit, Inject } from '@angular/core'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'

@Component({
  selector: 'app-top-section',
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.scss']
})
export class TopSectionComponent implements OnInit {
  descriptionMaxLength = 500;
  stripWidth: string

  constructor(
    @Inject('sectionData') public data: any,
    @Inject('channelName') public channelName: string,
    @Inject('orgId') public orgId: string,
    @Inject('isMobile') public isMobile: boolean,
    @Inject('slwConfiguration') public slwConfig: any,
    @Inject('isEdit') public isEdit: boolean,
    @Inject('eventCallback') public eventCallback: (event: any) => void,
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.stripWidth = `${(window.innerWidth - 1200 + 135) / 2}px`
  }

  emitEvent(action: string, id: string, data?: any) {
    this.eventCallback({
      action,
      source: 'topSection',
      id,
      data: data || this.data
    })
  }

  openEditor(fieldName: string, displayName: string, value: any) {
    this.eventCallback({
      action: 'edit',
      source: 'topSection',
      id: fieldName,
      data: {
        fieldName,
        displayName,
        value, // <-- Correct property name
        path: fieldName,
        fieldType: this.getFieldType(fieldName, value),
        parentData: this.data
      }
    })
  }

  getFieldType(fieldName: string, value: any): string {
    if (fieldName === 'logo' || fieldName === 'logoMobile' || fieldName.includes('banner')) {
      return 'image'
    } else if (fieldName === 'background') {
      return 'color'
    } else if (fieldName === 'sliderData') {
      return 'slider'
    } else if (fieldName === 'metrics') {
      return 'metrics'
    } else if (typeof value === 'string' && value.startsWith('#')) {
      return 'color'
    } else if (typeof value === 'boolean') {
      return 'boolean'
    } else if (fieldName.includes('description')) {
      return 'textarea'
    } else {
      return 'text'
    }
  }

  isArray(value: any): boolean {
    return Array.isArray(value)
  }

  getBackgroundStyle(background: string): any {
    if (!background) {
      return {}
    }

    // Check if it's a hex color (starts with #)
    if (background.startsWith('#')) {
      return { 'background-color': background }
    }

    // Otherwise, treat it as an image URL - return all background properties
    return {
      'background': `url('${background}') center center / cover no-repeat`
    }
  }
}
