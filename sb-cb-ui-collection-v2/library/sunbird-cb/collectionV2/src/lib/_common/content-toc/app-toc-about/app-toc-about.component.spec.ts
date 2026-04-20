(window as any)['env'] = {
  name: 'test-environment',
  sitePath: '/test-site-path',
  karmYogiPath: '/test-karm-yogi-path',
  cbpPath: '/test-cbp-path'
}


import { Subject } from 'rxjs'
import { AppTocAboutComponent } from './app-toc-about.component'
import { RatingService } from '@ws-widget/collection/src/public-api'
import { LoggerService, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { TimerService } from '@ws/app/src/lib/routes/app-toc/services/timer.service'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { ResetRatingsService } from '@ws/app/src/lib/routes/app-toc/services/reset-ratings.service'

describe('AppTocAboutComponent', () => {
  let component: AppTocAboutComponent
  let mockRatingService: jest.Mocked<RatingService>
  let mockLoggerService: jest.Mocked<LoggerService>
  let mockTimerService: jest.Mocked<TimerService>
  let mockDialog: any
  let mockMatSnackBar: any
  let mockLoadCheckService: any
  let mockTocSvc: jest.Mocked<AppTocService>
  let mockConfigService: jest.Mocked<ConfigurationsService>
  let mockRouter: any
  let mockReviewDataService: any
  let mockHandleClaimService: any
  let mockResetRatingsService: jest.Mocked<ResetRatingsService>
  let mockContentSvc: any

  beforeEach(() => {
    // Create mock services
    mockRatingService = {
      getRatingSummary: jest.fn(),
      getRatingLookup: jest.fn(),
      getRatingReply: jest.fn(),
    } as any

    mockLoggerService = {
      error: jest.fn(),
    } as any

    mockTimerService = {
      getTimerData: jest.fn().mockReturnValue(new Subject()),
    } as any

    mockDialog = {
      open: jest.fn(),
    }

    mockMatSnackBar = {
      open: jest.fn(),
    }

    mockLoadCheckService = {
      componentLoaded: jest.fn(),
    }

    mockTocSvc = {
      getTocStructure: jest.fn(),
    } as any

    mockConfigService = {} as any

    mockRouter = {
      navigate: jest.fn(),
    }

    mockReviewDataService = {
      setReviewData: jest.fn(),
    }

    mockHandleClaimService = {
      setClaimData: jest.fn(),
    }

    mockResetRatingsService = {
      resetRatings$: new Subject(),
    } as any

    mockContentSvc = {
      downloadCert: jest.fn(),
    }

    // Initialize component
    component = new AppTocAboutComponent(
      mockRatingService,
      mockLoggerService,
      mockDialog,
      mockMatSnackBar,
      mockLoadCheckService,
      mockTimerService,
      mockTocSvc,
      mockConfigService,
      mockRouter,
      mockReviewDataService,
      mockHandleClaimService,
      mockResetRatingsService,
      mockContentSvc
    )

    // Initialize default component properties
    component['destroySubject$'] = new Subject()
    component.timerUnsubscribe = new Subject()

  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {


    it('should set isMobile to false when window width > 1200', () => {
      global.innerWidth = 1300
      component.ngOnInit()
      expect(component.isMobile).toBeFalsy()
    })

  })


  describe('processRatingSummary', () => {
    it('should correctly calculate average rating', () => {
      component.ratingSummary = {
        total_number_of_ratings: 10,
        sum_of_total_ratings: 40,
        totalcount1stars: 1,
        totalcount2stars: 1,
        totalcount3stars: 2,
        totalcount4stars: 3,
        totalcount5stars: 3,
      }

      const result = component.processRatingSummary()

      expect(result.avgRating).toBe(4.0)
      expect(result.total_number_of_ratings).toBe(10)
    })
  })

  describe('handleClickOfClaim', () => {
    it('should call handleClaimService with event data', () => {
      const mockEvent = { data: 'test' }

      component.handleClickOfClaim(mockEvent)

      expect(mockHandleClaimService.setClaimData).toHaveBeenCalledWith(mockEvent)
    })
  })

  describe('navigateToDiscussionHub', () => {
    it('should navigate to discussion forum with correct params', () => {
      component.navigateToDiscussionHub()

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum'],
        expect.any(Object)
      )
    })
  })

  describe('handleOpenCertificateDialog', () => {


    it('should open dialog directly if certData is present', () => {

      component.handleOpenCertificateDialog()

      expect(mockContentSvc.downloadCert).not.toHaveBeenCalled()
      expect(mockDialog.open).toHaveBeenCalled()
    })
  })

  describe('ngOnDestroy', () => {
    it('should unsubscribe from observables', () => {
      const destroySpy = jest.spyOn(component['destroySubject$'], 'unsubscribe')
      const timerUnsubSpy = jest.spyOn(component.timerUnsubscribe, 'unsubscribe')

      component.ngOnDestroy()

      expect(destroySpy).toHaveBeenCalled()
      expect(timerUnsubSpy).toHaveBeenCalled()
    })
  })
})