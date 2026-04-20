(window as any)['env'] = {
  name: 'test-environment',
  sitePath: '/test-site-path',
  karmYogiPath: '/test-karm-yogi-path',
  cbpPath: '/test-cbp-path'
}

import { CardContentV2Component } from './card-content-v2.component'
import { EventService, ConfigurationsService, UtilityService, WsEvents } from '@sunbird-cb/utils-v2'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { WidgetContentService } from '../_services/widget-content.service'
import { Subject } from 'rxjs'
import _ from 'lodash'

jest.mock('lodash', () => ({
  camelCase: jest.fn(str => str.toLowerCase()),
}))

describe('CardContentV2Component', () => {
  let component: CardContentV2Component
  let mockEventService: jest.Mocked<EventService>
  let mockConfigService: jest.Mocked<ConfigurationsService>
  let mockUtilityService: jest.Mocked<UtilityService>
  let mockSnackBar: jest.Mocked<MatSnackBar>
  let mockRouter: jest.Mocked<Router>
  let mockActivatedRoute: Partial<ActivatedRoute>
  let mockContentService: jest.Mocked<WidgetContentService>

  beforeEach(() => {
    mockEventService = {
      raiseInteractTelemetry: jest.fn(),
    } as any

    mockConfigService = {
      isIntranetAllowed: false,
      instanceConfig: {
        logos: {
          defaultContent: 'default-thumbnail.jpg',
          defaultSourceLogo: 'default-logo.jpg',
        },
        sources: [],
      },
      prefChangeNotifier: new Subject(),
    } as any

    mockUtilityService = {
      isMobile: true,
    } as any

    mockSnackBar = {
      open: jest.fn(),
    } as any

    mockRouter = {
      navigate: jest.fn(),
    } as any

    mockActivatedRoute = {
      snapshot: {
        queryParams: {},
        url: [],
        params: {},
        fragment: '',
        data: {},
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
    }

    mockContentService = {
      getResourseLink: jest.fn(),
    } as any

    component = new CardContentV2Component(
      mockEventService,
      mockConfigService,
      mockUtilityService,
      mockSnackBar,
      mockRouter,
      mockActivatedRoute as ActivatedRoute,
      mockContentService
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.widgetData = {
        content: {
          identifier: 'test-id',
          name: 'Test Content',
          contentType: 'Resource',
          primaryCategory: 'Learning Resource',
          mimeType: 'application/pdf',
        },
      } as any
    })

    it('should initialize default values', () => {
      component.ngOnInit()

      expect(component.isIntranetAllowedSettings).toBe(false)
      expect(component.defaultThumbnail).toBe('default-thumbnail.jpg')
      expect(component.defaultSLogo).toBe('default-logo.jpg')
    })

    it('should set up playlist and goals config', () => {
      component.ngOnInit()

      expect(component.btnPlaylistConfig).toEqual({
        contentId: 'test-id',
        contentName: 'Test Content',
        contentType: 'Resource',
        primaryCategory: 'Learning Resource',
        mode: 'dialog',
      })

      expect(component.btnGoalsConfig).toEqual({
        contentId: 'test-id',
        contentName: 'Test Content',
        contentType: 'Resource',
        primaryCategory: 'Learning Resource',
      })
    })
  })



  describe('getRedirectUrlData', () => {
    const mockContent = {
      identifier: 'test-id',
      primaryCategory: 'Resource',
      mimeType: 'application/pdf',
    }

    it('should navigate to player for resource content', async () => {
      await component.getRedirectUrlData(mockContent, true)

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/amrit-gyaan-kosh/player/pdf/test-id'],
        {
          queryParams: {
            primaryCategory: 'Learning Resource',
            ...mockActivatedRoute.snapshot.queryParams,
          },
        }
      )
    })

    it('should handle content service response for non-resource content', async () => {
      mockContentService.getResourseLink.mockResolvedValue({
        url: '/test-url',
        queryParams: { test: 'param' },
      })

      await component.getRedirectUrlData(mockContent, false)

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/test-url'],
        {
          queryParams: { test: 'param' },
        }
      )
    })

    it('should show snackbar when content is archived', async () => {
      mockContentService.getResourseLink.mockResolvedValue(null)

      await component.getRedirectUrlData(mockContent, false)

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'This Resource has been archived and is no longer available.',
        'X',
        { duration: 2000 }
      )
    })
  })

  describe('showSnackbar', () => {
    it('should show intranet content message', () => {
      component.widgetData = {
        content: {
          isInIntranet: true,
          status: 'Live',
        },
      } as any

      component.showSnackbar()

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Content is only available in intranet',
        'X',
        { duration: 2000 }
      )
    })

    it('should show expired content message', () => {
      component.widgetData = {
        content: {
          status: 'Expired',
          isInIntranet: false,
        },
      } as any

      component.showSnackbar()

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Content may be expired or deleted',
        'X',
        { duration: 2000 }
      )
    })
  })

  describe('downloadCertificate', () => {
    it('should raise telemetry event for certificate download', () => {
      const certificateData = {
        issuedCertificates: [{ identifier: 'cert-id' }],
      }

      component.downloadCertificate(certificateData)

      expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          id: 'view-certificate',
          subType: WsEvents.EnumInteractSubTypes.CERTIFICATE,
        },
        {
          id: 'cert-id',
          type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
        }
      )
    })
  })
})