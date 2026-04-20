import { ContentStripWithTabsPillsComponent } from "./content-strip-with-tabs-pills.component";
import {
  EventService,
  ConfigurationsService,
  UtilityService,
  NsWidgetResolver,
} from "@sunbird-cb/utils-v2";
import { WidgetContentLibService } from "../../../_services/widget-content-lib.service";
import { MultilingualTranslationsService } from "../../../_services/multilingual-translations.service";
import { of, Subject, throwError } from "rxjs";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { WidgetUserServiceLib } from "../../../_services/widget-user-lib.service";
import { WidgetEnrollService } from "@sunbird-cb/utils-v2";
import { LoggerService } from "@sunbird-cb/utils-v2";
import { NsContentStripWithTabsAndPills } from "./content-strip-with-tabs-pills.model";
import { NsContent } from "../../../_models/widget-content.model";
import { NsCardContent } from "../../../_models/card-content.model";
import { SnackbarComponent } from "../../dialog-components/snackbar/snackbar.component";

describe("ContentStripWithTabsPillsComponent", () => {
  let component: ContentStripWithTabsPillsComponent;
  let mockEventService: jest.Mocked<EventService>;
  let mockContentService: jest.Mocked<WidgetContentLibService>;
  let mockConfigService: jest.Mocked<ConfigurationsService>;
  let mockUtilityService: jest.Mocked<UtilityService>;
  let mockRouter: jest.Mocked<Router>;
  let mockTranslateService: jest.Mocked<TranslateService>;
  let telemetrySubject: Subject<any>;

  beforeEach(() => {
    // Mock services
    telemetrySubject = new Subject();

    // Mock services
    mockEventService = {
      events$: of({ eventType: "test", from: "test" }),
    } as any;

    mockContentService = {
      telemetryData$: telemetrySubject,
      getRecommendedIds: jest.fn().mockReturnValue(["id1", "id2"]),
      isTelementrySubscribed: false,
      setTelementrySubscription: jest.fn(),
    } as any;

    mockConfigService = {
      sitePath: "/test",
      userProfile: {
        userId: "test-user-id",
        rootOrgId: "testOrg",
        professionalDetails: [{ designation: "test" }],
      },
    } as any;

    mockUtilityService = {
      isMobile: false,
    } as any;

    mockRouter = {
      navigate: jest.fn(),
    } as any;

    mockTranslateService = {
      setDefaultLang: jest.fn(),
      use: jest.fn(),
    } as any;

    // Component initialization
    component = new ContentStripWithTabsPillsComponent(
      { programStripKey: "test" },
      mockContentService,
      {} as LoggerService,
      mockEventService,
      mockConfigService,
      mockUtilityService,
      mockRouter,
      {} as WidgetUserServiceLib,
      mockTranslateService,
      {} as MultilingualTranslationsService,
      {} as WidgetEnrollService,
      {} as MatDialog,
      {} as MatSnackBar
    );

    component.widgetData = {
      strips: [],
      loader: true,
    };
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    beforeEach(() => {
      jest.spyOn(component, "initData").mockImplementation();
      jest.spyOn(component, "subscribeToTelementry");
    });

    it("should initialize component and call required methods", () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(mockContentService.getRecommendedIds).toHaveBeenCalledWith(
        "test-user-id"
      );
      expect(component.localRecommended).toEqual(["id1", "id2"]);
      expect(component.initData).toHaveBeenCalled();
      expect(component.subscribeToTelementry).toHaveBeenCalled();
    });
  });

  describe("subscribeToTelementry", () => {
    it("should handle telemetry data for cbpPlan strip", (done) => {
      // Arrange
      const emitSpy = jest.spyOn(component.telemtryResponse, "emit");
      const mockTab: NsContentStripWithTabsAndPills.IContentStripTab = {
        label: "Test Tab",
        value: "test-value",
        pillsData: [
          {
            label: "Test Pill",
            selected: true,
            value: "test-pill-value",
          },
        ],
        showTabDataCount: true,
      };

      component.widgetData = {
        strips: [
          {
            key: "cbpPlan",
            tabs: [mockTab],
          },
        ],
      } as any;
      component.activeTabIndex = 0;
      component.parametrizedText = jest.fn().mockReturnValue("test-tab");

      // Act
      component.subscribeToTelementry();
      telemetrySubject.next({ someData: "test" });

      // Assert
      setTimeout(() => {
        expect(
          mockContentService.setTelementrySubscription
        ).toHaveBeenCalledWith(true);
        expect(emitSpy).toHaveBeenCalledWith({
          someData: "test",
          selectedTab: "test-tab",
          selectedPill: "testpill",
        });
        done();
      });
    });

    it("should handle telemetry for forYou strip", (done) => {
      // Arrange
      const emitSpy = jest.spyOn(component.telemtryResponse, "emit");
      const mockTab: NsContentStripWithTabsAndPills.IContentStripTab = {
        label: "Test Tab",
        value: "test-value",
        pillsData: [
          {
            label: "Test Pill",
            selected: true,
            value: "test-pill-value",
          },
        ],
        showTabDataCount: true,
      };

      component.widgetData = {
        strips: [
          {
            key: "forYou",
            tabs: [mockTab],
          },
        ],
      } as any;
      component.activeTabIndex = 0;

      // Act
      component.subscribeToTelementry();
      telemetrySubject.next({ someData: "test" });

      // Assert
      setTimeout(() => {
        expect(emitSpy).toHaveBeenCalled();
        done();
      });
    });

    it("should not create multiple subscriptions", () => {
      // Arrange
      component.telementrySubscription = {} as any;

      // Act
      component.subscribeToTelementry();

      // Assert
      expect(
        mockContentService.setTelementrySubscription
      ).not.toHaveBeenCalled();
    });
  });

  describe("redirectViewAll", () => {
    it("should emit viewAllResponse when emitViewAll is true", () => {
      // Arrange
      const emitSpy = jest.spyOn(component.viewAllResponse, "emit");
      component.emitViewAll = true;
      const stripData = { test: "data" };

      // Act
      component.redirectViewAll(stripData, "/test-path", {});

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(stripData);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it("should navigate to recommended-learnings for designation tab", () => {
      // Arrange
      component.emitViewAll = false;
      const queryParams = { tabSelected: "designation", key: "test" };

      // Act
      component.redirectViewAll({}, "/test-path", queryParams);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ["/page/recommended-learnings"],
        { queryParams: { tabSelected: "designation" } }
      );
    });

    it("should navigate to provided path for non-designation tabs", () => {
      // Arrange
      component.emitViewAll = false;
      const path = "/test-path";
      const queryParams = { test: "param" };

      // Act
      component.redirectViewAll({}, path, queryParams);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith([path], { queryParams });
    });
  });

  describe("isStripShowing", () => {
    it("should return true when strip meets program strip criteria", () => {
      // Arrange
      const stripData = {
        key: "test",
        stripTitle: "test",
        widgets: [
          {
            widgetData: {
              content: {
                primaryCategory: "test",
              },
            },
          },
        ],
      };
      component["environment"] = {
        programStripKey: "test",
        programStripName: "test",
        programStripPrimaryCategory: "test",
      };

      // Act
      const result = component.isStripShowing(stripData);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when strip has no matching program content", () => {
      // Arrange
      const stripData = {
        key: "test",
        stripTitle: "test",
        widgets: [
          {
            widgetData: {
              content: {
                primaryCategory: "different",
              },
            },
          },
        ],
      };
      component["environment"] = {
        programStripKey: "test",
        programStripName: "test",
        programStripPrimaryCategory: "test",
      };

      // Act
      const result = component.isStripShowing(stripData);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("toggleInfo", () => {
    it("should toggle stripInfo visibility mode", () => {
      // Arrange
      const stripKey = "testStrip";
      component.stripsResultDataMap = {
        [stripKey]: {
          key: stripKey,
          stripInfo: {
            mode: "below",
            visibilityMode: "hidden",
          },
        },
      } as any;

      // Act
      component.toggleInfo({ key: stripKey } as any);

      // Assert
      expect(
        component.stripsResultDataMap[stripKey].stripInfo.visibilityMode
      ).toBe("visible");
    });
  });

  describe("parametrizedText", () => {
    it("should convert text to lowercase and replace spaces with hyphens", () => {
      // Arrange
      const input = "Test String";

      // Act
      const result = component.parametrizedText(input);

      // Assert
      expect(result).toBe("test-string");
    });
  });

  describe("transformContentsToWidgets", () => {
    it("should transform content to widget format", () => {
      // Arrange
      const mockContent: NsContent.IContent = {
        identifier: "test-id",
        name: "Test Content",
        batch: { batchId: "batch-1" },
      } as NsContent.IContent;

      const mockStrip: NsContentStripWithTabsAndPills.IContentStripUnit | any =
        {
          key: "test-strip",
          type: "content-strip",
          title: "Test Strip",
          showStrip: true,
          stripConfig: {
            cardSubType: "standard" as NsCardContent.TCardSubType,
          },
          customeClass: "custom-class",
          request: {
            api: {
              path: "test/path",
            },
          },
          noDataWidget: {},
          loader: true,
          tabs: [],
          preWidgets: [],
          postWidgets: [],
        };

      // Act
      const result = component["transformContentsToWidgets"](
        [mockContent],
        mockStrip
      );

      // Assert
      expect(result[0]).toEqual({
        widgetType: "cardLib",
        widgetSubType: "cardContentLib",
        widgetHostClass: "mb-2",
        widgetData: {
          content: mockContent,
          batch: mockContent.batch,
          cardSubType: "standard",
          cardCustomeClass: "custom-class",
          context: { pageSection: "test-strip", position: 0 },
          intranetMode: undefined,
          deletedMode: undefined,
          contentTags: undefined,
          sakshamAIGenerated: "",
        },
      });
    });
  });

  describe("processStrip", () => {
    it("should process strip data correctly with done status", async () => {
      // Arrange
      const mockStrip: NsContentStripWithTabsAndPills.IContentStripUnit | any =
        {
          key: "test-strip",
          type: "content-strip",
          title: "Test Strip",
          showStrip: true,
          canHideStrip: true,
          stripConfig: {
            cardSubType: "standard" as NsCardContent.TCardSubType,
          },
          request: {
            api: {
              path: "test/path",
            },
          },
          noDataWidget: {},
          loader: true,
          tabs: [],
          preWidgets: [],
          postWidgets: [],
        };

      const mockResults: NsWidgetResolver.IRenderConfigWithAnyData[] = [
        {
          widgetType: "test",
          widgetSubType: "test",
          widgetData: {},
        },
      ];

      // Act
      await component["processStrip"](
        mockStrip,
        mockResults,
        "done",
        true,
        null
      );

      // Assert
      expect(component.stripsResultDataMap[mockStrip.key]).toBeDefined();
      expect(component.stripsResultDataMap[mockStrip.key].widgets.length).toBe(
        1
      );
      expect(component.contentAvailable).toBe(true);
    });
  });

  describe("fetchStripFromRequestData", () => {
    it("should initialize strip with correct loader widgets", () => {
      // Arrange
      const mockStrip: NsContentStripWithTabsAndPills.IContentStripUnit | any =
        {
          key: "test-strip",
          type: "content-strip",
          title: "Test Strip",
          showStrip: true,
          stripConfig: {
            cardSubType: "standard" as NsCardContent.TCardSubType,
          },
          request: {
            api: {
              path: "test/path",
            },
          },
          noDataWidget: {},
          loader: true,
          tabs: [],
          preWidgets: [],
          postWidgets: [],
        };

      jest.spyOn(component as any, "transformSkeletonToWidgets");
      jest.spyOn(component as any, "processStrip");
      jest.spyOn(component as any, "fetchFromSearchV6").mockImplementation();
      jest.spyOn(component as any, "fetchForYouData").mockImplementation();
      jest.spyOn(component as any, "fetchAllCbpPlans").mockImplementation();
      jest
        .spyOn(component as any, "fetchUserEnrolledData")
        .mockImplementation();

      // Act
      component["fetchStripFromRequestData"](mockStrip);

      // Assert
      expect(component["transformSkeletonToWidgets"]).toHaveBeenCalledWith(
        mockStrip
      );
      expect(component["processStrip"]).toHaveBeenCalledWith(
        mockStrip,
        [],
        "fetching",
        false,
        null
      );
    });
  });

  describe("checkForEmptyWidget", () => {
    it("should return true for non-empty widget request", () => {
      // Arrange
      const mockStrip: NsContentStripWithTabsAndPills.IContentStripUnit | any =
        {
          key: "test-strip",
          type: "content-strip",
          title: "Test Strip",
          showStrip: true,
          stripConfig: {
            cardSubType: "standard" as NsCardContent.TCardSubType,
          },
          request: {
            api: {
              path: "test/path",
            },
          },
          loader: true,
          tabs: [],
          preWidgets: [],
          postWidgets: [],
        };

      // Act
      const result = component.checkForEmptyWidget(mockStrip);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("tabClicked", () => {
    let mockEventService: any;
    let HOME_PAGE_STRIP_TABS = "home-page-strip-tabs";
    let HOME = "home";
    beforeEach(() => {
      // Reset spies and mocks before each test
      jest.clearAllMocks();

      mockEventService = {
        events$: of({ eventType: "tFest", from: "test" }),
        raiseInteractTelemetry: jest.fn(),
      };

      component["eventSvc"] = mockEventService;
      // Setup default mock data
      component.widgetData = {
        strips: [
          {
            key: "testStrip",
            tabs: [
              {
                label: "Test Tab",
                value: "test-value",
                request: {},
                showTabDataCount: true,
                pillsData: [
                  {
                    label: "Test Pill",
                    value: "test-pill-value",
                    requestRequired: false,
                  },
                ],
              },
            ],
            type: "",
            title: "",
            showStrip: false,
          },
        ],
      };

      component.stripsResultDataMap = {
        testStrip: {
          key: "testStrip",
          canHideStrip: true,
          showStrip: true,
          disableTranslate: false,
          stripTitle: "Test Strip",
          stripConfig: {},
          showOnNoData: false,
          showOnLoader: false,
          showOnError: false,
          viewMoreUrl: {
            queryParams: {},
          },
          widgets: [],
          mode: "default",
          stripBackground: "",
          stripInfo: {
            mode: "below",
            icon: "",
            visibilityMode: "visible",
          },
        },
      } as any;
    });

    it("should update active tab index and reset selected pill", () => {
      // Arrange
      const tabEvent = 0;
      const pillIndex = 0;
      const stripMap = {
        tabs: [
          {
            label: "Test Tab",
            showTabDataCount: true,
            pillsData: [{ fetchTabStatus: "done", tabLoading: false }],
          },
        ],
        showOnLoader: false,
      } as any;
      const stripKey = "testStrip";
      const resetSelectedPillSpy = jest
        .spyOn(component as any, "resetSelectedPill")
        .mockImplementation();

      // Act
      component.tabClicked(tabEvent, pillIndex, stripMap, stripKey);

      // Assert
      expect(component.activeTabIndex).toBe(tabEvent);
      expect(stripMap.tabs[tabEvent].pillsData[pillIndex].fetchTabStatus).toBe(
        "inprogress"
      );
      expect(stripMap.tabs[tabEvent].pillsData[pillIndex].tabLoading).toBe(
        true
      );
      expect(stripMap.showOnLoader).toBe(true);

      expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: "click",
          subType: HOME_PAGE_STRIP_TABS,
          id: "testTab-tab",
        },
        {},
        {
          module: HOME,
        }
      );
    });

    it("should raise interact telemetry event", () => {
      // Arrange
      const tabEvent = 0;
      const pillIndex = 0;
      const stripMap = {
        tabs: [
          {
            label: "Test Tab",
            showTabDataCount: true,
            pillsData: [{ tabLoading: false }],
          },
        ],
      } as any;
      const stripKey = "testStrip";

      // Act
      component.tabClicked(tabEvent, pillIndex, stripMap, stripKey);

      // Assert
      expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: "click",
          subType: HOME_PAGE_STRIP_TABS,
          id: "testTab-tab",
        },
        {},
        {
          module: HOME,
        }
      );
    });

    it("should update viewMoreUrl queryParams", () => {
      // Arrange
      const tabEvent = 0;
      const pillIndex = 0;
      const stripMap = {
        tabs: [
          {
            label: "Test Tab",
            value: "test-value",
            showTabDataCount: true,
            pillsData: [
              {
                value: "test-pill-value",
              },
            ],
          },
        ],
      } as any;
      const stripKey = "testStrip";

      // Act
      component.tabClicked(tabEvent, pillIndex, stripMap, stripKey);

      // Assert
      expect(
        component.stripsResultDataMap[stripKey].viewMoreUrl.queryParams
      ).toEqual({
        tabSelected: "test-value",
        pillSelected: "test-pill-value",
      });
    });

    it("should call getTabDataByNewReqSearchV6 when pill has searchV6 request", () => {
      // Arrange
      const tabEvent = 0;
      const pillIndex = 0;
      const stripMap = {
        tabs: [
          {
            computeDataOnClick: false,
            showTabDataCount: true,
            pillsData: [
              {
                requestRequired: true,
                request: {
                  searchV6: true,
                },
                tabLoading: true,
              },
            ],
          },
        ],
      } as any;
      const stripKey = "testStrip";
      const getTabDataSpy = jest
        .spyOn(component as any, "getTabDataByNewReqSearchV6")
        .mockImplementation();

      // Act
      component.tabClicked(tabEvent, pillIndex, stripMap, stripKey);

      // Assert
      expect(getTabDataSpy).toHaveBeenCalledWith(
        component.widgetData.strips[0],
        tabEvent,
        0,
        stripMap.tabs[0].pillsData[0],
        true
      );
      expect(stripMap.tabs[0].pillsData[0].tabLoading).toBe(false);
    });

    it("should call fetchEventEnrollmentList when pill request type is eventEnrollment", () => {
      // Arrange
      const tabEvent = 0;
      const pillIndex = 0;
      const stripMap = {
        tabs: [
          {
            computeDataOnClick: false,
            pillsData: [
              {
                requestRequired: true,
                request: {
                  type: "eventEnrollment",
                },
                tabLoading: true,
              },
            ],
          },
        ],
      } as any;
      const stripKey = "testStrip";
      const fetchEventSpy = jest
        .spyOn(component as any, "fetchEventEnrollmentList")
        .mockImplementation();

      // Act
      component.tabClicked(tabEvent, pillIndex, stripMap, stripKey);

      // Assert
      expect(fetchEventSpy).toHaveBeenCalledWith(
        component.widgetData.strips[0],
        tabEvent,
        pillIndex,
        true
      );
      expect(stripMap.tabs[0].pillsData[0].tabLoading).toBe(false);
    });

    it("should call fetchDesignationBasedCourses when tab has designationsList request", () => {
      // Arrange
      const tabEvent = 0;
      const pillIndex = 0;
      const stripMap = {
        tabs: [
          {
            requestRequired: true,
            showTabDataCount: true,
            request: {
              designationsList: true,
            },
            pillsData: [
              {
                tabLoading: true,
              },
            ],
          },
        ],
      } as any;
      const stripKey = "testStrip";
      const fetchDesignationSpy = jest
        .spyOn(component as any, "fetchDesignationBasedCourses")
        .mockImplementation();

      // Update widgetData.strips[0] to match expected data for this test
      component.widgetData.strips[0].tabs[0].request = {
        designationsList: true,
      };
      component.widgetData.strips[0].tabs[0].requestRequired = true;

      // Act
      component.tabClicked(tabEvent, pillIndex, stripMap, stripKey);

      // Assert
      expect(fetchDesignationSpy).toHaveBeenCalledWith(
        component.widgetData.strips[0],
        tabEvent,
        true
      );
      expect(stripMap.tabs[0].pillsData[0].tabLoading).toBe(false);
    });

    it("should call generateCourseRecommendation when tab has courseRecommendation request", () => {
      // Arrange
      const tabEvent = 0;
      const pillIndex = 0;
      const stripMap = {
        tabs: [
          {
            requestRequired: true,
            showTabDataCount: true,
            request: {
              courseRecommendation: true,
            },
            pillsData: [
              {
                tabLoading: true,
              },
            ],
          },
        ],
      } as any;
      const stripKey = "testStrip";
      const generateRecommendationSpy = jest
        .spyOn(component as any, "generateCourseRecommendation")
        .mockImplementation();
      component.localRecommended = ["rec1", "rec2"];

      // Update widgetData.strips[0] to match expected data for this test
      component.widgetData.strips[0].tabs[0].request = {
        courseRecommendation: true,
      };
      component.widgetData.strips[0].tabs[0].requestRequired = true;

      // Act
      component.tabClicked(tabEvent, pillIndex, stripMap, stripKey);

      // Assert
      expect(generateRecommendationSpy).toHaveBeenCalledWith(
        component.widgetData.strips[0],
        tabEvent,
        true,
        ["rec1", "rec2"]
      );
      expect(stripMap.tabs[0].pillsData[0].tabLoading).toBe(false);
    });
  });

  describe("Saksham AI Related Functions", () => {
    let component: ContentStripWithTabsPillsComponent;
    let mockUserService: any;
    let mockContentService: any;
    let mockConfigService: any;
    let mockEnrollService: any;
    let mockSnackBar: any;

    beforeEach(() => {
      mockUserService = {
        getRecommendedCoursesSakshamAI: jest.fn().mockReturnValue(of({})),
        generateCoursesSakshamAI: jest.fn().mockReturnValue(of({})),
      };

      mockContentService = {
        setRecommendedIds: jest.fn(),
        setFeedbackData: jest.fn(),
        searchContentSearch_PROD: jest.fn().mockReturnValue(of({})),
        filterCoursesWithNoRating: jest.fn(),
        saveFeedbackSakshamAI: jest.fn().mockReturnValue(of({})),
        releventNotRelevent$: new Subject(),
      };

      mockConfigService = {
        userProfile: {
          userId: "test-user",
          departmentName: "test-dept",
          professionalDetails: [
            {
              designation: "test-designation",
            },
          ],
        },
      };

      mockEnrollService = {
        fetchEnrollContentData: jest.fn(),
      };

      mockSnackBar = {
        openFromComponent: jest.fn(),
      };

      component = new ContentStripWithTabsPillsComponent(
        {} as any,
        mockContentService,
        {} as any,
        {} as any,
        mockConfigService,
        {} as any,
        {} as any,
        mockUserService,
        {} as any,
        {} as any,
        mockEnrollService,
        {} as any,
        mockSnackBar
      );
    });

    describe("generateCourseRecommendation", () => {
      const mockStrip = {
        tabs: [
          {
            request: {
              courseRecommendation: {
                path: "/test-path",
              },
            },
            pillsData: [
              {
                selected: false,
                fetchTabStatus: "pending",
                tabLoading: true,
              },
            ],
          },
        ],
        showOnLoader: true,
      };

      const mockResponse = {
        id: "rec-123",
        recommended_courses: [{ course_id: "course-1" }],
        feedbacks: ["feedback1"],
      };

      const mockEnrollResponse = {
        result: {
          courses: ["course1"],
        },
      };

      const mockSearchResponse = {
        result: {
          content: ["content1"],
        },
      };

      it('should generate course recommendations with new request', async () => {
        // Arrange
        mockUserService.generateCoursesSakshamAI.mockReturnValue(of(mockResponse));
        mockEnrollService.fetchEnrollContentData.mockReturnValue(of(mockEnrollResponse));
        mockContentService.searchContentSearch_PROD.mockReturnValue(of(mockSearchResponse));
        mockContentService.filterCoursesWithNoRating.mockReturnValue(['filtered-content']);
  
        // Act
        await component.generateCourseRecommendation(mockStrip as any, 0, true, '');
  
        // Assert
        expect(mockUserService.generateCoursesSakshamAI).toHaveBeenCalledWith(
          '/test-path',
          {
            user_id: 'test-user',
            department: 'test-dept',
            designation: 'test-designation',
            device_type: 'web'
          }
        );
        expect(mockContentService.setRecommendedIds).toHaveBeenCalledWith('rec-123', 'test-user');
        expect(mockContentService.setFeedbackData).toHaveBeenCalledWith(['feedback1']);
      });

      it('should use existing recommendation ID if provided', async () => {
        // Arrange
        mockUserService.getRecommendedCoursesSakshamAI.mockReturnValue(of(mockResponse));
        mockEnrollService.fetchEnrollContentData.mockReturnValue(of(mockEnrollResponse));
        mockContentService.searchContentSearch_PROD.mockReturnValue(of(mockSearchResponse));
  
        // Act
        await component.generateCourseRecommendation(mockStrip as any, 0, true, 'existing-rec-id');
  
        // Assert
        expect(mockUserService.getRecommendedCoursesSakshamAI).toHaveBeenCalledWith('existing-rec-id');
        expect(mockUserService.generateCoursesSakshamAI).not.toHaveBeenCalled();
      });
    });

    describe("saveFeedback", () => {
      beforeEach(() => {
        component.recommendedCoursesId = "rec-123";
        component.feedbackCourseId = "course-123";
      });

      it("should save feedback successfully with rating", async () => {
        // Arrange
        mockContentService.saveFeedbackSakshamAI.mockReturnValue(
          of({ message: "Success" })
        );

        // Act
        await component.saveFeedback("Great course!", 1);

        // Assert
        expect(mockContentService.saveFeedbackSakshamAI).toHaveBeenCalledWith({
          recommendation_id: "rec-123",
          course_id: "course-123",
          rating: 1,
          comments: "Great course!",
          user_id: "test-user",
        });
        expect(mockSnackBar.openFromComponent).toHaveBeenCalled();
        expect(component.sakshamFeedbackPopup).toBe(false);
      });

      it("should handle feedback save failure", async () => {
        // Arrange
        mockContentService.saveFeedbackSakshamAI.mockReturnValue(
          throwError(new Error("Failed"))
        );
        let SNACKBAR_DURATION = 3000;
        // Act
        await component.saveFeedback("Great course!", 1);

        // Assert
        expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
          SnackbarComponent,
          {
            data: {
              message: "Something is wrong. Please try again later",
              type: "error",
            },
            duration: SNACKBAR_DURATION,
            panelClass: "course-error-snackbar",
          }
        );
      });
    });

    describe("subscribeToReleventEmmitter", () => {
      it("should subscribe to relevant emitter and handle feedback", () => {
        // Arrange
        const saveFeedbackSpy = jest
          .spyOn(component, "saveFeedback")
          .mockImplementation();

        // Act
        component.subscribeToReleventEmmitter();
        mockContentService.releventNotRelevent$.next({
          widgetData: {
            content: {
              identifier: "new-course-id",
            },
          },
          isRelevent: true,
        });

        // Assert
        expect(component.feedbackCourseId).toBe("new-course-id");
        expect(saveFeedbackSpy).toHaveBeenCalledWith("", 1);
      });

      it("should handle non-relevant feedback", () => {
        // Act
        component.subscribeToReleventEmmitter();
        mockContentService.releventNotRelevent$.next({
          widgetData: {
            content: {
              identifier: "new-course-id",
            },
          },
          isRelevent: false,
        });

        // Assert
        expect(component.sakshamFeedbackPopup).toBe(true);
      });
    });

    describe("cancelFeedbackPopup", () => {
      it("should reset feedback popup state", () => {
        // Arrange
        component.sakshamFeedbackPopup = true;
        component.feedbackCourseId = "course-123";

        // Act
        component.cancelFeedbackPopup();

        // Assert
        expect(component.sakshamFeedbackPopup).toBe(false);
        expect(component.feedbackCourseId).toBe("");
      });
    });
  });
});
