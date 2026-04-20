import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges, Inject } from "@angular/core";
import { Subscription } from "rxjs";
// tslint:disable-next-line
import * as _ from "lodash";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationsService, MultilingualTranslationsService } from "@sunbird-cb/utils-v2";
import { CBPstatusMapping, Facet, FacetType, FormattedFacets, ICompentencyKeys, SearchCategory, SearchListingConfig } from "../../_models/search-listing.model";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { ActivatedRoute } from "@angular/router";
import { MatRadioChange } from "@angular/material/radio";
// import { CATEGORY_TYPE } from "../../_constants/search-listing.constant";
import { SearchListingService } from "../../_services/search-listing.service";
import { DateRange, DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel } from "@angular/material/datepicker";

@Component({
  selector: "ws-app-search-filters",
  templateUrl: "./search-filters.component.html",
  styleUrls: ["./search-filters.component.scss"]
})
export class SearchFiltersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() newfacets!: any;
  @Input() urlparamFilters!: any;
  @Input() karmayogiBadge: any;
  @Input() typesOfEvents: any;
  @Input() applicationName!: string;
  @Output() appliedFilter = new EventEmitter<{ [key: string]: any }>();
  @Output() constructQueryParam = new EventEmitter<string>();
  @Output() applyFilterFromLearn = new EventEmitter<{ [key: string]: any }>();
  competencyFactet: any;

  private subscription: Subscription = new Subscription();
  queryParams: any;

  categoryType: SearchListingConfig.SearchCategoryType[] = [];
  categoryTypeDup: SearchListingConfig.SearchCategoryType[] = [];
  categoryTypeEnum = SearchCategory;
  showAllLanguage = false;
  showAllContents = false;

  formattedFacets: any = {};
  selectedFilters: any = {};
  compentencyKey!: ICompentencyKeys;
  competencyAreaNameKey!: string;
  competencyThemeKey!: string;
  competencySubThemeKey!: string;
  showAllCompetencyTheme: boolean = false;
  showAllOrganisation: boolean = false;
  showAllCompetencySubTheme: boolean = false;
  showAllDesignation: boolean = false;
  showAllSectors: boolean = false;
  showResourceCategory: boolean = false;
  showAllSubSectors: boolean = false;
  showAllContentPartners: boolean = false;
  showAllTopic: boolean = false;
  showAllRoles = false;

  selectedFilterChips: any;
  filterQueryOrganisation = "";
  filterQueryContents = "";
  filterQueryLanguage = "";
  filterQueryDesignation = "";
  filterQueryRootOrgName = "";
  filterQueryThemes = "";
  filterQuerySectorNames = "";
  filterQueryResourceCategory = "";
  filterQuerySubSectorNames = "";
  filterQuerySubSectors: string = "";
  filterQuerySubThemes = "";
  filterCompetency = "";
  filterQueryContentPartners = "";
  filterQueryTopic = "";
  filterQueryRoles = "";

  searchCategory = "";
  searchQuery = "";
  isExploreContentTab = false;
  isAllContentSelected = true;
  environment!: any;
  searchConfig: SearchListingConfig.Config | null = null;
  selectedDateRange!: DateRange<Date> | null;
  showEventsDateRange = false;
  showCoursesCreatedDateRange = false;
  displayLabels: Record<string, any> = {};
  selectedDateRangeTimeline!: DateRange<Date> | null;
  maxDateCalendar = new Date();
  constructor(
    @Inject("environment") environment: any,
    private activated: ActivatedRoute,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService, // private router: Router
    private configSvc: ConfigurationsService,
    private searchService: SearchListingService,
    private selectionModel: MatRangeDateSelectionModel<Date>,
    private selectionStrategy: DefaultMatCalendarRangeStrategy<Date>
  ) {
    this.environment = environment;
    if (localStorage.getItem("websiteLanguage")) {
      this.translate.setDefaultLang("en");
      const lang = localStorage.getItem("websiteLanguage")!;
      this.translate.use(lang);
    }
  }

  async ngOnInit() {
    this.compentencyKey = _.get(this.configSvc, `compentency.${this.environment.compentencyVersionKey}`);
    if (this.compentencyKey) {
      this.competencyAreaNameKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyArea}`;
      this.competencyThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyTheme}`;
      this.competencySubThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencySubTheme}`;
    }
    this.subscription.add(
      this.activated.queryParams.subscribe(params => {
        this.isExploreContentTab = params["tab"] === "explore-content";
        if (this.isExploreContentTab) {
          this.selectedFilters = {};
          this.selectedFilterChips = [];
        }
      })
    );

    this.searchConfig = await this.searchService.getSearchConfig();

    if (this.searchConfig) {
      //Only allow communities for mdo_leader and mdo moderator in MDO
      if (this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal) {
        const userRoles = this.configSvc?.userRoles as Set<string>;
        if (this.searchConfig.searchCategories) {
          const hasMdoAdmin = userRoles.has("mdo_admin");
          const hasMdoLeader = userRoles.has("mdo_leader");
          const hasCommunityModerator = userRoles.has("community_moderator");
          if ((hasMdoAdmin && hasCommunityModerator) || (hasMdoLeader && hasCommunityModerator) || hasMdoLeader) {
          } else if (hasMdoAdmin) {
            this.searchConfig.searchCategories = this.searchConfig?.searchCategories.filter(category => category?.value !== SearchCategory.Communities);
          } else if (hasCommunityModerator) {            this.searchConfig.searchCategories = this.searchConfig?.searchCategories.filter(category => category?.value === SearchCategory.Communities);
          } else {
            this.searchConfig.searchCategories = this.searchConfig?.searchCategories.filter(category => category?.value !== SearchCategory.Communities);
          }
        }
      }

      const categories = this.searchConfig.searchCategories || [];

      const categorieTypes = this.searchConfig.allSearchCategoriesTypes || [];

      // normalize user roles which can be a Set<string> or string[]
      const userRoles = (this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.CBPPortal ? (this.configSvc as any)?.userAllRoles : (this.configSvc as any)?.userRoles) as Set<string> | string[] | undefined;
      const userRolesArray: string[] = userRoles instanceof Set ? Array.from(userRoles) : Array.isArray(userRoles) ? (userRoles as string[]) : [];
      this.categoryType = categorieTypes.filter(cat => {
        // find the matching category config for this type
        const matchedCategory = categories.find(category => category.value === cat.name);
        if (!matchedCategory) return false;

        // If matched category has no roles defined or an empty array, keep the category
        const roles = (matchedCategory as any)?.roles as string[] | undefined;
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
          this.addLabels(cat);
          return true;
        }

        const isAllowed = roles.some((r: string) => userRolesArray.includes(r.toLocaleLowerCase()));
        if (isAllowed) {
          this.addLabels(cat);
        }
        return isAllowed;
      });
      this.categoryTypeDup = this.categoryType;
    }
  }

  addLabels(cat: any) {
    const typeLabels = (cat as any)?.labels;
    if (typeLabels) {
      this.displayLabels[cat.name] = typeLabels;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["newfacets"] && changes["newfacets"].currentValue) {
      this.formattedFacets = this.formatFacets(changes["newfacets"].currentValue);

      if (this.formattedFacets?.sectorId?.length) {
        const coursesCategory = _.find(this.categoryTypeDup, {
          name: "courses"
        });

        if (!coursesCategory) return;
      }

      // Handle nested filters for other categories
      if (this.formattedFacets?.nestedCategory?.length) {
        const nestedCategory = _.find(this.categoryTypeDup, {
          name: "nestedCategory"
        });

        if (nestedCategory) {
          nestedCategory.filters = this.formattedFacets.nestedCategory.map((filter: any) => ({
            name: filter.name,
            count: filter.count,
            isChecked: filter.isChecked,
            displayName: this.formatSectorName(filter.name)
          }));
        }
      }

      this.setCategoryType();
    }

    if (changes["typesOfEvents"] && changes["typesOfEvents"].currentValue) {
      this.formattedFacets["typeOfEvents"] = this.typesOfEvents;
    }
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
    if(this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      const filters = this.getFiltersList
      this.showEventsDateRange = filters.some((filter: any) => filter.sectionKey === 'eventDateRange') && this.isFilterFacetsAvailable ? true : false;
      this.showCoursesCreatedDateRange = filters.some((filter: any) => filter.sectionKey === 'createdDateRange') && this.isFilterFacetsAvailable ? true : false;
    }

  }

  formatSectorName(name: string): string {
    if (name.startsWith("sector-fw_sector_")) {
      name = name.replace("sector-fw_sector_", "");
    }
    return name
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  setCategoryType() {
    const params = this.activated.snapshot.queryParams;
    if (
      (this.searchCategory && params["category"] && this.searchCategory !== params["category"]) ||
      !params["category"] ||
      (params["q"] && params["q"] !== this.searchQuery)
    ) {
      this.selectedFilters = {};
      this.selectedDateRange = null;
      if (this.selectedFilters["dateRange"]) {
        this.selectedFilters["dateRange"] = [];
      }
      if (this.selectedFilters["timeline"]) {
        this.selectedFilters["timeline"] = [];
      }
    }

    if (params["q"]) {
      this.searchQuery = params["q"];
    }

    this.isExploreContentTab = !!params["tab"];

    this.searchCategory = params["category"];

    if (this.searchCategory) {
      this.categoryType = this.categoryTypeDup.filter(type => type.name === this.searchCategory);
      if (this.searchCategory === "case-study" && !this.categoryType.length) {
        this.categoryType = [
          {
            name: "case-study",
            count: 0,
            isChecked: false,
            displayName: "Case study",
            filters: [],
            disabled: false
          }
        ];
      }
      if (this.categoryType.length && !this.isExploreContentTab) {
        this.categoryType[0].isChecked = true;
        this.selectedFilters[this.categoryType[0].name] = [this.formatCategoryName(this.categoryType[0].name)];
        this.selectedFilterChips = [
          {
            value: this.categoryType[0].displayName,
            type: this.categoryType[0].name
          }
        ];
      }

      if (this.searchCategory === SearchCategory.Events) {
        this.formattedFacets["typeOfEvents"] = this.typesOfEvents;
      }
    } else {
      this.categoryType = this.categoryTypeDup.map(cat => ({
        ...cat,
        isChecked: cat.name === SearchCategory.All ? true : false
      }));
    }
    // }
  }

  setCourseCategoryType(contentType: string) {
    this.categoryTypeDup.map((item, parentIndex) => {
      if (item.name === contentType) {
        item.isChecked = true;
      } else if (item.filters) {
        this.checkForFilter(item, item.filters, contentType, parentIndex, parentIndex);
      }
    });
  }

  checkForFilter(parentData: any, filtersData: any, contentType: string, parentIndex: any, childIndex: any) {
    // this.selectedFilters['Course'] = []
    if (filtersData && filtersData.length) {
      filtersData.map((item: any, index: any) => {
        if (item.filters && item.filters.length) {
          this.checkForFilter(parentData, item.filters, contentType, parentIndex, index);
        } else {
          if (contentType.indexOf(item.name) > -1) {
            item.isChecked = true;
            parentData.filters[childIndex].isChecked = true;
            this.categoryTypeDup[parentIndex].isChecked = true;
            this.categoryType[0].isChecked = false;
            if (Object.keys(this.selectedFilters).length === 0) {
              this.selectedFilters["Course"] = [];
              this.selectedFilters["Course"] = contentType;
            } else {
              this.selectedFilters["Course"].concat(contentType);
            }
          } else {
            item.isChecked = false;
          }
        }
      });
      // this.appliedFilter.emit(this.selectedFilters);
      // this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
      // console.log('this.selectedFilters',this.selectedFilters, this.categoryTypeDup[parentIndex].name)
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleShowMore(togglesection: string) {
    switch (togglesection) {
      case this.competencyThemeKey:
        this.showAllCompetencyTheme = !this.showAllCompetencyTheme;
        break;

      case this.competencySubThemeKey:
        this.showAllCompetencySubTheme = !this.showAllCompetencySubTheme;
        break;

      case FacetType.Language:
        this.showAllLanguage = !this.showAllLanguage;
        break;

      case FacetType.Organization:
      case FacetType.SourceName:
        this.showAllOrganisation = !this.showAllOrganisation;
        break;

      case FacetType.Designation:
        this.showAllDesignation = !this.showAllDesignation;
        break;

      case FacetType.courseCategory:
        this.showAllContents = !this.showAllContents;
        break;

      case FacetType.sectorNames_v1:
      case FacetType.sectorId:
      case FacetType.sectorNameResource:
        this.showAllSectors = !this.showAllSectors;
        break;

      case FacetType.subSectorNames_v1:
      case FacetType.subSectorId:
      case FacetType.subSectorNameResource:
        this.showAllSubSectors = !this.showAllSubSectors;
        break;

      case FacetType.resourceCategory:
        this.showResourceCategory = !this.showResourceCategory;
        break;

      case FacetType.contentPartners:
        this.showAllContentPartners = !this.showAllContentPartners;
        break;

      case FacetType.topic:
      case FacetType.topicName:
        this.showAllTopic = !this.showAllTopic;
        break;
      case FacetType.organizationsRoles:
        this.showAllRoles = !this.showAllRoles;
        break;
    }
  }

  translateActualLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, "");
  }

  formatFacets(data: Facet[][]): FormattedFacets {
    const formattedFacets: FormattedFacets | any = {};

    if (!data.length) return formattedFacets;

    const mergedData: { [key: string]: { [key: string]: number } } = data.reduce((acc, group) => {
      group.forEach(({ name, values }) => {
        if (!acc[name]) {
          acc[name] = {};
        }
        values.forEach(({ name: valueName, count }) => {
          acc[name][valueName] = (acc[name][valueName] || 0) + count;
        });
      });
      return acc;
    }, {} as { [key: string]: { [key: string]: number } });

    // Sort the facet keys
    Object.entries(mergedData)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .forEach(([key, values]) => {
        if (key === FacetType.Duration) {
          const formattedDurations = [
            { range: [0, 1800], label: "0 - 30 mins" },
            { range: [1801, 3600], label: "30 - 60 mins" },
            { range: [3601, 5400], label: "60 - 90 mins" },
            { range: [5401, Infinity], label: "90 mins" }
          ]
            .map(({ range, label }) => {
              const count = Object.entries(values)
                .filter(([key]) => {
                  const duration = parseInt(key, 10);
                  return duration >= range[0] && duration <= range[1];
                })
                .reduce((sum, [, count]) => sum + count, 0);
              return count > 0 ? { name: label, count, isChecked: false } : null;
            })
            .filter(Boolean);

          formattedFacets[key] = formattedDurations;
        } else if (key === FacetType.AvgRating) {
          const ratingRanges = [4.5, 4.0, 3.5, 3.0];
          const formattedRatings = ratingRanges
            .map(rating => {
              const count = Object.entries(values)
                .filter(([rate]) => parseFloat(rate) >= rating)
                .reduce((sum, [, count]) => sum + count, 0);
              return count > 0 ? { name: `${rating.toFixed(1)}`, count, isChecked: false } : null;
            })
            .filter(Boolean);

          formattedFacets[key] = formattedRatings;
        } else {
          const selectedFilterValue = this.selectedFilters?.[key] || [];
          formattedFacets[key] = Object.entries(values)
            .map(([name, count]) => ({
              name,
              count,
              isChecked: selectedFilterValue.includes(name)
            }))
            .sort((a, b) => {
              // First sort by checked status (checked items first)
              if (a.isChecked !== b.isChecked) {
                return a.isChecked ? -1 : 1;
              }
              // Then sort alphabetically
              return a.name.localeCompare(b.name);
            });
        }
      });

    return formattedFacets;
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatRolesNames(str: string): string {
    const acronyms = ["MDO", "CBP", "SPV", "FRAC", "IFU", "WAT"];

    return str
      .split("_")
      .map(part => {
        const upperPart = part.toUpperCase();
        if (acronyms.includes(upperPart)) {
          return upperPart;
        }
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(" ");
  }

  onSelectionFilter(event: MatCheckboxChange, option: any, categoryType: string, setRole =false) {
    if (setRole && this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      const selectedCategory: any = _.get(this.searchConfig, 'searchCategories', []).find((category: any) => category.value === option.name);
      if (selectedCategory) {
        this.searchService.triggerSetRolesForCategory(selectedCategory.value, selectedCategory.roles);
      }
    }
    const type = option?.name;
    option.isChecked = event.checked;
    if (!this.selectedFilters[categoryType]) {
      this.selectedFilters[categoryType] = [];
    }
    if (event.checked) {
      if (!this.selectedFilters[categoryType].includes(type)) {
        this.selectedFilters[categoryType].push(type);
        // Sort the selected filters after adding new one
        this.selectedFilters[categoryType].sort((a: string, b: string) => a.localeCompare(b));
      }
    } else {
      this.selectedFilters[categoryType] = this.selectedFilters[categoryType].filter((item: any) => item !== type);
    }

    Object.keys(this.selectedFilters).forEach(key => {
      if (Array.isArray(this.selectedFilters[key]) && this.selectedFilters[key].length === 0) {
        delete this.selectedFilters[key];
      }
    });

    if (this.formattedFacets[categoryType]) {
      this.formattedFacets[categoryType] = this.formattedFacets[categoryType]
        .map((facet: { name: string; count: number; isChecked: boolean }) => ({
          ...facet,
          isChecked: this.selectedFilters[categoryType]?.includes(facet.name) || false
        }))
        .sort((a: { name: string; isChecked: boolean }, b: { name: string; isChecked: boolean }) => {
          // First sort by checked status (checked items first)
          if (a.isChecked !== b.isChecked) {
            return a.isChecked ? -1 : 1;
          }
          // Then sort alphabetically
          return a.name.localeCompare(b.name);
        });
    }

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);

    const types = this.categoryTypeDup.map(category => category.name);
    if (types.includes(type) && !option.isChecked) {
      this.constructQueryParam.emit("");
    }

    if (categoryType === "contentType" && this.isAllContentSelected) {
      this.isAllContentSelected = false;
    }
  }

  onRadioTypeChange(_event: MatRadioChange, option: any, radioType: string) {
    const type = option?.name;
    this.selectedFilters[radioType] = [type];

    const eventOptions = this.formattedFacets[radioType];
    if (eventOptions) {
      eventOptions.forEach((opt: any) => {
        opt.isChecked = opt.name === type;
      });
    }

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
  }

  togoleThemes(competency: any) {
    competency["showAll"] = !competency["showAll"];
  }

  get filtersAppliedCount(): number {
    return Object.entries(this.selectedFilters).filter(([_, arr]) => Array.isArray(arr) && arr.length > 0).length;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  refactorFilterData(data: Record<string, string[]>): { type: string; value: string }[] {
    if (typeof data !== "object" || data === null) {
      return [];
    }

    const returnedData: { type: string; value: string }[] = [];

    Object.entries(data).forEach(([key, values]) => {
      if (key === "dateRange" || key === "timeline") {
        const mergedDates = values.map(this.formatDate).join(" - ");
        if (mergedDates) {
          returnedData.push({ type: key, value: mergedDates });
        }
      } else {
        values.forEach(value => {
          returnedData.push({
            type: key,
            value: value === "Courses" ? "Contents" : this.formatValue(value)
          });
        });
      }
    });

    this.categoriseByFacet(returnedData);
    return returnedData;
  }

  categoriseByFacet(facetData: any) {
    const groupedData = _.groupBy(facetData, "type");
    const visibilityMap: { key: string; enableKey: any }[] = [
      // Sector related
      { key: FacetType.sectorNames_v1, enableKey: "showAllSectors" },
      { key: FacetType.sectorId, enableKey: "showAllSectors" },
      { key: FacetType.sectorNameResource, enableKey: "showAllSectors" },
      { key: "sectorName", enableKey: "showAllSectors" },
      
      // Sub-sector related
      { key: FacetType.subSectorNames_v1, enableKey: "showAllSubSectors" },
      { key: FacetType.subSectorId, enableKey: "showAllSubSectors" },
      { key: FacetType.subSectorNameResource, enableKey: "showAllSubSectors" },
      { key: "subSectorName", enableKey: "showAllSubSectors" },
      
      // Language
      { key: FacetType.Language, enableKey: "showAllLanguage" },
      
      // Organization related
      { key: FacetType.Organization, enableKey: "showAllOrganisation" },
      { key: FacetType.SourceName, enableKey: "showAllOrganisation" },
      { key: "rootOrgName", enableKey: "showAllOrganisation" },
      
      // Competency related
      { key: this.competencyThemeKey, enableKey: "showAllCompetencyTheme" },
      { key: this.competencySubThemeKey, enableKey: "showAllCompetencySubTheme" },
      
      // Content related
      { key: FacetType.courseCategory, enableKey: "showAllContents" },
      { key: FacetType.contentPartners, enableKey: "showAllContentPartners" },
      { key: "contentPartner.contentPartnerName", enableKey: "showAllContentPartners" },
      
      // Resource related
      { key: FacetType.resourceCategory, enableKey: "showResourceCategory" },
      
      // Topics
      { key: FacetType.topic, enableKey: "showAllTopic" },
      { key: FacetType.topicName, enableKey: "showAllTopic" },
      
      // Designation
      { key: FacetType.Designation, enableKey: "showAllDesignation" },
      { key: "profileDetails.professionalDetails.designation", enableKey: "showAllDesignation" },
      
      { key: FacetType.organizationsRoles, enableKey: "showAllRoles" },
    ];

    visibilityMap.forEach(({ key, enableKey }) => {
      (this as any)[enableKey] = groupedData[key]?.length > 0 || false;
    });
  }

  private formatValue(value: string): string {
    if (value.startsWith("sector-fw_sector_")) {
      return this.formatSectorName(value);
    }
    return this.capitalizeFirstLetter(value);
  }

  private reverseFormatSectorName(formattedName: string): string {
    const originalName = formattedName.toLowerCase().split(" ").join("-");
    return `sector-fw_sector_${originalName}`;
  }

  clearFilterChip(item: { type: string; value: string }) {
    let facets;
    if (item.type === "dateRange" || item.type === "timeline") {
      this.clearDateRange();
      return;
    }
    if (item.type === "sectorId" || item.type === "subSectorId") {
      item.value = this.reverseFormatSectorName(item.value);
    }

    if (item.type === "sectorDetails_v1.subSectorName") {
      item.value = item.value.toLowerCase();
    }
    const types = this.categoryTypeDup.map((category: any) => category.name);
    if (this.searchCategory === "case-study") {
      types.push("case-study");
    }
    if (types.includes(item.type)) {
      facets = this.categoryType;

      const category = _.find(facets, { name: item.type });

      if (category) {
        this.clearAllFilters();
        return;
      }

      const foundFilter = _.find(category!.filters, { name: item.value });
      if (foundFilter) {
        foundFilter.isChecked = false;

        if (_.has(this.selectedFilters, item.type)) {
          _.pull(this.selectedFilters[item.type], foundFilter.name);
          if (_.isEmpty(this.selectedFilters[item.type])) {
            // delete this.selectedFilters[item.type];
          }
        }

        this.appliedFilter.emit(this.selectedFilters);
        this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
      }
    } else {
      facets = this.formattedFacets;

      const allFilters = _.flatMap(facets);
      let foundFilter: any;
      foundFilter = _.find(allFilters, {
        name: item.value.toLowerCase()
      });

      if (!foundFilter) {
        foundFilter = _.find(allFilters, {
          name: item.value
        });
      }

      if (foundFilter) {
        foundFilter.isChecked = false;
        if (_.has(this.selectedFilters, item.type)) {
          _.pull(this.selectedFilters[item.type], foundFilter.name);
          if (_.isEmpty(this.selectedFilters[item.type])) {
            // delete this.selectedFilters[item.type];
          }
        }

        this.appliedFilter.emit(this.selectedFilters);
        this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
      } else {
        const foundCategory = _.find(this.categoryTypeDup, {
          name: SearchCategory.Courses
        });
        if (foundCategory) {
          const found = this.recursivelySetIsCheckedFalse(foundCategory.filters, item.value.toLowerCase());
          if (found) {
            found.isChecked = false;
            if (_.has(this.selectedFilters, item.type)) {
              if (item.value.toLowerCase().startsWith("sector-fw_sector_")) {
                _.pull(this.selectedFilters[item.type], item.value.toLowerCase());
              } else {
                _.pull(this.selectedFilters[item.type], item.value);
              }
              if (_.isEmpty(this.selectedFilters[item.type])) {
                delete this.selectedFilters[item.type];
              }
            }
            this.appliedFilter.emit(this.selectedFilters);
            this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
          }
        }
        // In case if no conditions are matched
        else {
          if (Array.isArray(this.selectedFilters[item.type])) {
            const updatedArr = this.selectedFilters[item.type].filter((val: any) => val.toLowerCase() !== item.value?.toLowerCase());
            if (updatedArr.length) {
              this.selectedFilters = { ...this.selectedFilters, [item.type]: updatedArr };
            } else {
              // Remove the property if array is empty
              const { [item.type]: _, ...rest } = this.selectedFilters;
              this.selectedFilters = rest;
            }

            this.appliedFilter.emit(this.selectedFilters);
            this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
          }
        }
      }
    }
  }

  clearAllFilters() {
    Object.keys(this.selectedFilters).forEach(key => {
      this.selectedFilters[key] = [];
    });

    if (!this.isExploreContentTab) {
      _.forEach(this.categoryType, (category: any) => {
        category.isChecked = false;
        _.forEach(category.filters, (filter: any) => {
          filter.isChecked = false;
        });
      });
    } else {
      this.isAllContentSelected = true;
    }

    _.forEach(this.formattedFacets, (filters: any) => {
      _.forEach(filters, (filter: any) => {
        filter.isChecked = false;
      });
    });

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = [];

    if (!this.isExploreContentTab) {
      this.constructQueryParam.emit("");
    }
  }

  // Generic function to filter and slice results
  private getFilteredAndSlicedResults(items: any[], searchQuery: string, showAll: boolean) {
    if (!items) return [];

    const filteredList = items.filter((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!showAll) {
      return filteredList.slice(0, 4);
    }

    return filteredList;
  }

  get filteredOrganisations() {
    const data = this.searchCategory === SearchCategory.Events ? this.formattedFacets[FacetType.SourceName] : this.formattedFacets[FacetType.Organization];

    return this.getFilteredAndSlicedResults(data, this.filterQueryOrganisation, this.showAllOrganisation);
  }

  get filteredContents() {
    return this.getFilteredAndSlicedResults(this.formattedFacets[FacetType.courseCategory], this.filterQueryContents, this.showAllContents);
  }

  get filteredLanguages() {
    return this.getFilteredAndSlicedResults(this.formattedFacets[FacetType.Language], this.filterQueryLanguage, this.showAllLanguage);
  }

  get filteredSectorNames() {
    const data = this.formattedFacets[FacetType.sectorNames_v1] || this.formattedFacets[FacetType.sectorNameResource];

    return this.getFilteredAndSlicedResults(data, this.filterQuerySectorNames, this.showAllSectors);
  }

  get filteredSubSectorNames() {
    const data = this.formattedFacets[FacetType.subSectorNames_v1] || this.formattedFacets[FacetType.subSectorNameResource];

    return this.getFilteredAndSlicedResults(data, this.filterQuerySubSectorNames, this.showAllSubSectors);
  }

  get filteredSectorId() {
    return this.getFilteredAndSlicedResults(this.formattedFacets[FacetType.sectorId], this.filterQuerySectorNames, this.showAllSectors);
  }

  get filteredSubSectorId() {
    return this.getFilteredAndSlicedResults(this.formattedFacets[FacetType.subSectorId], this.filterQuerySubSectorNames, this.showAllSubSectors);
  }

  get filteredDesignations() {
    return this.getFilteredAndSlicedResults(
      this.formattedFacets["profileDetails.professionalDetails.designation"],
      this.filterQueryDesignation,
      this.showAllDesignation
    );
  }

  get filteredRootOrgNames() {
    return this.getFilteredAndSlicedResults(this.formattedFacets["rootOrgName"], this.filterQueryRootOrgName, this.showAllOrganisation);
  }

  get filteredCompetencyTheme() {
    return this.getFilteredAndSlicedResults(this.formattedFacets[this.competencyThemeKey], this.filterQueryThemes, this.showAllCompetencyTheme);
  }

  get filteredSubCompetencyTheme() {
    const allThemes = this.formattedFacets[this.competencySubThemeKey] || [];

    let filteredList = this.filterQuerySubThemes
      ? allThemes.filter((item: any) => item?.name.toLowerCase().includes(this.filterQuerySubThemes.toLowerCase()))
      : allThemes;

    if (!this.showAllCompetencySubTheme) {
      return filteredList.slice(0, 4);
    }

    return filteredList;
  }

  // function to check if we should show More/Less button for a given filter
  private shouldShowMoreLessForFilter(items: any[], searchQuery: string): boolean {
    if (!items) return false;

    // If there's a search query, check filtered results
    if (searchQuery) {
      const filteredCount = items.filter((item: any) => item?.name.toLowerCase().includes(searchQuery.toLowerCase())).length;
      return filteredCount > 4;
    }

    // If no search query, check total items
    return items.length > 4;
  }

  get shouldShowMoreLessButton() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets[this.competencySubThemeKey], this.filterQuerySubThemes);
  }

  get shouldShowMoreLessOrganizations() {
    let data = this.searchCategory === SearchCategory.Events ? this.formattedFacets[FacetType.SourceName] : this.formattedFacets[FacetType.Organization];
    return this.shouldShowMoreLessForFilter(data, this.filterQueryOrganisation);
  }

  get shouldShowMoreLessContents() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets[FacetType.courseCategory], this.filterQueryContents);
  }

  get shouldShowMoreLessLanguages() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets[FacetType.Language], this.filterQueryLanguage);
  }

  get shouldShowMoreLessSectors() {
    let data = this.formattedFacets[FacetType.sectorNames_v1] || this.formattedFacets[FacetType.sectorNameResource] || this.formattedFacets[FacetType.sectorId];
    return this.shouldShowMoreLessForFilter(data, this.filterQuerySectorNames);
  }

  get shouldShowMoreLessSubSectors() {
    let data =
      this.formattedFacets[FacetType.subSectorNames_v1] || this.formattedFacets[FacetType.subSectorNameResource] || this.formattedFacets[FacetType.subSectorId];
    return this.shouldShowMoreLessForFilter(data, this.filterQuerySubSectorNames);
  }

  get shouldShowMoreLessDesignations() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets["profileDetails.professionalDetails.designation"], this.filterQueryDesignation);
  }

  get shouldShowMoreLessRootOrgs() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets["rootOrgName"], this.filterQueryRootOrgName);
  }

  get shouldShowMoreLessCompetencyThemes() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets[this.competencyThemeKey], this.filterQueryThemes);
  }

  get shouldShowMoreLessResourceCategory() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets[FacetType.resourceCategory], this.filterQueryResourceCategory);
  }

  get shouldShowMoreLessContentPartners() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets[FacetType.contentPartners], this.filterQueryContentPartners);
  }

  get shouldShowMoreLessRoles() {
    return this.shouldShowMoreLessForFilter(this.formattedFacets["roles.role"], this.filterQueryRoles);
  }

  get shouldShowMoreLessTopic() {
    let data = this.formattedFacets[FacetType.topic] || this.formattedFacets[FacetType.topicName];
    return this.shouldShowMoreLessForFilter(data, this.filterQueryTopic);
  }

  get filteredResourceCategory() {
    return this.getFilteredAndSlicedResults(this.formattedFacets[FacetType.resourceCategory], this.filterQueryResourceCategory, this.showResourceCategory);
  }

  get filteredContentPartners() {
    return this.getFilteredAndSlicedResults(this.formattedFacets[FacetType.contentPartners], this.filterQueryContentPartners, this.showAllContentPartners);
  }

  get filteredRoles() {
    return this.getFilteredAndSlicedResults(this.formattedFacets["roles.role"], this.filterQueryRoles, this.showAllRoles);
  }

  get filteredTopic() {
    const filterData = this.formattedFacets[FacetType.topic] || this.formattedFacets[FacetType.topicName];

    return this.getFilteredAndSlicedResults(filterData, this.filterQueryTopic, this.showAllTopic);
  }

  private recursivelySetIsCheckedFalse(filters: any[], name: string): any {
    for (const filter of filters) {
      if ((filter?.name).toLowerCase() === name.toLowerCase()) {
        filter.isChecked = false;
        return filter;
      }
      if (filter.filters?.length) {
        const found = this.recursivelySetIsCheckedFalse(filter.filters, name.toLowerCase());
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private formatCategoryName(name: string): string {
    return name
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  allContentSelection() {
    this.isAllContentSelected = true;
    this.selectedFilters["contentType"] = [];

    this.filteredContents.map((item: any) => {
      item.isChecked = false;
    });

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
  }

  getSelectedFilter(item: any, categoryType?: string) {
    if (Object.keys(this.selectedFilters || {}).length) {
      return this.filterValueExists(this.selectedFilters, this.formatEventStatusName(item?.name, categoryType), categoryType);
    }
    return false;
  }

  filterValueExists(obj: any, target: any, categoryType?: string): any {
    if (Array.isArray(obj)) {
      return obj.some(item => this.filterValueExists(item, target));
    } else if (obj !== null && typeof obj === "object") {
      if (categoryType) {
        if (obj.hasOwnProperty(categoryType)) {
          return this.filterValueExists(obj[categoryType], target);
        }
        return false;
      } else {
        return Object.values(obj).some(value => this.filterValueExists(value, target));
      }
    } else {
      return obj === target;
    }
  }

  rangeChanged(selectedDate: Date) {
    const selection = this.selectionModel.selection,
      newSelection = this.selectionStrategy.selectionFinished(selectedDate, selection);

    this.selectionModel.updateSelection(newSelection, this);
    this.selectedDateRange = new DateRange<Date>(newSelection.start, newSelection.end);

    if (this.selectedDateRange?.start && this.selectedDateRange?.end) {
      const formattedStartDate = this.formatDateForFilter(this.selectedDateRange.start, this.searchCategory);
      const formattedEndDate = this.formatDateForFilter(this.selectedDateRange.end, this.searchCategory, true);

      this.selectedFilters["dateRange"] = [formattedStartDate, formattedEndDate];
      this.appliedFilter.emit(this.selectedFilters);
      this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
    }
  }

  rangeChangedTimeline(selectedDate: Date) {
    const selection = this.selectionModel.selection,
      newSelection = this.selectionStrategy.selectionFinished(selectedDate, selection);

    this.selectionModel.updateSelection(newSelection, this);
    this.selectedDateRangeTimeline = new DateRange<Date>(newSelection.start, newSelection.end);

    if (this.selectedDateRangeTimeline?.start && this.selectedDateRangeTimeline?.end) {
      const formattedStartDate = this.formatDateForFilter(this.selectedDateRangeTimeline.start, this.searchCategory);
      const formattedEndDate = this.formatDateForFilter(this.selectedDateRangeTimeline.end, this.searchCategory, true);

      this.selectedFilters["timeline"] = [formattedStartDate, formattedEndDate];
      this.appliedFilter.emit(this.selectedFilters);
      this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
    }
  }

  private formatDateForFilter(date: Date, category: string, end = false): string {
    const pad = (num: number, size = 2) => num.toString().padStart(size, "0");

    if (end) {
      date.setHours(23, 59, 59, 999);
    }

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

    const timezoneOffset = -date.getTimezoneOffset();
    const sign = timezoneOffset >= 0 ? "+" : "-";
    const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
    const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

    if (category === SearchCategory.Users) {
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}${sign}${offsetHours}${offsetMinutes}`;
    } else {
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}${offsetMinutes}`;
    }
  }

  clearDateRange() {
    this.selectedDateRange = null;
    this.selectedDateRangeTimeline = null;
    if (this.selectedFilters["dateRange"]) {
      this.selectedFilters["dateRange"] = [];
    }
    if (this.selectedFilters["timeline"]) {
      this.selectedFilters["timeline"] = [];
    }
    if (this.selectedFilters["dateRange"] || this.selectedFilters["timeline"]) {
      this.appliedFilter.emit(this.selectedFilters);
      this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
    } else {
      this.appliedFilter.emit(this.selectedFilters);
    }
  }

  get isUserFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.Users && this.isFilterFacetsAvailable;
  }

  get isDesignationFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.Designation && this.isFilterFacetsAvailable;
  }

  get isEventsFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.Events && this.isFilterFacetsAvailable;
  }

  get isCommunityFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.Communities && this.isFilterFacetsAvailable;
  }

  get isTrainingPlanFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.TrainingPlans && this.isFilterFacetsAvailable;
  }

  get isFilterFacetsAvailable(): boolean {
    return (
      this.formattedFacets &&
      Object.keys(this.formattedFacets).length > 0 &&
      Object.values(this.formattedFacets).some((facet: any) => facet && facet?.length > 0)
    );
  }

  get sortedUserGroup() {
    const groupFacet = this.formattedFacets?.[FacetType.profileGroup];
    return !groupFacet || !Array.isArray(groupFacet)
      ? []
      : [
          ...groupFacet.filter(g => g.name.toLowerCase().startsWith("group")).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })),
          ...groupFacet.filter(g => !g.name.toLowerCase().startsWith("group")).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
        ];
  }

  get canShowTypeOfEventsFilter(): boolean {
    return (
      (this.formattedFacets["typeOfEvents"]?.some((event: any) => event.count > 0) &&
        this.searchConfig?.applicationName !== SearchListingConfig.ApplicationNames.MDOPortal) ??
      false
    );
  }

  // get canShowEventsStatusFilter(): boolean {
  //   return !!(
  //     this.searchCategory === SearchCategory.Events &&
  //     this.isEventsFacetsPresent &&
  //     this.formattedFacets["status"]?.length &&
  //     (this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal ||
  //       this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.CBPPortal)
  //   );
  // }

  get canShowStatusFilter(): boolean {
    if(this.formattedFacets["status"]?.length) {
      if (this.searchCategory === SearchCategory.Events && 
        this.isEventsFacetsPresent &&
        this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.CBPPortal ||
        this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal
      ) {
        return true;
      } else if (this.searchCategory === SearchCategory.Courses && 
        this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.CBPPortal
      ) {
        return true;
      }
    }
    return false;
  }

  formatFilterChips(value: string, type: string): string {
    if (!value) return value;

    const datePattern = /^\d{4}[-/]\d{2}[-/]\d{2}$/;

    if (datePattern.test(value)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }

    if (this.searchCategory === SearchCategory.Events) {
      const lowerValue = value.toLowerCase();
      if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
        return this.formatEventStatusName(lowerValue);
      } else {
        if (lowerValue === "live") {
          return "Published";
        } else if (lowerValue === "senttopublish") {
          return "Pending Approval";
        }
      }
    } else if (this.searchCategory === SearchCategory.Courses && this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal && type === "status") {
      return this.formatEventStatusName(value);
    }

    if (value.includes("_")) {
      return this.formatRolesNames(value);
    }

    return value;
  }

  getCalendarLabel(): string {
    if (this.isUserFacetsPresent) {
      return "learnsearch.onBoardingDateRange";
    } else if (this.isDesignationFacetsPresent) {
      return "learnsearch.importedOn";
    } else if (this.isEventsFacetsPresent) {
      return "searchfilters.eventDate";
    } else if (this.isCommunityFacetsPresent) {
      return "searchfilters.createdOn";
    } else if (this.isTrainingPlanFacetsPresent) {
      return "searchfilters.createdOn";
    } else if (this.showCoursesCreatedDateRange) {
      return "searchfilters.createdDate";
    }
    return "";
  }

  formatEventStatusName(name: string, type?: string): string {
    if(this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      if (this.searchCategory && this.searchCategory.toLocaleLowerCase() === "courses" || type === "courses") {
        return CBPstatusMapping[name.toLocaleLowerCase()] || CBPstatusMapping[name]
      } else {
        switch(name) {
          case 'senttopublish':
            return 'Pending';
          case 'live':
            return 'Approved';
          case 'upcoming':
            return 'Upcoming';
          default:
            return name;
        }
      }
    }
    if (name === "live") {
      return "Upcoming";
    }
    return name ? name : '';
  }

  get getFiltersList() {
    if(this.searchCategory && this.categoryType && this.categoryType.length) {
      const category = _.find(this.categoryType, { name: this.searchCategory });
      return category && category.filters ? category.filters : [];
    }
    return []
  }
}
