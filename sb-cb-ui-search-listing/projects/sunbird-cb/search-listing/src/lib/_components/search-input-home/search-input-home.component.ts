import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ConfigurationsService } from "@sunbird-cb/utils-v2";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  FacetType,
  ICompentencyKeys,
  SearchCategory,
  SearchCommunitiesRequest,
  SearchDesignationRequest,
  SearchEventfacet,
  SearchEventFields,
  SearchExternalRequest,
  SearchListingConfig,
  SearchNLP,
  SearchPeoplesRequest,
  SearchResourceFacets,
  SearchResourceMimeType,
  SearchTrainingPlansRequest,
  SearchUsersRequest,
  SearchV4Request
} from "../../_models/search-listing.model";
import { SnackbarComponent, WidgetContentLibService } from "@sunbird-cb/consumption";
// import { MobileAppsService } from "../../../../../../../../../src/app/services/mobile-apps.service";
import { SearchListingService } from "../../_services/search-listing.service";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "ws-app-search-input-lib-home",
  templateUrl: "./search-input-home.component.html",
  styleUrls: ["./search-input-home.component.scss"],
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None
})
export class SearchInputHomeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() placeHolder = "";
  @Input() ref = "";
  @Input() userRoles: string[] = [];
  // @Input() userRoleIsFixed = true;
  @Output() closed: EventEmitter<boolean> = new EventEmitter();
  @Output() selectedPillRole: EventEmitter<any> = new EventEmitter();

  queryControl: UntypedFormControl;
  languageSearch: string[] = [];
  SAKSHAMAI_ICON_LOADER = "/assets/images/sakshamAI/saksham_ai_loader.gif";

  disableMenu = false;
  recentSearches: any = [];
  searchQuery = "";
  allSearchResults: any[] = [];
  nlpSearchValue: any;
  private hasReadRecentBeenCalled = false;
  searchCat: any;
  categories: any[] = [];
  requiredQueryMinLength = 3;

  selectedSearchCategory: string = "";
  defaultSearchCategory: string = "";
  openSearchTemplate = false;
  loaderSearching = false;
  responseNlpQuery = "";
  searchSubscription: Subscription = new Subscription();
  searchConfig: SearchListingConfig.Config | null = null;

  environment!: any;
  competencyAreaNameKey!: string;
  competencyThemeKey!: string;
  competencySubThemeKey!: string;
  compentencyKey!: ICompentencyKeys;

  applicationName: string = "";
  rolesSubscription: Subscription | null = null

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;
  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.openSearchTemplate = false;
      this.hasReadRecentBeenCalled = false;
    }
  }
  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private configSvc: ConfigurationsService,
    private eRef: ElementRef,
    private searchListingService: SearchListingService,
    private contSvc: WidgetContentLibService, // private mobileAppsService: MobileAppsService
    @Inject("environment") environment: any,
    private translate: TranslateService,
    private snackbar: MatSnackBar
  ) {
    this.environment = environment;
    this.compentencyKey = _.get(this.configSvc, `compentency.${this.environment.compentencyVersionKey}`);
    if(this.compentencyKey) {
      this.competencyAreaNameKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyArea}`;
      this.competencyThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyTheme}`;
      this.competencySubThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencySubTheme}`;
    }

    this.queryControl = new UntypedFormControl(this.activated.snapshot.queryParams["q"] || "");

    this.queryControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(async (value: string) => {
      this.hasReadRecentBeenCalled = false;
      if (value && value.length > 100) {
        await this.searchFromQuery(value);
        this.loaderSearching = false;
      } else {
        this.loaderSearching = false;
      }
    });
  }

  clearSearchTextElement() {
    this.queryControl.setValue("");
    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
    }
  }

  ngOnInit() {
    if (localStorage.getItem("websiteLanguage")) {
      this.translate.setDefaultLang("en");
      const lang = localStorage.getItem("websiteLanguage")!;
      this.translate.use(lang);
    }
    this.searchConfig = this.activated.snapshot.data["searchPageData"];
    if (this.searchConfig) {
      this.initialize();
    } else {
      this.searchListingService.getSearchConfig().then((data: any) => {
        this.searchConfig = data;
        this.initialize();
      });
    }
    this.subscribeToRoleChanges()
  }

  subscribeToRoleChanges() {
    if (!this.rolesSubscription) {
      this.rolesSubscription = this.searchListingService.updatedUserRoles$.subscribe((roles: string[]) => {
        if (roles && roles.length === 1) {
          this.selectedPillRole.emit(roles[0].toLocaleLowerCase());
        }
      })
    }

    // Subscribe to setRolesForCategory triggers from service
    this.searchSubscription.add(
      this.searchListingService.setRolesForCategory$.subscribe((data: { category: string, roles?: string[] }) => {
        this.setRolesForCategory(data.category, data.roles);
      })
    );
  }

  ngOnChanges( changes: SimpleChanges ) {
    for (const change in changes) {
      if (change === "placeHolder") {
        this.placeHolder = this.placeHolder;
      }
    }

    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      if (changes['userRoles']) {
        this.getSearchCategoriesCopyForCBP(_.get(this.searchConfig, 'searchCategories', []))
      }
      // if (changes['userRoleIsFixed']) {
      //   this.searchListingService.setUserRoleIsFixed(this.userRoleIsFixed)
      // }
    }
  }
  

  initialize() {
    this.applicationName = _.get(this.searchConfig, 'applicationName', '');
    let isNotMyUser = false;
    let isIgotOrg = false;
    if ( _.get(this.configSvc, 'unMappedUser.profileDetails.profileStatus') ) {
      isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === "not-my-user" ? true : false;
    }
    isIgotOrg = _.get(this.configSvc, 'unMappedUser.profileDetails.employmentDetails.departmentName', '').toLowerCase() === "igot" ? true : false;
    // let isIgotOrg = true
    if (isNotMyUser && isIgotOrg) {
      this.disableMenu = true;
    } else {
      this.disableMenu = false;
    }
    let searchCategoriesCopy: SearchListingConfig.SearchCategory[] = _.get(this.searchConfig, 'searchCategories', [])
    if (this.applicationName  === SearchListingConfig.ApplicationNames.MDOPortal) {
      const userRoles = this.configSvc?.userRoles as Set<string>;
      if (searchCategoriesCopy.length) {
        const hasMdoAdmin = userRoles.has("mdo_admin");
        const hasMdoLeader = userRoles.has("mdo_leader");
        const hasCommunityModerator = userRoles.has("community_moderator");
        if ((hasMdoAdmin && hasCommunityModerator) || (hasMdoLeader && hasCommunityModerator) || hasMdoLeader) {
        } else if (hasMdoAdmin) {
          searchCategoriesCopy = searchCategoriesCopy.filter(category => category?.value !== SearchCategory.Communities);
        } else if (hasCommunityModerator) {
          searchCategoriesCopy = searchCategoriesCopy.filter(category => category?.value === SearchCategory.Communities);
          if (this.searchConfig && this.searchConfig.searchInputConfig) {
            this.searchConfig.searchInputConfig.defaultSearchCategory = SearchCategory.Communities;
          }
        } else {
          searchCategoriesCopy = searchCategoriesCopy.filter(category => category?.value !== SearchCategory.Communities);
        }
      }
    } else if (this.searchConfig && this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal && this.configSvc && this.configSvc.userRoles) {
      searchCategoriesCopy = this.getSearchCategoriesCopyForCBP(searchCategoriesCopy);
    }

    this.searchSubscription.add(
      this.activated.queryParamMap.subscribe(queryParam => {
        if (queryParam.has("q")) {
          this.queryControl.setValue(queryParam.get("q") || "");
        }
        if (queryParam.has("category")) {
          this.selectedSearchCategory = queryParam.get("category") || "";
        } else {
          this.selectedSearchCategory = this.defaultSearchCategory || this.searchConfig?.searchInputConfig?.defaultSearchCategory || "";
        }
      })
    );
    this.categories = searchCategoriesCopy || [];
    
    // Check if selectedSearchCategory exists in categories, if not set to first category
    const categoryExists = this.categories.some(category => category.value === this.selectedSearchCategory);
    if (!categoryExists && this.categories.length > 0) {
      this.selectedSearchCategory = this.categories[0].value;
      this.defaultSearchCategory = this.categories[0].value;
    }

    this.searchSubscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const path = event.url.split("?")[0];
          if (!path.split("/").includes("globalsearch")
            //  && 
            // (
            //   _.get(this.searchConfig, 'applicationName') !== SearchListingConfig.ApplicationNames.CBPPortal ||
            //   this.selectedSearchCategory !== 'courses'
            // )
          ) 
          {
            this.queryControl.reset();
          }
        }
      })
    );
  }

  getSearchCategoriesCopyForCBP(searchCategoriesCopy: SearchListingConfig.SearchCategory[]): SearchListingConfig.SearchCategory[] {
    // const userRoles = (this.userRoleIsFixed ? this.configSvc.userRoles : this.configSvc.userAllRoles) as Set<string> | string[];
    const userRoles = this.configSvc.userAllRoles as Set<string> | string[];
    const userRolesArray: string[] = userRoles instanceof Set ? Array.from(userRoles) : Array.isArray(userRoles) ? userRoles : [];
    searchCategoriesCopy = searchCategoriesCopy.filter((category: SearchListingConfig.SearchCategory) => {
      if (!category.roles || !Array.isArray(category.roles)) {
        return false;
      }
      return category.roles.some(role => userRolesArray.includes(role.toLocaleLowerCase()));
    });
    if (this.searchConfig) {
      this.searchConfig['currentSearchCategories'] = searchCategoriesCopy;
    }
    this.categories = searchCategoriesCopy || [];
    return searchCategoriesCopy
  }

  async updateQuery(query: string) {
    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      const currentSearchCategorie = this.selectedSearchCategory || this.defaultSearchCategory;
      const rolesForCategory = this.getRolesForCategory(currentSearchCategorie);
      this.setRolesForCategory(currentSearchCategorie, rolesForCategory);
    }
    if (query && query.length) {
      await this.searchInNLP(query)
        .then(() => {
          this.processSearchText(query);
        })
        .catch(() => {
          this.processSearchText(query);
        });
    } else {
      this.processSearchText(query);
    }
  }

  async updateRecentSearchQuery(query: any) {
    if (query) {
      const reqBody = {
        nlpSearchQuery: query.nlp_search_query,
        searchQuery: query.search_query,
        searchCategory: this.selectedSearchCategory || this.defaultSearchCategory || this.searchConfig?.searchInputConfig.defaultSearchCategory
      };
      await this.searchListingService
        .recentCreate(reqBody)
        .then(() => {
          this.processRecentSearchText(query);
        })
        .catch(() => {
          this.processRecentSearchText(query);
        });
    } else {
      this.processRecentSearchText(query);
    }
  }

  async createRecent(data: any) {
    const reqBody = {
      nlpSearchQuery: data,
      searchQuery: this.queryControl.value,
      searchCategory: this.selectedSearchCategory ? this.selectedSearchCategory : "all"
    };

    await this.searchListingService.recentCreate(reqBody).catch();
  }

  readRecent() {
    return this.searchListingService.recentRead().subscribe((res: any) => {
      if (res) {
        // this.recentSearches = res.result.searchQueries.nlp_search_query   this.nlpSearchValue = res
        if (res.result.searchQueries && res.result.searchQueries) {
          this.recentSearches = res?.result?.searchQueries;
        } else {
          this.recentSearches = "";
        }
      }
    });
  }

  goToSearchItem(query: any) {
    const category = this.selectedSearchCategory || this.defaultSearchCategory || this.searchConfig?.searchInputConfig.defaultSearchCategory
    const nlpSearchQuery = query?.nlp_search_query;
    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal && category) {
      const rolesForCategory = this.getRolesForCategory(category);
      this.setRolesForCategory(category, rolesForCategory);
    }
    if (category && category === SearchCategory.Courses && nlpSearchQuery) {
      const req = new SearchV4Request([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
      req.request.query = nlpSearchQuery;
      req.request.filters.contentType = ["Course"];
      this.searchListingService.fetchSearchDataByCategory(req).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.Events && nlpSearchQuery) {
      const req = new SearchV4Request([]);
      req.request.filters.contentType = "Event";
      req.request.filters.status = ["Live"];
      req.request.fields = SearchEventFields;
      req.request.facets = [...SearchEventfacet, this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey];
      req.request.query = nlpSearchQuery;

      delete req.request.filters?.courseCategory;
      delete req.request.sort_by?.createdOn;

      this.searchListingService.fetchSearchDataByCategory(req).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.People && nlpSearchQuery) {
      const req = new SearchPeoplesRequest();
      req.query = nlpSearchQuery;

      this.searchListingService
        .searchConnections(req)
        .then(() => {
          this.updateRecentSearchQuery(query);
        })
        .catch(error => {
          // tslint:disable-next-line: align
          console.error("something went wrong", error);
        });
    } else if (category && category === SearchCategory.Resources && nlpSearchQuery) {
      const req = new SearchV4Request([]);
      req.request.filters.contentType = "Resource";
      req.request.facets = SearchResourceFacets;
      req.request.filters["mimeType"] = SearchResourceMimeType;
      req.request.exists = [FacetType.sectorNames_v1, FacetType.resourceCategory];
      req.request.fields = [];
      req.request.query = nlpSearchQuery;

      this.searchListingService.fetchSearchDataByCategory(req).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.Communities && nlpSearchQuery) {
      const req = new SearchCommunitiesRequest([]);
      req.searchString = nlpSearchQuery;

      this.searchListingService
        .searchCommunity(req)
        .then((res: any) => {
          if (res) {
            this.updateRecentSearchQuery(query);
          }
        })
        .catch();
    } else if (category && category === "all" && nlpSearchQuery) {
      const catReq = new SearchV4Request([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
      catReq.request.query = nlpSearchQuery;
      catReq.request.filters.contentType = ["Course"];
      this.searchListingService.fetchSearchDataByCategory(catReq).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });

      const eventReq = new SearchV4Request([]);
      eventReq.request.filters.contentType = "Event";
      eventReq.request.filters.status = ["Live"];
      eventReq.request.fields = SearchEventFields;
      eventReq.request.facets = [...SearchEventfacet, this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey];
      eventReq.request.query = nlpSearchQuery;

      delete eventReq.request.filters?.courseCategory;
      delete eventReq.request.sort_by?.createdOn;
      this.searchListingService.fetchSearchDataByCategory(eventReq).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });

      const peopleReq = new SearchPeoplesRequest();
      peopleReq.query = nlpSearchQuery;
      this.searchListingService.searchConnections(peopleReq).catch();

      const resourceReq = new SearchV4Request([]);
      resourceReq.request.filters.contentType = "Resource";
      resourceReq.request.facets = SearchResourceFacets;
      resourceReq.request.filters["mimeType"] = SearchResourceMimeType;
      resourceReq.request.exists = [FacetType.sectorNames_v1, FacetType.resourceCategory];
      resourceReq.request.fields = [];
      resourceReq.request.query = nlpSearchQuery;
      this.searchListingService.fetchSearchDataByCategory(resourceReq).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });

      const communitiesreq = new SearchCommunitiesRequest([]);
      communitiesreq.searchString = nlpSearchQuery;

      this.searchListingService
        .searchCommunity(communitiesreq)
        .then((res: any) => {
          if (res) {
            this.updateRecentSearchQuery(query);
          }
        })
        .catch();
    } else if (category && category === SearchCategory.Users && nlpSearchQuery) {
      const req = new SearchUsersRequest();
      req.request.filters!.rootOrgId = this.configSvc.userProfile?.rootOrgId || "";
      req.request.query = nlpSearchQuery;
      this.searchListingService.searchUsersMDO(req).then((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.TrainingPlans && nlpSearchQuery) {
      const req = new SearchTrainingPlansRequest();
      req.pageSize = 3;
      req.searchString = nlpSearchQuery;

      this.searchListingService.searchTrainingPlans(req).then((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.Designation && nlpSearchQuery) {
      const req = new SearchDesignationRequest();
      req.request.query = nlpSearchQuery;
      req.request.filters["categories"] = [`${this.configSvc.userProfile?.rootOrgId}_odcs_designation`];

      this.searchListingService
        .searchDesignationV4(req)
        .then((res: any) => {
          if (res) {
            this.updateRecentSearchQuery(query);
          }
        })
        .catch(() => {});
    }
  }

  getRolesForCategory(category: string): string[] {
    const categoryObj = this.categories.find(cat => cat.value === category);
    return categoryObj && categoryObj.roles ? categoryObj.roles : [];
  }

  recentDeleteByUserId() {
    return this.searchListingService.recentDeleteByUser().subscribe((result: any) => {
      if (result && result.responseCode === "OK") {
        this.readRecent();
      }
    });
  }

  recentDeleteByTimeStamp(id: any) {
    return this.searchListingService.recentDeleteByTime(id).subscribe((result: any) => {
      if (result) {
        this.readRecent();
      }
    });
  }

  processRecentSearchText(query: any) {
    document.getElementById("global-search-input")?.blur();
    const isCBPPortal = _.get(this.searchConfig, "applicationName") === SearchListingConfig.ApplicationNames.CBPPortal;
    const searchQuery = isCBPPortal && _.get(query, "search_query", "") ? query.search_query.trim() : _.get(query, "nlp_search_query", "").trim();
    const queryParams = {
      q: searchQuery,
      // search: query && this.responseNlpQuery ? this.responseNlpQuery : null,
      category: this.selectedSearchCategory || this.defaultSearchCategory || this.searchConfig?.searchInputConfig.defaultSearchCategory || null,
      p: null,
      f: null,
      tab: null,
      filtersPanel: "show",
      search: query?.nlp_search_query || null
    };
    const navigationExtras = {
      queryParams,
      queryParamsHandling: "merge" as "merge"
    };
    const mergeQueryParams = window.location.pathname === "/app/globalsearch";
    if (this.ref === "home") {
      this.closed.emit(false);
      this.router.navigate(["/app/globalsearch"], mergeQueryParams ? navigationExtras : { queryParams });
    } else {
      this.router.navigate([], { ...navigationExtras, relativeTo: this.activated.parent });
    }
    localStorage.removeItem("activeRoute");
    this.openSearchTemplate = false;
  }

  processSearchText(query: any) {
    document.getElementById("global-search-input")?.blur();
    const queryParams = {
      q: query ? query?.trim() : "",
      search: query && this.responseNlpQuery ? this.responseNlpQuery : null,
      category: this.selectedSearchCategory || this.defaultSearchCategory || null,
      p: null,
      f: null,
      tab: null,
      filtersPanel: "show",
      user: null
    };
    const navigationExtras = {
      queryParams,
      queryParamsHandling: "merge" as "merge"
    };
    const mergeQueryParams = window.location.pathname === "/app/globalsearch";
    if (this.ref === "home") {
      this.closed.emit(false);
      this.router.navigate(["/app/globalsearch"], mergeQueryParams ? navigationExtras : { queryParams });
    } else {
      this.router.navigate([], { ...navigationExtras, relativeTo: this.activated.parent });
    }
    localStorage.removeItem("activeRoute");
    this.openSearchTemplate = false;
  }

  clearSearchText() {
    setTimeout(() => {
      this.openSearchTemplate = true;
    }, 0);
    this.queryControl.reset();

    if (this.applicationName !== SearchListingConfig.ApplicationNames.CBPPortal) {
      const params = { ...this.activated.snapshot.queryParams };
      params["q"] = "";
      params["search"] = "";

      this.router.navigate([], {
        relativeTo: this.activated.parent,
        queryParams: params,
        queryParamsHandling: "merge"
      });
    }
  }

  async selectSearchCategory(category: string, roles?: string[]) {
    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      this.setRolesForCategory(category, roles);
    }
    if (this.queryControl.value && this.queryControl.value.length >= this.requiredQueryMinLength) {
      this.selectedSearchCategory = category;
      // this.searchFromQuery(this.queryControl.value);
      this.updateQuery(this.queryControl.value);
    }
  }

  setRolesForCategory(category: string, roles?: string[]): void {
    // const userRoles = (this.userRoleIsFixed ? this.configSvc.userRoles : this.configSvc.userAllRoles) as Set<string> | string[];
    const userRoles = this.configSvc.userAllRoles as Set<string> | string[];
    const userRolesArray: string[] = userRoles instanceof Set ? Array.from(userRoles) : Array.isArray(userRoles) ? userRoles : [];
    if (userRolesArray.length > 1 && category) {
      if (roles && roles.length === 1) {
        if (userRolesArray.includes(roles[0].toLocaleLowerCase())) {
          this.configSvc.userRoles = new Set([roles[0].toLocaleLowerCase()]);
          this.selectedPillRole.emit(roles[0].toLocaleLowerCase());
        }
      } else if (roles && roles.length > 1) {
        for (const role of roles) {
          if (userRolesArray.includes(role.toLocaleLowerCase())) {
            this.configSvc.userRoles = new Set([role.toLocaleLowerCase()]);
            this.selectedPillRole.emit(role.toLocaleLowerCase());
            break;
          }
        }
      }
    }
  }

  showMessageIfChipsDisabled(): void {
    if (!this.queryControl.value || this.queryControl?.value?.length < this.requiredQueryMinLength) {
      this.snackbar.openFromComponent(SnackbarComponent, {
        data: { message: `Minimum 3 characters are required to initiate the search`, type: "error" },
        duration: 3000,
        panelClass: "course-error-snackbar"
      });
    }
  }

  async searchFromQuery(query: string) {
    let courseSearchResult: any;
    const searchRequest = new SearchV4Request([]);
    searchRequest.request.query = query;
    switch (this.selectedSearchCategory) {
      case SearchCategory.Courses:
        searchRequest.request.filters.courseCategory = "course";
        break;
      case SearchCategory.All:
        searchRequest.request.filters.courseCategory = [];
        searchRequest.request.filters.contentType = ["Course", "Event"];
        break;

      case SearchCategory.Programs:
        searchRequest.request.filters.courseCategory = "blended program";
        break;

      case SearchCategory.Events:
        searchRequest.request.filters.contentType = "Event";
        searchRequest.request.fields = SearchEventFields;
        searchRequest.request.facets = SearchEventfacet;

        delete searchRequest.request.filters?.courseCategory;
        delete searchRequest.request.sort_by?.createdOn;
        break;

      case SearchCategory.CaseStudy:
        searchRequest.request.filters.courseCategory = "case study";
        break;

      case SearchCategory.Resources:
        searchRequest.request.filters.contentType = "Resource";
        searchRequest.request.facets = SearchResourceFacets;
        searchRequest.request.filters["mimeType"] = SearchResourceMimeType;
        (searchRequest.request.exists = [FacetType.sectorNames_v1, FacetType.resourceCategory]),
          (searchRequest.request.fields = []),
          delete searchRequest.request.filters?.courseCategory;
        delete searchRequest.request.sort_by?.createdOn;
        break;
    }

    courseSearchResult = await this.searchListingService.searchCoursesv4(searchRequest).catch();

    if (this.selectedSearchCategory === SearchCategory.People) {
      const searchRequest = new SearchPeoplesRequest();
      searchRequest.query = query;
      const result = await this.searchListingService.searchConnections(searchRequest).catch(() => (this.allSearchResults = []));

      if (result.result && result.result?.response?.content.length) {
        this.allSearchResults = result.result?.response?.content || [];
      } else {
        this.allSearchResults = [];
      }

      return;
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      const searchRequestCommunities = new SearchCommunitiesRequest([]);
      searchRequestCommunities.searchString = query;
      const result = await this.searchListingService.searchCommunity(searchRequestCommunities).catch(() => (this.allSearchResults = []));
      if (result.result && Object.keys(result.result).length > 0 && result.result?.search_results?.data && result.result?.search_results?.data.length) {
        this.allSearchResults = result.result?.search_results?.data;
      } else {
        this.allSearchResults = [];
      }

      return;
    } else if (this.selectedSearchCategory === SearchCategory.ExternalContents) {
      const searchRequestExternal = new SearchExternalRequest([]);
      searchRequestExternal.searchString = query || "";
      const result = await this.searchListingService.searchExternalContent(searchRequestExternal).catch(() => (this.allSearchResults = []));
      if (result?.data && result?.data.length) {
        this.allSearchResults = result?.data;
      } else {
        this.allSearchResults = [];
      }

      return;
    }

    const validKeys = Object.keys(courseSearchResult?.result || {}).filter(
      key => (key === "Event" || key === "content") && Array.isArray(courseSearchResult.result[key]) && courseSearchResult.result[key].length > 0
    );

    this.allSearchResults = validKeys.length ? courseSearchResult.result[validKeys[0]] : [];
  }

  getResultName(result: any): string {
    if (!result) {
      return "";
    }

    if (this.selectedSearchCategory === SearchCategory.People) {
      return result.personalDetails?.firstname ?? result.firstName ?? "";
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      return result.communityName ?? "";
    } else {
      return result.name ?? "";
    }
  }

  redirectToContent(result: any) {
    this.openSearchTemplate = false;
    if (this.selectedSearchCategory === SearchCategory.People) {
      this.goToUserProfile(result);
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      // TODO: Route community
    } else {
      this.getRedirectUrlData(result);
    }
  }

  goToUserProfile(user: any) {
    this.router.navigate(["/app/person-profile", user.userId || user.id || user.wid], { fragment: "profileInfo" });
  }

  async getRedirectUrlData(content: any) {
    if (content && content.objectType === "Event" && content.identifier) {
      this.router.navigate([`app/event-hub/home/${content.identifier}`]);
    } else {
      const urlData = await this.contSvc.getResourseLink(content);
      this.router.navigate([urlData.url], {
        queryParams: urlData.queryParams
      });
    }
  }

  async searchInNLP(query: string) {
    const searchRequest = new SearchNLP();
    searchRequest.query = query;
    await this.searchListingService
      .nlpSearch(searchRequest)
      .then(async response => {
        if (response?.data && response?.data?.keywords) {
          if (response?.data?.keywords.length > 0) {
            this.responseNlpQuery = response?.data?.keywords[0]?.keyword;
            this.createRecent(this.responseNlpQuery);
          }
        } else {
          this.responseNlpQuery = "";
        }
      })
      .catch();
  }

  openSearchTemplateF(): void {
    this.openSearchTemplate = true;
    if (!this.hasReadRecentBeenCalled) {
      this.readRecent();
      this.hasReadRecentBeenCalled = true;
    }

    if (this.openSearchTemplate) {
      // this.readRecent();
    }
    if (!this.selectedSearchCategory) {
      // this.searchFromQuery(this.responseNlpQuery);
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.rolesSubscription) {
      this.rolesSubscription.unsubscribe();
    }
  }
}
