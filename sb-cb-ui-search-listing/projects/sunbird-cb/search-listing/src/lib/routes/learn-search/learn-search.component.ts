//#region (imports)
import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter, Inject } from "@angular/core";
import { ConfigurationsService, EventService, MultilingualTranslationsService, ValueService } from "@sunbird-cb/utils-v2";
import { ActivatedRoute, Router } from "@angular/router";
// tslint:disable-next-line
import * as _ from "lodash";
import { TranslateService } from "@ngx-translate/core";

import {
  FacetType,
  PageChangeEmitter,
  SearchCategory,
  SearchCommunitiesRequest,
  SearchConstantLocalStorage,
  SearchEventfacet,
  SearchEventFields,
  SearchPeoplesRequest,
  SearchV4Request,
  SortType,
  SearchResourceFacets,
  SearchResourceMimeType,
  SearchExternalRequest,
  ICompentencyKeys,
  SearchListingConfig,
  SearchUsersRequest,
  SearchTrainingPlansRequest,
  SearchDesignationRequest
} from "../../_models/search-listing.model";
import { forkJoin, Observable, Subject } from "rxjs";
import moment from "moment";
import { takeUntil } from "rxjs/operators";
import { NetworkService } from "../../_services/network.service";
import { SearchListingService } from "../../_services/search-listing.service";
//#endregion (imports)

@Component({
  selector: "ws-app-learn-search",
  templateUrl: "./learn-search.component.html",
  styleUrls: ["./learn-search.component.scss"]
})
export class LearnSearchComponent implements OnInit, OnChanges, OnDestroy {
  // #region (properties)

  //#region (inputs/outputs)
  @Input() searchQuery!: { query: string; nlp: string; searchCategory: string };
  @Input() userValue = "";
  @Input() paramFilters: any = [];
  @Input() filtersPanel!: string;
  @Output() queryParamChange = new EventEmitter<any>();
  @Output() updateUserEvent = new EventEmitter<string>();
  //#endregion (inputs/outputs)

  // searchResults: any = [];
  defaultThumbnail = "";
  sideNavBarOpened = true;
  private defaultSideNavBarOpenedSubscription: any;
  private destroy$ = new Subject<void>();

  public screenSizeIsLtMedium = false;
  isLtMedium$: Observable<boolean> = this.valueSvc.isLtMedium$;
  statedata:
    | {
        param: any;
        path: any;
      }
    | undefined;
  // resultFacets: any = [];
  // facetsData: any = [];
  veifiedKarmayogi = false;
  noResultMessage = "";
  recommendedUsers: any;
  seeAllResult: string = "";
  allResultsDepartmentName = new Set<string>();

  courseSearchTotalCount = 0;
  eventSearchTotalCount = 0;
  peopleSearchTotalCount = 0;
  communitiesSearchTotalCount = 0;
  resourcesSearchTotalCount = 0;
  externalSearchTotalCount = 0;
  designationSearchTotalCount = 0;
  trainingPlansSearchTotalCount = 0;
  usersSearchTotalCount = 0;

  courseSearchResults: any[] = [];
  eventsSearchResults: any[] = [];
  peoplesSearchResults: any[] = [];
  resourcesSearchResults: any[] = [];
  communitiesSearchResults: any[] = [];
  externalSearchResults: any[] = [];
  designationSearchResults: any[] = [];
  trainingPlansSearchResults: any[] = [];
  usersSearchResults: any[] = [];

  searchRequestCourse = new SearchV4Request([]);
  searchRequestEvents = new SearchV4Request([]);
  searchRequestPeoples = new SearchPeoplesRequest();
  searchRequestResources = new SearchV4Request([]);
  searchRequestCommunities = new SearchCommunitiesRequest([]);
  searchRequestExternal = new SearchExternalRequest([]);
  searchRequestUsers = new SearchUsersRequest();
  searchRequestDesignation = new SearchDesignationRequest();
  searchRequestTrainingPlans = new SearchTrainingPlansRequest();

  searchContentLoader = true;

  initialPaginationSize = 10;
  initialPaginationSizeOptions = [10, 20, 50, 100];
  initialPaginationPage = 1;
  commonPageResultSize = 3;

  coursesFacets = [];
  eventsFacets = [];
  communitiesFacets = [];
  peoplesFacets = [];
  resourcesFacets = [];
  externalFacets = [];
  designationFacets = [];
  trainingPlansFacets = [];
  usersFacets = [];

  combinedFacets: any[] = [];
  compentencyKey!: ICompentencyKeys;
  enrollmentDetails: any = [];
  cbpPlanList: any = [];

  competencyAreaNameKey!: string;
  competencyThemeKey!: string;
  competencySubThemeKey!: string;

