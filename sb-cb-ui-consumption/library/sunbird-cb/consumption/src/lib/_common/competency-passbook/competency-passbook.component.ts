
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2';
import { WidgetContentLibService } from '../../_services/widget-content-lib.service';
import { CompetencyPassbookService } from './competency-passbook.service';
import { Router } from '@angular/router';
import { NsCompentency } from '../../_models/compentencies.model'

@Component({
  selector: 'sb-uic-competency-passbook',
  templateUrl: './competency-passbook.component.html',
  styleUrls: ['./competency-passbook.component.scss']
})
export class CompetencyPassbookComponent implements OnInit {

  @Input() objectData: any
  @Input() providerId: any
  @Input() cardDisplayCount: any = 3
  @Input() dynamicClass: any
  @Input() dynamicColor: any
  @Input() dynamicAlignPills: any = 'center'
  @Output() emptyResponse = new EventEmitter<any>()
  @Output() temeletryResponse = new EventEmitter<any>()
  loadCometency: boolean = false
  loadCompetencyArea: boolean = false
  originalCompetencyArray: any
  competencyArea: any []
  selectedValue: any;
  competencyVersion:string = ''
  competencyTheme: any = []
  allcompetencyTheme: any ={}
  competencyStrength: any = 0
  competencyThemeLength: any = 6
  showAllTheme : any = [{name:'Show all', showAll: false}]
  environment!: any;
  comeptencyKeys: NsCompentency.CompentencyKeys;
  // subTheme = ['Behavioural']
  // currentFilter = 'Behavioural'
  // currentCompetencies: any = []
  // competencyData: any
  constructor(public configSvc: ConfigurationsService,
    public contentSvc:WidgetContentLibService,
    public competencySvc: CompetencyPassbookService,
    public router : Router,
    @Inject('environment') environment: any,
  ) { 
    this.environment = environment
  }

 
  ngOnInit() {
    this.comeptencyKeys = this.configSvc.compentency[this.environment.compentencyVersionKey]
    
    this.getAllCompetencies()
    // this.competencyData = this.objectData
    // this.filter(this.currentFilter)
  }
  // filter(filterValue: string) {
  //   this.currentFilter = filterValue
  //   this.currentCompetencies = this.competencyData.data.filter((item: any) => item.type === filterValue)
  // }
  showMore() {
    this.objectData.viewMore = !this.objectData.viewMore
  }

  // to get competency area from facets
  async getCompetencyArea(){
  let addfilter: any = {}
  if(this.providerId) {
    addfilter = {
      "createdFor": [
        this.providerId
     ],
    }
  }
    this.loadCompetencyArea = true
    let request = {
        "request": {
            "query": "",
            "filters": {
                "contentType":"Course",
                ...addfilter,
                "status": [
                    "Live"
                ]
            },
            "sort_by": {
                "lastUpdatedOn": "desc"
            },
            "facets": [
                `${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyArea}`
            ],
            "limit": 0,
            "offset": 0,
            "fields": [
            ]
        }
      }
    
    try {
      this.competencyStrength =  0
      const response = await this.callCompetencySearch(request);
      if (response && response.results) {
        if(response.results.result.facets){
          response.results.result.facets.forEach((fact: any) => {

            if(fact.name ===   `${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyArea}`) {
              this.competencyArea = fact.values
            }
          });
          this.selectedValue  = this.competencyArea[0].name.toLowerCase()
          this.competencyArea.forEach(async (area: any, indexValue: any)=> {
            let addFilter = {
              "createdFor": [
                this.providerId
             ]
            }
            let data = await this.getcompetencyThemeCount(area, addFilter)
            area['themeData'] = data
            area['count'] = data.length

            this.competencyStrength = this.competencyStrength + data.length
            if(indexValue === 0) {
              
              this.getThemeDataByArea(area)
            }
          })
          this.loadCompetencyArea = false
        }
      }
    } catch (error) {
      this.loadCompetencyArea = false
      this.emptyResponse.emit(true)
      // Handle errors
      // console.error('Error:', error);
    }
  }

  async callCompetencySearch(request){
    return new Promise<any>((resolve, reject) => {
      if (request && request) {
        this.contentSvc.searchV6(request).subscribe(results => {
            resolve({ results });
          },(error: any) => {
            reject(error);
          },
        );
      }
    });
  }

  // competency theam change
  competencyChange(e){
    let addfilter: any = {}
    if(this.providerId) {
      addfilter = {
        "createdFor": [
          this.providerId
       ],
      }
    }

    this.temeletryResponse.emit(e.name)
    
    this.getThemeDataByArea(e)
    this.selectedValue = e.name
  }
  getAllCompetencies(){
    this.loadCometency = true
    this.competencySvc.getCompetencyListv_V2().subscribe((response: any) => {
      this.allcompetencyTheme = {}
      if(response && response.result && response.result.content) {
        this.originalCompetencyArray = response.result.content
        this.getCompetencyArea()
        response.result.content.forEach(element => {
          element.children.forEach((childEle) => {
            let name = childEle.name.toLowerCase()
            this.allcompetencyTheme[name] = childEle
            this.allcompetencyTheme[name]['viewMore'] = false
          });
        });
      }
      this.loadCometency = false
    })
  }

