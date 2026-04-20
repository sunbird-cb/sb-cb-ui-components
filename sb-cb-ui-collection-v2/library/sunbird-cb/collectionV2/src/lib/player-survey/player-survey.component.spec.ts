import { of, Subject } from 'rxjs'
import { PlayerSurveyComponent } from './player-survey.component'
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { EventService, ConfigurationsService, WsEvents } from '@sunbird-cb/utils-v2'
// import { ViewerUtilService } from '@ws/viewer/src/lib/viewer-util.service'
// import { ViewerDataService } from '@ws/viewer/src/lib/viewer-data.service'
import { WidgetContentService } from '../_services/widget-content.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

describe('PlayerSurveyComponent', () => {
  let component: PlayerSurveyComponent
  let mockActivatedRoute: Partial<ActivatedRoute>
  let mockEventService: jest.Mocked<EventService>
  let mockViewerService: jest.Mocked<ViewerUtilService>
  let mockSnackBar: jest.Mocked<MatSnackBar>
  let mockViewerDataService: jest.Mocked<ViewerDataService>
  let mockConfigService: jest.Mocked<ConfigurationsService>
  let mockWidgetService: jest.Mocked<WidgetContentService>

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          collectionId: 'test-collection',
          batchId: 'test-batch'
        },
        data: {
          content: {
            data: {
              identifier: 'test-identifier'
            }
          }
        },
        params: {
          resourceId: 'test-resource'
        },
        url: [],
        fragment: '',
        outlet: '',
        component: '',
        routeConfig: undefined,
        root: new ActivatedRouteSnapshot,
        parent: new ActivatedRouteSnapshot,
        firstChild: new ActivatedRouteSnapshot,
        children: [],
        pathFromRoot: [],
        paramMap: undefined,
        queryParamMap: undefined
      },
      params: of({
        resourceId: 'test-resource'
      })
    }

    mockEventService = {
      dispatchEvent: jest.fn()
    } as any

    mockViewerService = {
      getBatchIdAndCourseId: jest.fn().mockReturnValue({
        batchId: 'test-batch',
        courseId: 'test-course'
      }),
      realTimeProgressUpdateQuiz: jest.fn()
    } as any

    mockSnackBar = {
      open: jest.fn()
    } as any

    mockViewerDataService = {
      resourceId: 'test-resource',
      changedSubject: new Subject()
    } as any

    mockConfigService = {
      userProfile: {
        userId: 'test-user'
      }
    } as any

    mockWidgetService = {
      fetchContentHistoryV2: jest.fn().mockReturnValue(of({
        result: {
          contentList: [{
            contentId: 'test-resource',
            status: 'completed'
          }]
        }
      })),
      setProgramChildResumeData: jest.fn()
    } as any

    component = new PlayerSurveyComponent(
      mockActivatedRoute as any,
      mockEventService,
      mockViewerService,
      mockSnackBar,
      mockViewerDataService,
      mockConfigService,
      mockWidgetService
    )

    component.widgetData = {
      surveyUrl: 'test-url/surveys/test-survey',
      collectionId: 'test-collection',
      courseName: 'Test Course',
      progressStatus: 1,
      identifier: 'test-identifier',
      contentType: 'Resource',
      disableTelemetry: false
    }
  })

  it('should create component', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should initialize component with widget data', () => {
      component.ngOnInit()
      expect(component.courseId).toBe('test-collection')
      expect(component.courseName).toBe('Test Course')
      expect(component.surveyId).toBe('test-survey')
    })

    it('should setup API data correctly', () => {
      component.ngOnInit()
      expect(component.apiData).toBeTruthy()
      expect(component.apiData?.getAPI).toContain('test-survey')
    })



    it('should not dispatch events when telemetry is disabled', () => {
      component.widgetData.disableTelemetry = true
      component.ngOnInit()
      expect(mockEventService.dispatchEvent).not.toHaveBeenCalled()
    })

    it('should subscribe to viewer data service changes', () => {
      component.ngOnInit()
      mockViewerDataService.changedSubject.next(true)
      expect(component.resourceId).toBe('test-resource')
    })
  })

  describe('checkAfterSubmit', () => {
    it('should update progress and show success message', () => {
      const updateProgressSpy = jest.spyOn(component, 'updateProgress')
      component.checkAfterSubmit({})
      expect(updateProgressSpy).toHaveBeenCalledWith(2)
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Survey is submitted successfully',
        'X',
        expect.any(Object)
      )
    })
  })

  describe('updateProgress', () => {
    it('should call realTimeProgressUpdateQuiz with correct params', () => {
      component.updateProgress(2)
      expect(mockViewerService.realTimeProgressUpdateQuiz).toHaveBeenCalledWith(
        'test-identifier',
        'test-course',
        'test-batch',
        2
      )
    })
  })

  describe('ngOnDestroy', () => {
    it('should unsubscribe from viewer data service', () => {
      const mockSubscription = {
        unsubscribe: jest.fn()
      }
      component.viewerDataServiceSubscription = mockSubscription as any
      component.ngOnDestroy()
      expect(mockSubscription.unsubscribe).toHaveBeenCalled()
    })
  })

  describe('eventDispatcher', () => {
    it('should not dispatch event when telemetry is disabled', () => {
      component.widgetData.disableTelemetry = true
      component['eventDispatcher'](WsEvents.EnumTelemetrySubType.Init)
      expect(mockEventService.dispatchEvent).not.toHaveBeenCalled()
    })

    it('should dispatch event with correct structure', () => {
      component.enableTelemetry = true
      component['eventDispatcher'](WsEvents.EnumTelemetrySubType.Init)
      expect(mockEventService.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: WsEvents.WsEventType.Telemetry,
          data: expect.objectContaining({
            eventSubType: WsEvents.EnumTelemetrySubType.Init
          })
        })
      )
    })
  })
})