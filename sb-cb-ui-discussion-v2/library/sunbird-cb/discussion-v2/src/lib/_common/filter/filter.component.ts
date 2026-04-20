import { Component, ElementRef, EventEmitter, Inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { communityConstants } from '../../_model/filter-constants.model'
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { DiscussionV2Service } from '../../_services/discussion-v2.service';

@Component({
  selector: 'd-v2-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() filterObjectList: any = {}
  @Input() filterKeys: any = []
  @Output() filterOptionSelected = new EventEmitter<any>();
  loadBottomSheet: boolean = false
  selectedOptions: any = {}
  constants: any = communityConstants




  filterData: any

  @ViewChildren('checkboxes') checkboxes!: QueryList<ElementRef>
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<any>,
    private discussV2Svc: DiscussionV2Service
  ) {
    if(this.data) {
      this.filterObjectList = this.data.filterObjectList
      this.filterKeys = this.data.filterKeys
      this.loadBottomSheet = this.data.loadBottomSheet
    }
    this.filterData = [
      {
        label:"MDO’s",
        placeholder:"Search MDO's"
      },
      {
        label:"Topics",
        placeholder:"Search Topics"
      },
      {
        label:"Competency Area",
        placeholder:"Search Competency Area"
      },
      {
        label:"Competency Theme",
        placeholder:"Search Competency Theme"
      },
      {
        label:"Competency Sub Theme",
        placeholder:"Search Competency Sub Theme"
      }
    ]

    this.selectedOptions = {
      [this.constants.orgName] : [],
      [this.constants.topicName] : [],
      [this.constants.competencyArea] : [],
      [this.constants.competencyTheme] : [],
      [this.constants.competencySubTheme] : []
    }
  }
  
  handleGetFilterType(event: any, selectedOption: any, filterType: any) {
    selectedOption['checked']= event.checked
    if(event.checked){
      selectedOption['checked']= event.checked
    }
    
    if(selectedOption['id'] === 'all') {
      // Handle "all" option selection
      if(event.checked) {
        // If "all" is checked, uncheck all other options and clear the array
        this.filterObjectList[filterType].values.forEach((option: any) => {
          option.checked = option.id !== 'all' ? false : true;
        })
        // Add all values to the selected options
        this.selectedOptions[filterType] = this.filterObjectList[filterType].values
          .filter((option: any) => option.id !== 'all')
          .map((option: any) => option.value);
      } else {
        // If "all" is unchecked, clear the array
        this.selectedOptions[filterType] = [];
      }
    } else {
      this.filterObjectList[filterType].values.forEach((option: any) => {
        if(option.id === 'all' && option.checked === true) {
          option.checked = false
          this.selectedOptions[filterType] = []
        }
      })
  
      // selectedOption['checked']= event.checked
      if(this.selectedOptions[filterType].includes(selectedOption.value)){
        const index = this.selectedOptions[filterType].findIndex((x: any) => x === selectedOption.value);
        this.selectedOptions[filterType].splice(index, 1);
      } else {
        this.selectedOptions[filterType].push(selectedOption.value);
      }
    }
    
    if (window.innerWidth < 768) {
      let factesRequest = []
      let filterObject: any = {}
      if(!this.selectedOptions[this.constants.competencyArea].length) {
        this.selectedOptions[this.constants.competencySubTheme] = []
        this.selectedOptions[this.constants.competencyTheme] = []
        this.filterObjectList[this.constants.competencyTheme].values = []
        this.filterObjectList[this.constants.competencySubTheme].values = []
      }
      Object.keys(this.selectedOptions).forEach((_ele: any)=> {
        if(this.selectedOptions[_ele] && this.selectedOptions[_ele].length) {
          let data = {
            [_ele]: this.selectedOptions[_ele]
          }
          filterObject = {...filterObject, ...data}
        }
      })
      if(filterType === this.constants.competencyArea 
        && this.selectedOptions[this.constants.competencyArea].length){
        factesRequest.push(this.constants.competencyTheme)
      } else if(filterType === this.constants.competencyTheme
        && this.selectedOptions[this.constants.competencyTheme].length
       )
      {
        factesRequest.push(this.constants.competencySubTheme)
      }
      this.fetchFacetsData(filterObject,factesRequest)
  
    } else {
      this.filterOptionSelected.emit({selectedOptions:this.selectedOptions,recentSelectedOption:selectedOption,recentSelectedKey:filterType})
    }
  }

  clearFilterWhileSearch() {
    if (this.checkboxes) {
      this.checkboxes.forEach((element: any) => {
        element['checked'] = false
      })
      Object.keys(this.selectedOptions).forEach((ele: any)=>{
        this.selectedOptions[ele]= []
      })
    }
    
    let select = {
      checked: false,
      count: 3,
      value: "Behavioral"
    }
    this.filterOptionSelected.emit({selectedOptions:this.selectedOptions,recentSelectedOption:select,recentSelectedKey:this.constants.competencyArea})
  }


  // this openLink method is used to close the bottomsheet
  openLink(type: any): void {
    
    if (type === 'apply') {
      this.bottomSheetRef.dismiss({
        filter: this.selectedOptions,
        // facetData: this.facetsData,
      })
    } else {
      this.bottomSheetRef.dismiss({
        // filter: this.data.selectedFilter,
        // facetData: this.facetsData,
      })
    }
  }

  fetchFacetsData(filterApply?:any,factesRequest?:any) {
    
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [
      ],
      "pageNumber": 0,
      "pageSize": 200,
      'facets': factesRequest
    }

    if(filterApply && Object.keys(filterApply).length){
      request['filterCriteriaMap'] = {...request['filterCriteriaMap'],...filterApply}
    }
    if(factesRequest && factesRequest.length) {
      request['facets']= factesRequest
    }

    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      
      if(factesRequest && factesRequest.length) {
        let facets: any = res.result.search_results.facets
        Object.keys(facets).forEach((ele: any) => {
          let tempFilter: any = {}
          tempFilter['label'] = this.constants[`${ele}Label`]
          let newValues = []
          if(facets[ele] && facets[ele].length ){
            newValues = facets[ele].map((v: any) => ({...v, checked: false}))
          }
          tempFilter['values'] = newValues
          this.filterObjectList[ele] =  tempFilter
        })
        if(this.filterObjectList[this.constants.competencyTheme].values && this.filterObjectList[this.constants.competencyTheme].values.length === 0  ) {
          this.filterObjectList[this.constants.competencySubTheme].values = []
        }
      }
    },(_err: any) => {
    })
   }
}
