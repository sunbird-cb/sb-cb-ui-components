import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { SEARCH_SORT_DROPDOWN, SEARCH_SORT_PEOPLES } from "../../_constants/search-listing.constant";
import { SearchCategory, SearchListingConfig, SortType } from "../../_models/search-listing.model";
import { SearchListingService } from "../../_services/search-listing.service";
import * as _ from "lodash";

@Component({
  selector: "ws-app-search-sort-input",
  templateUrl: "./search-sort-input.component.html",
  styleUrls: ["./search-sort-input.component.scss"]
})
export class SearchSortInputComponent implements AfterViewInit, OnChanges {
  @Output() searchSorter = new EventEmitter();
  @Input() category!: string;
  @Input() isExploreContentTab: boolean = false;
  @Input() sortingsList!: {
    [key: string]: SearchListingConfig.SortingOptions[];
  };
  @Input() applicationName: string = '';
  selectedOption: string = SortType.MostRelevent;
  options = SEARCH_SORT_DROPDOWN;

  @ViewChild("sortSelect") sortSelect!: ElementRef;

  constructor(
      private searchListingService: SearchListingService,
    ) {}

  async ngOnChanges(): Promise<void> {
    if (this.category === SearchCategory.People) {
      this.options = SEARCH_SORT_PEOPLES;
      this.selectedOption = SortType.MostRelevent;
    } else if (
      this.category === SearchCategory.Communities ||
      this.category === SearchCategory.Events ||
      this.category === SearchCategory.Users ||
      this.category === SearchCategory.TrainingPlans ||
      this.category === SearchCategory.Designation
    ) {
      this.options = SEARCH_SORT_DROPDOWN.filter(option => option.value !== SortType.HighestRated);
      this.selectedOption = SortType.MostRelevent;
    } else if (this.category === SearchCategory.ExternalContents) {
      this.options = SEARCH_SORT_DROPDOWN.filter(option => option.value !== SortType.HighestRated && option.value !== SortType.MostRelevent);
      this.selectedOption = SortType.RecentlyAdded;
    } else {
      this.options = SEARCH_SORT_DROPDOWN;
      this.selectedOption = SortType.MostRelevent;
      if (this.isExploreContentTab) {
        this.options = SEARCH_SORT_DROPDOWN.filter(option => option.value !== SortType.MostRelevent);
        this.selectedOption = SortType.RecentlyAdded;
      } else {
        this.options = SEARCH_SORT_DROPDOWN;
        this.selectedOption = SortType.MostRelevent;
      }
    }

    const categorySortings = _.get(this.sortingsList, `${this.category}`, []);
    if (categorySortings.length > 0) {
      this.options = categorySortings;
    } else if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      this.options = this.options.filter(option => option.value !== SortType.HighestRated);
    }

    // const sortType = localStorage.getItem(SearchConstantLocalStorage.SortType);
    // if (sortType && this.options.some(option => option.value === sortType)) {
    //   this.selectedOption = sortType;
    //   // this.searchSorter.emit(this.selectedOption);
    // }
  }

  ngAfterViewInit() {
    // this.adjustSelectWidth();
  }

  onChange(event: Event): void {
    this.selectedOption = (event.target as HTMLSelectElement).value;
    this.searchSorter.emit(this.selectedOption);
    // this.adjustSelectWidth();
  }

  adjustSelectWidth() {
    setTimeout(() => {
      const select = this.sortSelect.nativeElement;
      const selectedOption = select.options[select.selectedIndex];
      const tempSpan = document.createElement("span");

      tempSpan.style.font = window.getComputedStyle(select).font;
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.textContent = selectedOption.textContent;

      document.body.appendChild(tempSpan);
      const width = tempSpan.getBoundingClientRect().width;
      document.body.removeChild(tempSpan);

      select.style.width = `${width + 40}px`;
    });
  }
}
