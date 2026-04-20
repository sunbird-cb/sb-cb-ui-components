import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { AddUsersFormMetaComponent } from './add-users-form-meta.component'
import { ConfigurationsService } from '@ws-widget/utils/src/public-api'
import { MyContentService } from '../../services/my-content.service'
import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { of, throwError } from 'rxjs'

describe('AddUsersFormMetaComponent', () => {
  let component: AddUsersFormMetaComponent
  let mockFormBuilder: jest.Mocked<UntypedFormBuilder>
  let mockConfigSvc: jest.Mocked<ConfigurationsService>
  let mockContentService: jest.Mocked<MyContentService>
  let mockLoaderService: jest.Mocked<LoaderService>
  let mockSnackBar: jest.Mocked<MatSnackBar>
  let mockChangeDetector: jest.Mocked<any>
  let mockForm: UntypedFormGroup

  beforeEach(() => {
    // Setup mock form
    mockForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(''),
      email: new UntypedFormControl('test@test.com'),
      channel: new UntypedFormControl('Test Department'),
      mobileNumber: new UntypedFormControl('1234567890'),
      channelId: new UntypedFormControl('test-channel'),
      selectedRoles: new UntypedFormControl(['ROLE_1'])
    })

    mockFormBuilder = {
      group: jest.fn().mockReturnValue(mockForm)
    } as any

    mockConfigSvc = {
      userProfile: {
        departmentName: 'Test Department',
        rootOrgId: 'test-org'
      },
      unMappedUser: {
        rootOrg: {
          channel: 'test-channel'
        }
      }
    } as any

    mockContentService = {
      getExistingUserData: jest.fn(),
      createNewUserApi: jest.fn(),
      assignUserRoleApi: jest.fn()
    } as any

    mockLoaderService = {
      changeLoad: {
        next: jest.fn()
      }
    } as any

    mockSnackBar = {
      openFromComponent: jest.fn()
    } as any

    mockChangeDetector = {
      detectChanges: jest.fn()
    }

    component = new AddUsersFormMetaComponent(
      mockFormBuilder,
      mockConfigSvc,
      mockContentService,
      mockLoaderService,
      mockSnackBar,
      mockChangeDetector
    );

    // Mock environment.portalRoles
    (component as any).listOfRoles = ['ADMIN', 'USER', 'SPV_PUBLISHER']
  })

  describe('ngOnInit', () => {
    it('should initialize form for new user when selectedAction is createNew', () => {
      component.selectedAction = { type: 'createNew' }
      component.ngOnInit()
      expect(mockFormBuilder.group).toHaveBeenCalled()
    })

    it('should call assignValues for existing user when selectedAction is existingUser', () => {
      const assignValuesSpy = jest.spyOn(component, 'assignValues').mockImplementation(() => Promise.resolve())
      component.selectedAction = { type: 'existingUser', userId: 'test-id' }
      component.ngOnInit()
      expect(assignValuesSpy).toHaveBeenCalledWith('test-id')
    })
  })

  describe('emailVerification', () => {
    it('should set emailLengthVal to true when local part exceeds 64 characters', () => {
      const longEmail = 'a'.repeat(65) + '@test.com'
      component.emailVerification(longEmail)
      expect(component.emailLengthVal).toBeTruthy()
    })

    it('should set emailLengthVal to true when domain part exceeds 255 characters', () => {
      const longEmail = 'test@' + 'a'.repeat(256) + '.com'
      component.emailVerification(longEmail)
      expect(component.emailLengthVal).toBeTruthy()
    })

    it('should set emailLengthVal to false for valid email length', () => {
      component.emailVerification('test@test.com')
      expect(component.emailLengthVal).toBeFalsy()
    })
  })

  describe('createUser', () => {
    beforeEach(() => {
      component.contentForm = mockForm
    })

    it('should show error message when form is invalid', () => {
      mockForm.setErrors({ 'invalid': true })
      component.createUser()
      expect(mockSnackBar.openFromComponent).toHaveBeenCalled()
      expect(component.disableCreateButton).toBeTruthy()
    })

    it('should create user successfully', () => {
      mockForm.setErrors(null)
      mockContentService.createNewUserApi.mockReturnValue(of({ success: true }))

      component.createUser()

      expect(mockLoaderService.changeLoad.next).toHaveBeenCalledWith(true)
      expect(mockContentService.createNewUserApi).toHaveBeenCalled()
      expect(component.disableCreateButton).toBeFalsy()
    })

    it('should handle error when email already exists', () => {
      mockForm.setErrors(null)
      mockContentService.createNewUserApi.mockReturnValue(
        throwError({ error: { params: { errmsg: 'email already exists' } } })
      )

      component.createUser()

      expect(mockSnackBar.openFromComponent).toHaveBeenCalled()
    })
  })

  describe('updateUser', () => {
    beforeEach(() => {
      component.contentForm = mockForm
    })

    it('should show up-to-date message when roles haven\'t changed', async () => {
      component.userCompleteData = {
        organisations: [{ roles: ['ROLE_1'] }]
      }

      await component.updateuser()
      expect(mockSnackBar.openFromComponent).toHaveBeenCalled()
    })

    it('should call assignRoleToUser when roles have changed', async () => {
      component.userCompleteData = {
        organisations: [{ roles: ['ROLE_1'] }],
        userId: 'test-id'
      }
      mockForm.get('selectedRoles')?.setValue(['ROLE_2'])

      mockContentService.assignUserRoleApi.mockReturnValue(
        of({ params: { status: 'SUCCESS' } })
      )

      await component.updateuser()
      expect(mockContentService.assignUserRoleApi).toHaveBeenCalled()
    })
  })

  describe('numericOnly', () => {
    it('should return true for numeric input', () => {
      expect(component.numericOnly({ key: '5' })).toBeTruthy()
    })

    it('should return false for non-numeric input', () => {
      expect(component.numericOnly({ key: 'a' })).toBeFalsy()
    })
  })
})