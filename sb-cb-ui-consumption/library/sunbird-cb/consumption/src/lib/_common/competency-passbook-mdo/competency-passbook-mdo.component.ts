import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2';
import { WidgetContentLibService } from '../../_services/widget-content-lib.service';
import { CompetencyPassbookMdoService } from './competency-passbook-mdo.service';
import { Router } from '@angular/router';
import { NsCompentency } from '../../_models/compentencies.model';
@Component({
  selector: 'sb-uic-competency-passbook-mdo',
  templateUrl: './competency-passbook-mdo.component.html',
  styleUrls: ['./competency-passbook-mdo.component.scss']
})
export class CompetencyPassbookMdoComponent implements OnInit {

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
  selectedValue: any = 'functional';
  competencyVersion:string = ''
  competencyThemeData: any
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
    public competencySvc: CompetencyPassbookMdoService,
    public router : Router,
    @Inject('environment') environment: any,

  ) {
    this.environment = environment
  }

 
  ngOnInit() {
    this.comeptencyKeys = this.configSvc.compentency[this.environment.compentencyVersionKey]
    
    this.getAllCompetencies()
  }


  getAllCompetencies(){
    this.loadCometency = true
    let request = {"search":{"type":"Competency Area"},"filter":{"isDetail":true}}
    this.competencySvc.getCompetencyListv_V2().subscribe((response: any) => {
      this.allcompetencyTheme = {}
      if(response && response.result && response.result.content) {
        this.originalCompetencyArray = response.result.content
        this.getMdoCompetencies()
        // this.getCompetencyArea()
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
  


  async getMdoCompetencies(){
    try {
      this.loadCometency = true
      const response = await this.getMdoCompetency();
      if (response && response.results) {
        if(response.results.result.facets && response.results.result.facets.length){
          let facetData = response.results.result.facets
          facetData.forEach((facet: any) => {
            if(facet.name ===   `${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyArea}`) {
              this.competencyArea = facet.values
              this.selectedValue = facet.values[0].name
            } else if(facet.name ===   `${this.environment.compentencyVersionKey}.${this.comeptencyKeys.vCompetencyTheme}`) {
              this.competencyThemeData = facet.values
              this.getCompetencyTheme()
            }
          });

        } else {
          this.emptyResponse.emit(true)
        }
        this.loadCometency = false
      }
    } catch (error) {
      // Handle errors
      // console.error('Error:', error);
          this.emptyResponse.emit(true)
    }
  }

  getCompetencyTheme(){
    this.originalCompetencyArray.forEach((element: any) => {
      if(element.name.toLowerCase() === this.selectedValue) {
        this.competencyTheme = this.competencyThemeData.filter((ele1: any) => {
          return  element.children.find((ele2: any) => ele2.name.toLowerCase() === ele1.name.toLowerCase())
        })
        this.showAllTheme = [{name:'Show all', showAll: false}]
        this.competencyThemeLength = 6
      } else if('Behavioral'.toLowerCase()  === this.selectedValue) {
        this.competencyTheme = this.competencyThemeData.filter((ele1: any) => {
          return  element.children.find((ele2: any) => ele2.name.toLowerCase() === ele1.name.toLowerCase())
        })
        this.showAllTheme = [{name:'Show all', showAll: false}]
        this.competencyThemeLength = 6
      }
    });
    this.resetViewMore()
  }


  async getMdoCompetency(){
    return new Promise<any>((resolve, reject) => {
      if (this.providerId) {
        this.competencySvc.mdoCompetency(this.providerId).subscribe(results => {
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
    this.selectedValue = e.name
    this.getCompetencyTheme()
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
    this.router.navigateByUrl(`app/learn/browse-by/competency/${compData.name}`)
  }

  showMore() {
    this.objectData.viewMore = !this.objectData.viewMore
  }
}
