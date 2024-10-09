import { Component, OnInit, Input, OnDestroy, HostBinding, Inject, EventEmitter, Output } from '@angular/core';
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver-v2';
import { NsContentStripWithTabsAndPills } from './content-strip-with-tabs-pills.model';
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

interface IStripUnitContentData {
  key: string;
  canHideStrip: boolean;
  mode?: string;
  showStrip: boolean;
  disableTranslate: boolean;
  widgets?: NsWidgetResolver.IRenderConfigWithAnyData[];
  stripTitle: string;
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
  tabs?: NsContentStripWithTabsAndPills.IContentStripTab[] | undefined;
  stripName?: string;
  stripLogo?: string;
  description?: string;
  stripInfo?: NsContentStripWithTabsAndPills.IStripInfo;
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
  selector: 'sb-uic-content-strip-with-tabs-pills',
  templateUrl: './content-strip-with-tabs-pills.component.html',
  styleUrls: ['./content-strip-with-tabs-pills.component.scss']
})
export class ContentStripWithTabsPillsComponent extends WidgetBaseComponent
implements
OnInit,
OnDestroy,
NsWidgetResolver.IWidgetData<NsContentStripWithTabsAndPills.IContentStripMultiple> {
  @Input() widgetData!: NsContentStripWithTabsAndPills.IContentStripMultiple;
  @Output() emptyResponse = new EventEmitter<any>()
  @Output() viewAllResponse = new EventEmitter<any>()
  @Output() telemtryResponse = new EventEmitter<any>()
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

  constructor(
    // private contentStripSvc: ContentStripNewMultipleService,
    @Inject('environment') environment: any,
    private contentSvc: WidgetContentLibService,
    private loggerSvc: LoggerService,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    public utilitySvc: UtilityService,
    // private http: HttpClient,
    // private searchServSvc: SearchServService,
    public router: Router,
    private userSvc: WidgetUserServiceLib,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
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

  ngOnInit() {
    // const url = window.location.href
    this.initData();
    this.contentSvc.telemetryData$.subscribe((data: any) => {
      this.telemtryResponse.emit(data)
    })

  
  }

  ngOnDestroy() {
    if (this.changeEventSubscription) {
      this.changeEventSubscription.unsubscribe();
    }
  }

  showAccordion(key: string) {
    if (this.utilitySvc.isMobile && this.stripsResultDataMap[key].mode === 'accordion') {
      return this.showAccordionData;
    }
    return true;
  }

  setHiddenForStrip(key: string) {
    this.stripsResultDataMap[key].showStrip = false;
    sessionStorage.setItem(`cstrip_${key}`, '1');
  }
  private getIfStripHidden(key: string): boolean {
    const storageItem = sessionStorage.getItem(`cstrip_${key}`);
    return Boolean(storageItem !== '1');
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

  getdata(data: IStripUnitContentData) {
    if (data.stripInfo) {
      return data.stripInfo.widget;
    }
    return {};

  }
  checkCondition(wData: NsContentStripWithTabsAndPills.IContentStripMultiple, data: IStripUnitContentData) {
    if (wData.strips[0].stripConfig && wData.strips[0].stripConfig.hideShowAll) {
      return !wData.strips[0].stripConfig.hideShowAll;
    }
    return wData.strips[0].viewMoreUrl && data.widgets && data.widgets.length >= 4;
  }
  checkVisible(data: IStripUnitContentData) {
    return data.stripInfo && data.stripInfo.visibilityMode === 'visible';
  }

  getContineuLearningLenth(data: IStripUnitContentData) {
    return data.widgets ? data.widgets.length : 0;
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

  private getFiltersFromArray(v6filters: any) {
    const filters: any = {};
    if (v6filters.constructor === Array) {
      v6filters.forEach(((f: any) => {
        Object.keys(f).forEach(key => {
          filters[key] = f[key];
        });
      }));
      return filters;
    }
    return v6filters;
  }

  private transformSearchV6FiltersV2(v6filters: any) {
    const filters: any = {};
    if (v6filters.constructor === Array) {
      v6filters.forEach(((f: any) => {
        Object.keys(f).forEach(key => {
          filters[key] = f[key];
        });
      }));
      return filters;
    }
    return v6filters;
  }

  checkForDateFilters(filters: any) {
    let userData: any;
    if (this.configSvc.userProfile) {
      userData = this.configSvc.userProfile;
    }

    if (filters && filters.hasOwnProperty('batches.endDate')) {
      // tslint:disable-next-line
      filters['batches.endDate']['>='] = eval(filters['batches.endDate']['>='])
    } else if (filters && filters.hasOwnProperty('batches.enrollmentEndDate')) {
      // tslint:disable-next-line
      filters['batches.enrollmentEndDate']['>='] = eval(filters['batches.enrollmentEndDate']['>='])
    } else if (filters.organisation &&
      filters.organisation.indexOf('<orgID>') >= 0
    ) {
      if(this.providerId) {
        filters.organisation = this.providerId;
      } else {
        filters.organisation = userData && userData.rootOrgId;

        if (filters && filters.hasOwnProperty('designation')) {
          filters.designation = userData.professionalDetails.length > 0 ?
            userData.professionalDetails[0].designation : '';
        }
      }
      
    }
    return filters;
  }

  private fetchStripFromRequestData(
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    calculateParentStatus = true,
  ) {
    // setting initial values
    strip.loaderWidgets = this.transformSkeletonToWidgets(strip);
    this.processStrip(strip, [], 'fetching', false, null);
    this.fetchFromSearchV6(strip, calculateParentStatus);
    this.fetchForYouData(strip, calculateParentStatus)
    this.fetchAllCbpPlans(strip, calculateParentStatus);
    
    // this.enrollInterval = setInterval(() => {
    //   this.fetchAllCbpPlans(strip, calculateParentStatus)
    // },                                1000)
  }

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

  private transformContentsToWidgets(
    contents: NsContent.IContent[],
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
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

  private transformEventsToWidgets(
    contents: ITodayEvents[],
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
  ) {
    this.eventSvc.setEventListData(contents);
    return (this.eventSvc.todaysEvents || []).map((content: any, idx: any) => (content ? {
      widgetType: 'card',
      widgetSubType: 'eventHubCard',
      widgetHostClass: 'mb-2',
      widgetData: {
        content,
        cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
        cardCustomeClass: strip.customeClass ? strip.customeClass : '',
        context: { pageSection: strip.key, position: idx },
        intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
        deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
        contentTags: strip.stripConfig && strip.stripConfig.contentTags,
      },
    } : {
      widgetType: 'card',
      widgetSubType: 'eventHubCard',
      widgetHostClass: 'mb-2',
      widgetData: {},
    }
    ));
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
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    results: NsWidgetResolver.IRenderConfigWithAnyData[] = [],
    fetchStatus: TFetchStatus,
    calculateParentStatus = true,
    _viewMoreUrl: any,
    tabsResults?: NsContentStripWithTabsAndPills.IContentStripTab[] | undefined,
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
  checkForEmptyWidget(strip: NsContentStripWithTabsAndPills.IContentStripUnit): boolean {
    if (
      strip.request &&
      ((strip.request.api && Object.keys(strip.request.api).length) ||
        (strip.request.search && Object.keys(strip.request.search).length) ||
        (strip.request.searchRegionRecommendation &&
          Object.keys(strip.request.searchRegionRecommendation).length) ||
        (strip.request.cbpList && Object.keys(strip.request.cbpList).length) ||
        (strip && strip.tabs.length)
      )
    ) {
      return true;
    }
    return false;
  }


  getTabDataByfilter(
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    currentTab: NsContentStripWithTabsAndPills.IContentStripTab,
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

  getSelectedIndex(stripsResultDataMap: any, key: any): number {
    let returnValue = 0;
    return returnValue;
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '');
  }

  identify(index: number, item: any) {
    if (index >= 0) { }
    return item;
  }
  tracker(index: number, item: any) {
    if (index >= 0) { }
    return _.get(item, 'widgetData.content.identifier')
  }

  raiseTelemetry(stripData: any){
    this.telemtryResponse.emit(stripData)
  }

  redirectViewAll(stripData: any, path: string, queryParamsData: any) {
    if(this.emitViewAll) {
      this.viewAllResponse.emit(stripData)
    } else {
      this.router.navigate([path], {  queryParams: queryParamsData })
    }
  }

  // new code writting from here====new====

  fetchForYouData(strip: NsContentStripWithTabsAndPills.IContentStripUnit, calculateParentStatus = true) {
    if (strip && strip.type === 'forYou') {
      if (strip.tabs && strip.tabs.length) {
        const firstTab = strip.tabs[0];
        const pillData = firstTab.pillsData[0]
        if (pillData.requestRequired) {
          if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
            const allPills = this.stripsResultDataMap[strip.key].tabs[0].pillsData;
            const currenPillsFromMap = (allPills && allPills.length && allPills[0]) as NsContentStripWithTabsAndPills.IContentStripTab;
            this.getTabDataByNewReqTrending(strip, 0, 0, currenPillsFromMap, calculateParentStatus);
            if (this.stripsResultDataMap[strip.key] && currenPillsFromMap) {
              this.stripsResultDataMap[strip.key].viewMoreUrl.queryParams = {
                ...this.stripsResultDataMap[strip.key].viewMoreUrl.queryParams,
                key:strip.key,
                tabSelected: firstTab.value,
                pillSelected: pillData.value,
              };
            }
          }
        }
  
      }
    }
  }

  async fetchFromSearchV6(strip: NsContentStripWithTabsAndPills.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.searchV6 && Object.keys(strip.request.searchV6).length) {
      // if (!(strip.request.searchV6.locale && strip.request.searchV6.locale.length > 0)) {
      //   if (this.configSvc.activeLocale) {
      //     strip.request.searchV6.locale = [this.configSvc.activeLocale.locals[0]]
      //   } else {
      //     strip.request.searchV6.locale = ['en']
      //   }
      // }
      let originalFilters: any = [];
      // tslint:disable:no-console
      if (strip.request &&
        strip.request.searchV6 &&
        strip.request.searchV6.request &&
        strip.request.searchV6.request.filters) {
        originalFilters = strip.request.searchV6.request.filters;
        strip.request.searchV6.request.filters = this.checkForDateFilters(strip.request.searchV6.request.filters);
        strip.request.searchV6.request.filters = this.getFiltersFromArray(
          strip.request.searchV6.request.filters,
        );
      }
      if (strip.tabs && strip.tabs.length) {
        // TODO: Have to extract requestRequired to outer level of tabs config
        const firstTab = strip.tabs[0];
        if (firstTab.requestRequired) {
          if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
            const allTabs = this.stripsResultDataMap[strip.key].tabs;
            const currentTabFromMap = (allTabs && allTabs.length && allTabs[0]) as NsContentStripWithTabsAndPills.IContentStripTab;

            this.getTabDataByNewReqSearchV6(strip, 0, 0, currentTabFromMap, calculateParentStatus);
          }
        }

      } else {
        try {
          const response = await this.searchV6Request(strip, strip.request, calculateParentStatus);
          // console.log('calling  after - response, ', response)
          if (response && response.results) {
            // console.log('calling  after-- ')
            if (response.results.result.content) {
              
                this.processStrip(
                  strip,
                  this.transformContentsToWidgets(response.results.result.content, strip),
                  'done',
                  calculateParentStatus,
                  response.viewMoreUrl,
                );
              
            
            } else if (response.results.result.Event) {
              this.processStrip(
                strip,
                this.transformEventsToWidgets(response.results.result.Event, strip),
                'done',
                calculateParentStatus,
                response.viewMoreUrl,
              );
            } else {
              this.processStrip(strip, [], 'error', calculateParentStatus, null);
            }

          } else {
            this.processStrip(strip, [], 'error', calculateParentStatus, null);
          }
        } catch (error) {
          // Handle errors
          // console.error('Error:', error);
        }
      }
    }
  }

  async getTabDataByNewReqTrending(
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    tabIndex: number,
    pillIndex: number,
    currentTab: NsContentStripWithTabsAndPills.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    try {
      const response = await this.trendingSearchRequest(strip, currentTab.request, calculateParentStatus);
      let tabResults: any[] = [];
      if (response && response.results && response.results.response) {
        const content = response.results.response[currentTab.value] || [];
        const widgets = this.transformContentsToWidgets(content, strip);
       
        if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
          const allTabs = this.stripsResultDataMap[strip.key].tabs;
          const allPills = this.stripsResultDataMap[strip.key].tabs[tabIndex].pillsData;
          this.resetSelectedPill(allPills)
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            if(allPills && allPills.length && allPills[pillIndex]){
              allPills[pillIndex] = {
                ...allPills[pillIndex],
                widgets,
                fetchTabStatus: 'done',
                selected: true
              };
            }
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
              fetchTabStatus: 'done',
            };
            tabResults = allTabs;
          }
        }
        this.processStrip(
          strip,
          widgets,
          'done',
          calculateParentStatus,
          response.viewMoreUrl,
          tabResults // tabResults as widgets
        );
      } else {
        if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
          const allTabs = this.stripsResultDataMap[strip.key].tabs;
          const allPills = this.stripsResultDataMap[strip.key].tabs[tabIndex].pillsData;
          this.resetSelectedPill(allPills)
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            if(allPills && allPills.length && allPills[pillIndex]){
              allPills[pillIndex] = {
                ...allPills[pillIndex],
                widgets:[],
                fetchTabStatus: 'done',
                selected: true
              };
            }
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets:[],
              fetchTabStatus: 'done',
            };
            tabResults = allTabs;
          }
        }
        this.processStrip(strip, [], 'done', calculateParentStatus, null);
      }
    } catch (error) {
      // Handle errors
      this.processStrip(strip, [], 'error', calculateParentStatus, null);
    }
  }

  async getTabDataByNewReqSearchV6(
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    tabIndex: number,
    pillIndex: number,
    currentTab: NsContentStripWithTabsAndPills.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    try {
      const response = await this.searchV6Request(strip, currentTab.request, calculateParentStatus);
      if (response && response.results) {
        const widgets = this.transformContentsToWidgets(response.results.result.content, strip);
        let tabResults: any[] = [];
        if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
          const allTabs = this.stripsResultDataMap[strip.key].tabs;
          const allPills = this.stripsResultDataMap[strip.key].tabs[tabIndex].pillsData;
          this.resetSelectedPill(allPills)
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            if(allPills && allPills.length && allPills[pillIndex]){
              allPills[pillIndex] = {
                ...allPills[pillIndex],
                widgets,
                fetchTabStatus: 'done',
                selected: true
              };
            }
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
              fetchTabStatus: 'done',
            };
            tabResults = allTabs;
          }
        }
        this.processStrip(
          strip,
          widgets,
          'done',
          calculateParentStatus,
          response.viewMoreUrl,
          tabResults // tabResults as widgets
        );
      } else {
        this.processStrip(strip, [], 'error', calculateParentStatus, null);
      }
    } catch (error) {
      // Handle errors
      // console.error('Error:', error);
    }
  }

  async trendingSearchRequest(strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    request: NsContentStripWithTabsAndPills.IContentStripUnit['request'],
    calculateParentStatus: boolean
    ): Promise<any> {
      const originalFilters: any = [];
      return new Promise<any>((resolve, reject) => {
        if (request && request.trendingSearch) {
        // check for the request if it has dynamic values]
          if (request.trendingSearch.request.filters.organisation &&
          request.trendingSearch.request.filters.organisation.indexOf('<orgID>') >= 0
          ) {
          let userRootOrgId;
          if (this.configSvc.userProfile) {
          userRootOrgId = this.configSvc.userProfile.rootOrgId;
          }
          request.trendingSearch.request.filters.organisation = userRootOrgId;
          }
          this.contentSvc.trendingContentSearch(request.trendingSearch).subscribe(results => {
            const showViewMore = Boolean(
            results.result &&
            strip.request &&
            results.result[strip.request.trendingSearch.responseKey] &&
            results.result[strip.request.trendingSearch.responseKey].length > 5 &&
            strip.stripConfig && strip.stripConfig.postCardForSearch,
            );

            const viewMoreUrl = showViewMore
            ? {
            path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
            queryParams: {
            tab: 'Learn',
            q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
            f:
            request &&
            request.trendingSearch &&
            request.trendingSearch.request &&
            request.trendingSearch.request.filters
            ? JSON.stringify(
            this.transformSearchV6FiltersV2(
            originalFilters,
            )
            )
            : {},
            },
            }
            : null;

            let proccesedResult: any = []
            if (results && results.response && results.response.certifications) {
              results.response.certifications.map((result: any) => {
                if (result.source === this.channnelName) {
                  proccesedResult.push(result)
                }
              })
              results = {response: {certifications: proccesedResult}}
            }
            resolve({ results, viewMoreUrl });
          },                                                                      (error: any) => {
            if (error.error && error.error.status === 400) {
              this.processStrip(strip, [], 'done', calculateParentStatus, null);
            }
            // this.processStrip(strip, [], 'done', calculateParentStatus, null)
            reject(error);
          },);
        }
      });
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
          subType: WsEvents.EnumInteractSubTypes.HOME_PAGE_STRIP_TABS,
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
          // call API to get tab data and process
          // this.processStrip(currentStrip, [], 'fetching', true, null)
          if (currentPillFromMap.request.searchV6) {
            this.getTabDataByNewReqSearchV6(currentStrip, tabEvent.index, 0, currentPillFromMap, true);
          } else if (currentPillFromMap.request.trendingSearch) {
            this.getTabDataByNewReqTrending(currentStrip, tabEvent.index, 0, currentPillFromMap, true);
          }
          // if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
          //   stripMap.tabs[tabEvent.index].tabLoading = false;
          // }

        stripMap.tabs[tabEvent.index].pillsData[pillIndex].tabLoading = false;
        } else {
          // this.getTabDataByfilter(currentStrip, currentTabFromMap, true);
          // setTimeout(() => {
          //   if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
          //       stripMap.tabs[tabEvent.index].tabLoading = false;
          //       stripMap.tabs[tabEvent.index].fetchTabStatus = 'done';
          //       stripMap.showOnLoader = false;
          //   }
          // },         200);
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
            this.getTabDataByNewReqSearchV6(currentStrip, tabIndex, pillIndex, currentPillFromMap, true);
          } else if (currentPillFromMap.request.trendingSearch) {
            this.getTabDataByNewReqTrending(currentStrip, tabIndex, pillIndex, currentPillFromMap, true);
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

    async searchV6Request(strip: NsContentStripWithTabsAndPills.IContentStripUnit,
      request: NsContentStripWithTabsAndPills.IContentStripUnit['request'],
      calculateParentStatus: boolean
        ): Promise<any> {
        const originalFilters: any = [];
        return new Promise<any>((resolve, reject) => {
        if (request && request.searchV6) {
        this.contentSvc.searchV6(request.searchV6).subscribe(results => {
        const showViewMore = Boolean(
        results.result.content && results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
        );
        const viewMoreUrl = showViewMore
        ? {
        path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
        queryParams: {
        tab: 'Learn',
        q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
        f:
        request &&
          request.searchV6 &&
          request.searchV6.request &&
          request.searchV6.request.filters
          ? JSON.stringify(
            this.transformSearchV6FiltersV2(
              originalFilters,
            )
          )
          : {},
        },
        }
        : null;
        // if (viewMoreUrl && viewMoreUrl.queryParams) {
        //   viewMoreUrl.queryParams = viewMoreUrl.queryParams
        // }
        resolve({ results, viewMoreUrl });
        },                                                   (error: any) => {
        this.processStrip(strip, [], 'error', calculateParentStatus, null);
        reject(error);
        },
        );
        }
        });
  }


  getSelectedPillIndex(tabdata: any, tabIndex: any) {
    if(tabdata.pillsData && tabdata.pillsData.length) {
      let index = tabdata.pillsData.findIndex((pill: any) => {
          return pill.selected
      });
      return index
    }
    return 0
  }





  // cbp plans

  async fetchAllCbpPlans(strip: any, calculateParentStatus = true) {
    if (strip.request && strip.request.cbpList && Object.keys(strip.request.cbpList).length) {

      let courses: NsContent.IContent[];
      let tabResults: any[] = [];
      let userId = this.configSvc.userProfile.userId
      const response = await this.userSvc.fetchCbpPlanList(userId).toPromise();
      if (response) {
            courses = response;
            if (strip.tabs && strip.tabs.length) {
              tabResults = this.splitCbpTabsData(courses, strip);
              let countOfWidget = true
              if(strip && strip.tabs && strip.tabs.length) {
                strip.tabs.forEach((tab:any)=> {
                  if(tab.pillsData && tab.pillsData.length) {
                    tab.pillsData.forEach((pill: any) => {
                      if(pill && pill.widgets && pill.widgets.length){
                        if(countOfWidget){
                          pill.selected = true
                          countOfWidget= false
                        }
                      }
                    });
                  }
                })
              }
              await this.processStrip(
                strip,
                this.transformContentsToWidgets(courses, strip),
                'done',
                calculateParentStatus,
                '',
                tabResults
              );
            } else {
              this.processStrip(
                strip,
                this.transformContentsToWidgets(courses, strip),
                'done',
                calculateParentStatus,
                'viewMoreUrl',
              );
            }
      }
      clearInterval(this.enrollInterval);
    }
  }

  splitCbpTabsData(contentNew: NsContent.IContent[], strip: NsContentStripWithTabsAndPills.IContentStripUnit) {
    let tabResults: any[] = [];
    const splitData = this.getTabsList(
      contentNew,
      strip,
    );
    if (strip.tabs && strip.tabs.length) {
      for (let i = 0; i < strip.tabs.length; i += 1) {
        if( strip.tabs[i].value === "myIgotPlans") {
          let checkWidgetAndActivePill = true
          if (strip.tabs[i].pillsData && strip.tabs[i].pillsData.length) {
            for (let j = 0; j < strip.tabs[i].pillsData.length; j += 1) {
              // if(j === 0 ){
                // if(strip.tabs[i].pillsData[j].widgets && strip.tabs[i].pillsData[j].widgets.length ) {
                //   strip.tabs[i].pillsData[j].selected = true
                //   checkWidgetAndActivePill = false
                // }
                // strip.tabs[i].pillsData[j].selected = true
              // }
              if (strip.tabs[i].pillsData[j]) {
                tabResults.push(
                  {
                    ...strip.tabs[i].pillsData[j],
                    fetchTabStatus: 'done',
                    ...(splitData.find(itmInner => {
                      if (strip.tabs[i].pillsData&& strip.tabs[i].pillsData[j] && itmInner.value === strip.tabs[i].pillsData[j].value) {
                        return itmInner;
                      }
                      return undefined;
                    })),
                  }
                );
              }
            }
            strip.tabs[i].pillsData = tabResults
          }
        }
      }
    }
    
    return strip.tabs;
  }

  getTabsList(array: NsContent.IContent[],
              strip: NsContentStripWithTabsAndPills.IContentStripUnit) {
    let all: any[] = [];
    let upcoming: any[] = [];
    let overdue: any[] = [];
    array.forEach((e: any) => {
      all.push(e);
      if (e.planDuration === NsCardContent.ACBPConst.OVERDUE) {
        overdue.push(e);
      } else if (e.planDuration === NsCardContent.ACBPConst.UPCOMING) {
        upcoming.push(e);
      }
    });
    const allCompleted = all.filter((allData: any) => allData.contentStatus === 2);
    let allInCompleted = all.filter((allData: any) => allData.contentStatus < 2);

    let allCompletedOverDue = allCompleted.filter((allData: any) => allData.planDuration === NsCardContent.ACBPConst.OVERDUE);
    const allCompletedAll = allCompleted.filter((allData: any) =>  allData.planDuration !== NsCardContent.ACBPConst.OVERDUE);

    allCompletedOverDue = allCompletedOverDue.sort((a: any, b: any): any => {
      if (a.planDuration === NsCardContent.ACBPConst.OVERDUE && b.planDuration === NsCardContent.ACBPConst.OVERDUE) {
        const firstDate: any = new Date(a.endDate);
        const secondDate: any = new Date(b.endDate);
        return  firstDate > secondDate  ? -1 : 1;
      }
    });

    allInCompleted = allInCompleted.sort((a: any, b: any): any => {
      if (a.planDuration === NsCardContent.ACBPConst.OVERDUE && b.planDuration === NsCardContent.ACBPConst.OVERDUE) {
        const firstDate: any = new Date(a.endDate);
        const secondDate: any = new Date(b.endDate);
        return  firstDate > secondDate  ? -1 : 1;
      }
    });

    all = [...allInCompleted, ...allCompletedAll, ...allCompletedOverDue];

    overdue = overdue.filter((data: any): any => {
      return data.contentStatus < 2;
    });

    overdue = overdue.sort((a: any, b: any): any => {
        const firstDate: any = new Date(a.endDate);
        const secondDate: any = new Date(b.endDate);
        return  firstDate > secondDate  ? -1 : 1;
    });

    upcoming = upcoming.filter((data: any): any => {
      return data.contentStatus < 2;
    });
    
    return [
    { value: 'all', widgets: this.transformContentsToWidgets(all, strip) },
    { value: 'upcoming', widgets: this.transformContentsToWidgets(upcoming, strip) },
    { value: 'completed', widgets: this.transformContentsToWidgets(allCompleted, strip) },
    { value: 'overdue', widgets: this.transformContentsToWidgets(overdue, strip) }];
  }
  resetSelectedPill(pillData: any){
    if(pillData && pillData.length){
      pillData.forEach((pill: any) => {
        pill['selected'] = false
      });
    }
  }

}
