import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash'
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar'
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { UserService } from '../user.service'
import { MatLegacyDialog } from '@angular/material/legacy-dialog'
import { ConfirmationDialogComponent } from '../../dialog-components/confirmation-dialog/confirmation-dialog.component'
import { DatePipe } from '@angular/common'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { forkJoin, Observable, of } from 'rxjs'

const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+([-a-zA-Z0-9]*[a-zA-Z0-9]+)?(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/

@Component({
  selector: 'ws-app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
  providers: [DatePipe]
})
export class UserUpdateComponent implements OnInit {
  //#region (variables)

  //#region (input output)
  @Input() userId: string | null = null
  @Output() updateEvent = new EventEmitter<string>()

  @ViewChild('rejectDialog')
  rejectDialog!: TemplateRef<any>
  @ViewChild('updaterejectDialog')
  updaterejectDialog!: TemplateRef<any>
  //#endregion (input output)

  userForm!: FormGroup
  otherDetailsForm!: FormGroup
  userDetails: any
  otherDetails: any
  userName = ''
  avatarUserName = ''
  rootOrgId = ''
  currentDesignation = ''
  designationStatus = ''
  designationApprovalField: any
  groupStatus = ''
  groupApprovalField: any
  actionList: any[] = []
  showCadreDetails = false
  comment = ''
  showeditText = false

  otherDetailsEditable = false;
  rolesList: {
    roleName: string,
    isSelected: boolean
  }[] = []
  uniqueRoles: any = []
  public userRoles: Set<string> = new Set()
  orguserRoles: string[] = []

  groupsList: any = []
  orgHasDesignations = false;
  designationsMeta: any[] = [];
  designationsTotalCount = 0
  designationSearchText = ''
  designationsOffset = 0
  filterDesignationsMeta: any = []
  isLoadingMoreDesignations = false;
  designationListLoadCount = 50
  orgTypeList: any = []
  categoryList = ['General', 'OBC', 'SC', 'ST']
  genderList = ['Male', 'Female', 'Others']
  selectedtagsList: string[] = []
  isMdoLeader = false
  today = new Date()
  separatorKeysCodes: number[] = [ENTER, COMMA]
  masterLanguages: Observable<any[]> | undefined
  masterLanguagesEntries: any

  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  emailRegix = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  pincodePattern = '(^[0-9]{6}$)'
  yearPattern = '(^[0-9]{4}$)'
  empIDPattern = `^[A-Za-z0-9]+$`
  namePatern = '^[a-zA-Z ]*$'

  noHtmlCharacter = new RegExp(/<[^>]*>|(function[^\s]+)|(javascript:[^\s]+)/i)
  htmlDetected = false

  //#endregion (variables)

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatLegacyDialog,
    private snackBar: MatLegacySnackBar,
    private datePipe: DatePipe,
    private configSvc: ConfigurationsService
  ) {
    this.initForm()
  }

  initForm() {
    this.userForm = this.fb.group({
      designation: ['', Validators.required],
      searchDesignation: [''],
      group: ['', Validators.required],
      assignMentor: [false],
      isMyUser: [true],
      roles: [[], Validators.required],
    })

    this.otherDetailsForm = this.fb.group({
      employeeId: ['', [Validators.pattern(this.empIDPattern)]],
      ehrmsID: [{ value: '', disabled: true }, []],
      dob: [''],
      primaryEmail: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      mobile: ['', [Validators.required, Validators.pattern(this.phoneNumberPattern)]],
      domicileMedium: [''],
      gender: [''],
      category: [''],
      pincode: [''],
      civilServiceType: [''],
      civilServiceName: [''],
      cadreName: [''],
      cadreBatch: [''],
      cadreControllingAuthorityName: [''],
      tags: ['', [Validators.pattern(this.namePatern)]],
    })

    this.valueChanges()
  }

  // #region (initialization)
  ngOnInit() {
    this.initialization()
  }

  async initialization() {
    this.mergeApiCalls()
    
    this.valueChanges()
  }

  mergeApiCalls() {
    if (!this.userId) return

    forkJoin({
      roles: this.userService.getAllRoles(),
      groups: this.userService.getGroups(),
      languages: this.userService.getMasterLanguages(),
      userDetails: this.userService.getUserById(this.userId)
    }).subscribe(
      ({ roles, groups, languages, userDetails }) => {
        // Handle roles
        const parseRoledata = JSON.parse(_.get(roles, 'result.response.value', ''))
        this.orgTypeList = parseRoledata.orgTypeList

        // Handle groups
        const res = _.get(groups, 'result.response', []).filter((ele: any) => ele !== 'Others')
        this.groupsList = res

        // Handle languages
        this.masterLanguagesEntries = languages ? languages.languages : []

        // Handle user details
        if (userDetails) {
          this.userDetails = userDetails
          this.getApprovalsStatus()
          this.rootOrgId = _.get(userDetails, 'rootOrgId', '')
          this.checkOrgHasDesignations()
          this.userRoles.clear()
          this.patchUserDetails(userDetails)
          this.mapRoles(userDetails)
        }
      },
      err => {
        this.openSnackbar('Failed to load user data. Please try again.')
      }
    )
  }

  //#region (get user details)
  getApprovalsStatus() {
    const formBody = {
      serviceName: 'profile',
      applicationStatus: 'SEND_FOR_APPROVAL',
      requestType: ['GROUP_CHANGE', 'DESIGNATION_CHANGE'],
      deptName: _.get(this.configSvc, 'unMappedUser.channel'),
      offset: 0,
      limit: 20,
      query: _.get(this.userDetails, 'firstName', ''),
      sortBy: {
        createdOn: 'desc',
      },
    }
    this.userService.getApprovalsList(formBody).subscribe((res: any) => {
      const currentUserInfo = _.get(res, 'result.data', []).filter((user: any) => _.get(user, 'userInfo.id') === this.userId)
      if(currentUserInfo && currentUserInfo.length > 0) {
        this.setApprovalsStatus(currentUserInfo[0].wfInfo, currentUserInfo[0].userInfo)
      }
    })
  }

  setApprovalsStatus(wfInfo: any, userInfo: any) {
    if(wfInfo && wfInfo.length > 0) {
      wfInfo.forEach((item: any) => {
        if(item.currentStatus === 'SEND_FOR_APPROVAL') {
          item['formatedUpdateFieldValues'] = JSON.parse(item.updateFieldValues)
          item['wid'] = _.get(userInfo, 'wid', '')
          if(item.requestType === 'DESIGNATION_CHANGE') {
            item['toValue'] = _.get(item, 'formatedUpdateFieldValues[0].toValue.designation', '')
            if(this.userForm.get('approveDesignation')) {
              this.userForm.get('approveDesignation').setValue(item['toValue'])
            } else {
              this.addControl(this.userForm, 'approveDesignation', item['toValue'], [Validators.required])
            }
            this.designationApprovalField = item
          } else if(item.requestType === 'GROUP_CHANGE') {
            item['toValue'] = _.get(item, 'formatedUpdateFieldValues[0].toValue.group', '')
            if(this.userForm.get('approveGroup')) {
              this.userForm.get('approveGroup').setValue(item['toValue'])
            } else {
              this.addControl(this.userForm, 'approveGroup', item['toValue'], [Validators.required])
            }
            this.groupApprovalField = item
          }
        }
      })
    }
  }

  addControl(group: FormGroup, controlName: string, value: any = '', validatorsList: any[] = []) {
    const controlExists = group ? group.get(controlName) : null;
  
    if (!controlExists) {
      // Add control if condition is true and control doesn't exist
      group.addControl(controlName, this.fb.control(value, validatorsList));
    }
  }

  patchUserDetails(user: any) {
    this.isMdoLeader = _.get(this.configSvc, 'unMappedUser.roles', []).includes('MDO_LEADER')
    this.userName = _.get(user, 'firstName', '')
    this.avatarUserName = this.getUseravatarName
    this.designationStatus = _.get(user, 'profileDetails.profileDesignationStatus', '')
    this.groupStatus = _.get(user, 'profileDetails.profileGroupStatus', '')
    this.selectedtagsList = _.get(user, 'profileDetails.additionalProperties.tag', [])
    const userRoles = _.get(user, 'organisations[0].roles', [])
    this.currentDesignation = _.get(user, 'profileDetails.professionalDetails[0].designation', '')
    this.userForm.patchValue({
      designation: this.currentDesignation,
      group: _.get(user, 'profileDetails.professionalDetails[0].group', ''),
      assignMentor: userRoles.some((role: string) => role.toLowerCase() === 'mentor'),
      isMyUser: _.get(user, 'profileDetails.profileStatus', '').toLowerCase() === 'not-my-user' ? false : true,
      roles: userRoles,
    })

    const formatedDob = this.getDateFromText(_.get(user, 'profileDetails.personalDetails.dob', ''))
    const genderMap: { [key: string]: string } = {
      female: 'Female',
      male: 'Male',
      others: 'Others',
    }
    const civilServiceName = _.get(user, 'profileDetails?.cadreDetails?.civilServiceName', '').trim()
    if (civilServiceName && (
      civilServiceName === 'Indian Administrative Service (IAS)' ||
      civilServiceName === 'Indian Police Service (IPS)' ||
      civilServiceName === 'Indian Foreign Service (IFS)')) {
      this.showCadreDetails = true
    }
    this.showCadreDetails = _.get(user, 'profileDetails?.cadreDetails?.cadreName', '') ? true : false

    const genderValue = _.get(user, 'profileDetails.personalDetails.gender', '')
    this.otherDetails = {
      employeeId: _.get(user, 'profileDetails.employmentDetails.employeeCode', ''),
      ehrmsID: _.get(user, 'profileDetails.additionalProperties.externalSystemId', '-'),
      dob: _.get(user, 'profileDetails.personalDetails.dob', ''),
      primaryEmail: _.get(user, 'profileDetails.personalDetails.primaryEmail', ''),
      mobile: _.get(user, 'profileDetails.personalDetails.mobile', ''),
      domicileMedium: _.get(user, 'profileDetails.personalDetails.domicileMedium', ''),
      gender: genderValue ? genderMap[genderValue.toLowerCase()] : '',
      category: _.get(user, 'profileDetails.personalDetails.category', ''),
      pincode: _.get(user, 'profileDetails.employmentDetails.pinCode', ''),
      externalSystemDor: _.get(user, 'additionalProperties.externalSystemDor', 'NA'),
      civilServiceType: _.get(user, 'profileDetails?.cadreDetails?.civilServiceType', ''),
      civilServiceName: _.get(user, 'profileDetails?.cadreDetails?.civilServiceName', '-'),
      cadreName: _.get(user, 'profileDetails?.cadreDetails?.cadreName', '-'),
      cadreBatch: _.get(user, 'profileDetails?.cadreDetails?.cadreBatch', ''),
      cadreControllingAuthorityName: _.get(user, 'profileDetails?.cadreDetails?.cadreControllingAuthorityName', ''),
    }
    this.otherDetailsForm.patchValue({
      employeeId: _.get(user, 'profileDetails.employmentDetails.employeeCode', ''),
      ehrmsID: _.get(user, 'profileDetails.additionalProperties.externalSystemId', ''),
      dob: formatedDob,
      primaryEmail: _.get(user, 'profileDetails.personalDetails.primaryEmail', ''),
      mobile: _.get(user, 'profileDetails.personalDetails.mobile', ''),
      domicileMedium: _.get(user, 'profileDetails.personalDetails.domicileMedium', ''),
      gender: genderValue ? genderMap[genderValue.toLowerCase()] : '',
      category: _.get(user, 'profileDetails.personalDetails.category', ''),
      pincode: _.get(user, 'profileDetails.employmentDetails.pinCode', ''),
      civilServiceType: _.get(user, 'profileDetails?.cadreDetails?.civilServiceType', ''),
      civilServiceName: _.get(user, 'profileDetails?.cadreDetails?.civilServiceName', '-'),
      cadreName: _.get(user, 'profileDetails?.cadreDetails?.cadreName', '-'),
      cadreBatch: _.get(user, 'profileDetails?.cadreDetails?.cadreBatch', ''),
      cadreControllingAuthorityName: _.get(user, 'profileDetails?.cadreDetails?.cadreControllingAuthorityName', ''),
    })
  }

  get getUseravatarName(): string {
    let name = ''
    if (_.get(this.userDetails, 'profileDetails.personalDetails', '')) {
      if (_.get(this.userDetails, 'profileDetails.personalDetails.firstname', '')) {
        name = `${_.get(this.userDetails, 'profileDetails.personalDetails.firstname', '')}`
      } else if (_.get(this.userDetails, 'profileDetails.personalDetails.firstName', '')) {
        name = `${_.get(this.userDetails, 'profileDetails.personalDetails.firstName', '')}`
      }
    } else {
      name = `${_.get(this.userDetails, 'firstName', '')}`
    }
    return name
  }

  private getDateFromText(dateString: string): any {
    if (dateString) {
      const sv: string[] = dateString.split('T')
      if (sv && sv.length > 1) {
        return sv[0]
      }
      const splitValues: string[] = dateString.split('-')
      const [dd, mm, yyyy] = splitValues
      const dateToBeConverted = dd.length !== 4 ? `${yyyy}-${mm}-${dd}` : `${dd}-${mm}-${yyyy}`
      return new Date(dateToBeConverted)
    }
    return ''
  }

  mapRoles(user: any) {
    if (this.orgTypeList && this.orgTypeList.length > 0) {
      this.uniqueRoles = []
      this.rolesList = []
      this.userRoles.clear()
      this.orguserRoles = []

      for (let i = 0; i < this.orgTypeList.length; i += 1) {
        if (this.orgTypeList[i].name === 'MDO') {
          _.each(this.orgTypeList[i].roles, rolesObject => {
            if (rolesObject !== 'MDO_LEADER') {
              this.uniqueRoles.push({
                roleName: rolesObject, description: rolesObject,
              })
            }
          })
        }
      }
      const usrRoles = _.get(user, 'organisations[0].roles', [])
      
      if (this.isMdoLeader) {
        // For MDO leaders, add all unique roles except MENTOR
        this.uniqueRoles.forEach((role: any) => {
          if (!this.rolesList.some((item: any) => item.roleName === role.roleName) && role.roleName !== 'MENTOR') {
            const roleDetails = {
              roleName: role.roleName,
              isSelected: usrRoles.includes(role.roleName),
            }
            this.rolesList.push(roleDetails)
          }
        })
      } else {
        // For non-MDO leaders, only add PUBLIC role if it exists
        const publicRole = this.uniqueRoles.find((role: any) => role.roleName === 'PUBLIC')
        if (publicRole && !this.rolesList.some((item: any) => item.roleName === 'PUBLIC')) {
          const roleDetails = {
            roleName: 'PUBLIC',
            isSelected: usrRoles.includes('PUBLIC'),
          }
          this.rolesList.push(roleDetails)
        }
      }
      if (usrRoles.length > 0) {
        setTimeout(() => {
          this.userForm.controls['roles'].setValue(usrRoles)
        }, 0)

        usrRoles.forEach((role: any) => {
          this.orguserRoles.push(role)
          this.userRoles.add(role)
        })
      }
    }
  }
  //#endregion (get user details)

  valueChanges() {
    const searchDesignationControl = this.userForm.get('searchDesignation')
    if (searchDesignationControl) {
      let settingValueChange = true
      searchDesignationControl.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(searchText => {
          this.designationsOffset = 0
          if (searchText && searchText.length > 1) {
            this.designationSearchText = searchText // to avoid api call with single character
            this.getdesignationsMeta()
          } else if (!searchText) {
            if (!settingValueChange) {
              this.designationSearchText = searchText
              this.getdesignationsMeta()
            }
            this.checkCurrentDesignationPresent()
          }
          settingValueChange = false
        })
    }

    const domicileMediumControl = this.otherDetailsForm.get('domicileMedium')
    if (domicileMediumControl) {
      domicileMediumControl.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          startWith(''),
          map((value: any) => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
          map((name: any) => name ? this.filterLanguage(name) : (this.masterLanguagesEntries ? this.masterLanguagesEntries.slice() : [])),
        )
        .subscribe(res => {
          this.masterLanguages = of(res)
        })
    }
  }

  filterLanguage(name: string) {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.masterLanguagesEntries ? this.masterLanguagesEntries.filter((option: any) => option.name.toLowerCase().includes(filterValue)) : []
    }
    return this.masterLanguagesEntries
  }

  checkOrgHasDesignations(): void {
    if (!this.rootOrgId) {
      this.orgHasDesignations = false
    }
    const igotDesignationBody: any = {
      request: {
        filters: {
          status: 'Live',
          category: 'designation',
          categories: [
            this.rootOrgId + '_odcs_designation'
          ],
          objectType: 'Term',
        },
        fields: ['name'],
        offset: 0,
        limit: 1,
        sort_by: {
          lastUpdatedOn: 'desc',
          objectType: 'Term',
        },
        facets: [],
      },
    }
    this.userService.searchIgotDesignation(igotDesignationBody).subscribe({
      next: (res: any) => {
        const count = _.get(res, 'result.count', 0)
        this.orgHasDesignations = count > 0
        this.getdesignationsMeta()
      },
      error: () => {
        this.orgHasDesignations = false
        this.getdesignationsMeta()
      }
    })
  }

  //#region (get designations)
  getdesignationsMeta() {
    this.isLoadingMoreDesignations = true
    if (this.orgHasDesignations) {
      this.getIgotDesignations()
    } else {
      this.getDefaultDesignations()
    }
  }

  getIgotDesignations() {
    const igotDesignationBody: any = {
      request: {
        filters: {
          status: 'Live',
          category: 'designation',
          categories: [
            this.rootOrgId + '_odcs_designation'
          ],
          objectType: 'Term',
        },
        fields: ['name'],
        offset: this.designationsOffset,
        limit: this.designationListLoadCount,
        sort_by: {
          lastUpdatedOn: 'desc',
          objectType: 'Term',
        },
        facets: [],
      },
    }
    if (this.designationSearchText) {
      igotDesignationBody['request']['query'] = this.designationSearchText
    }
    this.userService.searchIgotDesignation(igotDesignationBody).subscribe({
      next: (res: any) => {
        const igotData = _.get(res, 'result.Term', [])
        const data = igotData.map((item: any) => ({ designation: item.name, status: 'Active' }))
        const totalCount = _.get(res, 'result.count', igotData.length)
        this.setDesignationResults(data, totalCount)
      },
      error: () => {
        this.isLoadingMoreDesignations = false
        this.openSnackbar('Something went wrong. Please refresh or try again later.')
      },
    })
  }

  getDefaultDesignations() {
    const requestBody: any = {
      filterCriteriaMap: {
        status: 'Active'
      },
      requestedFields: [],
      pageNumber: this.designationsOffset,
      pageSize: this.designationListLoadCount
    }
    if (this.designationSearchText) {
      requestBody['searchString'] = this.designationSearchText
    }
    this.userService.searchDesignation(requestBody).subscribe({
      next: (res: any) => {
        const data = _.get(res, 'result.result.data', [])
        const totalCount = _.get(res, 'result.result.totalCount', 0)
        this.setDesignationResults(data, totalCount)
      },
      error: () => {
        this.isLoadingMoreDesignations = false
        this.openSnackbar('Something went wrong. Please refresh or try again later.')
      }
    })
  }

  setDesignationResults(data: any[], totalCount: number) {
    if (this.designationsOffset === 0) {
      this.designationsMeta = data
    } else {
      this.designationsMeta = [...this.designationsMeta, ...data]
    }
    this.designationsTotalCount = totalCount
    this.isLoadingMoreDesignations = false
    this.checkCurrentDesignationPresent()
  }

  setupScrollListener(opened: boolean): void {
    const searchDesignationControl = this.userForm.get('searchDesignation')
    if (opened && searchDesignationControl) {
      searchDesignationControl.setValue('')
      this.designationsOffset = 0
      this.getdesignationsMeta()
      const searchInput = document.querySelector('.search-input') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
      this.checkCurrentDesignationPresent()
      const panel = document.querySelector('.mat-select-panel')
      if (panel) {
        // Add scroll event listener to the panel
        panel.addEventListener('scroll', this.onDesignationSelectScroll.bind(this))
      }
    }
  }

  onDesignationSelectScroll(event: any): void {
    const element = event.target
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5) {
      // Only load more if not already loading and if there are potentially more items
      if (!this.isLoadingMoreDesignations && this.designationsMeta.length < this.designationsTotalCount) {
        this.isLoadingMoreDesignations = true
        this.designationsOffset += 1
        this.getdesignationsMeta()
      }
    }
  }

  checkCurrentDesignationPresent() {
    // Get the current designation value
    const searchDesignationControl = this.userForm.get('designation')
    const currentDesignation = searchDesignationControl ? searchDesignationControl.value : ''
    // Check if current designation exists in the list
    if (currentDesignation) {
      const designationExists = this.designationsMeta.some(
        (designation: any) => designation.designation.toLowerCase() === currentDesignation.toLowerCase()
      )

      // If designation doesn't exist in the list, add it
      if (!designationExists) {
        // Create a new designation object to match the structure of other items
        const newDesignation = {
          designation: currentDesignation,
          status: 'Active'
        }
        this.designationsMeta.unshift(newDesignation)
      }
    }
  }

  onDesignationDropdownClosed(): void {
    const searchDesignationControl = this.userForm.get('searchDesignation')
    if (searchDesignationControl) {
      searchDesignationControl.setValue('')
      this.designationSearchText = ''
    }
    this.checkCurrentDesignationPresent()
  }

  //#endregion (get designations)

  //#endregion (initialization)

  //#region (UI interactions)
  modifyUserRoles(role: string) {
    if (this.userRoles.has(role)) {
      this.userRoles.delete(role)
    } else {
      this.userRoles.add(role)
    }
  }

  editOtherDetails() {
    this.otherDetailsEditable = true
  }

  addActivity(event: any) {
    const input = event.input
    const value = event.value as string
    if ((value && value.trim())) {
      this.selectedtagsList.push(value)
    }
    if (input) {
      input.value = ''
    }
    if (this.otherDetailsForm.get('tags')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.otherDetailsForm.get('tags')!.setValue(null)
    }
    this.otherDetailsForm!.controls['tags']!.reset()
  }

  removeActivity(index: number) {
    if (index >= 0) {
      this.selectedtagsList.splice(index, 1)
    }
  }

  cancel() {
    this.updateEvent.emit('cancel')
  }

  onAssignMentorChange(isMentor: boolean) {
    if(isMentor) {
      if (this.userForm.get('roles')) {
        const userRoles = this.userForm.get('roles')?.value || [];
        if (!userRoles.includes('MENTOR')) {
          this.userForm.get('roles')?.setValue([...userRoles, 'MENTOR']);
          this.userRoles.add('MENTOR');
        }
      }
    } else {
      if (this.userForm.get('roles')) {
        const userRoles = this.userForm.get('roles').value || [];
        this.userForm.get('roles').setValue(userRoles.filter((r: string) => r !== 'MENTOR'));
        this.userRoles.delete('MENTOR');
      }
    }
  }

  onIsMyUserChange(isMyUser: boolean) {
    if (isMyUser) {
      this.confirmUpdate('VERIFIED')
    } else {
      this.confirmUpdate('NOT-MY-USER')
    }
  }

  confirmUpdate(popuType: string = 'updateDetails') {
    if ((this.userForm.valid && (!this.otherDetailsEditable || this.otherDetailsForm.valid)) || popuType !== 'updateDetails') {
      const dialogData: any = {
        iconName: 'error_outline',
        type: 'warning',
        buttonsPositionClass: 'justify-center items-center',
        buttons: [
          {
            classes: 'btn-out-line',
            text: 'No',
            response: false
          },
          {
            classes: 'succes-button',
            text: 'Yes',
            response: true
          }
        ]
      }
      switch (popuType) {
        case 'updateDetails':
          dialogData.planeDescription = 'Are you sure you want to update?'
          break;
        case 'VERIFIED':
          dialogData.planeDescription = 'Are you sure you want to update?'
          break;
        case 'NOT-MY-USER':
          dialogData.planeDescription = 'Are you sure you want to update?'
          dialogData.description = 'You are about to remove this user from your organization. The user will lose all learning access and be moved out of your organization in 48 hours unless you reverse the action from the "Not My Users" tab.'
          break;
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: dialogData,
        width: '500px',
        disableClose: true,
        autoFocus: false
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (popuType === 'updateDetails') {
            this.updateProfile()
          } else {
            this.markStatus(popuType)
          }
        } else {
          switch (popuType) {
            case 'updateDetails':
              this.cancel()
              break;
            case 'VERIFIED':
              if (this.userForm.get('isMyUser')) {
                this.userForm.get('isMyUser').setValue(false)
              }
              break;
            case 'NOT-MY-USER':
              if (this.userForm.get('isMyUser')) {
                this.userForm.get('isMyUser').setValue(true)
              }
              break;
          }
        }
      })
    } else {
      this.userForm.markAllAsTouched()
      this.otherDetailsForm.markAllAsTouched()
    }
  }

  markStatus(status: any) {
    const reqbody = {
      request: {
        userId: this.userId,
        profileDetails: {
          profileStatus: status,
        },
      },
    }

    this.userService.updateUserDetails(reqbody).subscribe(dres => {
      if (dres) {
        this.openSnackbar('User status updated Successfully')
      }
    })
  }

  updateProfile() {
    const dobn = this.datePipe.transform(this.otherDetailsForm.controls['dob'].value, 'dd-MM-yyyy')
    const otherDetailsValues = this.otherDetailsForm.value
    const userFormValues = this.userForm.value
    const reqbody = {
      request: {
        userId: this.userId,
        profileDetails: {
          personalDetails: {
            dob: dobn ? dobn : '',
            domicileMedium: _.get(otherDetailsValues, 'domicileMedium', ''),
            gender: _.get(otherDetailsValues, 'gender', ''),
            category: _.get(otherDetailsValues, 'category', ''),
            mobile: _.get(otherDetailsValues, 'mobile', ''),
            primaryEmail: _.get(otherDetailsValues, 'primaryEmail', ''),
          },
          professionalDetails: [
            {
              designation: _.get(userFormValues, 'designation', ''),
              group: _.get(userFormValues, 'group', ''),
            },
          ],
          additionalProperties: {
            tag: this.selectedtagsList,
          },
          employmentDetails: {
            pinCode: _.get(otherDetailsValues, 'pincode', ''),
            employeeCode: _.get(otherDetailsValues, 'employeeId', ''),
          },
        },
      },
    }
    this.userService.updateUserDetails(reqbody).subscribe(dres => {
      if (dres) {
        if (this.isMdoLeader) {
          if (userFormValues.roles !== this.orguserRoles) {
            const dreq = {
              request: {
                organisationId: _.get(this.userDetails, 'rootOrgId', ''),
                userId: this.userId,
                roles: Array.from(this.userRoles),
              },
            }
            this.userService.addUserToRole(dreq).subscribe(res => {
              if (res) {
                this.openSnackbar('User updated Successfully, updated data will be reflecting in sometime.')
                this.updateEvent.emit('updated')
              }
            })
          } else {
            this.openSnackbar('Select new roles')
          }
        }
        else {
          this.updateEvent.emit('updated')
          this.openSnackbar('User updated Successfully, updated data will be reflecting in sometime.')
        }
      }
    })
  }

  onClickHandleWorkflow(action: string, field: string) {
    let fieldDetails: any
    if (field === 'designation') {
      fieldDetails = this.designationApprovalField
    } else if (field === 'group') {
      fieldDetails = this.groupApprovalField
    }
    fieldDetails['action'] = action
    if (fieldDetails) {
      const req = {
        action,
        comment: '',
        state: 'SEND_FOR_APPROVAL',
        userId: fieldDetails.userId,
        applicationId: fieldDetails.applicationId,
        actorUserId: fieldDetails.wid,
        wfId: fieldDetails.wfId,
        deptName: fieldDetails.deptName || '',
        serviceName: 'profile',
        updateFieldValues: JSON.parse(fieldDetails.updateFieldValues),
      }
      if (action === 'APPROVE') {
        const index = this.actionList.findIndex((x: any) => x.wfId === req.wfId)
        if (index > -1) {
          this.actionList[index] = req
        } else {
          this.actionList.push(req)
        }
      } else {
        this.comment = ''
        const dialogRef = this.dialog.open(this.rejectDialog, {
          width: '770px',
          minHeight: '260px'
        })
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            req.comment = this.comment
            fieldDetails['comment'] = this.comment
            const index = this.actionList.findIndex((x: any) => x.wfId === req.wfId)
            if (index > -1) {
              this.actionList[index] = req
            } else {
              this.actionList.push(req)
            }
          } else {
            dialogRef.close()
          }
        })
      }
    }
  }

  updateRejection(field: any) {
    this.comment = field.comment
    const dialogRef = this.dialog.open(this.updaterejectDialog, {
      width: '770px',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionList.forEach((req: any) => {
          if (req.wfId === field.wfId) {
            req.comment = this.comment
            field.comment = this.comment
            this.showeditText = false
          }
        })
      } else {
        dialogRef.close()
      }
    })
  }

  validateText(text: any) {
    const regexMatch = text.match(this.noHtmlCharacter)
    if (regexMatch) {
      this.htmlDetected = true
      this.snackBar.open('HTML or Js is not allowed')
    } else {
      this.htmlDetected = false
    }
  }

  numericOnly(event: any): boolean {
    const pattren = /^([0-9])$/
    const result = pattren.test(event.key)
    return result
  }

  showedit() {
    this.showeditText = true
  }

  get showApprovalButtons() : boolean {
    if(this.designationApprovalField && !(this.actionList && this.actionList.findIndex(x => x.wfId === this.designationApprovalField.wfId) > -1)) {
      return false
    } else if(this.groupApprovalField && !(this.actionList && this.actionList.findIndex(x => x.wfId === this.groupApprovalField.wfId) > -1)) {
      return false
    }
    return true
  }

  updateApprovals() {
    if (this.actionList.length > 0) {
      const request: any = {
        request: this.actionList
      }
      this.userService.handleWorkflowV2(request).subscribe((res: any) => {
        if (res.result.data) {
          this.designationApprovalField = null
          this.groupApprovalField = null
          this.getUserDetails()
          this.openSnackbar('Request has been updated')
        }
      })
    }
  }

  getUserDetails() {
    this.userService.getUserById(this.userId).subscribe((res: any) => {
      if (res) {
        this.currentDesignation = _.get(res, 'profileDetails.professionalDetails[0].designation', '')
        this.userForm.patchValue({
          designation: this.currentDesignation,
          group: _.get(res, 'profileDetails.professionalDetails[0].group', ''),
        })
        this.getApprovalsStatus()
      }
    })
  }
  //#endregion (UI interactions)

  openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
