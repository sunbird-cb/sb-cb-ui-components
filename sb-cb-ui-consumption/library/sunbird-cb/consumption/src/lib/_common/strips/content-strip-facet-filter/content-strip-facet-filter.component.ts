import { Component, OnInit, Input, OnDestroy, HostBinding, Inject, EventEmitter, Output } from '@angular/core';
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver-v2';
import { NsContentStripWithFacets, ApiRequestFor } from './content-strip-facet-filter.model';
// import { HttpClient } from '@angular/common/http'
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service';
import { NsContent } from '../../../_models/widget-content.model';
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service';
import {
  TFetchStatus,
  LoggerService,
  EventService,
  ConfigurationsService,
  UtilityService,
  WsEvents,
} from '@sunbird-cb/utils-v2';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { WidgetUserServiceLib } from '../../../_services/widget-user-lib.service';
// import { environment } from 'src/environments/environment'
// tslint:disable-next-line
import * as _ from 'lodash'
import { MatTabChangeEvent } from '@angular/material';
import { NsCardContent } from '../../../_models/card-content-v2.model';
import { ITodayEvents } from '../../../_models/event';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

interface IStripUnitContentData {
  key: string;
  canHideStrip: boolean;
  mode?: string;
  showStrip: boolean;
  disableTranslate: boolean;
  widgets?: NsWidgetResolver.IRenderConfigWithAnyData[];
  stripTitle: string;
  hideViewMoreUrl?: boolean;
  stripTitleLink?: {
    link:  {
      queryParams: string
    },
    icon: string,
    queryParams: string
  };
  sliderConfig?: {
    showNavs: boolean,
    showDots: boolean,
    maxWidgets?: number
    cerificateCardMargin?: boolean
  };
  stripConfig: any;
  tabs?: NsContentStripWithFacets.IContentStripTab[] | undefined;
  stripName?: string;
  stripLogo?: string;
  description?: string;
  stripInfo?: NsContentStripWithFacets.IStripInfo;
  noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData;
  errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData;
  showOnNoData: boolean;
  showOnLoader: boolean;
  showOnError: boolean;
  loaderWidgets?: any;
  stripBackground?: string;
  secondaryHeading?: any;
  viewMoreUrl: any;
  request?: any
  
}


