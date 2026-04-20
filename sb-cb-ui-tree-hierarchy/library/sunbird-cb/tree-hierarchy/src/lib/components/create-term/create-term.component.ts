import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FrameworkService } from '../../services/framework.service';
import { startWith, map } from 'rxjs/operators';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
// import { Identifiers } from '@angular/compiler';
import { NSFramework } from '../../models/framework.model';
import * as appConstants from '../../constants/app-constant';
import { labels } from '../../labels/strings';
import { Card } from '../../models/variable-type.model';
import { OdcsService } from '../../services/odcs.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import * as _ from 'lodash'

@Component({
  selector: 'lib-create-term',
  templateUrl: './create-term.component.html',
  styleUrls: ['./create-term.component.scss']
})

export class CreateTermComponent implements OnInit, AfterViewInit {
  name: string = '';
  termLists: Array<Card> = [];
  filtedTermLists: any;
  createTermForm: any
  createThemeForm: UntypedFormGroup = this.fb.group({});
  createThemeFormMulti: UntypedFormGroup = this.fb.group({});
  disableCreate: boolean = false;
  disableUpdate: boolean = false;
  disableMultiCreate: boolean = false;
  isTermExist: boolean = false;
  selectedTerm: Card = {};
  app_strings = labels;
  colCode = ''
  savedDesignations: any = []
  addedDesignationCount = 0
  designationsList = []
  panelOpenState: any[] = [];
  allCompetency:any[]=[]
  seletedCompetencyArea: any
  allCompetencyTheme:any[]=[]
  filteredallCompetencyTheme:any[]=[]
  allCompetencySubtheme:any[]=[]
  filteredallCompetencySubTheme:any[]=[]
  competencyForm: UntypedFormGroup = this.fb.group({})
  compLabeltext:string = ''
  masterList:any[]=[];
  filteredMasterList:any[]=[];
  expansionTitle:string = ''
  private debounceTimeout: any;
  private debounceDelay: number = 500;
  values= ''
  toolTipText = `You can customize this display name for learners to see, as it's what they will view.`
  previousCategoryCode:string = '';
  previousTermCode:string = '';
  previousCatCode:string = '';
  previousTermCatCode:string=''
  selectedTermArray: any= []


  constructor(
    public dialogRef: MatDialogRef<CreateTermComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private frameWorkService: FrameworkService,
    private fb: UntypedFormBuilder,
    private odcsService: OdcsService,
    private _snackBar: MatSnackBar,
    private cdr:ChangeDetectorRef
  ) { 
    this.getKcmSearch()
  }

  ngOnInit() {
    
    this.termLists = this.data.columnInfo.children
    this.compLabeltext = this.data.columnInfo.config.labelName
    
    this.initTermForm()
    
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges()
  }

