(window as any)['env'] = {
  name: 'test-environment',
  sitePath: '/test-site-path',
  karmYogiPath: '/test-karm-yogi-path',
  cbpPath: '/test-cbp-path'
}

import { SimpleChange } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { ContentTocComponent } from './content-toc.component'
import { UtilityService } from '@sunbird-cb/utils-v2'
import { LoadCheckService } from '@ws/app/src/lib/routes/app-toc/services/load-check.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

describe('ContentTocComponent', () => {
  let component: ContentTocComponent
  let mockActivatedRoute: Partial<ActivatedRoute>
  let mockUtilityService: Partial<UtilityService>
  let mockLoadCheckService: Partial<LoadCheckService>
  let mockConfigService: Partial<ConfigurationsService>

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        data: {
          pageData: {
            data: {
              // mock config data
            }
          }
        },
        queryParams: {},
        url: [],
        params: {},
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
      }
    }

    mockUtilityService = {
      isMobile: false
    }

    mockLoadCheckService = {
      componentLoaded: jest.fn()
    }

    mockConfigService = {
      userRoles: new Set(['MENTOR'])
    }

    component = new ContentTocComponent(
      mockActivatedRoute as ActivatedRoute,
      mockUtilityService as UtilityService,
      mockLoadCheckService as LoadCheckService,
      mockConfigService as ConfigurationsService
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should set selectedTabIndex to 1 when batchId is present in query params', () => {
      mockActivatedRoute.snapshot!.queryParams = { batchId: '123' }
      component.ngOnInit()
      expect(component.selectedTabIndex).toBe(1)
    })

    it('should set displayTeachersContent to true for mentor role and case study course', () => {

      component.ngOnInit()
      expect(component.displayTeachersContent).toBeTruthy()
    })

    it('should set reference and teacher notes flags based on referenceNodes', () => {

      component.ngOnInit()
      expect(component.referenceNotesFlag).toBeFalsy()
      expect(component.teacherNotesFlag).toBeFalsy()
    })
  })

  describe('ngAfterViewInit', () => {


    it('should set menuPosition from tab element', () => {
      component.tabElement = {
        _elementRef: {
          nativeElement: {
            offsetTop: 100
          }
        }
      } as any
      component.ngAfterViewInit()
      expect(component.menuPosition).toBe(100)
    })
  })

  describe('ngOnChanges', () => {
    it('should set selectedTabIndex to 1 when changeTab is true', () => {
      const changes = {
        changeTab: new SimpleChange(false, true, false)
      }
      component.ngOnChanges(changes)
      expect(component.selectedTabIndex).toBe(1)
    })
  })

  describe('handleScroll', () => {
    beforeEach(() => {
      component.menuPosition = 200
      component.isMobile = false
    })

    it('should set sticky to true when scroll position exceeds threshold', () => {
      Object.defineProperty(window, 'scrollY', { value: 200 })
      component.handleScroll()
      expect(component.sticky).toBeTruthy()
    })

    it('should set sticky to false when scroll position is below threshold', () => {
      Object.defineProperty(window, 'scrollY', { value: 50 })
      component.handleScroll()
      expect(component.sticky).toBeFalsy()
    })
  })


})