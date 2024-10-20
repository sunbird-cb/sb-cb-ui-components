import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive';

@Component({
  selector: 'sb-uic-highlights-of-week',
  templateUrl: './highlights-of-week.component.html',
  styleUrls: ['./highlights-of-week.component.scss']
})
export class HighlightsOfWeekComponent implements OnInit {

  @Input() objectData: any
  currentIndex = 0
  contentdata: any = []
  styleData: any = {}
  expand: boolean = true
  
  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>
  constructor() { }

  ngOnInit() {
    this.styleData = this.objectData && this.objectData.sliderData && this.objectData.sliderData.styleData
    if (this.objectData && this.objectData.list) {
      this.objectData.list.forEach((contentEle: any) => {
        let localData = {}
        localData['title'] = contentEle.title
        localData['videoUrl'] = contentEle.videoUrl
        localData['cardSubType'] =  "card-wide-lib"
        localData['description'] = contentEle.description
        this.contentdata.push(localData)
      })
    }
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }


}
