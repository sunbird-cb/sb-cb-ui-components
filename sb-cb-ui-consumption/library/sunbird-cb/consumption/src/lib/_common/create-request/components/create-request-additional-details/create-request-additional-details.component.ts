import { Component, Input, OnInit, Inject } from '@angular/core'
import { UntypedFormGroup, FormControl, Validators, UntypedFormControl } from '@angular/forms'
import { MatLegacyDialog } from '@angular/material/legacy-dialog'
import * as _ from 'lodash'
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators'
import { CreateRequestService } from '../../services/create-request.service'
import { AddAuthorsComponent } from '../../dialogs/add-authors/add-authors.component'
import { CompetencyPassbookService } from '../../../competency-passbook/competency-passbook.service'

type Auther = {
  name: string,
  number: string,
  email: string,
}

@Component({
  selector: 'sb-uic-create-request-additional-details',
  templateUrl: './create-request-additional-details.component.html',
  styleUrls: ['./create-request-additional-details.component.scss',
    '../../../../styles/round-controls.scss'
  ]
})
export class CreateRequestAdditionalDetailsComponent implements OnInit {
  //#region (global variable declaration)
  @Input() additionalDetailsForm!: UntypedFormGroup
  @Input() viewMode: string = ''
  @Input() demandId: string | null = null

  languagesList: any[] = []
  filteredLanguages: any[] = []
  searchText: string = ''
  addedAuthersList: Auther[] = []
  requestTypeList = [
    { type: 'Single', description: 'Request raised for a specific individual course requirement or a focused learning need.' },
    { type: 'Broadcast', description: 'Request raised for multiple stakeholders or departments to meet common learning requirements at scale.' }
  ]
  yesNoOptions = [
    { displayName: 'Yes', value: true },
    { displayName: 'No', value: false }
  ]
  filteredAssigneeType: any[] = []
  filteredRequestType: any[] = []
  countOfVisibleProviders: number = 0
  requestTypeData: any[] = []
  requestObjData: any
  environment!: any
  // competencies
  allCompetencies: any[] = []
  filteredallCompetencies: any[] = []
  allCompetencyTheme: any[] = []
  filteredallCompetencyTheme: any[] = []
  allCompetencySubtheme: any[] = []
  filteredallCompetencySubtheme: any[] = []
  enableCompetencyAdd = false
  seletedCompetencyArea: any
  seletedCompetencyTheme: any
  seletedCompetencySubTheme: any
  queryThemeControl = new UntypedFormControl('')
  querySubThemeControl = new UntypedFormControl('')
  isTableExpanded = true
  listView = true
  allThemeData: any
  allSubThemeData: any
  //#endregion (global variable declaration)



  constructor(
    private dialog: MatLegacyDialog,
    private createRequestSvc: CreateRequestService,
    private competencySvc: CompetencyPassbookService,
    @Inject('environment') environment: any,
  ) {
    this.environment = environment
  }

  ngOnInit(): void {
    this.initialization()
  }

  initialization() {
    this.additionalDetailsForm.addControl('searchLanguage', new FormControl(''))
    this.getLanguagesList()
    this.getRequestTypeList()
    this.valueChangeFunctions()
    const autherControl = this.getControl('authors')
    if (autherControl && autherControl.value && autherControl.value.length > 0) {
      this.addedAuthersList = autherControl.value
    }
    this.initializeCompetenciesSection()
  }

  getLanguagesList(): void {
    const req = {
      request: {
        type: "cbp-portal",
        subType: "cbp-v1",
        action: "cbp-configuration",
        component: "cbp",
        rootOrgId: "*"
      }
    }
    this.createRequestSvc.getLanguages(req).subscribe((res: any) => {
      this.languagesList = _.get(res, 'result.form.data.languages', [])
      this.filteredLanguages = [...this.languagesList]
      if (this.demandId) {
        const courseLanguageControl = this.getControl('courseLanguage')
        if (courseLanguageControl && courseLanguageControl.value && courseLanguageControl.value.length > 0) {
          const selectedLanguages = this.languagesList.filter((lang: any) => courseLanguageControl.value.some((cl: any) => cl === lang.value))
          courseLanguageControl.setValue(selectedLanguages)
          courseLanguageControl.updateValueAndValidity()
        }
      }
    })
  }

