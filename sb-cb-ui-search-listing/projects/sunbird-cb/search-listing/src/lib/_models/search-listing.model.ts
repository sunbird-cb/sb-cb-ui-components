export class SearchV4Request {
  request: RequestParams;
  locale?: string[];
  constructor(competenciesKey: any) {
    this.request = new RequestParams(competenciesKey);
  }
}

export class RequestParams {
  filters: Filters;
  fields: any[];
  facets: string[];
  query: string;
  limit: number;
  offset: number;
  sort_by: SortBy;
  exists?: string[];
  reviewStatus?: string[];
  constructor(competenciesKey: any) {
    this.filters = new Filters();
    this.fields = [
      "downloadUrl",
      "organisation",
      "language",
      "source",
      "appIcon",
      "identifier",
      "name",
      "primaryCategory",
      "contentType",
      "posterImage",
      "createdOn",
      "duration",
      "avgRating",
      "additionalTags",
      "courseCategory",
      "mimeType",
      "contentId",
      "creatorLogo",
      "sectorDetails_v1",
      "status"
    ];
    this.facets = [...SearchOthersFacet, ...competenciesKey];
    this.query = "";
    this.limit = 3;
    this.offset = 0;
    this.sort_by = new SortBy();
  }
}

export class Filters {
  contentType: any;
  courseCategory?: any;
  status: string[];
  sourceName?: string[];
  avgRating?: { [key: string]: string };
  language?: string[];
  organisation?: string[];
  sectorId?: string[];
  subSectorId?: string[];
  resourceType?: string[];
  must?: any;
  resourceCategory?: string[];
  [key: string]: any;
  constructor() {
    this.contentType = ["Course"];
    this.courseCategory = [];
    this.status = [];
  }
}

export class SortBy {
  createdOn?: string;
  createdDate?: string;
  startDate?: string;
  avgRating?: string;
  firstName?: string;
  name?: string;
  constructor() {
    // this.lastUpdatedOn = 'desc';
  }
}

export enum SearchCategory {
  All = "",
  Courses = "courses",
  Programs = "programs",
  Events = "events",
  People = "peoples",
  CaseStudy = "case-study",
  Communities = "communities",
  Resources = "resources",
  ExternalContents = "external-contents",
  TrainingPlans = "training-plans",
  Designation = "designation",
  Users = "users"
}

export const SearchOthersFacet = [
  // 'duration',
  "avgRating",
  "language",
  "organisation",
  // 'sectorId',
  "courseCategory",
  "sectorDetails_v1.sectorName",
  "sectorDetails_v1.subSectorName"
];

// Events
export const SearchEventfacet = ["language", "sourceName", "startDateTimeInEpoch", "endDateTimeInEpoch", "resourceType", "status"];

export const SearchEventFields = [
  "name",
  "description",
  "identifier",
  "resourceType",
  "contentType",
  "sourceName",
  "duration",
  "startDate",
  "endDate",
  "startTime",
  "endTime",
  "createdOn",
  "eventType",
  "expiryDate",
  "appIcon",
  "startDateTime",
  "endDateTime",
  "status"
];

export const SearchResourceMimeType = ["application/pdf", "video/mp4", "text/x-url", "audio/mpeg", "application/vnd.ekstep.content-collection"];

export const SearchResourceFacets = ["resourceCategory", "sectorDetails_v1.subSectorName", "sectorDetails_v1.sectorName", "years"];

export class SearchPeoplesRequest {
  filters: PeoplesFilters;
  facets?: string[];
  fields: any[];
  limit: number;
  offset: number;
  sort_by: SortBy;
  query: string;
  constructor() {
    this.limit = 5;
    this.offset = 0;
    this.sort_by = {};
    (this.query = ""), (this.fields = []);
    this.filters = new PeoplesFilters();
    this.facets = ["profileDetails.professionalDetails.designation", "rootOrgName"];
  }
}

export class PeoplesFilters {
  rootOrgName?: string[];
  [key: string]: any;
}

export class SearchCommunitiesRequest {
  filterCriteriaMap: {
    status: string;
    orgName?: string[];
    competencyArea?: string[];
    topicName?: string[];
    [key: string]: any;
  };
  requestedFields: any[];
  pageNumber: number;
  pageSize: number;
  facets: string[];
  searchString?: string;
  orderBy?: string;
  orderDirection?: string;

