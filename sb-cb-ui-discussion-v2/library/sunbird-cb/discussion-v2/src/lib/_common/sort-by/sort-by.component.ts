import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'd-v2-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.scss']
})
export class SortByComponent {
  @Input() sortData: any
  @Output() sortOptionSelection = new EventEmitter<any>();
  constructor() {
   
  }

  handleGetFilterType(_event: any, type: any, _filterType: any) {
    type.checked = true
    this.sortOptionSelection.emit(type)
  }
}