  getRequestTypeList() {
    const requestObj = {
      request: {
        filters: {
          isCbp: true,
        },
        limit: 1000,
      },
    }
    this.createRequestSvc.getRequestTypeList(requestObj).subscribe(data => {
      this.requestTypeData = data
      this.filteredRequestType = [...this.requestTypeData]
      this.filteredAssigneeType = [...this.requestTypeData]
      this.countOfVisibleProviders = this.filteredRequestType.length
      if (this.demandId) {
        const providersControl = this.getControl('providers')
        const assigneeControl = this.getControl('assignee')
        if (providersControl && providersControl.value && providersControl.value.length > 0) {
          const selcetdProvidersList = this.requestTypeData.filter((provider: any) => providersControl.value.some((p: any) => p.providerId === provider.id))
          providersControl.setValue(selcetdProvidersList)
          providersControl.updateValueAndValidity()
        }
        if (assigneeControl && assigneeControl.value && assigneeControl.value.providerId) {
          const selcetdAssignee = this.requestTypeData.filter((assignee: any) => assigneeControl.value.providerId === assignee.id)
          assigneeControl.setValue(selcetdAssignee ? selcetdAssignee[0] : null)
          assigneeControl.updateValueAndValidity()
        }
        // if (this.viewMode.toLocaleLowerCase() === 'reassign') {
        //   this.additionalDetailsForm.controls['assigneeText'].enable()
        //   this.additionalDetailsForm.controls['assignee'].enable()
        // }
      }

    })
  }

  valueChangeFunctions() {
    const assigneeTextControl = this.getControl('assigneeText')
    const providerTextControl = this.getControl('providerText')
    if (assigneeTextControl) {
      assigneeTextControl.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((newValue: any) => {
        this.filteredAssigneeType = this.filterOrgValues(newValue, this.requestTypeData)
      })
    }

    if (providerTextControl) {
      providerTextControl.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((newValue: any) => {
        this.filteredRequestType = this.getHiddenOptions(newValue, this.requestTypeData)
      })
    }
  }

  filterOrgValues(searchValue: string, array: any) {
    return array.filter((value: any) =>
      value.orgName.toLowerCase().includes(searchValue.toLowerCase()))
  }

  getHiddenOptions(searchValue: string, array: any) {
    const hiddenOptions: any = []
    let countOfVisibleProviders = 0
    array.forEach((element: any) => {
      if (element.orgName.toLowerCase().includes(searchValue.toLowerCase())) {
        element['hideOption'] = 'show'
        countOfVisibleProviders += 1
      } else {
        element['hideOption'] = 'hide'
      }
      hiddenOptions.push(element)
    })
    this.countOfVisibleProviders = countOfVisibleProviders
    return hiddenOptions
  }

  clearSearch() {
    this.getControl('searchLanguage')?.setValue('')
    this.filteredLanguages = [...this.languagesList]
  }

  onSearchChange(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredLanguages = this.languagesList.filter(lang =>
      lang.name.toLowerCase().includes(searchValue)
    )
  }

