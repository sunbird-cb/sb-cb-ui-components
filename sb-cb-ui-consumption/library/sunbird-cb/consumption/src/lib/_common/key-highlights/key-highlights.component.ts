import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core'
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive'

@Component({
  selector: 'sb-uic-key-highlights',
  templateUrl: './key-highlights.component.html',
  styleUrls: ['./key-highlights.component.scss']
})
export class KeyHighlightsComponent implements OnInit {
  currentIndex: any = 0
  @Input() providerId: any = ''
  @Input() formData: any = ''
  @Input() mode: any
  @Input() isEdit: boolean = false;
  @Output() emptyResponse = new EventEmitter<any>()
  titleMaxLength = 100

  styleData: any = {}
  contentdata: any = []
  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>
  constructor() { }

  ngOnInit() {
    this.styleData = this.formData && this.formData.sliderData && this.formData.sliderData.styleData
    this.contentdata = this.formData && this.formData.content ? this.formData.content : []
    this.titleMaxLength = this.formData && this.formData.titleMaxLength ? this.formData.titleMaxLength : 100
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }
}