  constructor(competenciesKey: any) {
    this.filterCriteriaMap = {
      status: "active"
    };
    this.requestedFields = [
      "communityName",
      "countOfAnswerPost",
      "countOfPeopleLiked",
      "countOfPostCreated",
      "countOfPeopleJoined",
      "topicName",
      "imageUrl",
      "posterImageUrl",
      "orgName",
      "createdOn",
      "communityId"
    ];
    this.pageNumber = 0;
    this.pageSize = 6;
    this.facets = ["topicName", "orgName", ...competenciesKey];
  }
}

export class SearchUsersRequest {
  request: UsersRequestParams;
  constructor() {
    this.request = new UsersRequestParams();
  }
}

export class UsersRequestParams {
  filters: UsersFilters;
  fields: string[];
  facets: string[];
  query?: string;
  sort_by: SortBy;
  orderBy?: string;
  limit: number;
  offset: number;

  constructor() {
    this.filters = {
      status: 1
    };
    this.fields = [
      "userId",
      "firstName",
      "userName",
      "email",
      "profileDetails.professionalDetails.designation",
      "maskedPhone",
      "profileDetails.personalDetails.primaryEmail",
      "profileDetails.profileStatus",
      "createdDate",
      "rootOrgName"
    ];
    this.facets = [
      "profileDetails.professionalDetails.designation",
      "profileDetails.profileStatus",
      "profileDetails.professionalDetails.group",
      "profileDetails.employmentDetails.departmentName",
      "roles.role"
    ];
    this.limit = 10;
    this.offset = 0;
    this.sort_by = {};
    this.orderBy = "createdDate";
  }
}

export class SearchTrainingPlansRequest {
  filter: {
    [key: string]: any;
  };
  pageNumber: number;
  pageSize: number;
  searchString?: string;
  orderBy?: string;
  orderDirection?: string;
  requestedFields?: string[];
  facets: string[];

  constructor() {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.facets = ["status", "createdAt", "createdByName", "contentType", "endDate", "isApar"];
    this.filter = {};
  }
}

export class SearchDesignationRequest {
  request: DesignationRequestParams;
  constructor() {
    this.request = new DesignationRequestParams();
  }
}

export class DesignationRequestParams {
  filters: {
    category?: string;
    categories?: string[];
    status?: string;
    objectType?: string;
    [key: string]: any;
  };
  fields: string[];
  facets: string[];
  query?: string;
  sort_by: SortBy;
  orderBy?: string;
  limit: number;
  offset: number;

  constructor() {
    this.fields = ["name", "identifier", "createdOn", "additionalProperties"];
    this.facets = ["createdOn"];
    this.limit = 10;
    this.offset = 0;
    this.sort_by = {};
    this.filters = {
      category: "designation",
      status: "Live",
      objectType: "Term"
    };
  }
}

export interface UsersFilters {
  rootOrgId?: string;
  [key: string]: any;
}

export class SearchNLP {
  query: string;
  synonyms: boolean;
  constructor() {
    this.query = "";
    this.synonyms = false;
  }
}

export interface PageChangeEmitter {
  currentPage: number;
  previousPage: number;
  limit: number;
}

export type Facet = {
  name: string;
  values: { name: string; count: number }[];
};

export type FormattedFacets = {
  [key: string]: { name: string; count: number }[] | null;
};

export enum FacetType {
  Organization = "organisation",
  Language = "language",
  AvgRating = "avgRating",
  Duration = "duration",
  Designation = "designation",
  SourceName = "sourceName",
  courseCategory = "courseCategory",
  sectorNames_v1 = "sectorDetails_v1.sectorName",
  subSectorNames_v1 = "sectorDetails_v1.subSectorName",
  sectorId = "sectorId",
  resourceCategory = "resourceCategory",
  subSectorId = "subSectorId",
  subSectorNameResource = "subSectorName",
  sectorNameResource = "sectorName",
  contentPartners = "contentPartner.contentPartnerName",
  topic = "topic",
  topicName = "topicName",
  eventStatus = "eventStatus",
  rootOrgName = "rootOrgName",