@Component({
  selector: 'sb-uic-content-strip-facet-filter',
  templateUrl: './content-strip-facet-filter.component.html',
  styleUrls: ['./content-strip-facet-filter.component.scss']
})
export class ContentStripFacetFilterComponent extends WidgetBaseComponent
implements
OnInit,
OnDestroy,
NsWidgetResolver.IWidgetData<NsContentStripWithFacets.IContentStripMultiple> {
  @Input() widgetData!: NsContentStripWithFacets.IContentStripMultiple;
  @Output() emptyResponse = new EventEmitter<any>()
  @Output() viewAllResponse = new EventEmitter<any>()
  @Output() telemtryLearningContentResponse = new EventEmitter<any>()
  @Input() providerId : any = ''
  @Input() emitViewAll : boolean = false
  @Input() channnelName: any = ''
  @HostBinding('id')
  public id = `ws-strip-miltiple_${Math.random()}`;
  stripsResultDataMap: { [key: string]: IStripUnitContentData } = {};
  stripsKeyOrder: string[] = [];
  showAccordionData = true;
  showParentLoader = false;
  showParentError = false;
  showParentNoData = false;
  errorDataCount = 0;
  noDataCount = 0;
  successDataCount = 0;
  contentAvailable = true;
  baseUrl = this.configSvc.sitePath || '';
  veifiedKarmayogi = false;
  environment!: any;
  changeEventSubscription: Subscription | null = null;
  defaultMaxWidgets = 12;
  enrollInterval: any;
  todaysEvents: any = [];
  facetForm: any
  constructor(
    @Inject('environment') environment: any,
    private contentSvc: WidgetContentLibService,
    private loggerSvc: LoggerService,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    public utilitySvc: UtilityService,
    public router: Router,
    private userSvc: WidgetUserServiceLib,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private _fb: FormBuilder
  ) {
    super();
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en');
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'));
      lang = lang.replace(/\"/g, '');
      this.translate.use(lang);
    }
    this.environment = environment
  }
  ngOnDestroy(): void {
   
  }

  ngOnInit() {
    this.initData();
    // this.contentSvc.telemetryData$.subscribe((data: any) => {
    //   this.telemtryLearningContentResponse.emit(data)
    // })
    this.facetForm = this._fb.group({
      org: ['0']
    })
  }

  private initData() {
    this.stripsKeyOrder = this.widgetData && this.widgetData.strips && this.widgetData.strips.map(strip => strip.key) || [];
    if (this.widgetData.loader && this.widgetData.strips.length) {
      this.showParentLoader = true;
    }
    // Fetch the data
    for (const strip of this.widgetData.strips) {
      if (this.checkForEmptyWidget(strip)) {
        this.fetchStripFromRequestData(strip, false);
      } else {
        this.processStrip(strip, [], 'done', true, null);
      }
    }
    // Subscription for changes
    const keyAndEvent: { key: string; type: string; from: string }[] = this.widgetData.strips
      .map(strip => ({
        key: strip.key,
        type: (strip.refreshEvent && strip.refreshEvent.eventType) || '',
        from: (strip.refreshEvent && strip.refreshEvent.from.toString()) || '',
      }))
      .filter(({ key, type, from }) => key && type && from);
    const eventTypeSet = new Set(keyAndEvent.map(e => e.type));
    this.changeEventSubscription = this.eventSvc.events$
      .pipe(filter(event => eventTypeSet.has(event.eventType)))
      .subscribe(event => {
        keyAndEvent
          .filter(e => e.type === event.eventType && e.from === event.from)
          .map(e => e.key)
          .forEach(k => this.fetchStripFromKey(k, false));
      });
  }

  private fetchStripFromKey(key: string, calculateParentStatus = true) {
    const stripData = this.widgetData.strips.find(strip => strip.key === key);
    if (stripData) {
      this.fetchStripFromRequestData(stripData, calculateParentStatus);
    }
  }
  
  private fetchStripFromRequestData(
    strip: NsContentStripWithFacets.IContentStripUnit,
    calculateParentStatus = true,
  ) {
    // setting initial values
    strip.loaderWidgets = this.transformSkeletonToWidgets(strip);
    this.processStrip(strip, [], 'fetching', false, null);
    if(strip && strip.stripRequestFor ===  ApiRequestFor.SEARCH && !strip.onTabClickRequest) {
      this.fetchFromSearch(strip, calculateParentStatus);
    }
  }

  private transformSkeletonToWidgets(
    strip: any
  ) {
    return [1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10].map(_content => ({
      widgetType: 'cardLib',
      widgetSubType: 'cardContentLib',
      widgetHostClass: 'mb-2',
      widgetData: {
        cardSubType: strip.loaderConfig && strip.loaderConfig.cardSubType || 'card-standard-skeleton',
        cardCustomeClass: strip.customeClass ? strip.customeClass : '',
      },
    }));
  }

  private async processStrip(
    strip: NsContentStripWithFacets.IContentStripUnit,
    results: NsWidgetResolver.IRenderConfigWithAnyData[] = [],
    fetchStatus: TFetchStatus,
    calculateParentStatus = true,
    _viewMoreUrl: any,
    tabsResults?: NsContentStripWithFacets.IContentStripTab[] | undefined,
    // calculateParentStatus is used so that parents' status is not re-calculated if the API is called again coz of filters, etc.
  ) {
    const stripData = {
      viewMoreUrl: strip.viewMoreUrl,
      key: strip.key,
      canHideStrip: Boolean(strip.canHideStrip),
      showStrip: this.getIfStripHidden(strip.key),
      noDataWidget: strip.noDataWidget,
      errorWidget: strip.errorWidget,
      stripInfo: strip.info,
      stripTitle: strip.title,
      stripTitleLink: strip.stripTitleLink,
      disableTranslate: strip.disableTranslate,
      sliderConfig: strip.sliderConfig,
      tabs: tabsResults ? tabsResults : strip.tabs,
      stripName: strip.name,
      mode: strip.mode,
      stripConfig: strip.stripConfig,
      stripBackground: strip.stripBackground,
      secondaryHeading: strip.secondaryHeading,
      loaderWidgets: strip.loaderWidgets || [],
      hideViewMoreUrl:strip.hideViewMoreUrl || false,
      widgets:
        fetchStatus === 'done'
          ? [
            ...(strip.preWidgets || []).map(w => ({
              ...w,
              widgetHostClass: `mb-2 ${w.widgetHostClass}`,
            })),
            ...results,
            ...(strip.postWidgets || []).map(w => ({
              ...w,
              widgetHostClass: `mb-2 ${w.widgetHostClass}`,
            })),
          ]
          : [],
      showOnNoData: Boolean(
        strip.noDataWidget &&
        !((strip.preWidgets || []).length + results.length + (strip.postWidgets || []).length) &&
        fetchStatus === 'done',
      ),
      showOnLoader: Boolean(strip.loader && fetchStatus === 'fetching'),
      showOnError: Boolean(strip.errorWidget && fetchStatus === 'error'),
    };
    // const stripData = this.stripsResultDataMap[strip.key]
    this.stripsResultDataMap = {
      ...this.stripsResultDataMap,
      [strip.key]: stripData,
    };
    if (!tabsResults) {
      if (
        calculateParentStatus &&
        (fetchStatus === 'done' || fetchStatus === 'error') &&
        stripData.widgets
      ) {
        this.checkParentStatus(fetchStatus, stripData.widgets.length);
      }
      if (calculateParentStatus && !(results && results.length > 0)) {
        this.contentAvailable = false;
      } else if (results && results.length > 0) {
        this.contentAvailable = true;
      }
    } else {
      this.contentAvailable = true;
    }
  }

  private checkParentStatus(fetchStatus: TFetchStatus, stripWidgetsCount: number): void {
    if (fetchStatus === 'done' && !stripWidgetsCount) {
      this.noDataCount += 1;
    } else if (fetchStatus === 'done' && stripWidgetsCount) {
      this.successDataCount += 1;
    } else if (fetchStatus === 'error') {
      this.errorDataCount += 1;
    }
    const settledCount = this.noDataCount + this.successDataCount + this.errorDataCount;
    const totalCount = this.widgetData.strips.length;
    if (this.successDataCount > 0 && settledCount < totalCount) {
      return;
    }
    this.showParentLoader = settledCount !== totalCount;
    this.showParentNoData =
      this.noDataCount > 0 && this.noDataCount + this.errorDataCount === totalCount;
    this.showParentError = this.errorDataCount === totalCount;
  }
  checkForEmptyWidget(strip: NsContentStripWithFacets.IContentStripUnit): boolean {
    if (
      strip.request &&
      ((strip.request.requestBody && Object.keys(strip.request.requestBody).length))
    ) {
      return true;
    }
    return false;
  }
  // strip settings
  toggleInfo(data: IStripUnitContentData) {
    const stripInfo = this.stripsResultDataMap[data.key].stripInfo;
    if (stripInfo) {
      if (stripInfo.mode !== 'below') {
        this.loggerSvc.warn(`strip info mode: ${stripInfo.mode} not implemented yet`);
        stripInfo.mode = 'below';
      }
      if (stripInfo.mode === 'below') {
        this.stripsResultDataMap[data.key].stripInfo = {
          ...stripInfo,
          visibilityMode: stripInfo.visibilityMode === 'hidden' ? 'visible' : 'hidden',
        };
      }
    }
  }

  raiseTelemetry(stripData: any){
    this.telemtryLearningContentResponse.emit(stripData)
  }
  setHiddenForStrip(key: string) {
    this.stripsResultDataMap[key].showStrip = false;
    sessionStorage.setItem(`cstrip_${key}`, '1');
  }
  // selected pills data
  getSelectedPillIndex(tabdata: any, tabIndex: any) {
    if(tabdata.pillsData && tabdata.pillsData.length) {
      let index = tabdata.pillsData.findIndex((pill: any) => {
          return pill.selected
      });
      return index
    }
    return 0
  }

  getdata(data: IStripUnitContentData) {
    if (data.stripInfo) {
      return data.stripInfo.widget;
    }
    return {};

  }

  public tabClicked(tabEvent: MatTabChangeEvent, pillIndex: any, stripMap: IStripUnitContentData, stripKey: string) {
    if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
      stripMap.tabs[tabEvent.index].pillsData[pillIndex].fetchTabStatus = 'inprogress';
      stripMap.tabs[tabEvent.index].pillsData[pillIndex].tabLoading = true;
      stripMap.showOnLoader = true;
    }
    const data: WsEvents.ITelemetryTabData = {
      label: `${tabEvent.tab.textLabel}`,
      index: tabEvent.index,
    };
    this.eventSvc.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: 'explore-learning-content',
        id: `${_.camelCase(data.label)}-tab`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    );

    const currentTabFromMap: any = stripMap.tabs && stripMap.tabs[tabEvent.index];
    const currentPillFromMap: any = stripMap.tabs && stripMap.tabs[tabEvent.index].pillsData[pillIndex];
    const currentStrip = this.widgetData.strips.find(s => s.key === stripKey);
    if (this.stripsResultDataMap[stripKey] && currentTabFromMap) {
      this.stripsResultDataMap[stripKey].viewMoreUrl.queryParams = {
        ...this.stripsResultDataMap[stripKey].viewMoreUrl.queryParams,
        tabSelected: currentTabFromMap.value,
        pillSelected: currentPillFromMap.value,
      };
    }

    if (currentStrip && currentTabFromMap && !currentTabFromMap.computeDataOnClick && currentPillFromMap) {
      if (currentPillFromMap.requestRequired && currentPillFromMap.request) {
        if (currentPillFromMap.request.searchV6) {
          // this.getTabDataByNewReqSearchV6(currentStrip, tabEvent.index, currentTabFromMap, true);
        }
      stripMap.tabs[tabEvent.index].pillsData[pillIndex].tabLoading = false;
      } else {
        this.getTabDataByfilter(currentStrip, currentTabFromMap, true);
        if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
          stripMap.tabs[tabEvent.index].pillsData[pillIndex].fetchTabStatus = 'inprogress';
          stripMap.tabs[tabEvent.index].pillsData[pillIndex].tabLoading = false;
          stripMap.showOnLoader = true;
          this.resetFilter(stripMap, tabEvent.index ,pillIndex)
        }
        setTimeout(() => {
          if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
            stripMap.tabs[tabEvent.index].pillsData[pillIndex].fetchTabStatus = 'done';
            stripMap.tabs[tabEvent.index].pillsData[pillIndex].tabLoading = false;
            stripMap.showOnLoader = false;
            this.resetSelectedPill(stripMap.tabs[tabEvent.index].pillsData)
            stripMap.tabs[tabEvent.index].pillsData[pillIndex]['selected']=true
          }
        },         200);
      }
    }
  }

  pillClicked(event: any, stripMap: IStripUnitContentData, stripKey: any, pillIndex: any, tabIndex: any) {
    if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
      stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'inprogress';
      stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = true;
      stripMap.showOnLoader = true;
    }
    const currentTabFromMap: any = stripMap.tabs && stripMap.tabs[tabIndex];
    const currentPillFromMap: any = stripMap.tabs && stripMap.tabs[tabIndex].pillsData[pillIndex];
    const currentStrip = this.widgetData.strips.find(s => s.key === stripKey);
    if (this.stripsResultDataMap[stripKey] && currentTabFromMap) {
      this.stripsResultDataMap[stripKey].viewMoreUrl.queryParams = {
        ...this.stripsResultDataMap[stripKey].viewMoreUrl.queryParams,
        tabSelected: currentTabFromMap.value,
        pillSelected: currentPillFromMap.value,
      };
    }
    if (currentStrip && currentTabFromMap && !currentTabFromMap.computeDataOnClick && currentPillFromMap) {
      if (currentPillFromMap.requestRequired && currentPillFromMap.request) {
        // call API to get tab data and process
        // this.processStrip(currentStrip, [], 'fetching', true, null)
        if (currentPillFromMap.request.searchV6) {
          // this.getTabDataByNewReqSearchV6(currentStrip, tabIndex, pillIndex, currentPillFromMap, true);
        } else if (currentPillFromMap.request.trendingSearch) {
          // this.getTabDataByNewReqTrending(currentStrip, tabIndex, pillIndex, currentPillFromMap, true);
        }
        // if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
        //   stripMap.tabs[tabEvent.index].tabLoading = false;
        // }

      stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false;
      } else {
        this.getTabDataByfilter(currentStrip, currentTabFromMap, true);
        if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
          stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'inprogress';
          stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false;
          stripMap.showOnLoader = true;
          this.resetFilter(stripMap, tabIndex ,pillIndex)
        }
        setTimeout(() => {
          if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
            stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'done';
            stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false;
            stripMap.showOnLoader = false;
            this.resetSelectedPill(stripMap.tabs[tabIndex].pillsData)
            stripMap.tabs[tabIndex].pillsData[pillIndex]['selected']=true
          }
        },         200);
      }
    }
  }

  resetSelectedPill(pillData: any){
    if(pillData && pillData.length){
      pillData.forEach((pill: any) => {
        pill['selected'] = false
      });
    }
  }

  getTabDataByfilter(
    strip: NsContentStripWithFacets.IContentStripUnit,
    currentTab: NsContentStripWithFacets.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    // tslint:disable:no-console
    console.log('strip -- ', strip);
    // tslint:disable:no-console
    console.log('currentTab -- ', currentTab);
    // tslint:disable:no-console
    console.log('calculateParentStatus-- ', calculateParentStatus);
    // TODO: Write logic for individual filter if passed in config
    // add switch case based on config key passed
  }

  private getIfStripHidden(key: string): boolean {
    const storageItem = sessionStorage.getItem(`cstrip_${key}`);
    return Boolean(storageItem !== '1');
  }

  // translate labes
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '');
  }

  redirectViewAll(stripData: any, path: string, queryParamsData: any) {
    if(this.emitViewAll) {
      this.viewAllResponse.emit(stripData)
    } else {
      this.router.navigate([path], {  queryParams: queryParamsData })
    }
  }
  identify(index: number, item: any) {
    if (index >= 0) { }
    return item;
  }
  tracker(index: number, item: any) {
    if (index >= 0) { }
    return _.get(item, 'widgetData.content.identifier')
  }

  getContineuLearningLenth(data: IStripUnitContentData) {
    return data.widgets ? data.widgets.length : 0;
  }

  showAccordion(key: string) {
    if (this.utilitySvc.isMobile && this.stripsResultDataMap[key].mode === 'accordion') {
      return this.showAccordionData;
    }
    return true;
  }

  checkCondition(wData: NsContentStripWithFacets.IContentStripMultiple, data: IStripUnitContentData) {
    if (wData.strips[0].stripConfig && wData.strips[0].stripConfig.hideShowAll) {
      return !wData.strips[0].stripConfig.hideShowAll;
    }
    return wData.strips[0].viewMoreUrl && data.widgets && data.widgets.length >= 4;
  }
  checkVisible(data: IStripUnitContentData) {
    return data.stripInfo && data.stripInfo.visibilityMode === 'visible';
  }

  getSelectedIndex(stripsResultDataMap: any, key: any): number {
    let returnValue = 0;
    return returnValue;
  }

  getLength(data: IStripUnitContentData) {
    if (!data.tabs || !data.tabs.length) {
      return data.widgets ? data.widgets.length : 0;
    } {
      // if tabs are there check if each tab has widgets and get the tab with max widgets
      let tabWithMaxWidgets: any = {}
      data.tabs.forEach((tab: any)=>{
        if(tab.pillsData && tab.pillsData.length){
          tabWithMaxWidgets = tab.pillsData.reduce(
            (prev: any, current: any) => {
              if (!prev.widgets && !current.widgets) {
                return current;
              }
              if (prev.widgets && current.widgets) {
                return (prev.widgets.length > current.widgets.length) ? prev : current;
              }
              if (current.widgets && !prev.widgets) {
                return current;
              }
              if (!current.widgets && prev.widgets) {
                return prev;
              }
              return current;
              // return (prev.widgets && current.widgets && (prev.widgets.length > current.widgets.length) ) ? prev : current
              // tslint:disable-next-line: align
            }, data.tabs[0]);

        }
      })
      // if tabs has atleast 1 widgets then strip will show or else not
      return tabWithMaxWidgets.widgets ? tabWithMaxWidgets.widgets.length : 0;
    }
  }
  isStripShowing(data: any) {
    let count = 0;
    
    if (data && data.key === this.environment.programStripKey && (!data.tabs || !data.tabs.length) &&
      data.stripTitle === this.environment.programStripName && data.widgets.length > 0) {
      data.widgets.forEach((key: any) => {
        if (key && key.widgetData.content.primaryCategory === this.environment.programStripPrimaryCategory) {
          count = count + 1;
        }
      });
      if (count > 0) {
        data.showStrip = true;
      } else {
        data.showStrip = false;
      }
    }
    // console.log('data.key', data, data.key, data.widgets);
    return data.showStrip;
  }
  get isMobile() {
    return this.utilitySvc.isMobile || false;
  }



  // search api with facets
  async postRequestMethod(strip: NsContentStripWithFacets.IContentStripUnit,
    request: NsContentStripWithFacets.IContentStripUnit['request'],
    apiUrl: string,
    calculateParentStatus: boolean
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (request && request) {
        this.contentSvc.postApiMethod(apiUrl, request).subscribe(results => {
          if (results.result && results.result.content) {
            const showViewMore = Boolean(
              results.result.content && results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
            );
            const viewMoreUrl = showViewMore
              ? {
                path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
                queryParams: {
                  tab: 'Learn',
                  q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
                  f: {},
                },
              }
              : null;
            resolve({ results, viewMoreUrl });
          }
        }, (error: any) => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null);
          reject(error);
        },
        );
      }
    });
  }

  async fetchFromSearch(strip: NsContentStripWithFacets.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && Object.keys(strip.request.requestBody).length) {
        try {
          const response = await this.postRequestMethod(strip, strip.request.requestBody, strip.request.apiUrl, calculateParentStatus);
          let tabIndex=0
          let pillIndex= 0
          if (response.results && response.results.result && response.results.result.content && response.results.result.content.length > 0) {
            this.mapAllDataWithFacets(strip, response.results.result.content, response.results.result.facets, calculateParentStatus)
            const widgets = this.transformContentsToWidgets(response.results.result.content, strip);
            let tabResults: any[] = [];
            // if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
            //   const allTabs = this.stripsResultDataMap[strip.key].tabs;
            //   const allPills = this.stripsResultDataMap[strip.key].tabs[tabIndex].pillsData;
            //   this.resetSelectedPill(allPills)
            //   if (allTabs && allTabs.length && allTabs[tabIndex]) {
            //     if(allPills && allPills.length && allPills[pillIndex]){
            //       allPills[pillIndex] = {
            //         ...allPills[pillIndex],
            //         widgets,
            //         fetchTabStatus: 'done',
            //         selected: true
            //       };
            //     }
            //     allTabs[tabIndex] = {
            //       ...allTabs[tabIndex],
            //       widgets,
            //       fetchTabStatus: 'done',
            //     };
            //     tabResults = allTabs;
            //   }
            // }
            // this.processStrip(
            //   strip,
            //   widgets,
            //   'done',
            //   calculateParentStatus,
            //   response.viewMoreUrl,
            //   tabResults // tabResults as widgets
            // );
          } else {
            this.processStrip(strip, [], 'error', calculateParentStatus, null);
          }
        } catch (error) {
          // Handle errors
          // console.error('Error:', error);
        }
      
    }
  }

  mapAllDataWithFacets(strip :any, content : any, facets:any, calculateParentStatus: any) {
    console.log(strip, content)
    const allTabs = this.stripsResultDataMap[strip.key].tabs;
    let facet: any = []
    allTabs.forEach((ele: any)=> {
      ele['fetchTabStatus']= 'done'
      let filteredData =  content.filter((contEle: any) => contEle.nlwUserExp.includes(ele.value))
      // filteredData.forEach(element => {
      //   facet =  [...facet,..._.difference(element.nlwOrgs ,facet)];
      // });
      ele['widgets'] = filteredData
      ele.pillsData.forEach((pill: any) => {
        if(pill.value === 'all') {
          pill['widgets'] = this.transformContentsToWidgets(filteredData, strip);
          pill['fetchTabStatus']= 'done'
        } else if(pill.value === 'course') {
          let contentFilteredData =  filteredData.filter((contEle: any) => contEle.courseCategory.toLowerCase() === pill.value)
          pill['widgets'] = this.transformContentsToWidgets(contentFilteredData, strip);
          pill['fetchTabStatus']= 'done'
        } else {
          let contentFilteredData =  filteredData.filter((contEle: any) => contEle.courseCategory.toLowerCase() !== 'course')
          pill['widgets'] = this.transformContentsToWidgets(contentFilteredData, strip);
          pill['fetchTabStatus']= 'done'
        }
      })

      // ele['facets'] = [{
      //   name:'nlwOrgs',
      //   values: facet
      // }]
      ele['facets'] = facets
    })
    strip.tabs[0].pillsData[0].fetchTabStatus = 'done';
    strip.tabs[0].pillsData[0].tabLoading = false;
    strip.showOnLoader = false;
    this.resetSelectedPill(strip.tabs[0].pillsData)
    strip.tabs[0].pillsData[0]['selected']=true
    this.processStrip(
              strip,
              [],
              'done',
              calculateParentStatus,
              strip.viewMoreUrl,
              allTabs // tabResults as widgets
            );
  }

  private transformContentsToWidgets(
    contents: NsContent.IContent[],
    strip: NsContentStripWithFacets.IContentStripUnit,
  ) {
    return (contents || []).map((content, idx) => (
      content ? {
        widgetType: 'cardLib',
        widgetSubType: 'cardContentLib',
        widgetHostClass: 'mb-2',
        widgetData: {
          content,
          ...(content.batch && { batch: content.batch }),
          cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
          cardCustomeClass: strip.customeClass ? strip.customeClass : '',
          context: { pageSection: strip.key, position: idx },
          intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
          deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
          contentTags: strip.stripConfig && strip.stripConfig.contentTags,
        },
      } : {
        widgetType: 'card',
        widgetSubType: 'cardContent',
        widgetHostClass: 'mb-2',
        widgetData: {},
      }
    ));
  }

  getorgData(eventData: any, stripMap: any, tabIndex: any) {
    console.log(eventData)
    let selectedValue = eventData.target.value
    let pillIndex: any = this.getSelectedPillIndex(stripMap.tabs[tabIndex], tabIndex)
    if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
      stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'inprogress';
      stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false;
      stripMap.showOnLoader = true;
      let returnedValues = stripMap.tabs[tabIndex].widgets.filter((ele: any) => {
        var words = ele.nlwOrgs.map(v => v.toLowerCase());
        return words.includes(selectedValue)
      })
      stripMap.tabs[tabIndex].pillsData[pillIndex]['widgets'] = this.transformContentsToWidgets(returnedValues, stripMap);
    }
    setTimeout(() => {
      if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
        stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'done';
        stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false;
        stripMap.showOnLoader = false;
        this.resetSelectedPill(stripMap.tabs[tabIndex].pillsData)
        stripMap.tabs[tabIndex].pillsData[pillIndex]['selected']=true
      }
    },         200);
  }

  resetFilter(stripMap: any,  tabIndex: any, pillIndex: any) {
    // let selectedValue = eventData.target.value
    if(pillIndex) {
     pillIndex = this.getSelectedPillIndex(stripMap.tabs[tabIndex], tabIndex)
    }
    this.facetForm.reset({
      org: 0
     });
    if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
      stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'inprogress';
      stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false;
      stripMap.showOnLoader = true;
      // let returnedValues = stripMap.tabs[tabIndex].widgets.filter((ele: any) => {
      //   var words = ele.nlwOrgs.map(v => v.toLowerCase());
      //   return words.includes(selectedValue)
      // })
      let contentData: any = stripMap.tabs[tabIndex].widgets || []
      stripMap.tabs[tabIndex].pillsData[pillIndex]['widgets'] = this.transformContentsToWidgets(contentData, stripMap);
    }
    setTimeout(() => {
      if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
        stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'done';
        stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false;
        stripMap.showOnLoader = false;
        this.resetSelectedPill(stripMap.tabs[tabIndex].pillsData)
        stripMap.tabs[tabIndex].pillsData[pillIndex]['selected']=true
      }
    },         200);
  }
}