  getFilteredLanguagesWithSelected(): any[] {
    const selectedLanguages = this.getControl('courseLanguage')?.value || []

    // Create a unique list combining filtered languages and selected languages
    const uniqueLanguages = new Map()

    // Add filtered languages
    this.filteredLanguages.forEach(lang => {
      uniqueLanguages.set(lang.value || lang.name, lang)
    })

    // Add selected languages (even if they don't match the current filter)
    selectedLanguages.forEach((selectedLang: any) => {
      if (selectedLang && (selectedLang.value || selectedLang.name)) {
        uniqueLanguages.set(selectedLang.value || selectedLang.name, selectedLang)
      }
    })

    // Convert back to array and sort by name
    return Array.from(uniqueLanguages.values()).sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    )
  }

  onLanguageRemoved(languageValue: { displayName: string; value: string }): void {
    const control = this.getControl('courseLanguage')
    if (control) {
      const currentValues = Array.isArray(control.value) ? [...control.value] : []
      control.setValue(currentValues.filter((val: { displayName: string; value: string }) => val.value !== languageValue.value))
    }

  }

  onDropdownToggle(isOpen: boolean): void {
    if (isOpen) {
      this.getControl('searchLanguage')?.setValue('')
      this.filteredLanguages = [...this.languagesList]
    }
  }

  compareByValue(v1: any, v2: any): boolean {
    // Comparison function for mat-select with object values
    if (typeof v1 === 'string' && typeof v2 === 'string') {
      return v1 === v2
    }
    return v1 && v2 ? v1.value === v2.value : v1 === v2
  }

  onAvailableWithMDOChange(event: any): void {
    const selectedValue = event.value
    if (selectedValue === true) {
      this.openAddAuthorDialog()
      const authorsControl = this.getControl('authors')
      if (authorsControl) {
        authorsControl.setValidators([Validators.required])
        authorsControl.updateValueAndValidity()
      }
    } else {
      this.addedAuthersList = []
      this.resetControlAndClearValidators('authors')
    }
  }

  openAddAuthorDialog(): void {
    const dialogRef = this.dialog.open(AddAuthorsComponent, {
      maxHeight: '90vh',
      width: '400px',
      maxWidth: '90%',
      disableClose: true
    })

    dialogRef.afterClosed().subscribe((result: Auther | undefined) => {
      const authorsControl = this.getControl('authors')
      if (result) {
        this.addedAuthersList.push(result)
        if (authorsControl) {
          authorsControl.setValue(this.addedAuthersList)
          authorsControl.updateValueAndValidity()
        }
      }
      authorsControl?.markAsDirty()
      authorsControl?.markAsTouched()
    })
  }

  removeAuthor(index: number): void {
    if (this.addedAuthersList && this.addedAuthersList.length > 1) {
      this.addedAuthersList.splice(index, 1)
      const authorsControl = this.getControl('authors')
      if (authorsControl) {
        authorsControl.setValue(this.addedAuthersList)
        authorsControl.updateValueAndValidity()
      }
    }
  }

  controlValidationStatus(controlName: string, errorType: string): boolean {
    const control = this.getControl(controlName)
    if (!control) {
      return false
    }
    return control.touched && control.hasError(errorType)
  }

  onRequiredFromKBChange(event: any): void {
    this.resetControlAndClearValidators('providers')
    this.resetControlAndClearValidators('assignee')
    this.resetControlAndClearValidators('requestType')
    if (event.value === false) {
      const requestTypeControl = this.getControl('requestType')
      if (requestTypeControl) {
        requestTypeControl.setValidators([Validators.required])
        requestTypeControl.updateValueAndValidity()
      }
    } else {
      const requestTypeControl = this.getControl('requestType')
      if (requestTypeControl) {
        requestTypeControl.setValue('Single')
        requestTypeControl.updateValueAndValidity()
      }
      const karmayogiBharathId = _.get(this.environment, 'spvorgID', '')
      const karmayogiBharathObj = this.requestTypeData.find((org: any) => org.orgId === karmayogiBharathId)
      const assigneeControl = this.getControl('assignee')
      if (assigneeControl && karmayogiBharathId) {
        if (karmayogiBharathObj) {
          assigneeControl.setValue(karmayogiBharathObj)
          assigneeControl.updateValueAndValidity()
        } else {
          assigneeControl.setValue({
            orgName: 'Karmayogi Bharat',
            id: karmayogiBharathId,
          })
          assigneeControl.updateValueAndValidity()
        }
      }
    }

  }

  selectRequestType(item: any) {
    this.resetControlAndClearValidators('assignee')
    this.resetControlAndClearValidators('providers')
    if (item === 'Single') {
      const assigneeControl = this.getControl('assignee')
      if (assigneeControl) {
        assigneeControl.setValidators([Validators.required])
        assigneeControl.updateValueAndValidity()
      }
    } else if (item === 'Broadcast') {
      const providersControl = this.getControl('providers')
      if (providersControl) {
        providersControl.setValidators([Validators.required])
        providersControl.updateValueAndValidity()
      }
    }

  }

  getControl(controlName: string): FormControl {
    return this.additionalDetailsForm.get(controlName) as FormControl
  }

  resetControlAndClearValidators(controlName: string) {
    const control = this.getControl(controlName)
    if (control) {
      control.reset()
      control.clearValidators()
      control.updateValueAndValidity()
    }
  }

  providersOpenedChange(e: any, searchControl: any) {
    this.getControl(searchControl).patchValue('')
    if (e === true) {
    }
  }

  onProviderRemoved(provider: any) {
    const compThemeControl = this.getControl('providers') as UntypedFormControl | null
    if (compThemeControl) {
      const themes = compThemeControl.value
      if (themes) {
        const index = themes.indexOf(provider)
        if (index >= 0) {
          themes.splice(index, 1)
          compThemeControl.setValue(themes)
        }
      }
    }
  }

  clearProviderSearch(event: any, searchControl: any) {
    event.stopPropagation()
    this.additionalDetailsForm.controls[searchControl].patchValue('')
  }

  isOptionDisabled(option: any): boolean {
    const control = this.getControl('providers')
    if (control && control.value) {
      const selectedProviders = control.value
      return selectedProviders.length >= 5 && !selectedProviders.includes(option)
    }
    return false
  }

  // region: competencies UI helpers

  get competenciesValue(): any[] {
    const control = this.additionalDetailsForm?.get('competencies_v6') as UntypedFormControl | null
    return (control && control.value) || []
  }

  initializeCompetenciesSection() {
    if (!this.additionalDetailsForm.get('competencies_v6')) {
      this.additionalDetailsForm.addControl('competencies_v6', new UntypedFormControl([]))
    }

    this.loadCompetencyMaster()

    this.queryThemeControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(value => {
        this.filteredallCompetencyTheme = this.filterValues(value || '', this.allCompetencyTheme)
      })

    this.querySubThemeControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(value => {
        this.filteredallCompetencySubtheme = this.filterValues(value || '', this.allCompetencySubtheme)
      })
  }

  loadCompetencyMaster() {
    this.competencySvc.fetchCompetencyV6().subscribe(response => {
      if (response && response.params && response.params.status && response.params.status.toLowerCase() === 'successful') {
        this.allCompetencies = response.result.framework.categories.filter((v: any) => v.code === 'competencyarea')[0].terms
        this.allThemeData = response.result.framework.categories.filter((v: any) => v.code === 'theme')[0].terms
        this.allSubThemeData = response.result.framework.categories.filter((v: any) => v.code === 'subtheme')[0].terms
        this.filteredallCompetencies = this.allCompetencies
      } else {
        this.allCompetencies = []
        this.filteredallCompetencies = []
      }
    })
  }

  filterValues(searchValue: string, array: any[]) {
    if (!searchValue) {
      return array
    }
    const lower = searchValue.toLowerCase()
    return array.filter((value: any) =>
      (value.name || '').toLowerCase().includes(lower),
    )
  }

  compAreaSelected(option: any) {
    this.resetCompSubfields()
    this.allCompetencies.forEach((val: any) => {
      if (option.identifier === val.identifier) {
        this.seletedCompetencyArea = val
        this.allCompetencyTheme = val.associations
        this.filteredallCompetencyTheme = this.allCompetencyTheme
      }
    })
  }

  compThemeSelected(option: any) {
    this.enableCompetencyAdd = false
    this.allCompetencyTheme.forEach((val: any) => {
      if (option.identifier === val.identifier) {
        this.seletedCompetencyTheme = val
        this.allCompetencySubtheme = this.allThemeData.filter((v: any) => v.identifier === val.identifier)[0].associations
        this.filteredallCompetencySubtheme = this.allCompetencySubtheme
      }
    })
  }

  compSubThemeSelected(option: any) {
    this.seletedCompetencySubTheme = option
    this.enableCompetencyAdd = true
  }

  resetCompfields() {
    this.enableCompetencyAdd = false
    this.seletedCompetencyArea = null
    this.seletedCompetencyTheme = null
    this.seletedCompetencySubTheme = null
    this.allCompetencyTheme = []
    this.allCompetencySubtheme = []
    this.filteredallCompetencyTheme = []
    this.filteredallCompetencySubtheme = []
    this.queryThemeControl.setValue('')
    this.querySubThemeControl.setValue('')
  }

  resetCompSubfields() {
    this.enableCompetencyAdd = false
    this.seletedCompetencyTheme = null
    this.seletedCompetencySubTheme = null
    this.allCompetencySubtheme = []
    this.filteredallCompetencySubtheme = []
    this.queryThemeControl.setValue('')
    this.querySubThemeControl.setValue('')
  }

  canPush(arr: any[], obj: any) {
    return !arr.some(item =>
      item.competencyAreaIdentifier === obj.competencyAreaIdentifier &&
      item.competencyThemeIdentifier === obj.competencyThemeIdentifier &&
      item.competencySubThemeIdentifier === obj.competencySubThemeIdentifier,
    )
  }

  addCompetency() {
    if (!this.seletedCompetencyArea || !this.seletedCompetencyTheme || !this.seletedCompetencySubTheme) {
      return
    }

    const area = this.seletedCompetencyArea
    const theme = this.seletedCompetencyTheme
    const subTheme = this.seletedCompetencySubTheme

    const obj = {
      // Area
      competencyAreaIdentifier: area.identifier || area.id || area.name,
      competencyAreaRefId: area.code || area.identifier || '',
      competencyAreaName: area.name,
      competencyAreaDescription: area.description || '',

      // Theme
      competencyThemeIdentifier: theme.identifier || theme.id || theme.name,
      competencyThemeRefId: theme.code || theme.identifier || '',
      competencyThemeName: theme.name,
      competencyThemeType: theme.category || 'theme',
      competencyThemeDescription: theme.description || '',
      competencyThemeAdditionalProperties: theme.additionalProperties || {},

      // Sub-theme
      competencySubThemeIdentifier: subTheme.identifier || subTheme.id || subTheme.name,
      competencySubThemeRefId: subTheme.code || subTheme.identifier || '',
      competencySubThemeName: subTheme.name,
      competencySubThemeDescription: subTheme.description || '',
      competencySubThemeAdditionalProperties: subTheme.additionalProperties || {},
    }

    const control = this.additionalDetailsForm.get('competencies_v6') as UntypedFormControl
    const value = control.value || []
    if (this.canPush(value, obj)) {
      value.push(obj)
      control.setValue(value)
      control.markAsDirty()
      control.markAsTouched()
    }
  }

  get uniqueAreas(): string[] {
    if (!this.competenciesValue || !this.competenciesValue.length) {
      return []
    }

    return Array.from(new Set(
      this.competenciesValue.map((comp: any) => comp.competencyAreaName),
    ))
  }

  getUniqueThemesForArea(areaName: string): string[] {
    if (!this.competenciesValue || !this.competenciesValue.length) {
      return []
    }

    const themesForArea = this.competenciesValue
      .filter((comp: any) => comp.competencyAreaName === areaName)
      .map((comp: any) => comp.competencyThemeName)

    return Array.from(new Set(themesForArea))
  }

  getSubthemesForAreaAndTheme(areaName: string, themeName: string): string[] {
    if (!this.competenciesValue || !this.competenciesValue.length) {
      return []
    }

    return this.competenciesValue
      .filter((comp: any) =>
        comp.competencyAreaName === areaName &&
        comp.competencyThemeName === themeName,
      )
      .map((comp: any) => comp.competencySubThemeName)
  }

  getTotalRowsForArea(areaName: string): number {
    let totalRows = 0
    for (const theme of this.getUniqueThemesForArea(areaName)) {
      totalRows += this.getSubthemesForAreaAndTheme(areaName, theme).length
    }
    return totalRows
  }

  removeCompetencyV2(area: string, theme: string, subtheme: string): void {
    const control = this.additionalDetailsForm.get('competencies_v6') as UntypedFormControl | null
    if (!control || !control.value) {
      return
    }

    const competenciesValue = control.value
    const index = competenciesValue.findIndex((comp: any) =>
      comp.competencyAreaName === area &&
      comp.competencyThemeName === theme &&
      comp.competencySubThemeName === subtheme,
    )

    if (index !== -1) {
      const updatedCompetencies = [
        ...competenciesValue.slice(0, index),
        ...competenciesValue.slice(index + 1),
      ]
      control.setValue(updatedCompetencies)
      control.markAsDirty()
      control.markAsTouched()
    }
  }

  updateQuery(key: string, field: 'theme' | 'subtheme') {
    if (field === 'theme') {
      this.filteredallCompetencyTheme = this.filterValues(key, this.allCompetencyTheme)
    } else {
      this.filteredallCompetencySubtheme = this.filterValues(key, this.allCompetencySubtheme)
    }
  }

  resetSearch(field: 'theme' | 'subtheme') {
    if (field === 'theme') {
      this.queryThemeControl.setValue('')
      this.filteredallCompetencyTheme = this.allCompetencyTheme
      if (!this.seletedCompetencySubTheme) {
        this.filteredallCompetencySubtheme = []
        this.querySubThemeControl.setValue('')
      } else {
        this.querySubThemeControl.setValue('')
      }
    } else {
      this.querySubThemeControl.setValue('')
      this.filteredallCompetencySubtheme = this.allCompetencySubtheme
    }
  }

  toggleTable() {
    this.isTableExpanded = !this.isTableExpanded
  }

  // endregion

}