  // Users
  profileDesignation = "profileDetails.professionalDetails.designation",
  profileStatus = "profileDetails.profileStatus",
  profileGroup = "profileDetails.professionalDetails.group",
  employmentDepartment = "profileDetails.employmentDetails.departmentName",
  organizationsRoles = "roles.role",

  // Designations
  createdOn = "createdOn",

  // Training Plans
  status = "status",
  createdAt = "createdAt",
  createdByName = "createdByName",
  contentType = "contentType",
  endDate = "endDate",
  isApar = "isApar"
}

export enum SortType {
  MostRelevent = "most_relevant",
  RecentlyAdded = "recently_added_newest",
  HighestRated = "highest_rated",
  MostEnrolled = "most_enrolled",
  Ascending = "asc",
  Descending = "desc",
  AtoZ = "a-z",
  ZtoA = "z-a"
}

export enum SearchConstantLocalStorage {
  SortType = "searchSortType"
}

export class SearchExternalRequest {
  filterCriteriaMap: {
    [key: string]: any;
  };
  requestedFields: any[];
  pageNumber: number;
  pageSize: number;
  facets: string[];
  searchString: string | null;
  orderBy?: string;
  orderDirection?: string;

  constructor(competenciesKey: any) {
    this.filterCriteriaMap = {};
    this.requestedFields = [];
    this.pageNumber = 0;
    this.pageSize = 3;
    this.searchString = null;
    this.facets = ["topic", "contentPartner.contentPartnerName", ...competenciesKey];
    this.orderBy = "createdOn";
  }
}

export const SearchResourcesFields = [
  "appIcon",
  "artifactUrl",
  "channel",
  "contentType",
  "createdOn",
  "creator",
  "description",
  "duration",
  "identifier",
  "mimeType",
  "name",
  "posterImage",
  "primaryCategory",
  "resourceType",
  "source",
  "additionalTags"
];

export interface ICompentencyKeys {
  vKey: string;
  vCompetencyArea: string;
  vCompetencyAreaDescription: string;
  vCompetencyTheme: string;
  vCompetencySubTheme: string;
}

export enum ACBPConst {
  UPCOMING = "upcoming",
  ALL = "All",
  OVERDUE = "overdue",
  SUCCESS = "success"
}

export enum IGOTConst {
  COMPETENCIES = "competencies_v6",
  RETIRED = "Retired"
}

export namespace SearchListingConfig {
  export interface Config {
    searchCategories: SearchCategory[];
    currentSearchCategories?: SearchCategory[];
    searchListing: boolean;
    allSearchCategoriesTypes: SearchCategoryType[];
    searchInputConfig: SearchInputConfig;
    applicationName: string;
    sortings?: {
      [key: string]: SortingOptions[];
    };
    fields?: {
      [key: string]: string[];
    }
    noDataFoundFlags: {
      [key: string]: SearchNoDataFoundFlags;
    };
  }
  export interface SearchCategory {
    label: string;
    value: string;
    icon: string;
    roles?: string[];
  }

  export interface FilterType {
    name: string;
    count: number;
    isChecked: boolean;
    displayName: string;
    filters?: FilterType[];
  }

  export interface SearchCategoryType {
    displayName: string;
    name: string;
    count: number;
    isChecked: boolean;
    filters: FilterType[];
    disabled: boolean;
    facets?: string[];
  }
  export interface SearchInputConfig {
    enableRecentSearches: boolean;
    defaultSearchCategory: string;
  }

  export interface SortingOptions {
    name: string;
    value: string;
  }
  export interface SearchNoDataFoundFlags {
    showButtons: boolean;
    navigationsButtons: NavigationsButton[];
  }

  export interface NavigationsButton {
    label: string;
    routeTo: string;
    matFlatButton: boolean;
  }

  export enum ApplicationNames {
    LearnerPortal = "Learner Portal",
    MDOPortal = "MDO Portal",
    CBPPortal = "CBP Portal"
  }
}

export const CBPstatusMapping: Record<string, string> = {
  live: 'Live',
  review: 'Review',
  reviewed: 'Under Publish',
  inreview: 'Under Review',
  retired: 'Inactive',
  draft: 'Draft',
  failed: 'Failed'
};
