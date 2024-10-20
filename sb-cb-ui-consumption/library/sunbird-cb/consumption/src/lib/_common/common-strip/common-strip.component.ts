import { Component, OnInit, Input, OnDestroy, HostBinding, Inject } from '@angular/core';
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver-v2';
import { NsCommonStrip } from './common-strip.model';
// import { HttpClient } from '@angular/common/http'
import { WidgetContentLibService } from '../../_services/widget-content-lib.service';
import { NsContent } from '../../_models/widget-content.model';
import { MultilingualTranslationsService } from '../../_services/multilingual-translations.service';
import {
  TFetchStatus,
  LoggerService,
  EventService,
  ConfigurationsService,
  UtilityService,
} from '@sunbird-cb/utils-v2';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { WidgetUserServiceLib } from '../../_services/widget-user-lib.service';
// import { environment } from 'src/environments/environment'
// tslint:disable-next-line
import * as _ from 'lodash'
import { MatTabChangeEvent } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CommonMethodsService } from '../../_services/common-methods.service';


interface IStripUnitCommonData {
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
  tabs?: NsCommonStrip.ICommonStripTab[] | undefined;
  stripName?: string;
  stripLogo?: string;
  description?: string;
  stripInfo?: NsCommonStrip.IStripInfo;
  noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData;
  errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData;
  showOnNoData: boolean;
  showOnLoader: boolean;
  showOnError: boolean;
  loaderWidgets?: any;
  stripBackground?: string;
  secondaryHeading?: any;
  viewMoreUrl: any;
}

@Component({
  selector: 'sb-uic-common-strip',
  templateUrl: './common-strip.component.html',
  styleUrls: ['./common-strip.component.scss']
})
export class CommonStripComponent extends WidgetBaseComponent
implements
OnInit,
OnDestroy,
NsWidgetResolver.IWidgetData<NsCommonStrip.ICommonStrip> {
  @Input() widgetData!: NsCommonStrip.ICommonStrip;
  @HostBinding('id')
  public id = `ws-strip-miltiple_${Math.random()}`;
  stripsResultDataMap: { [key: string]: IStripUnitCommonData } = {};
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
    @Inject('environment') environment: any,
    private contentSvc: WidgetContentLibService,
    private loggerSvc: LoggerService,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    public utilitySvc: UtilityService,
    // private http: HttpClient,
    // private searchServSvc: SearchServService,
    private userSvc: WidgetUserServiceLib,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private commonMethodsSvc: CommonMethodsService
  ) {
    super();
    this.environment = environment
  }

  ngOnInit() {
    // const url = window.location.href
    this.initData();
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
    // null check if in case no strips key in config
    if(this.widgetData && this.widgetData.strips) {
      // Fetch the data
      for (const strip of this.widgetData.strips) {
        this.processStrip(strip, [], 'fetching', false, null);
        if(strip.dataType === 'in-hand' && this.widgetData[strip.dataKey]){
          this.processStrip(
            strip,
            this.commonMethodsSvc.transformContentsToWidgets(this.widgetData[strip.dataKey], strip),
            'done',
            true,
            strip.viewMoreUrl || '',
          );
        } else {
          if (this.checkForEmptyWidget(strip)) {
            // this.fetchStripFromRequestData(strip, false);
          } else {
            this.processStrip(strip, [], 'done', true, null);
          }
        }
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
      // this.fetchStripFromRequestData(stripData, calculateParentStatus);
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
    return data.showStrip;
  }

  get isMobile() {
    return this.utilitySvc.isMobile || false;
  }

  getdata(data: IStripUnitCommonData) {
    if (data.stripInfo) {
      return data.stripInfo.widget;
    }
    return {};

  }
  checkCondition(wData: NsCommonStrip.ICommonStrip, data: IStripUnitCommonData) {
    if (wData.strips[0].stripConfig && wData.strips[0].stripConfig.hideShowAll) {
      return !wData.strips[0].stripConfig.hideShowAll;
    }
    return wData.strips[0].viewMoreUrl && data.widgets && data.widgets.length >= 4;
  }
  checkVisible(data: IStripUnitCommonData) {
    return data.stripInfo && data.stripInfo.visibilityMode === 'visible';
  }

  getContineuLearningLenth(data: IStripUnitCommonData) {
    return data.widgets ? data.widgets.length : 0;
  }
  getLength(data: IStripUnitCommonData) {
    if (!data.tabs || !data.tabs.length) {
      return data.widgets ? data.widgets.length : 0;
    } {
      // if tabs are there check if each tab has widgets and get the tab with max widgets
      const tabWithMaxWidgets = data.tabs.reduce(
        (prev, current) => {
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
      // if tabs has atleast 1 widgets then strip will show or else not
      return tabWithMaxWidgets.widgets ? tabWithMaxWidgets.widgets.length : 0;
    }
  }
  
  private async processStrip(
    strip: NsCommonStrip.ICommonStripUnit,
    results: NsWidgetResolver.IRenderConfigWithAnyData[] = [],
    fetchStatus: TFetchStatus,
    calculateParentStatus = true,
    _viewMoreUrl: any,
    tabsResults?: NsCommonStrip.ICommonStripTab[] | undefined,
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
      dataType: strip.dataType,
      dataKey: strip.dataKey,
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

  getSelectedIndex(stripsResultDataMap: any, key: any): number {
    let returnValue = 0;
    if (key === 'cbpPlan') {
      if (stripsResultDataMap.tabs.length) {
        const data = stripsResultDataMap.tabs.filter((ele: any) => ele.value === 'upcoming');
        returnValue = data[0].widgets && data[0].widgets.length > 0 ? 1 : 0;
      }
    }
    return returnValue;
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
  checkForEmptyWidget(strip: NsCommonStrip.ICommonStripUnit): boolean {
    if (
      strip.request &&
      ((strip.request.api && Object.keys(strip.request.api).length) ||
        (strip.request.search && Object.keys(strip.request.search).length) ||
        (strip.request.searchRegionRecommendation &&
          Object.keys(strip.request.searchRegionRecommendation).length) ||
        (strip.request.searchV6 && Object.keys(strip.request.searchV6).length) ||
        (strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) ||
        (strip.request.cbpList && Object.keys(strip.request.cbpList).length) ||
        (strip.request.trendingSearch && Object.keys(strip.request.trendingSearch).length)
      )
    ) {
      return true;
    }
    return false;
  }

  public tabClicked(tabEvent: MatTabChangeEvent, stripMap: IStripUnitCommonData, stripKey: string) {

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

}
