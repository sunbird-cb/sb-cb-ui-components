import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'sb-uic-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.scss']
})
export class SpeakersComponent implements OnInit {
  @Input() objectData: any
  currentIndex = 0
  contentdata: any = []
  styleData: any = {}
  expand: boolean = true
  
  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>

  constructor(private route: Router) { }

  ngOnInit() {
    this.styleData = this.objectData && this.objectData.sliderData && this.objectData.sliderData.styleData
    if (this.objectData && this.objectData.list) {
      this.objectData.list.forEach((contentEle: any) => {
        let localData = {}
        localData['name'] = contentEle.title
        localData['cardSubType'] =  "card-wide-lib"
        localData['description'] = contentEle.description
        localData['initial'] = this.createInititals(contentEle.title)
        localData['profileImage'] = contentEle.profileImage ? contentEle.profileImage : ''
        localData['identifier'] = contentEle.identifier ? contentEle.identifier : ''
        this.contentdata.push(localData)
      })
    }
  }

  createInititals(name: string) {
    let initials = ''
    const array = name.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      for (let i = 0; i < name.length; i += 1) {
        if (name.charAt(i) === ' ') {
          continue
        }
        if (name.charAt(i) === name.charAt(i)) {
          initials += name.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    return initials.toUpperCase()
  }
  
  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

  goToEvent(eventData:any) {
    if(eventData && eventData.identifier){
      this.route.navigateByUrl(`/app/event-hub/home/${eventData.identifier}`)
    }
  }

}
