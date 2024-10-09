import { Component, Input, OnInit } from '@angular/core';
import { InsiteDataService } from '../../_services/insite-data.service';

@Component({
  selector: 'sb-uic-data-points',
  templateUrl: './data-points.component.html',
  styleUrls: ['./data-points.component.css']
})
export class DataPointsComponent implements OnInit {
  @Input() objectData: any
  @Input() layoutType: string = ''
  @Input() fetchDataFromApi: boolean = false
  @Input() providerId : any = ''
  @Input() pageLayout: any = ''
  @Input() title: any
  customArray: any[][] = []
  isDataLoading: boolean = false
  apiResults: any
  
  constructor(public insightSvc: InsiteDataService) { }

  ngOnInit() {
    if (this.objectData && this.layoutType === 'gridLayout') {
      this.customArray = this.createCustomArray(this.objectData.metrics)
    }
    if(this.fetchDataFromApi) {
      this.isDataLoading = true
      if (this.pageLayout === 'nlw') {
        this.getStats()
      } else {
        this.getInsiteData()
      }
    }
  }  

  createCustomArray(arr: any[]): any[][] {
    const nByn: any[][] = []
    for (let i = 0; i < arr.length; i += this.objectData.dataColSpan) {
      nByn.push(arr.slice(i, i + this.objectData.dataColSpan))
    }
    return nByn   
  }

  getInsiteData(){
    let request: any = {}
    request  = {
      "request": {
          "filters": {
              "organisations": [
                  this.providerId
              ]
          }
      }
    }
    if (this.pageLayout && this.pageLayout === 'mdo') {
      request  = {
        "request": {
            "filters": {
              "requestType": "MDO_INSIGHT",
                "organisations": [
                    this.providerId
                ]
            }
        }
      }
    }
    this.insightSvc.fetchSearchData(request).subscribe((res: any)=> {
      if(res && res.result && res.result.response && res.result.response.nudges && res.result.response.nudges.length) {
        res.result.response.nudges.forEach((nudgeData: any) => {
          if(this.providerId && this.providerId === nudgeData.orgId) {
            this.objectData = nudgeData.data
          }
        })
      }
      this.isDataLoading = false
    })

  }

  getStats() {
    this.insightSvc.fetchNwlStats().subscribe((res: any) => {
      if(res && res.result && res.result.data) {
        this.objectData = res.result.data
      }
      this.isDataLoading = false
    }, error => {
      console.log(error)
      this.isDataLoading = false
    })
  }

  converToIndianSystem(value: any) {
    if (value) {
      let numStr = value.toString()
      let [integerPart, decimalPart] = numStr.split('.')
      let lastThree = integerPart.slice(-3);
      let otherNumbers = integerPart.slice(0, -3);
      if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
      }
      let formattedIntegerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
      const result = decimalPart ? `${formattedIntegerPart}.${decimalPart.substr(0,2)}` : formattedIntegerPart;
      return result
    }
  }
}
