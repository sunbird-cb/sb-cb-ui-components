
import { MobileAppsService } from './mobile-apps.service'
import { NavigationExternalService } from './navigation-external.service'

describe('MobileAppsService', () => {
    let component: MobileAppsService

    const navigateSvc: Partial<NavigationExternalService> = {}

    beforeAll(() => {
        component = new MobileAppsService(
            navigateSvc as NavigationExternalService
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create a instance of component', () => {
        expect(component).toBeTruthy()
    })
})