  currentUserDept = "";
  connectionRequestsSent!: any;
  queryParams: any;
  typesOfEventsFilters: any;
  competencyFactet: any = [];
  searchSortFilter: string = "";
  searchPeopleLoader = false;
  filtersChipFromLearn: string[] = [];
  shouldReturnFromHere = false;
  isExploreContentTab = false;
  applySelectedFilters: any;
  compentencyKeyExist = false;
  environment!: any;
  searchConfig: SearchListingConfig.Config | null = null;
  noDataNavigationButtons: any[] = [];
  applicationName = ''
  //#endregion (properties)
  constructor(
    @Inject("environment") environment: any,
    private searchListingService: SearchListingService,
    private configSvc: ConfigurationsService,
    private events: EventService,
    private activated: ActivatedRoute,
    private valueSvc: ValueService,
    private translate: TranslateService,
    private router: Router,
    private langtranslations: MultilingualTranslationsService,
    private networkService: NetworkService
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem("websiteLanguage")) {
        this.translate.setDefaultLang("en");
        const lang = localStorage.getItem("websiteLanguage")!;
        this.translate.use(lang);
      }
    });
    this.environment = environment;
    this.compentencyKey = this.configSvc.compentency ? this.configSvc.compentency[this.environment.compentencyVersionKey] : null;
    if (this.compentencyKey) {
      this.competencyAreaNameKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyArea}`;
      this.competencyThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyTheme}`;
      this.competencySubThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencySubTheme}`;
    }
  }

  async ngOnInit() {
    this.currentUserDept = _.get(this.configSvc, 'userProfile.departmentName', '');
    this.statedata = {
      param: this.searchQuery?.nlp ? this.searchQuery?.nlp : this.searchQuery.query,
      path: "Search"
    };
    const instanceConfig = this.configSvc.instanceConfig;
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.sideNavBarOpened = !isLtMedium;
      this.screenSizeIsLtMedium = isLtMedium;
    });

    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || "";
    }

    const searchQuery = _.get(this.searchQuery, 'query', this.statedata.param)
    this.updateNoResultMessage(searchQuery);
    if (this.getCurrentSearchCategories.some(cat => cat.value === SearchCategory.Courses)) {
      this.checkCourseEnrollmentAndCbpPlan();
    }
    // this.fetchCbpPlan()
    this.checkIfExploreContentTab();
    localStorage.removeItem(SearchConstantLocalStorage.SortType);
  }

  get getCurrentSearchCategories(): SearchListingConfig.SearchCategory[] {
    if(this.searchConfig && this.searchConfig.currentSearchCategories && this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      return this.searchConfig.currentSearchCategories;
    }
    return this.searchConfig ? this.searchConfig.searchCategories : [];
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.searchConfig = await this.searchListingService.getSearchConfig();
    this.applicationName = _.get(this.searchConfig, "applicationName", '');
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.profileDetails) {
      this.veifiedKarmayogi =
        this.configSvc.unMappedUser.profileDetails.profileStatus && this.configSvc.unMappedUser.profileDetails.profileStatus === "VERIFIED" ? true : false;
    }
    if (changes["paramFilters"] && changes["paramFilters"].currentValue && changes["paramFilters"].currentValue.length) {
      this.searchContentLoader = true;
      this.searchRequestCourse.request.filters.courseCategory = changes["paramFilters"].currentValue[0].subType;
      this.seeAllResult = SearchCategory.Courses;
      this.eventSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.searchRequestCourse.request.limit = this.initialPaginationSize;
      this.searchRequestCourse.request.sort_by.createdOn = "desc";
      await this.searchCourses();
      this.sideNavBarOpened = false;
      this.searchContentLoader = false;
      this.filtersChipFromLearn = changes["paramFilters"].currentValue[0].subType;
      return;
    }

    if (
      (changes["searchQuery"] && changes["searchQuery"].currentValue?.query !== changes["searchQuery"].previousValue?.query) ||
      changes["searchQuery"].currentValue?.searchCategory !== changes["searchQuery"].previousValue?.searchCategory
    ) {
      this.searchContentLoader = true;
      this.resetAllSearchParams();
      this.statedata = {
        param: this.searchQuery?.nlp ? this.searchQuery?.nlp : this.searchQuery.query,
        path: "Search"
      };

      if (changes["searchQuery"].currentValue?.searchCategory) {
        const category = changes["searchQuery"].currentValue?.searchCategory || "";

        this.seeAllResults(category);
      } else {
        const categories = this.getCurrentSearchCategories?.map(cat => cat.value) || [];
        if (categories.length) {
          // iterate once and dispatch to the correct search handler
          await this.executeSearchesForCategories(categories, true);
        }

        this.searchContentLoader = false;
      }

      const searchQuery = _.get(this.searchQuery, 'query', this.statedata.param)
      this.updateNoResultMessage(searchQuery);

      if (changes["filtersPanel"] && changes["filtersPanel"].currentValue === "show") {
        this.sideNavBarOpened = true;
        this.filtersChipFromLearn = [];
      }
    }
  }

  getName(userDetails: any) {
    return userDetails.firstName ? userDetails.firstName : userDetails.firstname;
  }

  applyTelemetry(event: any, index: number) {
    this.raiseTelemetry(event, index);
  }

  updateUserDetails(event: string) {
    this.updateUserEvent.emit(event);
  }

  raiseTelemetry(content: any, i: number) {
    if (content) {
      this.events.raiseInteractTelemetry(
        {
          type: "click",
          subType: `card-learnSearch`,
          id: `search-card-${i + 1}`,
          pageid: `/app/globalsearch`
        },
        {
          id: content.identifier || "",
          type: content.contentType,
          rollup: {},
          ver: content.version ? `${content.version}${""}` : ""
        },
        {}
      );
    }
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      if (this.defaultSideNavBarOpenedSubscription) {
        this.defaultSideNavBarOpenedSubscription.unsubscribe();
      }
    }

    this.destroy$.next();
    this.destroy$.complete();

    localStorage.removeItem(SearchConstantLocalStorage.SortType);
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, "");
  }

  updateNoResultMessage(searchTerm: string) {
    this.translate.get("learnsearch.noResultFound", { searchTerm }).subscribe((translatedText: string) => {
      this.noResultMessage = translatedText;
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  connectionUpdatePeopleCard(event: any) {
    if (event === "connection-updated") {
      this.getAllConnectionRequests();
    }
  }

  //#region (get courses methods)

  async searchCourses() {
    this.searchRequestCourse.request.query = this.statedata?.param;
    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      const courseFilters = _.get(this.searchConfig, 'allSearchCategoriesTypes', []).filter((ele: any) => ele.name === 'courses');
      if (courseFilters.length && courseFilters[0].facets && courseFilters[0].facets.length) {
        const competencyKeys = [
          this.competencyAreaNameKey,
          this.competencyThemeKey,
          this.competencySubThemeKey
        ].filter(k => k !== null && k !== undefined) as string[];
        //#region (adding facets from config)
        const facetsFromConfig = [...courseFilters[0].facets] as string[];

        // If config contains the placeholder 'competencies', replace it with the actual competency keys
        const compIndex = facetsFromConfig.indexOf('competencies');
        if (compIndex !== -1) {
          // Splice will remove the placeholder and insert competency keys (if any). If competencyKeys is empty,
          // this effectively removes the 'competencies' placeholder.
          facetsFromConfig.splice(compIndex, 1, ...competencyKeys);
        }
        if(_.get(this.searchConfig, 'fields.courses')) {
          this.searchRequestCourse.request.fields = _.get(this.searchConfig, 'fields.courses')
        }
        // Filter out any null/undefined values and use config-provided facets
        this.searchRequestCourse.request.facets = facetsFromConfig.filter(v => v !== null && v !== undefined);
        //#endregion (adding facets from config)

        const hasStatus = typeof this.applySelectedFilters === "object" && 
               this.applySelectedFilters["status"] && 
               Array.isArray(this.applySelectedFilters["status"]) && 
               this.applySelectedFilters["status"].length > 0;        
        this.searchRequestCourse.request.filters = this.getContentSearchFilters(this.searchRequestCourse.request.filters)

      }
      this.searchRequestCourse.request.facets = _.get(this.searchRequestCourse, 'request.facets', []).filter((v: string) => v !== null && v !== undefined);
    } else {
      this.searchRequestCourse.request.filters.status = ["Live"];
    }

    //#region (api call and response handling)
    try {
      const result = await this.searchListingService.searchCoursesv4(this.searchRequestCourse);
      if (_.get(result, 'result.content')) {
        this.courseSearchResults = result.result.content;
        this.courseSearchTotalCount = result.result?.count;
        this.coursesFacets = result.result?.facets || [];
        this.combinedFacets = [];
        this.combinedFacets = [...this.combinedFacets, this.coursesFacets || []];
      } else {
        this.courseSearchResults = [];
        this.courseSearchTotalCount = 0;
        this.coursesFacets = result?.result?.facets || [];
        this.combinedFacets = [];
      }
    } catch (err) {
      this.courseSearchResults = [];
      this.courseSearchTotalCount = 0;
      this.coursesFacets = [];
      this.combinedFacets = [];
    }
    //#endregion (api call and response handling)
  }

  private getContentSearchFilters(filters: any): any {
    const userRoles = this.configSvc?.userRoles as Set<string>;
    const userId = _.get(this.configSvc, 'userProfile.userId');
    const userOrgId = _.get(this.configSvc, 'userProfile.rootOrgId');
    const hasStatus = filters && filters.status && Array.isArray(filters.status) && filters.status.length > 0 ? true : false;

    // Get single role (case-insensitive)
    const role = Array.from(userRoles || [])[0]?.toUpperCase();
    if (!role) {
      return filters;
    }

    // Ensure filter structure
    if (!filters.must) {
      filters.must = { courseCategory: [], resourceCategory: [] };
    } else {
      if (!Array.isArray(filters.must.courseCategory)) filters.must.courseCategory = [];
      if (!Array.isArray(filters.must.resourceCategory)) filters.must.resourceCategory = [];
    }
    if (!Array.isArray(filters.status) && !hasStatus) filters.status = [];

    delete filters.contentType;

    const mergeUnique = (target: any[], source: any[] = []) => {
      source.forEach(item => {
        if (!target.includes(item)) target.push(item);
      });
    };

    // ---- Role-based logic ----
    switch (role) {
      case "CONTENT_CREATOR":
        mergeUnique(filters.must.courseCategory, [
          "Course", "Program", "Standalone Assessment", "Curated Program", "Blended Program",
          "invite-only program", "Moderated Course", "Moderated Assessment", "Moderated Program",
          "invite-only assessment", "Case Study", "Comprehensive Assessment Program", "Multilingual Course"
        ]);
        mergeUnique(filters.must.resourceCategory, [
          "Events", "Podcasts", "Webinars", "Case study", "Whitepaper", "Article", "Blog",
          "Best Practices", "Policies and Acts", "Karmayogi Talks", "Know Your Ministry", "Others"
        ]);
        if (!hasStatus) {
          mergeUnique(filters.status, [
            "Live", "Failed", "Review", "Retired", "Draft"
          ]);
        }
        filters.createdFor = [userOrgId];
        break;

      case "CONTENT_REVIEWER":
        mergeUnique(filters.must.courseCategory, [
          "Course", "Program", "Standalone Assessment", "Curated Program", "Blended Program",
          "invite-only program", "Moderated Course", "Moderated Assessment", "Moderated Program",
          "invite-only assessment", "Case Study", "Comprehensive Assessment Program", "Multilingual Course"
        ]);
        mergeUnique(filters.must.resourceCategory, [
          "Events", "Podcasts", "Webinars", "Case study", "Whitepaper", "Article", "Blog",
          "Best Practices", "Policies and Acts", "Karmayogi Talks", "Know Your Ministry", "Others"
        ]);
        if (!hasStatus) {
          mergeUnique(filters.status, ["Live", "Review"]);
        }
        filters.reviewerIDs = [userId];
        break;

      case "CONTENT_PUBLISHER":
        mergeUnique(filters.must.courseCategory, [
          "Moderated Course", "Moderated Assessment", "Moderated Program"
        ]);
        if (!hasStatus) {
          mergeUnique(filters.status, ["Review", "Live"]);
        }
        filters.publisherIDs = [userId];
        break;

      case "PROGRAM_COORDINATOR":
        filters.any = [
          { programCoordinatorIds: userId },
          { createdFor: userOrgId }
        ];
        mergeUnique(filters.must.courseCategory, [
          "Blended Program", "Curated Program", "Moderated Program", "Invite-Only Program", "Invite-Only Assessment"
        ]);
        if (!hasStatus) {
          mergeUnique(filters.status, ["Live"]);
        }
        break;

      case "SPV_PUBLISHER":
        mergeUnique(filters.must.courseCategory, [
          "Course", "Program", "Standalone Assessment", "Curated Program", "Blended Program",
          "invite-only program", "invite-only assessment", "Case Study", "Comprehensive Assessment Program",
          "Multilingual Course"
        ]);
        mergeUnique(filters.must.resourceCategory, [
          "Events", "Podcasts", "Webinars", "Case study", "Whitepaper", "Article", "Blog",
          "Best Practices", "Policies and Acts", "Karmayogi Talks", "Know Your Ministry", "Others"
        ]);
        if (!hasStatus) {
          mergeUnique(filters.status, ["Review", "Live"]);
        }
        break;
    }

    // Remove empty must arrays
    Object.keys(filters.must).forEach(key => {
      if (!filters.must[key].length) delete filters.must[key];
    });
    if (!Object.keys(filters.must).length) delete filters.must;
    if (this.applySelectedFilters && this.applySelectedFilters.resourceCategory && this.applySelectedFilters.resourceCategory.length) {
      filters.must.resourceCategory = JSON.parse(JSON.stringify(this.applySelectedFilters?.resourceCategory || []));
      filters.must.courseCategory = [];
      filters.must.courseCategory = []
    }

    return filters;
  }

  //#endregion (get courses methods)


  async searchEvents() {
    if (this.applicationName === SearchListingConfig.ApplicationNames.LearnerPortal) {
      this.searchRequestEvents.request.filters.status = ["Live"];
    }
    this.searchRequestEvents.request.filters.contentType = "Event";
    this.searchRequestEvents.request.fields = SearchEventFields;
    // Build base facets array and avoid passing null/undefined competency keys
    const baseEventFacets = [
      ...SearchEventfacet
    ].filter((v: string) => v !== null && v !== undefined);

    const competencyKeys = [
      this.competencyAreaNameKey,
      this.competencyThemeKey,
      this.competencySubThemeKey
    ].filter(k => k !== null && k !== undefined) as string[];

    // Start with base facets and append competency keys if present
    let resolvedEventFacets: string[] = competencyKeys.length ? [...baseEventFacets, ...competencyKeys] : baseEventFacets;

    // If CBPPortal provides a facets configuration for events, prefer that.
    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      if(_.get(this.searchConfig, 'fields.courses')) {
          this.searchRequestEvents.request.fields = _.get(this.searchConfig, 'fields.events')
        }
      const hasStatus = typeof this.applySelectedFilters === "object" && 
               this.applySelectedFilters["status"] && 
               Array.isArray(this.applySelectedFilters["status"]) && 
               this.applySelectedFilters["status"].length > 0;
      if (!hasStatus) {
        this.searchRequestEvents.request.filters.status = ["Live", "SentToPublish"];
      }
      this.searchRequestEvents.request.filters["createdFor"] = {
        "!=": [this.environment.spvorgID]
      };
      const eventFilters = _.get(this.searchConfig, 'allSearchCategoriesTypes', []).filter((ele: any) => ele.name === 'events');
      if (eventFilters.length && eventFilters[0].facets && eventFilters[0].facets.length) {
        // Clone to avoid mutating upstream config
        const facetsFromConfig = [...eventFilters[0].facets] as string[];

        // If config contains the placeholder 'competencies', replace it with the actual competency keys
        const compIndex = facetsFromConfig.indexOf('competencies');
        if (compIndex !== -1) {
          // Splice will remove the placeholder and insert competency keys (if any). If competencyKeys is empty,
          // this effectively removes the 'competencies' placeholder.
          facetsFromConfig.splice(compIndex, 1, ...competencyKeys);
        }

        // Filter out any null/undefined values and use config-provided facets
        this.searchRequestEvents.request.facets = facetsFromConfig.filter(v => v !== null && v !== undefined);
      } else {
        this.searchRequestEvents.request.facets = resolvedEventFacets;
      }
      this.searchRequestEvents.request.filters["startDate"] = {
        '>=': this.environment.eventPhaseTwo || '2025-02-18',
      };
    } else {
      this.searchRequestEvents.request.facets = resolvedEventFacets;
    }
    delete this.searchRequestEvents.request.filters?.courseCategory;
    delete this.searchRequestEvents.request.sort_by?.createdOn;

    this.searchRequestEvents.request.query = this.statedata?.param || "";

    if (this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal) {
      const updatedFacet = SearchEventfacet.filter(item => item !== FacetType.SourceName);
      this.searchRequestEvents.request.facets = [...updatedFacet, this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey];
      this.searchRequestEvents.request.filters["createdFor"] = this.configSvc.userProfile?.rootOrgId || "";
    }

    try {
      const result = await this.searchListingService.searchCoursesv4(this.searchRequestEvents);
      if (_.get(result, 'result.Event')) {
        const eventFacets = this.applicationName === SearchListingConfig.ApplicationNames.MDOPortal ? this.processObjectFacetsForEvents(result.result.facets) : result.result.facets || [];
        this.eventsSearchResults = result.result.Event || [];
        this.eventSearchTotalCount = result.result.count;
        this.eventsFacets = eventFacets;
        this.combinedFacets = [];
        this.combinedFacets = [...this.combinedFacets, eventFacets || []];
      } else {
        this.eventsSearchResults = [];
        this.eventSearchTotalCount = 0;
        this.eventsFacets = result?.result?.facets || [];
      }
    } catch (err) {
      // API/network error - ensure UI remains stable
      // eslint-disable-next-line no-console
      this.eventsSearchResults = [];
      this.eventSearchTotalCount = 0;
      this.eventsFacets = [];
      this.combinedFacets = [];
    }
  }

  async searchPeople() {
    this.searchPeopleLoader = true;

    this.searchRequestPeoples.query = this.statedata?.param || "";
    const result = await this.searchListingService.searchConnections(this.searchRequestPeoples);

    if (result && result?.result && result?.result?.response?.content) {
      this.peoplesSearchResults = result.result?.response?.content || [];
      this.peopleSearchTotalCount = result.result?.response?.count;
      this.peoplesFacets = result.result?.response.facets || [];

      this.combinedFacets = [];
      this.combinedFacets = [...this.combinedFacets, result.result?.response.facets || []];
      this.getAllConnectionRequests();
    } else {
      this.peoplesSearchResults = [];
      this.peopleSearchTotalCount = 0;
      this.peoplesFacets = [];
      this.combinedFacets = [];
    }
    this.searchPeopleLoader = false;
  }

  async searchResources() {
    this.searchRequestResources.request.filters.contentType = "Resource";
    this.searchRequestResources.request.facets = SearchResourceFacets;
    this.searchRequestResources.request.filters["mimeType"] = SearchResourceMimeType;
    (this.searchRequestResources.request.exists = [FacetType.sectorNames_v1, FacetType.resourceCategory]),
      (this.searchRequestResources.request.fields = []),
      delete this.searchRequestEvents.request.filters?.courseCategory;
    this.searchRequestResources.request.query = this.statedata?.param || "";
    const result = await this.searchListingService.searchResource(this.searchRequestResources);
    if (result && result?.result && result?.result?.content) {
      this.resourcesSearchResults = result.result?.content || [];
      this.resourcesSearchTotalCount = result.result?.count;
      this.resourcesFacets = result.result?.facets || [];
      this.combinedFacets = [];
      this.combinedFacets = [...this.combinedFacets, result.result?.facets || []];
    } else {
      this.resourcesSearchResults = [];
      this.resourcesSearchTotalCount = 0;
      this.resourcesFacets = [];
      this.combinedFacets = [];
    }
  }

  async searchcommunities() {
    if (this.statedata?.param) {
      this.searchRequestCommunities.searchString = this.statedata?.param || "";
    }

    if (this.searchListingService.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal) {
      this.searchRequestCommunities.filterCriteriaMap["orgId"] = this.configSvc.userProfile?.rootOrgId;
      this.searchRequestCommunities.facets = this.searchRequestCommunities.facets.filter(item => item !== "orgName");
    }

    const result = await this.searchListingService.searchCommunity(this.searchRequestCommunities).catch(() => {
      return {
        result: { search_results: { data: [], totalCount: 0, facets: {} } }
      };
    });

    if (result.result && result?.result?.search_results?.data && result.result?.search_results?.data.length) {
      this.communitiesSearchResults = result.result?.search_results?.data || [];
      this.communitiesSearchTotalCount = result.result?.search_results?.totalCount;
      this.communitiesFacets = this.processObjectFacets(result.result?.search_results?.facets);
      this.combinedFacets = [];
      this.combinedFacets = [...this.combinedFacets, this.communitiesFacets || []];
    } else {
      this.communitiesSearchResults = [];
      this.communitiesSearchTotalCount = 0;
      this.communitiesFacets = [];
      this.combinedFacets = [];
    }
  }

  async searchExternalContents() {
    this.searchRequestExternal.searchString = this.statedata?.param || "";
    // Ensure facets array does not contain null/undefined entries
    const baseEventFacets = [
      ...SearchEventfacet
    ].filter((v: string) => v !== null && v !== undefined);

    const competencyKeys = [
      this.competencyAreaNameKey,
      this.competencyThemeKey,
      this.competencySubThemeKey
    ].filter(k => k !== null && k !== undefined) as string[];

    // Start with base facets and append competency keys if present
    let resolvedEventFacets: string[] = competencyKeys.length ? [...baseEventFacets, ...competencyKeys] : baseEventFacets;
    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      if(_.get(this.configSvc, 'userProfileV2.rootOrgId', '')) {
        this.searchRequestEvents.request.filters["channel"] = _.get(this.configSvc, 'userProfileV2.rootOrgId', '');
      }
      const contentFilters = _.get(this.searchConfig, 'allSearchCategoriesTypes', []).filter((ele: any) => ele.name === 'events');
      if (contentFilters.length && contentFilters[0].facets && contentFilters[0].facets.length) {
        // Clone to avoid mutating upstream config
        const facetsFromConfig = [...contentFilters[0].facets] as string[];

        // If config contains the placeholder 'competencies', replace it with the actual competency keys
        const compIndex = facetsFromConfig.indexOf('competencies');
        if (compIndex !== -1) {
          // Splice will remove the placeholder and insert competency keys (if any). If competencyKeys is empty,
          // this effectively removes the 'competencies' placeholder.
          facetsFromConfig.splice(compIndex, 1, ...competencyKeys);
        }

        // Filter out any null/undefined values and use config-provided facets
        this.searchRequestExternal.facets = facetsFromConfig.filter(v => v !== null && v !== undefined);
      } else {
        this.searchRequestExternal.facets = resolvedEventFacets;
      }
    }
    this.searchRequestExternal.facets = (_.get(this.searchRequestExternal, 'facets', []) as string[]).filter(
      (v: string | null | undefined) => v !== null && v !== undefined
    );
    const result = await this.searchListingService.searchExternalContent(this.searchRequestExternal).catch(() => {
      return {
        data: [],
        totalCount: 0,
        facets: {}
      };
    });

    if (result?.data && result?.data.length) {
      this.externalSearchResults = result?.data || [];
      this.externalSearchTotalCount = result?.totalCount;
      this.externalFacets = this.processObjectFacets(result?.facets);
      this.combinedFacets = [];
      this.combinedFacets = [...this.combinedFacets, this.externalFacets || []];
    } else {
      this.externalSearchResults = [];
      this.externalSearchTotalCount = 0;
      this.externalFacets = [];
      this.combinedFacets = [];
    }
  }

  async searchDesignations() {
    this.searchPeopleLoader = true;

    this.searchRequestDesignation.request.query = this.statedata?.param || "";
    this.searchRequestDesignation.request.filters["categories"] = [`${this.configSvc.userProfile?.rootOrgId}_odcs_designation`];

    const result = await this.searchListingService.searchDesignationV4(this.searchRequestDesignation).catch(() => {});
    if (result?.result && result?.result?.Term) {
      this.designationSearchResults = result.result?.Term || [];
      this.designationSearchTotalCount = result.result?.count;
      this.designationFacets = result.result?.facets;
      this.combinedFacets = [];
      this.combinedFacets = [...this.combinedFacets, this.designationFacets || []];
    } else {
      this.designationSearchResults = [];
      this.designationSearchTotalCount = 0;
      this.combinedFacets = [];
    }
    this.searchPeopleLoader = false;
  }

  async searchTrainingPlans() {
    this.searchRequestTrainingPlans.searchString = this.statedata?.param || "";
    this.searchRequestTrainingPlans.filter["orgIdList"] = [this.configSvc.userProfile?.rootOrgId];

    const result = await this.searchListingService.searchTrainingPlans(this.searchRequestTrainingPlans).catch(() => {});

    if (result?.result?.result && result?.result?.result?.data?.length) {
      this.trainingPlansSearchResults = result.result.result.data;
      this.trainingPlansSearchTotalCount = result.result.result.totalCount;
      this.trainingPlansFacets = this.processObjectFacetsForTrainingPlan(result.result.result.facets) || [];

      this.combinedFacets = [];
      this.combinedFacets = [...this.combinedFacets, this.trainingPlansFacets || []];
    } else {
      this.trainingPlansSearchResults = [];
      this.trainingPlansSearchTotalCount = 0;
      this.trainingPlansFacets = [];
      this.combinedFacets = [];
    }
  }

  async searchUsersMDO() {
    this.searchPeopleLoader = true;
    if (this.configSvc?.unMappedUser?.rootOrg?.organisationType === 16 || this.configSvc?.unMappedUser?.rootOrg?.organisationType === 2048) {
      this.searchRequestUsers.request.filters["profileDetails.ministryOrStateId"] = this.configSvc.userProfile?.rootOrgId || "";
      if (this.searchRequestUsers.request.filters!.rootOrgId) {
        delete this.searchRequestUsers.request.filters!.rootOrgId;
      }
      if (!this.searchRequestUsers.request.facets.includes("rootOrgName")) {
        this.searchRequestUsers.request.facets = [...this.searchRequestUsers.request.facets, "rootOrgName"];
      }
    } else {
      this.searchRequestUsers.request.filters!.rootOrgId = this.configSvc.userProfile?.rootOrgId || "";
    }
    if(this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      delete this.searchRequestUsers.request.filters["status"]
      this.searchRequestUsers.request.fields.push("isDeleted")
    }

    this.searchRequestUsers.request.query = this.statedata?.param || "";

    const result = await this.searchListingService.searchUsersMDO(this.searchRequestUsers).catch(() => {
      return {
        result: { response: { content: [], count: 0, facets: {} } }
      };
    });

    if (result?.result?.response?.content && result?.result?.response?.content?.length) {
      this.usersSearchResults = result?.result?.response?.content || [];
      this.usersSearchTotalCount = result?.result?.response?.count;
      this.usersFacets = result.result?.response.facets || [];

      this.combinedFacets = [];
      this.combinedFacets = [...this.combinedFacets, result.result?.response.facets || []];
      if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
        this.combinedFacets = this.filterRolesWithAppliedRoles(this.combinedFacets);
      }
      this.updateUserEvent.emit('');
    } else {
      this.usersSearchResults = [];
      this.usersSearchTotalCount = 0;
      this.usersFacets = [];
      this.combinedFacets = [];
      this.updateUserEvent.emit('');
    }

    this.searchPeopleLoader = false;
  }

  filterRolesWithAppliedRoles(facets: any[]): any[] {
    const appliedRoles: string[] = _.get(this.searchRequestUsers, "request.filters", {})['roles.role'] || [];

    // If no facets or no applied roles, return original facets
    if (!facets || !facets.length || !appliedRoles.length) return facets;

    const appliedLower = appliedRoles.map(r => String(r).toLowerCase());

    const filteredFacets = facets[0].map((facet: any) => {
      if (
        facet &&
        typeof facet.name === "string" &&
        facet.name.toLowerCase() === "roles.role" &&
        Array.isArray(facet.values)
      ) {
        const filteredValues = facet.values.filter((v: any) => {
          const name = v && v.name ? String(v.name).toLowerCase() : "";
          return appliedLower.includes(name);
        });
        facet.values = filteredValues;
        return facet;
      }
      return facet;
    });
    facets[0] = filteredFacets;
    return facets;
  }

  /**
   * Execute searches for the provided categories.
   * If awaitEach is true, run each search sequentially and await its completion.
   * If awaitEach is false, await Courses and Events (they may affect shared state),
   * then trigger the remaining searches without awaiting to run in parallel.
   */
  private async executeSearchesForCategories(categories: string[], awaitEach = false): Promise<void> {
    if (!categories || !categories.length) {
      return;
    }

    if (awaitEach) {
      for (const cat of categories) {
        // await each search sequentially
        // runSearchForCategory returns a Promise from the underlying async search method
        // eslint-disable-next-line no-await-in-loop
        await this.runSearchForCategory(cat);
      }
      return;
    }

    // Non-await mode: await Courses and Events first (they often set shared facets/state),
    // then fire the rest without awaiting so they can run concurrently.
    if (categories.includes(SearchCategory.Courses)) {
      await this.searchCourses();
    }
    if (categories.includes(SearchCategory.Events)) {
      await this.searchEvents();
    }

    const others = categories.filter(cat => cat !== SearchCategory.Courses && cat !== SearchCategory.Events);
    for (const cat of others) {
      // intentionally not awaited to allow parallel execution
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.runSearchForCategory(cat);
    }
  }

  // dispatch a single category to its corresponding search method
  private runSearchForCategory(category: string): Promise<any> {
    switch (category) {
      case SearchCategory.Courses:
        return this.searchCourses();
      case SearchCategory.Events:
        return this.searchEvents();
      case SearchCategory.People:
        return this.searchPeople();
      case SearchCategory.Communities:
        return this.searchcommunities();
      case SearchCategory.Resources:
        return this.searchResources();
      case SearchCategory.ExternalContents:
        return this.searchExternalContents();
      case SearchCategory.Designation:
        return this.searchDesignations();
      case SearchCategory.TrainingPlans:
        return this.searchTrainingPlans();
      case SearchCategory.Users:
        return this.searchUsersMDO();
      default:
        return Promise.resolve();
    }
  }

  processObjectFacets(facets: Record<string, any[]>): any {
    return Object.keys(facets).map(key => ({
      name: key,
      values: facets[key].map(({ value, count }) => ({ name: value, count }))
    }));
  }

  processObjectFacetsForEvents(facets: any[]): any {
    return facets.map((element: any) => {
      return element;
    });
  }

  processObjectFacetsForTrainingPlan(facets: Record<string, any[]>): any {
    return Object.keys(facets).map(key => {
      const valuesMap: Record<string, number> = {};
      facets[key].forEach(({ value, count }) => {
        let name: string;

        if (key === FacetType.isApar) {
          name = value === "true" ? "APAR" : "NON APAR";
        } else {
          name = value;
        }

        valuesMap[name] = (valuesMap[name] ?? 0) + count;
      });
      return {
        name: key,
        values: Object.entries(valuesMap).map(([name, count]) => ({
          name,
          count
        }))
      };
    });
  }

  private initializeSearchRequests(): void {
    // Initialize course search request
    this.searchRequestCourse = new SearchV4Request([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
    this.searchRequestCourse.request.limit = this.initialPaginationSize;
    this.searchRequestCourse.request.filters.courseCategory = [];
    this.searchRequestCourse.request.filters.avgRating = {};

    // Initialize events search request
    this.searchRequestEvents = new SearchV4Request([]);
    this.searchRequestEvents.request.limit = this.initialPaginationSize;

    // Initialize resources search request
    this.searchRequestResources = new SearchV4Request([]);
    this.searchRequestResources.request.limit = this.initialPaginationSize;

    // Initialize external content search request
    this.searchRequestExternal = new SearchExternalRequest([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
    this.searchRequestExternal.pageNumber = 0;
    this.searchRequestExternal.pageSize = this.initialPaginationSize;

    // Initialize communities search request
    this.searchRequestCommunities = new SearchCommunitiesRequest([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
    this.searchRequestCommunities.pageNumber = 0;
    this.searchRequestCommunities.pageSize = this.initialPaginationSize;
    this.searchRequestCommunities.orderBy = "communityName"; // Default sort by name

    // Initialize people search request
    this.searchRequestPeoples = new SearchPeoplesRequest();
    this.searchRequestPeoples.limit = this.initialPaginationSize;
    this.searchRequestPeoples.offset = 0;

    // Initialize users search request
    this.searchRequestUsers = new SearchUsersRequest();
    this.searchRequestUsers.request.limit = this.initialPaginationSize;
    this.searchRequestUsers.request.filters = { ...this.searchRequestUsers.request.filters, rootOrgId: this.configSvc.userProfile?.rootOrgId || "" };

    // Initialize designation search request
    this.searchRequestDesignation = new SearchDesignationRequest();
    this.searchRequestDesignation.request.limit = this.initialPaginationSize;
    this.searchRequestDesignation.request.offset = 0;

    // Initialize training plans search request
    this.searchRequestTrainingPlans = new SearchTrainingPlansRequest();
    this.searchRequestTrainingPlans.pageSize = this.initialPaginationSize;
    this.searchRequestTrainingPlans.pageNumber = 0;
  }

  async applySearchFilter(selectedFilters: { [key: string]: any }) {
    if (Object.keys(selectedFilters).length === 1) {
      this.shouldReturnFromHere = true;
    }
    this.applySelectedFilters = selectedFilters;
    this.searchContentLoader = true;
    this.compentencyKeyExist = false;

    this.initializeSearchRequests();

    if (this.searchSortFilter === SortType.MostRelevent) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by = {};
        this.searchRequestEvents.request.sort_by = {};
        this.searchRequestResources.request.sort_by = {};
        this.searchRequestUsers.request.sort_by = {};
        this.searchRequestDesignation.request.sort_by = {};

        delete this.searchRequestTrainingPlans.orderBy;
        delete this.searchRequestTrainingPlans.orderDirection;

        delete this.searchRequestCommunities.orderBy;
        delete this.searchRequestCommunities.orderDirection;
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by = {};
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by = {};
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by = {};
      } else if (this.seeAllResult === SearchCategory.Users) {
        this.searchRequestUsers.request.sort_by = {};
        this.searchRequestUsers.request.orderBy = "createdAt";
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        this.searchRequestTrainingPlans.orderBy = "";
        this.searchRequestTrainingPlans.orderDirection = "desc";
      } else if (this.seeAllResult === SearchCategory.Designation) {
        this.searchRequestDesignation.request.sort_by = {};
      } else if (this.seeAllResult === SearchCategory.Communities) {
        delete this.searchRequestCommunities.orderBy;
        delete this.searchRequestCommunities.orderDirection;
      }
    } else if (this.searchSortFilter === SortType.RecentlyAdded) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by.createdOn = SortType.Descending;
        this.searchRequestEvents.request.sort_by.startDate = SortType.Descending;
        this.searchRequestUsers.request.orderBy = "createdDate";
        this.searchRequestTrainingPlans.orderBy = "createdAt";
        this.searchRequestTrainingPlans.orderDirection = SortType.Descending;

        this.searchRequestDesignation.request.sort_by[FacetType.createdOn] = SortType.Descending;
        delete this.searchRequestDesignation.request.sort_by["name"];

        this.searchRequestCommunities.orderBy = "createdOn";
        this.searchRequestCommunities.orderDirection = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by.createdOn = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by.startDate = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Communities) {
        this.searchRequestCommunities.orderDirection = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.People) {
        delete this.searchRequestPeoples?.sort_by?.firstName;
        this.searchRequestPeoples.sort_by.createdOn = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by.createdOn = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.ExternalContents) {
        this.searchRequestExternal.orderBy = "createdOn";
      } else if (this.seeAllResult === SearchCategory.Users) {
        delete this.searchRequestUsers.request.orderBy;
        this.searchRequestUsers.request.sort_by["createdDate"] = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        this.searchRequestTrainingPlans.orderBy = "createdAt";
        this.searchRequestTrainingPlans.orderDirection = SortType.Descending;
      } else if (this.seeAllResult == SearchCategory.Designation) {
        this.searchRequestDesignation.request.sort_by[FacetType.createdOn] = SortType.Descending;
        delete this.searchRequestDesignation.request.sort_by["name"];
      } else if (this.seeAllResult == SearchCategory.Communities) {
        this.searchRequestCommunities.orderBy = "createdOn";
        this.searchRequestCommunities.orderDirection = SortType.Descending;
      }
    } else if (this.searchSortFilter === SortType.HighestRated) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by.avgRating = SortType.Descending;
        this.searchRequestEvents.request.sort_by.avgRating = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by.avgRating = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by.avgRating = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by.avgRating = SortType.Descending;
      }
    } else if (this.searchSortFilter === SortType.Ascending) {
      this.searchRequestPeoples.sort_by.firstName = SortType.Ascending;
    } else if (this.searchSortFilter === SortType.Descending) {
      this.searchRequestPeoples.sort_by.firstName = SortType.Descending;
    } else if (this.searchSortFilter === SortType.AtoZ) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by.name = SortType.Ascending;
        this.searchRequestEvents.request.sort_by.name = SortType.Ascending;
        this.searchRequestUsers.request.sort_by.firstName = SortType.Ascending;

        this.searchRequestTrainingPlans.orderBy = "name";
        this.searchRequestTrainingPlans.orderDirection = SortType.Ascending;

        delete this.searchRequestDesignation.request.sort_by[FacetType.createdOn];
        this.searchRequestDesignation.request.sort_by["name"] = SortType.Ascending;

        this.searchRequestCommunities.orderBy = "communityName";
        this.searchRequestCommunities.orderDirection = SortType.Ascending;
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by.name = SortType.Ascending;
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by.name = SortType.Ascending;
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by.name = SortType.Ascending;
      } else if (this.seeAllResult === SearchCategory.ExternalContents) {
        this.searchRequestExternal.orderDirection = SortType.Ascending;
      } else if (this.seeAllResult === SearchCategory.Users) {
        this.searchRequestUsers.request.sort_by.firstName = SortType.Ascending;
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        this.searchRequestTrainingPlans.orderBy = "name";
        this.searchRequestTrainingPlans.orderDirection = SortType.Ascending;
      } else if (this.seeAllResult === SearchCategory.Designation) {
        delete this.searchRequestDesignation.request.sort_by[FacetType.createdOn];
        this.searchRequestDesignation.request.sort_by["name"] = SortType.Ascending;
      } else if (this.seeAllResult == SearchCategory.Communities) {
        this.searchRequestCommunities.orderBy = "communityName";
        this.searchRequestCommunities.orderDirection = SortType.Ascending;
      }
    } else if (this.searchSortFilter === SortType.ZtoA) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by.name = SortType.Descending;
        this.searchRequestEvents.request.sort_by.name = SortType.Descending;
        this.searchRequestUsers.request.sort_by.firstName = SortType.Descending;

        this.searchRequestTrainingPlans.orderBy = "name";
        this.searchRequestTrainingPlans.orderDirection = SortType.Descending;

        delete this.searchRequestDesignation.request.sort_by[FacetType.createdOn];
        this.searchRequestDesignation.request.sort_by["name"] = SortType.Descending;

        this.searchRequestCommunities.orderBy = "communityName";
        this.searchRequestCommunities.orderDirection = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by.name = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by.name = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by.name = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.ExternalContents) {
        this.searchRequestExternal.orderDirection = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Users) {
        this.searchRequestUsers.request.sort_by.firstName = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        this.searchRequestTrainingPlans.orderBy = "name";
        this.searchRequestTrainingPlans.orderDirection = SortType.Descending;
      } else if (this.seeAllResult === SearchCategory.Designation) {
        delete this.searchRequestDesignation.request.sort_by[FacetType.createdOn];
        this.searchRequestDesignation.request.sort_by["name"] = SortType.Descending;
      } else if (this.seeAllResult == SearchCategory.Communities) {
        this.searchRequestCommunities.orderBy = "communityName";
        this.searchRequestCommunities.orderDirection = SortType.Descending;
      }
    }

    this.resetPagination();

    Object.keys(selectedFilters).forEach(key => {
      if (selectedFilters[key] && Array.isArray(selectedFilters[key])) {
        if (key === FacetType.AvgRating) {
          const ratings = selectedFilters[key].map((val: string) => parseFloat(val.split(" ")[0])).filter((num: any) => !isNaN(num));

          if (ratings.length > 0) {
            this.searchRequestCourse.request.filters.avgRating = {
              ">=": String(Math.min(...ratings))
            };
          }
        } else if (key === FacetType.Language) {
          this.searchRequestCourse.request.filters.language = selectedFilters[key];
        } else if (key === FacetType.Organization) {
          this.searchRequestCourse.request.filters.organisation = selectedFilters[key];
        } else if (key === this.competencyAreaNameKey) {
          this.searchRequestCourse.request.filters[this.competencyAreaNameKey] = selectedFilters[key];
          this.searchRequestEvents.request.filters[this.competencyAreaNameKey] = selectedFilters[key];
          this.searchRequestCommunities.filterCriteriaMap[this.competencyAreaNameKey] = selectedFilters[key];
          this.searchRequestExternal.filterCriteriaMap[this.competencyAreaNameKey] = selectedFilters[key];
          this.compentencyKeyExist = true;
        } else if (key === this.competencyThemeKey) {
          this.searchRequestCourse.request.filters[this.competencyThemeKey] = selectedFilters[key];
          this.searchRequestEvents.request.filters[this.competencyThemeKey] = selectedFilters[key];
          this.searchRequestCommunities.filterCriteriaMap[this.competencyThemeKey] = selectedFilters[key];
          this.searchRequestExternal.filterCriteriaMap[this.competencyThemeKey] = selectedFilters[key];
          this.compentencyKeyExist = true;
        } else if (key === this.competencySubThemeKey) {
          this.searchRequestCourse.request.filters[this.competencySubThemeKey] = selectedFilters[key];
          this.searchRequestEvents.request.filters[this.competencySubThemeKey] = selectedFilters[key];
          this.searchRequestCommunities.filterCriteriaMap[this.competencySubThemeKey] = selectedFilters[key];
          this.searchRequestExternal.filterCriteriaMap[this.competencySubThemeKey] = selectedFilters[key];
          this.compentencyKeyExist = true;
        } else if (key === SearchCategory.Events) {
          this.constructQueryParam("events");
          this.seeAllResult = SearchCategory.Events;
          this.applyFilterToCaategoryType();
        } else if (key === SearchCategory.Courses) {
          this.constructQueryParam("courses");
          this.seeAllResult = SearchCategory.Courses;
          this.applyFilterToCaategoryType();
        } else if (key === SearchCategory.Resources) {
          this.constructQueryParam("resources");
          this.seeAllResult = SearchCategory.Resources;
          this.applyFilterToCaategoryType();
        } else if (key === "Case Study") {
          this.searchRequestCourse.request.filters.sectorId = [...selectedFilters[key]];
        } else if (key === SearchCategory.People) {
          this.constructQueryParam("peoples");
          this.seeAllResult = SearchCategory.People;
          this.applyFilterToCaategoryType();
        } else if (key === SearchCategory.Communities) {
          this.constructQueryParam("communities");
          this.seeAllResult = SearchCategory.Communities;
          this.applyFilterToCaategoryType();
        } else if (key === SearchCategory.Designation) {
          this.constructQueryParam("designation");
          this.seeAllResult = SearchCategory.Designation;
          this.applyFilterToCaategoryType();
        } else if (key === SearchCategory.TrainingPlans) {
          this.constructQueryParam("training-plans");
          this.seeAllResult = SearchCategory.TrainingPlans;
          this.applyFilterToCaategoryType();
        } else if (key === SearchCategory.Users) {
          this.constructQueryParam("users");
          this.seeAllResult = SearchCategory.Users;
          this.applyFilterToCaategoryType();
        } else if (key === "typeOfEvents") {
          const currentEpochTime = moment().valueOf();
          const tomorrowEpochTime = moment().add(1, "day").startOf("day").valueOf();
          this.resetEventsTypesRequest();
          if (selectedFilters[key][0] === "live") {
            this.searchRequestEvents.request.filters["startDateTimeInEpoch"] = {
              "<=": currentEpochTime
            };
            this.searchRequestEvents.request.filters["endDateTimeInEpoch"] = {
              ">=": currentEpochTime
            };
          } else if (selectedFilters[key][0] === "upcoming") {
            this.searchRequestEvents.request.filters["startDateTimeInEpoch"] = {
              ">=": tomorrowEpochTime
            };
          } else if (selectedFilters[key][0] === "past events") {
            this.searchRequestEvents.request.filters["endDateTimeInEpoch"] = {
              "<=": currentEpochTime
            };
          }
        } else if (key === FacetType.status) {
          this.searchRequestEvents.request.filters.status = [...selectedFilters[key]];
          this.searchRequestCourse.request.filters.status = [...selectedFilters[key]];
          this.searchRequestTrainingPlans.filter[FacetType.status] = [...selectedFilters[key]];
        } else if (key === "competencyArea") {
          this.searchRequestCommunities.filterCriteriaMap.competencyArea = [...selectedFilters[key]];
        } else if (key === "orgName") {
          this.searchRequestCommunities.filterCriteriaMap.orgName = [...selectedFilters[key]];
        } else if (key === "topicName") {
          this.searchRequestCommunities.filterCriteriaMap.topicName = [...selectedFilters[key]];
        } else if (key === FacetType.profileDesignation) {
          this.searchRequestPeoples.filters[key] = [...selectedFilters[key]];
          this.searchRequestUsers.request.filters[FacetType.profileDesignation] = [...selectedFilters[key]];
        } else if (key === "rootOrgName") {
          this.searchRequestPeoples.filters[key] = [...selectedFilters[key]];
          this.searchRequestUsers.request.filters[key] = [...selectedFilters[key]];
        } else if (key === "sourceName") {
          this.searchRequestEvents.request.filters.sourceName = [...selectedFilters[key]];
        } else if (key === "resourceType") {
          this.searchRequestEvents.request.filters.resourceType = [...selectedFilters[key]];
        } else if (key === "sectorId") {
          this.searchRequestCourse.request.filters.sectorId = [...selectedFilters[key]];
        } else if (key === "subSectorId") {
          this.searchRequestCourse.request.filters.subSectorId = [...selectedFilters[key]];
        } else if (key === FacetType.sectorNames_v1) {
          this.searchRequestCourse.request.filters[FacetType.sectorNames_v1] = [...selectedFilters[key]];
          this.searchRequestResources.request.filters[FacetType.sectorNames_v1] = [...selectedFilters[key]];
        } else if (key === FacetType.subSectorNames_v1) {
          this.searchRequestCourse.request.filters[FacetType.subSectorNames_v1] = [...selectedFilters[key]];
          this.searchRequestResources.request.filters[FacetType.subSectorNames_v1] = [...selectedFilters[key]];
        } else if (key === FacetType.sectorNameResource) {
          this.searchRequestResources.request.filters[FacetType.sectorNameResource] = [...selectedFilters[key]];
        } else if (key === FacetType.subSectorNameResource) {
          this.searchRequestResources.request.filters[FacetType.subSectorNameResource] = [...selectedFilters[key]];
        } else if (key === FacetType.resourceCategory) {
          this.searchRequestResources.request.filters[FacetType.resourceCategory] = [...selectedFilters[key]];
        } else if (key === SearchCategory.ExternalContents) {
          this.constructQueryParam(SearchCategory.ExternalContents);
          this.seeAllResult = SearchCategory.ExternalContents;
          this.applyFilterToCaategoryType();
        } else if (key === FacetType.contentPartners) {
          this.searchRequestExternal.filterCriteriaMap[FacetType.contentPartners] = [...selectedFilters[key]];
        } else if (key === FacetType.topic) {
          this.searchRequestExternal.filterCriteriaMap[FacetType.topic] = [...selectedFilters[key]];
        }
        // Users
        else if (key === FacetType.profileGroup) {
          this.searchRequestUsers.request.filters[FacetType.profileGroup] = [...selectedFilters[key]];
        } else if (key === FacetType.profileStatus) {
          this.searchRequestUsers.request.filters[FacetType.profileStatus] = [...selectedFilters[key]];
        } else if (key === FacetType.organizationsRoles) {
          this.searchRequestUsers.request.filters[FacetType.organizationsRoles] = [...selectedFilters[key]];
        } else if (key === "dateRange") {
          if (selectedFilters[key].length === 2) {
            const [startDate, endDate] = selectedFilters[key];
            if (startDate && endDate) {
              // For Events we need epoch millis; for Users/Designation keep the original string values
              if (this.seeAllResult === SearchCategory.Events) {
                const startEpoch = moment(startDate).valueOf();
                const endEpoch = moment(endDate).valueOf();
                this.searchRequestEvents.request.filters["startDateTimeInEpoch"] = {
                  ">=": startEpoch
                };
                this.searchRequestEvents.request.filters["endDateTimeInEpoch"] = {
                  "<=": endEpoch
                };
              } else if (this.seeAllResult === SearchCategory.Users) {
                this.searchRequestUsers.request.filters["createdDate"] = {
                  ">=": startDate,
                  "<=": endDate
                };
              } else if (this.seeAllResult === SearchCategory.Designation) {
                this.searchRequestDesignation.request.filters[FacetType.createdOn] = {
                  ">=": startDate,
                  "<=": endDate
                };
              } else if (this.seeAllResult === SearchCategory.Events) {
                const startDateInEpoch = new Date(startDate).getTime();
                const endDateInEpoch = new Date(endDate).getTime();
                this.searchRequestEvents.request.filters["startDateTimeInEpoch"] = {
                  ">=": startDateInEpoch
                };
                this.searchRequestEvents.request.filters["endDateTimeInEpoch"] = {
                  "<=": endDateInEpoch
                };
              } else if (this.seeAllResult === SearchCategory.Communities) {
                this.searchRequestCommunities.filterCriteriaMap[FacetType.createdOn] = {
                  ">=": startDate,
                  "<=": endDate
                };
              } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
                this.searchRequestTrainingPlans.filter[FacetType.createdAt] = {
                  ">=": startDate,
                  "<=": endDate
                };
              } else if (this.seeAllResult === SearchCategory.Courses) {
                this.searchRequestCourse.request.filters[FacetType.createdOn] = {
                  ">=": startDate,
                  "<=": endDate
                };
              }
            }
          } else {
            this.searchRequestUsers.request.filters["createdDate"] = selectedFilters[key];
            this.searchRequestDesignation.request.filters[FacetType.createdOn] = selectedFilters[key];
          }
        } else if (key === FacetType.status) {
          if (this.seeAllResult === SearchCategory.Events) {
            this.searchRequestEvents.request.filters[FacetType.status] = [...selectedFilters[key]];
          } else {
            this.searchRequestTrainingPlans.filter[FacetType.status] = [...selectedFilters[key]];
          }
        } else if (key === "timeline") {
          if (selectedFilters[key].length === 2) {
            const [startDate, endDate] = selectedFilters[key];
            if (startDate && endDate) {
              if (this.seeAllResult === SearchCategory.TrainingPlans) {
                this.searchRequestTrainingPlans.filter[FacetType.endDate] = {
                  ">=": startDate,
                  "<=": endDate
                };
              }
            }
          }
        } else if (key === FacetType.contentType) {
          this.searchRequestTrainingPlans.filter[FacetType.contentType] = [...selectedFilters[key]];
        } else if (key === FacetType.isApar) {
          if (selectedFilters[key]?.length) {
            this.searchRequestTrainingPlans.filter[FacetType.isApar] = selectedFilters[key][0] === "APAR" ? true : false;
          }
        } else {
          this.searchRequestCourse.request.filters.courseCategory!.push(...selectedFilters[key]);
        }
      }
    });

    if (!Object.keys(selectedFilters).includes("typeOfEvents") && (this.seeAllResult === SearchCategory.Events && !Object.keys(selectedFilters).includes("dateRange"))) {
      this.resetEventsTypesRequest();
    }

    if (!Object.keys(selectedFilters).includes(this.competencyAreaNameKey)) {
      // this.resetEventsTypesRequest()
      delete this.searchRequestEvents.request.filters[this.competencyAreaNameKey];
    }

    if (this.isExploreContentTab && Object.keys(selectedFilters).length === 1) {
      this.searchCourses();
      this.searchContentLoader = false;
    }

    this.deleteFilterKeys();
    if (this.shouldReturnFromHere) {
      this.shouldReturnFromHere = false;
      return;
    }

    if (this.seeAllResult === SearchCategory.Courses || this.seeAllResult === SearchCategory.CaseStudy) {
      this.searchCourses();
    } else if (this.seeAllResult === SearchCategory.Events) {
      this.searchEvents();
    } else if (this.seeAllResult === SearchCategory.Resources) {
      this.searchResources();
    } else if (this.seeAllResult === SearchCategory.People) {
      this.searchPeople();
    } else if (this.seeAllResult === SearchCategory.Communities) {
      this.searchcommunities();
    } else if (this.seeAllResult === SearchCategory.ExternalContents) {
      this.searchExternalContents();
    } else if (this.seeAllResult === SearchCategory.Designation) {
      this.searchDesignations();
    } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
      this.searchTrainingPlans();
    } else if (this.seeAllResult === SearchCategory.Users) {
      this.searchUsersMDO();
    } else {
      const categories = this.getCurrentSearchCategories.map(cat => cat.value) || [];
      if (categories.length) {
        // trigger searches: await Courses and Events first, then run others concurrently
        await this.executeSearchesForCategories(categories, false);
      }
    }

    this.searchContentLoader = false;
  }

  private checkIfExploreContentTab(): void {
    this.activated.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
      this.isExploreContentTab = !!params["tab"];
    });
  }

  async applyFilterFromLearn(selectedFilters: { [key: string]: any }) {
    console.log("selectedFilters", selectedFilters);
  }

  // Delete the empty request param from request body
  deleteFilterKeys() {
    const removeEmpty = (obj: any, keys: string[], isObjectCheck = false) => {
      keys.forEach(key => {
        const value = obj[key];
        if (value && ((isObjectCheck && Object.keys(value).length === 0) || (!isObjectCheck && value.length === 0))) {
          delete obj[key];
        }
      });
    };

    // For searchRequestCourse
    const courseFilters = this.searchRequestCourse?.request?.filters || {};
    removeEmpty(courseFilters, [FacetType.Language, FacetType.Organization, FacetType.sectorId, FacetType.subSectorId], false);
    removeEmpty(courseFilters, [FacetType.AvgRating], true);
    removeEmpty(courseFilters, [this.competencyAreaNameKey, this.competencySubThemeKey, FacetType.sectorNames_v1, FacetType.subSectorNames_v1], false);

    // For searchRequestCommunities
    const communityFilters = this.searchRequestCommunities?.filterCriteriaMap || {};
    removeEmpty(communityFilters, ["competencyArea", "orgName", "topicName"], false);
    removeEmpty(communityFilters, [this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey], false);

    // For searchRequestPeoples
    const peopleFilters = this.searchRequestPeoples?.filters || {};
    removeEmpty(peopleFilters, ["rootOrgName", "profileDetails.professionalDetails.designation"], false);

    // For searchRequestEvents
    const eventFilters = this.searchRequestEvents?.request?.filters || {};
    removeEmpty(eventFilters, [FacetType.SourceName, "resourceType"], false);
    removeEmpty(eventFilters, [this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey], false);

    // For searchRequestResources
    const resourceFilters = this.searchRequestResources?.request?.filters || {};
    removeEmpty(resourceFilters, [FacetType.sectorNameResource, FacetType.subSectorNameResource], false);

    // For searchRequestExternal
    const externalFilters = this.searchRequestExternal.filterCriteriaMap || {};
    removeEmpty(
      externalFilters,
      [FacetType.contentPartners, FacetType.topic, this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey],
      false
    );

    // For searchRequestUsers
    const userFilters = this.searchRequestUsers?.request?.filters || {};
    removeEmpty(
      userFilters,
      [FacetType.profileGroup, FacetType.profileStatus, FacetType.organizationsRoles, FacetType.profileDesignation, FacetType.rootOrgName],
      false
    );

    if (userFilters["createdDate"]) {
      const dateRange = userFilters["createdDate"];
      if (!Object.keys(dateRange)?.length) {
        delete this.searchRequestUsers?.request?.filters["createdDate"];
      }
    }

    // For searchRequestDesignation
    if (this.searchRequestDesignation?.request.filters) {
      removeEmpty(this.searchRequestDesignation.request.filters, [FacetType.createdOn], false);
    }

    // For searchRequestTrainingPlans
    if (this.searchRequestTrainingPlans?.filter) {
      removeEmpty(
        this.searchRequestTrainingPlans.filter,
        [FacetType.status, FacetType.createdAt, FacetType.createdByName, FacetType.contentType, FacetType.endDate, FacetType.isApar],
        false
      );
    }
  }

  async seeAllResults(category: string) {
    this.seeAllResult = category;
    if (category === SearchCategory.Courses) {
      this.eventSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.externalSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;

      this.searchRequestCourse.request.limit = this.initialPaginationSize;
      await this.searchCourses();
      this.combinedFacets = [this.coursesFacets];
    } else if (category === SearchCategory.CaseStudy) {
      this.eventSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.externalSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;

      this.searchRequestCourse.request.limit = this.initialPaginationSize;
      this.searchRequestCourse.request.filters.courseCategory = ["Case Study"];
      await this.searchCourses();
      this.combinedFacets = [this.coursesFacets];
    } else if (category === SearchCategory.Events) {
      this.courseSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.externalSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;

      this.searchRequestEvents.request.limit = this.initialPaginationSize;
      await this.searchEvents();
      this.combinedFacets = [this.eventsFacets];

      if (this.applicationName !== SearchListingConfig.ApplicationNames.CBPPortal && this.applicationName !== SearchListingConfig.ApplicationNames.MDOPortal) {
        this.processTypeOfEventsFilter();
      }
    } else if (category === SearchCategory.People) {
      this.courseSearchTotalCount = 0;
      this.eventSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.externalSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;

      this.searchRequestPeoples.limit = this.initialPaginationSize;
      await this.searchPeople();
      this.combinedFacets = this.peoplesFacets.length ? [this.peoplesFacets] : [];
    } else if (category === SearchCategory.Communities) {
      this.courseSearchTotalCount = 0;
      this.eventSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.externalSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;

      this.searchRequestCommunities.pageSize = this.initialPaginationSize;
      await this.searchcommunities();
      this.combinedFacets = [this.communitiesFacets];
    } else if (category === SearchCategory.Resources) {
      this.courseSearchTotalCount = 0;
      this.eventSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.externalSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;

      this.searchRequestResources.request.limit = this.initialPaginationSize;
      await this.searchResources();
      this.combinedFacets = [this.resourcesFacets];
    } else if (category === SearchCategory.ExternalContents) {
      this.courseSearchTotalCount = 0;
      this.eventSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;

      this.searchRequestExternal.pageSize = this.initialPaginationSize;

      await this.searchExternalContents();
      this.combinedFacets = [this.externalFacets];
    } else if (category === SearchCategory.Designation) {
      this.courseSearchTotalCount = 0;
      this.eventSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;

      // this.searchRequestExternal.pageSize = this.initialPaginationSize;
      await this.searchDesignations();
      // this.combinedFacets = [this.externalFacets];
    } else if (category === SearchCategory.TrainingPlans) {
      this.courseSearchTotalCount = 0;
      this.eventSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.usersSearchTotalCount = 0;
      this.searchRequestTrainingPlans.pageSize = this.initialPaginationSize;
      await this.searchTrainingPlans();
      this.combinedFacets = [this.trainingPlansFacets];
    } else if (category === SearchCategory.Users) {
      this.courseSearchTotalCount = 0;
      this.eventSearchTotalCount = 0;
      this.communitiesSearchTotalCount = 0;
      this.peopleSearchTotalCount = 0;
      this.resourcesSearchTotalCount = 0;
      this.designationSearchTotalCount = 0;
      this.trainingPlansSearchTotalCount = 0;
      this.searchRequestUsers.request.limit = this.initialPaginationSize;

      await this.searchUsersMDO();
      this.combinedFacets = [this.usersFacets];
    }
    // this.scrollToTop();
    this.searchContentLoader = false;
  }

  resetAllSearchParams() {
    this.applySelectedFilters = {};
    this.searchRequestCourse = new SearchV4Request([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
    this.searchRequestEvents = new SearchV4Request([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
    this.searchRequestPeoples = new SearchPeoplesRequest();
    this.searchRequestCommunities = new SearchCommunitiesRequest([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
    this.searchRequestResources = new SearchV4Request([]);
    this.searchRequestExternal = new SearchExternalRequest([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);

    this.searchRequestDesignation = new SearchDesignationRequest();
    this.searchRequestTrainingPlans = new SearchTrainingPlansRequest();
    this.searchRequestUsers = new SearchUsersRequest();

    this.courseSearchResults = [];
    this.eventsSearchResults = [];
    this.peoplesSearchResults = [];
    this.communitiesSearchResults = [];
    this.resourcesSearchResults = [];
    this.externalSearchResults = [];
    this.designationSearchResults = [];
    this.trainingPlansSearchResults = [];
    this.usersSearchResults = [];

    this.combinedFacets = [];

    this.courseSearchTotalCount = 0;
    this.eventSearchTotalCount = 0;
    this.peopleSearchTotalCount = 0;
    this.communitiesSearchTotalCount = 0;
    this.resourcesSearchTotalCount = 0;
    this.externalSearchTotalCount = 0;
    this.designationSearchTotalCount = 0;
    this.trainingPlansSearchTotalCount = 0;
    this.usersSearchTotalCount = 0;

    this.seeAllResult = "";
    this.allResultsDepartmentName = new Set<string>();
    this.competencyFactet = [];
  }

  async onPageChange(event: PageChangeEmitter) {
    this.searchContentLoader = true;
    this.scrollToTop();

    if (this.seeAllResult === SearchCategory.Courses) {
      this.searchRequestCourse.request.limit = event.limit;
      this.searchRequestCourse.request.offset = (event.currentPage - 1) * event.limit;

      await this.searchCourses();
    } else if (this.seeAllResult === SearchCategory.Events) {
      this.searchRequestEvents.request.limit = event.limit;
      this.searchRequestEvents.request.offset = (event.currentPage - 1) * event.limit;
      await this.searchEvents();
    } else if (this.seeAllResult === SearchCategory.People) {
      this.searchRequestPeoples.limit = event.limit;
      this.searchRequestPeoples.offset = (event.currentPage - 1) * event.limit;
      this.searchPeople();
    } else if (this.seeAllResult === SearchCategory.Resources) {
      this.searchRequestResources.request.limit = event.limit;
      this.searchRequestResources.request.offset = (event.currentPage - 1) * event.limit;
      await this.searchResources();
    } else if (this.seeAllResult === SearchCategory.ExternalContents) {
      this.searchRequestExternal.pageSize = event.limit;
      this.searchRequestExternal.pageNumber = event.currentPage - 1;
      await this.searchExternalContents();
    } else if (this.seeAllResult === SearchCategory.Communities) {
      this.searchRequestCommunities.pageSize = event.limit;
      this.searchRequestCommunities.pageNumber = event.currentPage - 1;
      await this.searchcommunities();
    } else if (this.seeAllResult === SearchCategory.Users) {
      this.searchRequestUsers.request.limit = event.limit;
      this.searchRequestUsers.request.offset = (event.currentPage - 1) * event.limit;
      await this.searchUsersMDO();
    } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
      this.searchRequestTrainingPlans.pageSize = event.limit;
      this.searchRequestTrainingPlans.pageNumber = event.currentPage - 1;
      await this.searchTrainingPlans();
    } else if (this.seeAllResult === SearchCategory.Designation) {
      this.searchRequestDesignation.request.limit = event.limit;
      this.searchRequestDesignation.request.offset = (event.currentPage - 1) * event.limit;
      await this.searchDesignations();
    }

    this.searchContentLoader = false;
  }

  async onChangeSortSearch(event: string) {
    this.searchContentLoader = true;
    this.searchSortFilter = event;
    this.resetPagination();
    this.searchRequestCourse.request.sort_by = {};
    this.searchRequestCourse.request.offset = 0;

    this.searchRequestResources.request.sort_by = {};
    this.searchRequestResources.request.offset = 0;

    this.searchRequestEvents.request.sort_by = {};
    this.searchRequestEvents.request.offset = 0;

    this.searchRequestCommunities.pageNumber = 0;

    this.searchRequestPeoples.offset = 0;

    this.searchRequestExternal.pageNumber = 0;
    this.searchRequestExternal.orderDirection = "";

    this.searchRequestUsers.request.sort_by = {};
    this.searchRequestUsers.request.offset = 0;

    this.searchRequestTrainingPlans.pageNumber = 0;
    this.searchRequestTrainingPlans.orderBy = "desc";

    this.searchRequestDesignation.request.offset = 0;
    this.searchRequestDesignation.request.sort_by = {};

    const categories = this.getCurrentSearchCategories.map(cat => cat.value) || [];

    if (event === SortType.MostRelevent) {
      if (this.seeAllResult === "") {
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
        if (categories.includes(SearchCategory.Communities)) {
          await this.searchcommunities();
        }
        if (categories.includes(SearchCategory.Users)) {
          await this.searchUsersMDO();
        }
        if (categories.includes(SearchCategory.TrainingPlans)) {
          await this.searchTrainingPlans();
        }
        if (categories.includes(SearchCategory.Designation)) {
          await this.searchDesignations();
        }
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by = {};
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by = {};
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by = {};
        if (categories.includes(SearchCategory.Resources)) {
          await this.searchResources();
        }
      } else if (this.seeAllResult === SearchCategory.Users) {
        this.searchRequestUsers.request.sort_by = {};
        this.searchRequestUsers.request.orderBy = "createdAt";
        if (categories.includes(SearchCategory.Users)) {
          await this.searchUsersMDO();
        }
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        delete this.searchRequestTrainingPlans.orderBy;
        delete this.searchRequestTrainingPlans.orderDirection;
        if (categories.includes(SearchCategory.TrainingPlans)) {
          await this.searchTrainingPlans();
        }
      } else if (this.seeAllResult === SearchCategory.Designation) {
        this.searchRequestDesignation.request.sort_by = {};
        if (categories.includes(SearchCategory.Designation)) {
          await this.searchDesignations();
        }
      } else if (this.seeAllResult === SearchCategory.Communities) {
        delete this.searchRequestCommunities.orderBy;
        delete this.searchRequestCommunities.orderDirection;
        if (categories.includes(SearchCategory.Communities)) {
          await this.searchcommunities();
        }
      }
    } else if (event === SortType.RecentlyAdded) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by.createdOn = SortType.Descending;
        this.searchRequestEvents.request.sort_by.startDate = SortType.Descending;
        this.searchRequestUsers.request.orderBy = "createdDate";

        this.searchRequestTrainingPlans.orderBy = FacetType.createdAt;
        this.searchRequestTrainingPlans.orderDirection = SortType.Descending;

        this.searchRequestDesignation.request.sort_by[FacetType.createdOn] = SortType.Descending;
        delete this.searchRequestDesignation.request.sort_by["name"];

        this.searchRequestCommunities.orderDirection = SortType.Descending;
        this.searchRequestCommunities.orderBy = "createdOn";

        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
        if (categories.includes(SearchCategory.Communities)) {
          await this.searchcommunities();
        }
        if (categories.includes(SearchCategory.Users)) {
          await this.searchUsersMDO();
        }
        if (categories.includes(SearchCategory.TrainingPlans)) {
          await this.searchTrainingPlans();
        }
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by.createdOn = SortType.Descending;
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by.startDate = SortType.Descending;
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
      } else if (this.seeAllResult === SearchCategory.Communities) {
        this.searchRequestCommunities.orderDirection = SortType.Descending;
        this.searchRequestCommunities.orderBy = "createdOn";

        if (categories.includes(SearchCategory.Communities)) {
          await this.searchcommunities();
        }
      } else if (this.seeAllResult === SearchCategory.People) {
        delete this.searchRequestPeoples?.sort_by?.firstName;
        this.searchRequestPeoples.sort_by.createdOn = SortType.Descending;
        if (categories.includes(SearchCategory.People)) {
          await this.searchPeople();
        }
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by.createdOn = SortType.Descending;
        if (categories.includes(SearchCategory.Resources)) {
          await this.searchResources();
        }
      } else if (this.seeAllResult === SearchCategory.ExternalContents) {
        this.searchRequestExternal.orderBy = "createdOn";
        if (categories.includes(SearchCategory.ExternalContents)) {
          await this.searchExternalContents();
        }
      } else if (this.seeAllResult === SearchCategory.Users) {
        delete this.searchRequestUsers.request.orderBy;
        this.searchRequestUsers.request.sort_by["createdDate"] = SortType.Descending;
        if (categories.includes(SearchCategory.Users)) {
          await this.searchUsersMDO();
        }
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        this.searchRequestTrainingPlans.orderBy = "createdAt";
        this.searchRequestTrainingPlans.orderDirection = SortType.Descending;
        if (categories.includes(SearchCategory.TrainingPlans)) {
          await this.searchTrainingPlans();
        }
      } else if (this.seeAllResult == SearchCategory.Designation) {
        this.searchRequestDesignation.request.sort_by[FacetType.createdOn] = SortType.Descending;
        delete this.searchRequestDesignation.request.sort_by["name"];
        if (categories.includes(SearchCategory.Designation)) {
          await this.searchDesignations();
        }
      }
    } else if (event === SortType.HighestRated) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by.avgRating = SortType.Descending;
        this.searchRequestEvents.request.sort_by.avgRating = SortType.Descending;
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
        if (categories.includes(SearchCategory.Communities)) {
          await this.searchcommunities();
        }
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by.avgRating = SortType.Descending;
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by.avgRating = SortType.Descending;
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by.avgRating = SortType.Descending;
        if (categories.includes(SearchCategory.Resources)) {
          await this.searchResources();
        }
      }
    } else if (event === SortType.Ascending) {
      this.searchRequestPeoples.sort_by.firstName = SortType.Ascending;
      if (categories.includes(SearchCategory.People)) {
        await this.searchPeople();
      }
    } else if (event === SortType.Descending) {
      this.searchRequestPeoples.sort_by.firstName = SortType.Descending;
      if (categories.includes(SearchCategory.People)) {
        await this.searchPeople();
      }
    } else if (event === SortType.AtoZ) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by.name = SortType.Ascending;
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }

        this.searchRequestEvents.request.sort_by.name = SortType.Ascending;
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }

        this.searchRequestUsers.request.sort_by.firstName = SortType.Ascending;
        if (categories.includes(SearchCategory.Users)) {
          await this.searchUsersMDO();
        }

        this.searchRequestTrainingPlans.orderBy = "name";
        this.searchRequestTrainingPlans.orderDirection = SortType.Ascending;
        if (categories.includes(SearchCategory.TrainingPlans)) {
          await this.searchTrainingPlans();
        }

        delete this.searchRequestDesignation.request.sort_by[FacetType.createdOn];
        this.searchRequestDesignation.request.sort_by["name"] = SortType.Ascending;
        if (categories.includes(SearchCategory.Designation)) {
          await this.searchDesignations();
        }

        if (categories.includes(SearchCategory.Communities)) {
          this.searchRequestCommunities.orderBy = "communityName";
          this.searchRequestCommunities.orderDirection = SortType.Ascending;
          await this.searchcommunities();
        }
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by.name = SortType.Ascending;
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by.name = SortType.Ascending;
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by.name = SortType.Ascending;
        if (categories.includes(SearchCategory.Resources)) {
          await this.searchResources();
        }
      } else if (this.seeAllResult === SearchCategory.ExternalContents) {
        this.searchRequestExternal.orderDirection = SortType.Ascending;
        if (categories.includes(SearchCategory.ExternalContents)) {
          await this.searchExternalContents();
        }
      } else if (this.seeAllResult === SearchCategory.Users) {
        this.searchRequestUsers.request.sort_by.firstName = SortType.Ascending;
        if (categories.includes(SearchCategory.Users)) {
          await this.searchUsersMDO();
        }
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        this.searchRequestTrainingPlans.orderBy = "name";
        this.searchRequestTrainingPlans.orderDirection = SortType.Ascending;
        if (categories.includes(SearchCategory.TrainingPlans)) {
          await this.searchTrainingPlans();
        }
      } else if (this.seeAllResult === SearchCategory.Communities) {
        this.searchRequestCommunities.orderBy = "communityName";
        this.searchRequestCommunities.orderDirection = SortType.Ascending;
        if (categories.includes(SearchCategory.Communities)) {
          await this.searchcommunities();
        }
      } else if (this.seeAllResult === SearchCategory.Designation) {
        delete this.searchRequestDesignation.request.sort_by[FacetType.createdOn];
        this.searchRequestDesignation.request.sort_by["name"] = SortType.Ascending;
        if (categories.includes(SearchCategory.Designation)) {
          await this.searchDesignations();
        }
      }
    } else if (event === SortType.ZtoA) {
      if (this.seeAllResult === "") {
        this.searchRequestCourse.request.sort_by.name = SortType.Descending;
        this.searchRequestEvents.request.sort_by.name = SortType.Descending;
        this.searchRequestUsers.request.sort_by.firstName = SortType.Descending;

        this.searchRequestTrainingPlans.orderBy = "name";
        this.searchRequestTrainingPlans.orderDirection = SortType.Descending;

        delete this.searchRequestDesignation.request.sort_by[FacetType.createdOn];
        this.searchRequestDesignation.request.sort_by["name"] = SortType.Descending;

        this.searchRequestCommunities.orderBy = "communityName";
        this.searchRequestCommunities.orderDirection = SortType.Descending;

        if (categories.includes(SearchCategory.Designation)) {
          await this.searchDesignations();
        }
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
        if (categories.includes(SearchCategory.Communities)) {
          await this.searchcommunities();
        }
        if (categories.includes(SearchCategory.Users)) {
          await this.searchUsersMDO();
        }
        if (categories.includes(SearchCategory.TrainingPlans)) {
          await this.searchTrainingPlans();
        }
      } else if (this.seeAllResult === SearchCategory.Courses) {
        this.searchRequestCourse.request.sort_by.name = SortType.Descending;
        if (categories.includes(SearchCategory.Courses)) {
          await this.searchCourses();
        }
      } else if (this.seeAllResult === SearchCategory.Events) {
        this.searchRequestEvents.request.sort_by.name = SortType.Descending;
        if (categories.includes(SearchCategory.Events)) {
          await this.searchEvents();
        }
      } else if (this.seeAllResult === SearchCategory.Resources) {
        this.searchRequestResources.request.sort_by.name = SortType.Descending;
        if (categories.includes(SearchCategory.Resources)) {
          await this.searchResources();
        }
      } else if (this.seeAllResult === SearchCategory.ExternalContents) {
        this.searchRequestExternal.orderDirection = SortType.Descending;
        if (categories.includes(SearchCategory.ExternalContents)) {
          await this.searchExternalContents();
        }
      } else if (this.seeAllResult === SearchCategory.Users) {
        this.searchRequestUsers.request.sort_by.firstName = SortType.Descending;
        if (categories.includes(SearchCategory.Users)) {
          await this.searchUsersMDO();
        }
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        this.searchRequestTrainingPlans.orderBy = "name";
        this.searchRequestTrainingPlans.orderDirection = SortType.Descending;
        if (categories.includes(SearchCategory.TrainingPlans)) {
          await this.searchTrainingPlans();
        }
      } else if (this.seeAllResult === SearchCategory.Designation) {
        delete this.searchRequestDesignation.request.sort_by[FacetType.createdOn];
        this.searchRequestDesignation.request.sort_by["name"] = SortType.Descending;
        if (categories.includes(SearchCategory.Designation)) {
          await this.searchDesignations();
        }
      } else if (this.seeAllResult === SearchCategory.Communities) {
        this.searchRequestCommunities.orderBy = "communityName";
        this.searchRequestCommunities.orderDirection = SortType.Descending;
        if (categories.includes(SearchCategory.Communities)) {
          await this.searchcommunities();
        }
      }
    }

    localStorage.setItem(SearchConstantLocalStorage.SortType, event);
    this.searchContentLoader = false;
  }

  checkCourseEnrollmentAndCbpPlan() {
    const userId = this.configSvc.userProfile?.userId || "";
    const request = {
      request: {
        retiredCoursesEnabled: true,
        limit: this.initialPaginationSize
      }
    };

    forkJoin({
      inProgress: this.searchListingService.enrollment({ request: { ...request.request, status: "In-Progress" } }, userId),
      completed: this.searchListingService.enrollment({ request: { ...request.request, status: "Completed" } }, userId),
      cbpPlan: this.searchListingService.fetchCbpPlanList()
    }).subscribe(responses => {
      const inProgressCourses = (responses.inProgress as any)?.result?.courses || [];
      const completedCourses = (responses.completed as any)?.result?.courses || [];

      this.enrollmentDetails = [...inProgressCourses, ...completedCourses];
      this.cbpPlanList = responses.cbpPlan || [];
    });
  }

  getAllConnectionRequests() {
    this.networkService.fetchAllConnectionRequests().subscribe((requests: any) => {
      this.connectionRequestsSent = requests.result.data;

      if (this.peoplesSearchResults && this.peoplesSearchResults.length > 0) {
        // Filter all the connection requests sent
        if (this.connectionRequestsSent && this.connectionRequestsSent.length > 0) {
          this.connectionRequestsSent.map((user: any) => {
            const userid = user.id || user.identifier || user.wid || user.userId;
            if (userid) {
              this.peoplesSearchResults.forEach((usr: any) => {
                if ((usr.userId || usr.wid) === userid) {
                  usr["requestSent"] = true;
                }
              });
            }
          });
        }
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  constructQueryParam(category: any) {
    const params = this.activated.snapshot.queryParams;

    this.queryParams = {
      q: params["q"]?.trim(),
      search: params["search"] || null,
      category: category || null,
      tab: null
    };
    this.queryParamChange.emit(this.queryParams);
  }

  resetPagination() {
    this.initialPaginationPage = 2;
    setTimeout(() => {
      this.initialPaginationPage = 1;
    });
  }

  processEventsResult(events: any) {
    let processedEvents: any = [];

    let serverTime = moment();
    serverTime = serverTime.add(5, "hours").add(30, "minutes");
    serverTime.format("YYYY-MM-DD HH:mm:ss"),
      events.forEach((event: any) => {
        if (event.startDate && event.endDate && event.startTime && event.endTime) {
          // Conver current time into milliseconds
          let currentTime = new Date(serverTime.toString()).getTime() / 1000;
          // Combining date and time for start event
          let evenStarttDate = new Date(`${event.startDate} ${event.startTime}`).getTime() / 1000;
          // Combining date and time for end event
          let eventEndDate = new Date(`${event.endDate} ${event.endTime}`).getTime() / 1000;
          if (this.applicationName !== SearchListingConfig.ApplicationNames.CBPPortal) {
            if (currentTime > eventEndDate) {
              if (this.typesOfEventsFilters.includes("past events")) {
                processedEvents.push(event);
              }
            } else if (currentTime <= eventEndDate && currentTime >= evenStarttDate) {
              if (this.typesOfEventsFilters.includes("live")) {
                event.showLive = true;
                processedEvents.push(event);
              }
            } else {
              if (this.typesOfEventsFilters.includes("upcoming")) {
                processedEvents.push(event);
              }
            }
          }
        }
      });
    return processedEvents;
  }

  async removeFilterChip(filter: any) {
    this.searchContentLoader = true;
    this.filtersChipFromLearn = this.filtersChipFromLearn.filter(ele => ele !== filter);
    this.searchRequestCourse.request.filters.courseCategory = this.filtersChipFromLearn;

    if (!this.filtersChipFromLearn.length) {
      this.sideNavBarOpened = true;
      this.seeAllResults(SearchCategory.Courses);
      return;
    }

    await this.searchCourses();
    this.searchContentLoader = false;
  }

  async processTypeOfEventsFilter() {
    const typeOfEvents = ["live", "upcoming", "past events"];
    const eventCounts: any[] = [];

    for (const type of typeOfEvents) {
      const searchRequestEvents = new SearchV4Request([]);
      searchRequestEvents.request.query = this.statedata?.param;
      searchRequestEvents.request.filters.contentType = "Event";
      searchRequestEvents.request.fields = SearchEventFields;
      searchRequestEvents.request.facets = ["startDateTimeInEpoch"];

      delete searchRequestEvents.request.filters?.courseCategory;
      delete searchRequestEvents.request.sort_by?.createdOn;

      const currentEpochTime = moment().valueOf();
      // const endOfDayEpochTime = moment().endOf('day').valueOf();
      const tomorrowEpochTime = moment().add(1, "day").startOf("day").valueOf();

      if (type === "live") {
        searchRequestEvents.request.filters["startDateTimeInEpoch"] = {
          "<=": currentEpochTime
        };
        searchRequestEvents.request.filters["endDateTimeInEpoch"] = {
          ">=": currentEpochTime
        };
      } else if (type === "upcoming") {
        searchRequestEvents.request.filters["startDateTimeInEpoch"] = {
          ">=": tomorrowEpochTime
        };
      } else if (type === "past events") {
        searchRequestEvents.request.filters["endDateTimeInEpoch"] = {
          "<=": currentEpochTime
        };
      }
      const result = await this.searchListingService.searchCoursesv4(searchRequestEvents);
      eventCounts.push({
        name: type,
        count: result?.result?.count || 0,
        isChecked: false,
        displayName: type
      });
    }

    this.typesOfEventsFilters = eventCounts;
  }

  resetEventsTypesRequest() {
    if (this.searchRequestEvents.request.filters["startDateTimeInEpoch"]) {
      delete this.searchRequestEvents.request.filters["startDateTimeInEpoch"];
    }
    if (this.searchRequestEvents.request.filters["endDateTimeInEpoch"]) {
      delete this.searchRequestEvents.request.filters["endDateTimeInEpoch"];
    }
  }

  async applyFilterToCaategoryType() {
    const params = this.activated.snapshot.queryParams;
    const category = params["category"];

    const keys = Object.keys(this.applySelectedFilters);
    if (keys.length === 1 && category === this.seeAllResult && this.applySelectedFilters[keys[0]].length) {
      if (this.seeAllResult === SearchCategory.Courses || this.seeAllResult === SearchCategory.CaseStudy) {
        await this.searchCourses();
      } else if (this.seeAllResult === SearchCategory.Events) {
        await this.searchEvents();
      } else if (this.seeAllResult === SearchCategory.Resources) {
        await this.searchResources();
      } else if (this.seeAllResult === SearchCategory.People) {
        await this.searchPeople();
      } else if (this.seeAllResult === SearchCategory.Communities) {
        await this.searchcommunities();
      } else if (this.seeAllResult === SearchCategory.ExternalContents) {
        await this.searchExternalContents();
      } else if (this.seeAllResult === SearchCategory.Designation) {
        await this.searchDesignations();
      } else if (this.seeAllResult === SearchCategory.TrainingPlans) {
        await this.searchTrainingPlans();
      } else if (this.seeAllResult === SearchCategory.Users) {
        await this.searchUsersMDO();
      }

      this.searchContentLoader = false;
    }
  }
}
