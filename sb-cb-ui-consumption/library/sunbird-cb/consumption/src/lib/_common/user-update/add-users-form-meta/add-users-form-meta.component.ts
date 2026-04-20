
import { Component, OnDestroy, OnInit, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef, Input, ChangeDetectorRef, Inject } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

/* tslint:disable */
import * as _ from 'lodash'
import { NOTIFICATION_TIME, NSApiRequest, preventHtmlAndJs } from '../user.model'
import { NotificationComponent } from '../../notification/notification/notification.component'
import { Notify } from '../../notification/notificationMessage'
import { UserService } from '../user.service'
/* tslint:enable */

@Component({
  selector: 'ws-auth-add-users-form-meta',
  templateUrl: './add-users-form-meta.component.html',
  styleUrls: ['./add-users-form-meta.component.scss'],
})
export class AddUsersFormMetaComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('roles') roles!: ElementRef

  @Output() updateEvent = new EventEmitter<string>()
  @Input() userId!: string

  contentForm!: UntypedFormGroup
  listOfRoles: any[] = []
  userCompleteData!: any
  emailLengthVal = false
  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  disableCreateButton = false
  environment!: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private configSvc: ConfigurationsService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    @Inject("environment") private environmentConfig: any
  ) {
    this.environment = environmentConfig;
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges()
  }

  ngOnInit() {
    this.listOfRoles = this.environment.portalRoles
    this.listOfRoles = this.listOfRoles.filter((r: any) => (r !== 'SPV_PUBLISHER'))
    this.assignValues(this.userId)
  }

  async assignValues(userId: string) {
    this.createFormContent()
    // this.loadService.changeLoad.next(true)
    const getUserData = await this.userService.getUserById(userId).toPromise().catch(_error => { })
    if (getUserData) {
      this.userCompleteData = getUserData
      let userRoles: any = []
      getUserData.organisations.forEach((orgEle: any) => {
        userRoles = (orgEle.roles) ? orgEle.roles : []
      })
      this.contentForm.setValue({
        firstName: getUserData.firstName,
        channel: getUserData.channel,
        channelId: getUserData.channel,
        // lastName: getUserData.lastName,
        email: getUserData.maskedEmail,
        mobileNumber: getUserData.phone,
        selectedRoles: userRoles,
      })
      // this.loadService.changeLoad.next(false)
    } else {
      // this.loadService.changeLoad.next(false)
      this.showToastMessage('fail')
    }
  }

  createFormContent() {
    this.contentForm = this.formBuilder.group({
      firstName: ['', [Validators.required, preventHtmlAndJs()]],
      email: ['', [Validators.required, Validators.email]],
      channel: [(this.configSvc.userProfile) ? this.configSvc.userProfile.departmentName : '', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.maxLength(12)]],
      channelId: _.get(this.configSvc, 'unMappedUser.rootOrg.channel', ''),
      selectedRoles: ['', Validators.required],
    })
    // tslint:disable-next-line: no-non-null-assertion
    this.contentForm.get('mobileNumber')!.valueChanges.subscribe(ctrl => {
      if (ctrl !== '') {
        // tslint:disable-next-line: no-non-null-assertion
        this.contentForm.get('mobileNumber')!.setValidators([Validators.pattern(this.phoneNumberPattern)])
      } else {
        // tslint:disable-next-line: no-non-null-assertion
        this.contentForm.get('mobileNumber')!.clearValidators()
      }
    })
  }

  actionBtn() {
    this.updateEvent.emit('cancel')
  }

  updateuser() {
    // this.loadService.changeLoad.next(true)
    let userDataRoles: any = []
    let selectedRoles: any[] = this.contentForm.controls['selectedRoles'].value
    this.userCompleteData.organisations.forEach((orgEle: any) => {
      userDataRoles = (orgEle.roles) ? orgEle.roles : []
    })
    if (userDataRoles.includes('PUBLIC')) {
      selectedRoles = [...selectedRoles, 'PUBLIC']
    }
    selectedRoles = Array.from(new Set(selectedRoles))
    let flag = false
    selectedRoles.forEach((element: any) => {
      if (userDataRoles.includes(element)) {
        flag = true
      } else {
        flag = false
      }
    })
    if (flag && selectedRoles.length === userDataRoles.length) {
      this.showToastMessage('upToDate')
      // this.loadService.changeLoad.next(false)
    } else {
      this.assignRoleToUser(this.userCompleteData.userId, selectedRoles)
    }
  }

  async assignRoleToUser(id: string, selectedRoles: any) {
    const requestPayload: NSApiRequest.IAssignUserRoles = {
      request: {
        organisationId: (this.configSvc.userProfile) ? this.configSvc.userProfile.rootOrgId : '',
        userId: id,
        roles: selectedRoles,
      },
    }
    const assignUserRoleRes = await this.userService.addUserToRole(requestPayload).toPromise().catch(_error => { })
    if (assignUserRoleRes && assignUserRoleRes.params && assignUserRoleRes.params.status.toLowerCase() === 'success') {
      // this.loadService.changeLoad.next(false)
      this.showToastMessage('success')
      this.updateEvent.emit('updated')
    } else {
      // this.loadService.changeLoad.next(false)
      this.showToastMessage('fail')
    }
  }

  showToastMessage(type: string) {
    switch (type) {
      case 'fail':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.SAVE_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'success':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.SAVE_SUCCESS,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'requriedFieldsMissing':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.REQURIED_FIELDS_MISSING,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'upToDate':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.UP_TO_DATE,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'emailAlreadyExist':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.EMAIL_EXIST,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'mobileAlreadyExist':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.MOBILE_EXIST,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
    }
  }

}