  async getcompetencyTheme(value: any,addFilter?: any) {
    let request = {
      "request": {
          "query": "",
          "filters": {
              "contentType":"Course",
              ...addFilter,
              [`${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyArea}`] : value,
              "status": [
                  "Live"
              ]
          },
          "sort_by": {
              "lastUpdatedOn": "desc"
          },
          "facets": [
              `${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyTheme}`
          ],
          "limit": 0,
          "offset": 0,
          "fields": [
          ]
      }
    }
  
  try {
    this.loadCometency = true
    const response = await this.callCompetencySearch(request);
    if (response && response.results) {
      if(response.results.result.facets){
        let competencyThemeData : any = response.results.result.facets[0].values 
        this.originalCompetencyArray.forEach((element: any) => {
          if(element.name.toLowerCase() === value) {
            this.competencyTheme = competencyThemeData.filter((ele1: any) => {
              return  element.children.find((ele2: any) => ele2.name.toLowerCase() === ele1.name.toLowerCase())
            })
            this.showAllTheme = [{name:'Show all', showAll: false}]
            this.competencyThemeLength = 6
          }
        });
        this.resetViewMore()
      }
      this.loadCometency = false
    }
  } catch (error) {
    // Handle errors
    // console.error('Error:', error);
  }
  }

  getThemeDataByArea(areaData: any){
    let competencyThemeData : any = areaData.themeData
        this.originalCompetencyArray.forEach((element: any) => {
          if(element.name.toLowerCase() === areaData.name) {
           this.competencyTheme = competencyThemeData.filter((ele1: any) => {
              return  element.children.find((ele2: any) => ele2.name.toLowerCase() === ele1.name.toLowerCase())
            })
            this.showAllTheme = [{name:'Show all', showAll: false}]
            this.competencyThemeLength = 6
          }
        });
        let addfilter: any = {}
        if(this.providerId) {
          addfilter = {
            "createdFor": [
              this.providerId
           ],
          }
        }
        this.getcompetencySubTheme(areaData,addfilter)
  }

  async getcompetencyThemeCount(area: any,addFilter?: any) {
    let request = {
      "request": {
          "query": "",
          "filters": {
              "contentType":"Course",
              ...addFilter,
              [`${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyArea}`] : area.name,
              "status": [
                  "Live"
              ]
          },
          "sort_by": {
              "lastUpdatedOn": "desc"
          },
          "facets": [
              `${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyTheme}`
          ],
          "limit": 0,
          "offset": 0,
          "fields": [
          ]
      }
    }
  
  try {
    let returnedData : any = 
    this.loadCometency = true
    const response = await this.callCompetencySearch(request);
    if (response && response.results) {
      if(response.results.result.facets){
        let competencyThemeData : any = response.results.result.facets[0].values 
        this.originalCompetencyArray.forEach((element: any) => {
          if(element.name.toLowerCase() === area.name) {
           returnedData = competencyThemeData.filter((ele1: any) => {
              return  element.children.find((ele2: any) => ele2.name.toLowerCase() === ele1.name.toLowerCase())
            })
            this.showAllTheme = [{name:'Show all', showAll: false}]
            this.competencyThemeLength = 6
          }
        });
      }
      this.loadCometency = false
      return returnedData
    }
  } catch (error) {
    // Handle errors
    // console.error('Error:', error);
  }
  }

  resetViewMore(){
    Object.keys(this.allcompetencyTheme).forEach((comp: any) => {
      this.allcompetencyTheme[comp]['viewMore'] = false
    })
  }
  viewMoreChildren(data: any) {
    data.viewMore = !data.viewMore
    this.allcompetencyTheme[data.name.toLowerCase()].viewMore = data.viewMore
  }
  displayAllTheme(event: any) {
    this.showAllTheme[0]['showAll'] = !event.showAll 
    this.competencyThemeLength = event.showAll ?  this.competencyTheme.length : 6
    this.showAllTheme[0]['name'] = event.showAll ? 'Show less' : 'Show all'
    this.temeletryResponse.emit(event.name)
  }

  navigateToCompetency(compData: any){
    this.router.navigateByUrl(`/app/learn/browse-by/competency/${compData.name}`)
  }


  async getcompetencySubTheme(compArea: any,addFilter?: any) {
    let request = {
      "request": {
          "query": "",
          "filters": {
              "contentType":"Course",
              ...addFilter,
             [`${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyArea}`] : compArea.name,
              "status": [
                  "Live"
              ]
          },
          "sort_by": {
              "lastUpdatedOn": "desc"
          },
          "facets": [
               `${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencySubTheme}`
          ],
          "limit": 0,
          "offset": 0,
          "fields": [
          ]
      }
    }
  
  try {
    this.loadCometency = true
    const response = await this.callCompetencySearch(request);
    if (response && response.results) {
      if(response.results.result.facets){
        let competencySubThemeData : any = response.results.result.facets[0].values 
        this.competencyArea.forEach((areaEle: any) => {
          if(areaEle.name === compArea.name) {
            areaEle.themeData.forEach((themeEle) => {
              if(this.allcompetencyTheme[themeEle.name.toLowerCase()] &&
              this.allcompetencyTheme[themeEle.name.toLowerCase()].children && 
              this.allcompetencyTheme[themeEle.name.toLowerCase()].children.length) {
                let data = this.allcompetencyTheme[themeEle.name.toLowerCase()].children.filter(obj1 => 
                  competencySubThemeData.some(obj2 => 
                    Object.keys(obj1).every(key => obj1['name'] === (obj2['name']))
                  )
                );
                
                this.allcompetencyTheme[themeEle.name.toLowerCase()]['children'] = data
              }
            });
          }
        })
      }

      this.loadCometency = false
    }
  } catch (error) {
    // Handle errors
    // console.error('Error:', error);
  }
  }
}
