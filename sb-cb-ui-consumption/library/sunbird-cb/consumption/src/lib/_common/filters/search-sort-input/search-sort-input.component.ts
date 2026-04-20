import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'sb-uic-search-sort-input',
  templateUrl: './search-sort-input.component.html',
  styleUrls: ['./search-sort-input.component.scss']
})
export class SearchSortInputComponent implements AfterViewInit, OnChanges {
  @Output() searchSorter = new EventEmitter();
  @Input() category!: string
  @Input() isExploreContentTab: boolean = false;
  selectedOption: string = ''
  @Input() customOptions: any[] = [];
  options: any[] = [];

  @ViewChild('sortSelect') sortSelect!: ElementRef

  constructor() { }

  ngOnChanges(): void {
    if (this.customOptions && this.customOptions.length > 0) {
      this.options = this.customOptions
      this.selectedOption = this.customOptions[0].value
    }

    // const sortType = localStorage.getItem(SearchConstantLocalStorage.SortType)
    // if (sortType && this.options.some((option) => option.value === sortType)) {
    //   this.selectedOption = sortType
    // }
  }

  ngAfterViewInit() {
    // this.adjustSelectWidth();
  }

  onChange(event: Event): void {
    this.selectedOption = (event.target as HTMLSelectElement).value
    this.searchSorter.emit(this.selectedOption)
    // this.adjustSelectWidth();
  }

  adjustSelectWidth() {
    setTimeout(() => {
      const select = this.sortSelect.nativeElement
      const selectedOption = select.options[select.selectedIndex]
      const tempSpan = document.createElement('span')

      tempSpan.style.font = window.getComputedStyle(select).font
      tempSpan.style.visibility = 'hidden'
      tempSpan.style.position = 'absolute'
      tempSpan.textContent = selectedOption.textContent

      document.body.appendChild(tempSpan)
      const width = tempSpan.getBoundingClientRect().width
      document.body.removeChild(tempSpan)

      select.style.width = `${width + 40}px`
    })
  }
}