  initTermForm() {
    this.createTermForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    })
    this.createThemeForm = this.fb.group({
      name: ['', [Validators.required]],
      dname: [{value: '', disabled: true}, [Validators.required]],
      description: ['']
    })
    // this.createThemeForm.controls['dname'].disable()
    // this.createThemeForm.controls['name'].valueChanges.subscribe((value)=>{
    //   if(value.length){
    //    this.createThemeForm.controls['dname'].enable()
    //   }
    // })
    this.createThemeFormMulti = this.fb.group({
      themeFields:this.fb.array([this.createThemeFields()])
    })
    // this.initializeValueChanges()
    this.filtedTermLists = this.createTermForm.get('name').valueChanges.pipe(
      startWith(''),
      map(value => {
        if (value && this.createTermForm.controls.dname) {
          this.createTermForm.controls.dname.enable()
        } else if (this.createTermForm.controls.dname) {
          this.createTermForm.controls.dname.disable()
        }
        return this._filter(value || '')
      }),
    );

    // if mode is "view" then check for which type of form has to be used and then append the values in form
    if (
      this.data &&
      (this.data.mode === 'view')
    ) {
      switch (this.data.columnInfo.code) {
        case 'theme': this.updateFormView(this.createThemeForm, this.data)
          break
        case 'subtheme': this.updateFormView(this.createThemeForm, this.data)
          break
        default: this.updateFormView(this.createThemeForm, this.data)
          break
      }
      this.disableCreate = true
    } else if (this.data &&
      (this.data.mode === 'edit')) {
      switch (this.data.columnInfo.code) {
        case 'theme': this.updateFormEdit(this.createThemeForm, this.data)
          break
        case 'subtheme': this.updateFormEdit(this.createThemeForm, this.data)
          break
        default: this.updateFormEdit(this.createThemeForm, this.data)
          break
      }
    } else if (this.data &&
      (this.data.mode === 'multi-create')) {
      // switch (this.data.columnInfo.code) {
      //   case 'theme': this.updateFormEdit(this.createThemeForm, this.data)
      //     break
      //   case 'subtheme': this.updateFormEdit(this.createThemeForm, this.data)
      //     break
      //   default: this.updateFormEdit(this.createThemeForm, this.data)
      //     break
      // }
    }
  }

  getComptencyData(){
    // const filterObj = {
    //   search: {
    //     type: 'Competency Area',
    //   },
    //   filter: {
    //     isDetail: true,
    //   },
    // }
    // this.frameWorkService.getFilterEntity(filterObj).subscribe((data)=>{
    
    //  if(data && data.length){
    //   this.allCompetency = data
    //  }
    // })
  }
  // initializeValueChanges() {
  //   this.themeFields.controls.forEach((group: FormGroup) => {
  //     this.setUpValueChanges(group);
  //   });
  // }

  // setUpValueChanges(group: FormGroup) {
  //   group.controls['name'].valueChanges.subscribe(value => {
  //     const dnameControl = group.controls['dname'];
  //     dnameControl.disable();
  //     if (value.trim().length) {
  //       dnameControl.enable();
  //     } else {
  //       dnameControl.disable();
  //     }
  //   });
  // }

  get themeFields(): UntypedFormArray {
    return this.createThemeFormMulti.get('themeFields') as UntypedFormArray;
  }

  get themeFieldsControls() {
    const themeFields = this.createThemeFormMulti.get('themeFields')
    return (<any>themeFields)['controls']
  }

  createThemeFields(): UntypedFormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      dname: [{value: '', disabled: true}, [Validators.required]],
      description: ['',]
    });
  }

  addThemeFields() {
    this.values = ''
    this.filteredMasterList = [...this.masterList]
    if (this.data.mode === 'multi-create') {
      // this.themeFields.push(this.createThemeFields());
      this.themeFields.insert(0, this.createThemeFields());
    }
  }

  removeThemeFields(index: number) {
    if (this.data.mode === 'multi-create') {
      this.themeFields.removeAt(index);
    }
  }
  getCreateName(name: string): string {
   switch(name){
    case 'Theme':
      return `Add Competency ${name}`;
    case 'Sub Theme':
      return `Add Competency ${name}`;
    default:
      return `Add ${name}`;
   }
  }

  getCategoryName(categoryName:any, term:any){
    this.previousCategoryCode = categoryName;
    this.previousTermCode = term.code
    
    switch(categoryName){
      case 'competencyarea':
        return 'Competency Area';
      case 'theme':
        return 'Competency Theme';
      case 'subtheme':
        return 'Competency Sub Theme';
      default:
        return categoryName; // Default return to handle any unmatched case
     }
  }


  getName(item:any){
  return item.toUpperCase()
  }

  getLabelName(labelName:string): string {
    
   switch(labelName){
    case 'Theme':
      return `Competency ${labelName} name`;
      case 'Sub Theme':
      return `Competency ${labelName} name`
      default:
        return labelName; // Default return to handle any unmatched case
   }
  }

 

  createCompThemeFields():UntypedFormGroup {
    return this.fb.group({
      competencyTheme:['', [Validators.required]],
      competencySubTheme:['', [Validators.required]]
    })
  }

  addCompetencyTheme(){
    if (this.data.mode === 'multi-create') {
      this.compThemeFields.push(this.createCompThemeFields());
    }
  }

  removeCompFields(index: number) {
    if (this.data.mode === 'multi-create') {
      this.compThemeFields.removeAt(index);
    }
  }

  get compThemeFields(): UntypedFormArray {
    return this.competencyForm.get('compThemeFields') as UntypedFormArray;
  }

  // get compThemeFieldsControls() {
  //   const createCompThemeFields = this.competencyForm.get('createCompThemeFields')
  //   return (<any>createCompThemeFields)['controls']
  // }


  updateFormView(form:any, data:any) {
    if(data && data.childrenData && data.childrenData.additionalProperties && data.childrenData.additionalProperties.displayName){
      form.get('dname').patchValue(data.childrenData.additionalProperties.displayName)
    }
    form.get('description').patchValue(data.childrenData.description)    
    
      if (data.childrenData.name && this.masterList.length) {
        const assignName = this.masterList.find(option =>
          data.childrenData.refId === option.id
        )
        if (assignName) {
          form.controls['name'].setValue(assignName)
        }
        
      }
  
    
    // form.get('name').patchValue(data.childrenData.name)
    
    setTimeout(() => {
      form.get('name').disable()
      form.get('dname').disable()
      form.get('description').disable()
      
      
    })
  }

  updateFormEdit(form:any, data:any) {
    form.get('dname').patchValue(data.childrenData.additionalProperties.displayName)
    form.get('description').patchValue(data.childrenData.description)
    if (data.childrenData.name && this.masterList.length) {
      const assignName = this.masterList.find(option =>
        data.childrenData.name === option.title
      )
      if (assignName) {
        form.controls['name'].setValue(assignName)
      }
      
    }
    // form.get('name').patchValue(data.childrenData.name)
   
    setTimeout(() => {
      form.get('name').disable()
      form.get('dname').enable()
    })
  }

  onKey(event:any){
    //  this.values = event.target.value.toLowerCase();
    //  this.filteredMasterList = this.filterOrgValues(this.values, this.masterList)

     clearTimeout(this.debounceTimeout);
    
     // Set the new timeout
     this.debounceTimeout = setTimeout(() => {
       this.values = event.target.value.toLowerCase();
       this.filteredMasterList = this.filterOrgValues(this.values, this.masterList);
     }, this.debounceDelay);
  }

 

  filterOrgValues(searchValue: string, array: any) {
    return array.filter((value: any) =>
      value.title.toLowerCase().includes(searchValue.toLowerCase()))
  }

  getKcmSearch(){
    const requestObj = {
      filterCriteriaMap: {
        status: "Live",
        isActive: true
    },
    requestedFields: [],
    pageNumber: 0,
    pageSize:1000
    }
    this.frameWorkService.getKcmSearchList(requestObj,this.data.columnInfo.code).subscribe((response:any)=>{
      if(response.data && response.data.length){
        this.masterList = response.data;
        this.filteredMasterList = [...this.masterList]
        setTimeout(()=>{
          if(this.data &&
            (this.data.mode === 'edit')){
              this.updateFormEdit(this.createThemeForm, this.data)
            }
            else if(this.data &&
              (this.data.mode === 'view')){
                this.updateFormView(this.createThemeForm, this.data)
            }

          
        },1000)
       

      }
    })
   
    
  }

  onDisableTheme(option: any){
    let parentCol
    const parentColumnConfigData = this.frameWorkService.getPreviousCategory(this.data.columnInfo.code)
    if(parentColumnConfigData) {
      parentCol = this.frameWorkService.selectionList.get(parentColumnConfigData.code)
    }
    let result = -1
    if(parentCol && parentCol.children && parentCol.children.length){
      result = parentCol.children.findIndex((ele: any) => {
        if( (ele.refType === 'theme'|| ele.refType === 'subtheme') ) {
          return ele.name.toLowerCase() === option.title.toLowerCase();
        }
        return false;
      })
      
   
      
    }
    if(result < 0){
      let formArray = this.createThemeFormMulti.get('themeFields') as UntypedFormArray;
      result = formArray.value.findIndex((formEle: any) => {
        if(formEle.name && formEle.name.id){
          return formEle.name.id === option.id;
        }
        return false;
      });
     }
    //
    
    return result >= 0 ? true: false
  }

  multiCreate(form:any, _data:any) {
    this.disableMultiCreate = true
    let counter = 0
    let createdTerms:any = []
    if(form.valid) {
      
      const themeFields = form && form.value && form.value.themeFields
      
      if(themeFields && themeFields.length) {
        themeFields.forEach((val:any, _i:any) =>{
          const term: NSFramework.ICreateTerm = {
            code: this.frameWorkService.getUuid(),
            name: _.get(val, 'name.title'),
            description: val.description,
            category: this.data.columnInfo.code,
            status: appConstants.LIVE,
            refId:val.name.id,
            refType:this.data.columnInfo.code,
            // framework:this.data.frameworkId,
            // approvalStatus:appConstants.DRAFT,
            parents: [
              { identifier: `${this.data.frameworkId.toLowerCase()}_${this.data.columnInfo.code}` }
            ],
            additionalProperties: {
              displayName:val.dname,
              timeStamp: new Date().getTime(),
            }
          }
          const requestBody: any = {
            request: {
              term: term
            }
          }
    
          this.frameWorkService.createTerm(this.data.frameworkId, this.data.columnInfo.code, requestBody).subscribe((res: any) => {
            requestBody.request.term['identifier'] = res.result.node_id[0]
            createdTerms.push(requestBody.request.term)
            
            counter++
            
            if(counter === themeFields.length){


              const parentColumn:any = this.frameWorkService.getPreviousCategory(this.data.columnInfo.code)
              let parentCol: any = this.frameWorkService.selectionList.get(parentColumn.code)
              this.updateTermAssociationsMultiV2(createdTerms , parentCol)
              // this.updateTermAssociationsMulti(createdTerms)
              // this.dialogClose({ term: createdTerms, created: true, multi:true })
            }
          })
        })
        this.disableMultiCreate = true
      }
    }
  }

  async updateTermAssociationsMulti(createdTerms: any[]) {
     let parent: any
    if(createdTerms && createdTerms.length) {
      let createdTermsCounter = 0
      for(let createdTerm of createdTerms) {
        this.selectedTerm = createdTerm
        let associations = []
        let temp
        let counter = 0
        for(const [value] of this.frameWorkService.selectionList){
           parent = value
          counter++
          temp = parent.children ? parent.children.filter((child: any) => child.identifier === this.selectedTerm.identifier) : null
          associations = parent.children ? parent.children.map((c:any) => {
            // return { identifier: c.identifier, approvalStatus: c.associationProperties?c.associationProperties.approvalStatus: 'Draft' }
            return c.identifier ?  { identifier: c.identifier } : null
          }) : []
          if (temp && temp.length) {
            this.isTermExist = true
            return
          } else {
              associations.push({ identifier: this.selectedTerm.identifier })
              this.isTermExist = false
              // if(createdTermsCounter === (createdTerms.length-1)) {
                const reguestBody = {
                  request: {
                    term: {
                      ...(associations && associations.length) ? {associations: [...associations]} : null,
                    }
                  }
                }
                // this.dialogClose({ term: this.selectedTerm, created: true })
                await this.callUpdateAssociations(counter, parent, reguestBody)
                
              // }
          }
        }
        createdTermsCounter++
        if(createdTermsCounter === createdTerms.length) {
          this.frameWorkService.updateFrameworkList(this.data.columnInfo.code, parent, createdTerms )
          this.dialogClose({ term: [this.selectedTerm], created: true, multi:true })
          this.disableMultiCreate =false;
          if(createdTerms[0].category === 'theme'){
            this._snackBar.open(`Competency ${createdTerms[0].category} created successfully.`)
          }
          if(createdTerms[0].category === 'subtheme'){
            this._snackBar.open(`Competency ${createdTerms[0].category} created successfully.`)
          }
        }
      }
    }
  }

  callUpdateAssociations(counter:any, parent:any, reguestBody:any): Promise<any>{
    return new Promise((resolve) => {
      this.frameWorkService.updateTerm(this.data.frameworkId, parent.category, parent.code, reguestBody).subscribe(() => {
        parent['children'] = parent && parent.children ?[...parent.children, ...[this.selectedTerm]]:[this.selectedTerm]

        if (counter === this.frameWorkService.selectionList.size) {
          // this.selectedTerm['associationProperties']['approvalStatus'] = 'Draft';
  
          // this value is for selected term in case of create scenario, in case of edit scenario this won't be avaiable 
          // so term is set from childdata which is received from params in updateData
          // const value = (this.selectedTerm && this.selectedTerm.identifier) ? this.selectedTerm : {}
          // const found = parent.children ? parent.children.find(c=> c.identifier === this.selectedTerm.identifier) : false
          // if(!found) {
          //   parent.children ? parent.children.push(this.selectedTerm) : parent['children'] = [this.selectedTerm]
          // }
          this.disableUpdate = false
          // this.frameWorkService.publishFramework().subscribe(res => {
          //   // this.dialogRef.close(term)
          
          //   return resolve(true)
          // });
          resolve(true)
        } else {
          return resolve(true)
        }
      }, (_err: any) => {
        console.error(`Edit ${this.data.columnInfo.name} failed, please try again later`)
      })
    })
  }

  updateDname(_name: any, _form:any, _i?:any) {
    // if(this.data.mode === 'create' && !form.controls['dname'].value.trim().length){
    //   form.get('dname').patchValue(name)
    // }
    // if(this.data.mode === 'multi-create' && !form.controls.themeFields.controls[i].controls['dname'].value.trim().length){
    //   form.controls.themeFields.controls[i].controls['dname'].patchValue(name)
    // }
  }
  change(event: any,form: any, i?: any){
    if(this.data && this.data.mode) { 
      if(this.data.mode === 'create'){
        form.get('dname').patchValue(event.source.value.title)
        this.expansionTitle = event.source.value.title
        this.cdr.detectChanges()

      }
      if(this.data.mode === 'multi-create'){
        const formToUpdate = form.controls.themeFields.controls[i]
        formToUpdate.controls['dname'].patchValue(event.source.value.title)
        this.expansionTitle = event.source.value.title
        this.cdr.detectChanges()
        if(formToUpdate.controls.name.valid && formToUpdate.controls.dname) {
          formToUpdate.controls.dname.enable()
        } else if(formToUpdate.controls.dname) {
          formToUpdate.controls.dname.disable()
        }
      }
    }
   
  }

  getExpansionTitle(form: any) {
    const details = form.get('name').value
    return _.get(details, 'title', '')
  }
  

  //#region (designations)

  get designationControls() {
    return (this.createThemeForm.get('designations') as UntypedFormArray).controls;
  }

  loadDesignations() {
    this.odcsService.getDesignations({}).subscribe(
      (data: any) => {
        this.designationsList = data.responseData
      },
      (_err: any) => {
      })
  }

  getFilteredDesignationList(index: string) {
    const filterKey = this.createThemeForm.value.designations[index].name.toLowerCase()
    if(filterKey && this.designationsList) {
      const filteredList = this.designationsList.filter((designation: any) => designation.name.toLowerCase().includes(filterKey))
      return filteredList
    }

    return []
  }

  addDesignation() {
    const newDesignation = this.fb.group({
      name: ['', Validators.required],
      id:[null, Validators.required],
      designationDescription: ['', [Validators.required, Validators.maxLength(600)]],
      isSaved: [false], // isSaved can be used to change button text from save to update if needed
      creationId: this.addedDesignationCount // creationId is created to use locally to give unique id to added records
    });
    this.addedDesignationCount = this.addedDesignationCount + 1;
    (this.createThemeForm.get('designations') as UntypedFormArray).insert(0, newDesignation);
    // this.panelOpenState.insert(0, true)
    this.panelOpenState.splice(0, 0, true);
  }

  clearSelectedDesignaionOnChange(index:any, event:any) {
    const selectedName = this.createThemeForm.value.designations[index].name
    if(selectedName !== event.value) {
      const designationsToReset:any = this.designationControls[index]
      designationsToReset.get('id').reset()
    }
  }

  deleteDesignation(index: number) {
    const reovedCreationId = this.designationControls[index].value.creationId;
    (this.createThemeForm.get('designations') as UntypedFormArray).removeAt(index);
    this.savedDesignations = this.savedDesignations.filter((savedDesignation: any) => savedDesignation.creationId !== reovedCreationId)
  }

  saveDesignation(index: number) {
    const designations = this.designationControls
    const designationToSave = designations[index]
    if (designationToSave.valid) {
      designationToSave.value.isSaved = true
      const savedDesignationIndex = this.savedDesignations.findIndex((e:any) => e.creationId === designationToSave.value.creationId)
      if (savedDesignationIndex >= 0) {
        this.savedDesignations[savedDesignationIndex] = designationToSave.value
      } else {
        this.savedDesignations.push(designationToSave.value)
      }
    }
  }

  submitDesignation() {
    
  }

  cancel() {
    this.dialogRef.close()
  }

  get enableAddBtn() {
    if(this.colCode === 'designation') {
      return this.designationControls.length > 0 ? true : false
    }
    return false
  }

  //#endregion
  
  private _filter(searchTxt: any): Card[] {
    let isExist;
    this.disableCreate = false
    this.isTermExist = false
    this.createTermForm.get('description').enable()
    // this.createTermForm.get('description').patchValue('')
    const filterValue = typeof (searchTxt) === 'object' ? this._normalizeValue(searchTxt.name) : this._normalizeValue(searchTxt);
    isExist = this.termLists.filter((term:any) => this._normalizeValue(term.name).includes(filterValue));
    return isExist
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  onSelectionArea(option:any){
    this.allCompetency.forEach((val:any)=>{
      if (option.name === val.name) {
        this.seletedCompetencyArea = val
        this.allCompetencyTheme = val.children
        this.filteredallCompetencyTheme = this.allCompetencyTheme

      }
    })
   
  }

  OnThemeSelection(event:any) {
    
    const selectedTheme = event.source.value
    this.filteredallCompetencyTheme.forEach((val: any) => {
      if (selectedTheme.name === val.name) {
        this.allCompetencySubtheme = val.children
        this.filteredallCompetencySubTheme = this.allCompetencySubtheme
      }

    })


  }

  // compAreaSelected(option: any) {
  //   this.resetCompSubfields()
  //   this.allCompetencies.forEach((val: any) => {
  //     if (option.name === val.name) {
  //       this.seletedCompetencyArea = val
  //       this.allCompetencyTheme = val.children
  //       this.filteredallCompetencyTheme = this.allCompetencyTheme
  
  //     }
  //   })
  // }

  onSelect(term:any, form:any) {
    switch (this.colCode) {
      case 'designation':
        form.get('name').patchValue(term.value.name)
        form.get('id').patchValue(term.value.id)
        break;
      default:
        this.selectedTerm = term.value
        form.get('name').patchValue(term.value.name)
        form.get('dname').patch(term.value.dname)
        form.get('description').patchValue(term.value.description)
        form.get('description').disable()
        this.disableCreate = true
    }
  }

  saveTerm() {
    if (this._filter(this.createTermForm.value.name).length > 0) {
      this.isTermExist = true
      
      return
    }
    if (this.createTermForm.valid) {
      const term: NSFramework.ICreateTerm = {
        code: this.frameWorkService.getUuid(),
        name: this.createTermForm.value.name,
        description: this.createTermForm.value.description,
        category: this.data.columnInfo.code,
        status: appConstants.LIVE,
        // framework:this.data.frameworkId,
        // approvalStatus:appConstants.DRAFT,
        parents: [
          { identifier: `${this.data.frameworkId.toLowerCase()}_${this.data.columnInfo.code}` }
        ],
        additionalProperties: {
          displayName: this.createTermForm.value.dname,
          timeStamp: new Date().getTime(),
        }
      }
      const requestBody:any = {
        request: {
          term: term
        }
      }

      this.frameWorkService.createTerm(this.data.frameworkId, this.data.columnInfo.code, requestBody).subscribe((res: any) => {
        requestBody.request.term['identifier'] = res.result.node_id[0]
        this.dialogClose({ term: requestBody.request.term, created: true })
        this.selectedTerm = requestBody.request.term
        this.updateTermAssociations()
      })
    }
  }

  updateTermData(form:any, data:any) {
    let additionalProperties =  data.childrenData.additionalProperties
    additionalProperties['displayName'] = this.createThemeForm.value.dname
    form.value.additionalProperties = additionalProperties
    
    form.value.displayName = form.value.dname
    
    this.disableUpdate = true
    const formData = {
      // use this if you need disabled field values : form.getRawValue()
      ...form.value,
      // displayName:{...form.value.dname}
    }
    const updateData = {
      formData,
      updateTermData: data.childrenData
    }
    this.updateTermDataAssociations(updateData)
  }


  updateTermDataAssociations(updateData:any) {
    this.disableMultiCreate = true
    let selectionData = this.frameWorkService.selectionList.get(this.data.columnInfo.code)
    if(!selectionData ) {
      selectionData = this.data.childrenData
    }
    const listThme = this.frameWorkService.list.get(this.data.columnInfo.code)
    let themAssociations: any
    if(listThme && listThme.children && listThme.children.length) {
      const data = listThme.children.find((c) => c.identifier === selectionData.identifier)
      themAssociations = data.associations ? data.associations.map((c:any) => {
        // return { identifier: c.identifier, approvalStatus: c.associationProperties?c.associationProperties.approvalStatus: 'Draft' }
        return c.identifier ?  { identifier: c.identifier } : null
      }) : []
    }
    const reguestBody = {
      request: {
        term: {
          ...updateData.formData,
          ...(themAssociations && themAssociations.length) ? {associations: themAssociations} : null,
        }
      }
    }
    this.frameWorkService.updateTerm(this.data.frameworkId, selectionData.category, selectionData.code, reguestBody).subscribe(() => {
        // this.selectedTerm['associationProperties']['approvalStatus'] = 'Draft';

        // this value is for selected term in case of create scenario, in case of edit scenario this won't be avaiable 
        // so term is set from childdata which is received from params in updateData
        const value = (this.selectedTerm && this.selectedTerm.identifier) ? this.selectedTerm : (updateData) ? {...updateData.updateTermData, ...updateData.formData} : {}
        
        this.disableUpdate = false
        
        // const selectionData = this.frameWorkService.selectionList.get(this.data.columnInfo.code)
        selectionData['description'] = reguestBody.request.term.description
        selectionData['additionalProperties'] = reguestBody.request.term.additionalProperties
        selectionData['associations'] = themAssociations
        

        this._snackBar.open(`Competency ${value.category} updated successfully`)
        this.dialogClose({ term: { ...value }, created: true })
        this.disableMultiCreate = false;
        this.frameWorkService.updateFullTermDataLocalMap(this.data.columnInfo.code, selectionData)
    }, (_err: any) => {
      console.error(`Edit ${this.data.columnInfo.name} failed, please try again later`)
    })
  }

  updateTermAssociations(updateData?: any) {
    let associations = []
    let temp
    let counter = 0
    // let localIsExist = false
    this.frameWorkService.selectionList.forEach((parent) => {
      counter++
      temp = parent.children ? parent.children.filter((child:any) => child.identifier === this.selectedTerm.identifier) : null
      associations = parent.children ? parent.children.map((c:any) => {
        // return { identifier: c.identifier, approvalStatus: c.associationProperties?c.associationProperties.approvalStatus: 'Draft' }
        return c.identifier ?  { identifier: c.identifier } : null
      }) : []
      if (temp && temp.length) {
        this.isTermExist = true
        return
      } else {
        // associations.push({ identifier: this.selectedTerm.identifier, approvalStatus: appConstants.DRAFT })
        if(this.selectedTerm && this.selectedTerm.identifier) {
          associations.push({ identifier: this.selectedTerm.identifier })
        }
        this.isTermExist = false
        const reguestBody = {
          request: {
            term: {
              ...(updateData && updateData.formData && updateData.updateTermData.code === parent.code) ? {...updateData.formData}: null,
              ...(associations && associations.length) ? {associations: [...associations]} : null,
            }
          }
        }
        
        // this.dialogClose({ term: this.selectedTerm, created: true })
        this.frameWorkService.updateTerm(this.data.frameworkId, parent.category, parent.code, reguestBody).subscribe(() => {
          if (counter === this.frameWorkService.selectionList.size) {
            // this.selectedTerm['associationProperties']['approvalStatus'] = 'Draft';

            // this value is for selected term in case of create scenario, in case of edit scenario this won't be avaiable 
            // so term is set from childdata which is received from params in updateData
            const value = (this.selectedTerm && this.selectedTerm.identifier) ? this.selectedTerm : (updateData) ? {...updateData.updateTermData, ...updateData.formData} : {}
            
            this.disableUpdate = false
            this._snackBar.open(`Competency ${value.category} updated successfully`)
            this.dialogClose({ term: { ...value }, created: true })
          }
        }, (_err: any) => {
          console.error(`Edit ${this.data.columnInfo.name} failed, please try again later`)
        })
      }
    })
  }

  saveThemeTerm() {
    if (this._filter(this.createThemeForm.value.name).length > 0) {
      this.isTermExist = true
      return
    }
    if (this.createThemeForm.valid) {
      const term: NSFramework.ICreateTerm = {
        code: this.frameWorkService.getUuid(),
        name: this.createThemeForm.value.name,
        description: this.createThemeForm.value.description,
       
        category: this.data.columnInfo.code,
        status: appConstants.LIVE,
        // approvalStatus:appConstants.DRAFT,
        parents: [
          { identifier: `${this.data.frameworkId.toLowerCase()}_${this.data.columnInfo.code}` }
        ],
        additionalProperties: {
          displayName:this.createTermForm.value.dname,
          timeStamp: new Date().getTime(),
        }
      }
      const requestBody:any = {
        request: {
          term: term
        }
      }

      this.frameWorkService.createTerm(this.data.frameworkId, this.data.columnInfo.code, requestBody).subscribe((res: any) => {
        requestBody.request.term['identifier'] = res.result.node_id[0]
        this.dialogClose({ term: requestBody.request.term, created: true })
        this.selectedTerm = requestBody.request.term
        this.updateTermAssociations()
      }, (_err: any) => {
        console.error(`Create ${this.data.columnInfo.name} failed, please try again later`)
      })
    }
  }

  dialogClose(term: any) {
    this.frameWorkService.publishFramework().subscribe(() => {
      this.dialogRef.close(term)
    });
  }


  async updateTermAssociationsMultiV2(createdTerms: any[], parentSelectedTerm?:any) {
   
    this.selectedTermArray = []
    // let createdTermsCounter = 0
    let createdTermsIdentifiers = []
    this.selectedTermArray = createdTerms
    this.selectedTerm = createdTerms[createdTerms.length -1]
    for(let createdTerm of createdTerms) {
      createdTermsIdentifiers.push({ identifier: createdTerm.identifier })
    }
    let associations = []
    let counter = 0
   if(createdTerms && createdTerms.length) {
      let parent: any
     let createdTermsCounter = 0
     if(!parentSelectedTerm) {
      for(let createdTerm of createdTerms) {
        this.selectedTerm = createdTerm
        let temp
        for(const [value] of this.frameWorkService.selectionList){
           parent = value
          counter++
          temp = parent.children ? parent.children.filter((child: any) => child.identifier === this.selectedTerm.identifier) : null
          associations = parent.children ? parent.children.map((c: any) => {
            // return { identifier: c.identifier, approvalStatus: c.associationProperties?c.associationProperties.approvalStatus: 'Draft' }
            return c.identifier ?  { identifier: c.identifier } : null
          }) : []
          if (temp && temp.length) {
            this.isTermExist = true
            return
          } else {
              associations.push({ identifier: this.selectedTerm.identifier })
              this.isTermExist = false
              // if(createdTermsCounter === (createdTerms.length-1)) {
                const reguestBody = {
                  request: {
                    term: {
                      ...(associations && associations.length) ? {associations: [...associations]} : null,
                    }
                  }
                }
                // this.dialogClose({ term: this.selectedTerm, created: true })
                await this.callUpdateAssociations(counter, parent, reguestBody)
                
              // }
          }
        }
        createdTermsCounter++
        if(createdTermsCounter === createdTerms.length) {
          this.frameWorkService.updateFrameworkList(this.data.columnInfo.code, parent, createdTerms )
          this.dialogClose({ term: [this.selectedTerm], created: true, multi:true })
          this.disableMultiCreate =false;
          if(createdTerms[0].category === 'theme'){
            this._snackBar.open(`Competency ${createdTerms[0].category} created successfully.`)
          }
          if(createdTerms[0].category === 'subtheme'){
            this._snackBar.open(`Competency ${createdTerms[0].category} created successfully.`)
          }
        }
      }
     } else {
      const parent = parentSelectedTerm
      associations = parent.children ? parent.children.map((c:any) => {
        return c.identifier ?  { identifier: c.identifier } : null
      }) : []
        associations = [...associations, ...createdTermsIdentifiers]
        this.isTermExist = false
        const reguestBody = {
          request: {
            term: {
              ...(associations && associations.length) ? {associations: [...associations]} : null,
            }
          }
        }
        await this.callUpdateAssociationsV2(counter, parent, reguestBody)

          this.frameWorkService.updateFrameworkList(this.data.columnInfo.code, parent, createdTerms )
          this.dialogClose({ term: this.selectedTermArray, created: true, multi:true })
          this.disableMultiCreate =false;
          if(createdTerms[0].category === 'theme'){
            this._snackBar.open(`Competency ${createdTerms[0].category} created successfully.`)
          }
          if(createdTerms[0].category === 'subtheme'){
            this._snackBar.open(`Competency ${createdTerms[0].category} created successfully.`)
          }
     }
   }
 }

 async callUpdateAssociationsV2(counter:any, parent:any, reguestBody :any): Promise<any>{
   return new Promise((resolve) => {
    this.frameWorkService.updateTerm(this.data.frameworkId, parent.category, parent.code, reguestBody).subscribe(async () => {
      parent['children'] = parent && parent.children ?[...parent.children, ...this.selectedTermArray]:this.selectedTermArray
        let listData : any = this.frameWorkService.list.get(this.data.columnInfo.code)
        let differenceData = []
        if(listData && listData.children && listData.children.length) {
          differenceData  = _.differenceBy(this.selectedTermArray,listData.children, 'identifier');
        } else {
          differenceData = this.selectedTermArray
        }
        listData['associations'] = listData && listData.associations ?[...listData.associations, ...differenceData]:differenceData
        listData['children'] = listData && listData.children ?[...listData.children, ...differenceData]:differenceData

        this.frameWorkService.selectionList.forEach((selectedData: any)=> {
          let listData : any = this.frameWorkService.list.get(selectedData.category)
          if(listData && listData.children && listData.children.length) {
            this.frameWorkService.updateLocalList(listData,parent, this.selectedTermArray, 'create')
          }
        }) 
       if (counter === this.frameWorkService.selectionList.size) {
         // this.selectedTerm['associationProperties']['approvalStatus'] = 'Draft';
 
         // this value is for selected term in case of create scenario, in case of edit scenario this won't be avaiable 
         // so term is set from childdata which is received from params in updateData
        //  const value = (this.selectedTerm && this.selectedTerm.identifier) ? this.selectedTerm : {}
        //  const found = parent.children ? parent.children.find(c=> c.identifier === this.selectedTerm.identifier) : false
         // if(!found) {
         //   parent.children ? parent.children.push(this.selectedTerm) : parent['children'] = [this.selectedTerm]
         // }
         this.disableUpdate = false
         // this.frameWorkService.publishFramework().subscribe(res => {
         //   // this.dialogRef.close(term)
         //   return resolve(true)
         // });
         resolve(true)
       } else {
         return resolve(true)
       }
     }, (_err: any) => {
       console.error(`Edit ${this.data.columnInfo.name} failed, please try again later`)
     })
   })
  }

}