import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { NsAssessment } from '../../service/assessment.model'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { AssessmentService } from '../../service/assessment.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

@Component({
  selector: 'sb-uic-assessment-basic-info',
  templateUrl: './assessment-basic-info.component.html',
  styleUrls: ['./assessment-basic-info.component.scss']
})

export class AssessmentBasicInfoComponent implements OnInit, OnDestroy {

  @Input() config: any
  @Output() saved = new EventEmitter<any>()
  @Output() updated = new EventEmitter<any>()
  @Output() cancelled = new EventEmitter<void>()

  assessmentForm!: FormGroup
  reAttemptOptions: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  nameMaxLength = 70
  instructionsMaxLength = 500
  durationTouched = false
  overallScoreCutoffOptions = [
    {
      id: 'AssessmentLevel',
      name: 'Overall score cutoff',
      description: 'With this selection the scores are calculated based on the overall correct answers.',
    },
    {
      id: 'SectionLevel',
      name: 'Sectional score cutoff',
      description: 'With this selection the scores are calculated based on the each section you create.',
    },
  ]
  isFinalAssessment: boolean = false
  isPracticeAssessment: boolean = false
  showCoolOffPeriod: boolean = false
  private showTimerSubscription?: Subscription
  private assessmentTypeSubscription?: Subscription
  private questionWeightageTypeSubscription?: Subscription
  private noOfSectionSubscription?: Subscription
  assessmentTypeList = [
    {
      name: 'Question Weightage',
      value: NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE,
    },
    {
      name: 'Option Weightage',
      value: NsAssessment.EAssessmentType.OPTION_WEIGHTAGE,
    },
  ]
  difficultyLevels = ['Easy', 'Medium', 'Difficult', 'HOTS']
  selectedSectionIndex = 0
  negativePercentageOptions = ['0%', '25%', '50%', '75%', '100%']
  assessmentData: any
  previousQuestionWeightageType: any = null

  constructor(
    private fb: FormBuilder,
    private configSvc: ConfigurationsService,
    private assessmentService: AssessmentService,
    private snackBar: MatSnackBar,
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    if (this.config && this.config.identifier) {
      // Load existing assessment data to populate the form
      this.assessmentData = this.assessmentService.getAssessmentHierarchyData()
      if (this.assessmentData) {
        this.populateForm(this.assessmentData)
      }
    }

    if (this.config && this.config?.primaryCategory === NsAssessment.EAssessmentPrimaryCategory.FINAL_ASSESSMENT) {
      this.isFinalAssessment = true
    }
    if (this.config && this.config?.primaryCategory === NsAssessment.EAssessmentPrimaryCategory.PRACTICE_QUESTION_SET) {
      this.isPracticeAssessment = true
    }
    // Check if coolOffPeriod should be shown
    if (this.config && this.config?.contextCategory) {
      this.showCoolOffPeriod = this.config.contextCategory === NsAssessment.EAssessmentContextCategory.PRELIMINARY_ASSESSMENT ||
        this.config.contextCategory === NsAssessment.EAssessmentContextCategory.FINAL_MILESTONE_ASSESSMENT
    }
    this.setupShowTimerSubscription()
    this.setupAssessmentTypeSubscription()
    this.setupQuestionWeightageTypeSubscription()
    this.setupNoOfSectionSubscription()
    this.updateValidators()
  }

  ngOnDestroy(): void {
    this.showTimerSubscription?.unsubscribe()
    this.assessmentTypeSubscription?.unsubscribe()
    this.questionWeightageTypeSubscription?.unsubscribe()
    this.noOfSectionSubscription?.unsubscribe()
  }

  setupShowTimerSubscription(): void {
    this.showTimerSubscription = this.assessmentForm.get('showTimer')?.valueChanges.subscribe(() => {
      this.updateValidators()
    })
  }

  setupAssessmentTypeSubscription(): void {
    this.assessmentTypeSubscription = this.assessmentForm.get('assessmentType')?.valueChanges.subscribe((value) => {
      // Reset advanced assessment fields when switching assessment type
      if (value === 'advanced') {
        this.assessmentForm.get('questionWeightageType')?.setValue(NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE, { emitEvent: false })
        // For practice assessment with advanced type, showTimer should always be true
        if (this.isPracticeAssessment) {
          this.assessmentForm.get('showTimer')?.setValue(true, { emitEvent: false })
        }
      } else {
        this.assessmentForm.get('questionWeightageType')?.setValue(null, { emitEvent: false })
      }
      this.assessmentForm.get('numberOfQuestionsToDisplay')?.setValue(0, { emitEvent: false })
      this.assessmentForm.get('noOfSection')?.setValue(1, { emitEvent: false })
      this.updateSections(1)
      this.selectedSectionIndex = 0
      this.updateValidators()
    })
  }

  setupQuestionWeightageTypeSubscription(): void {
    this.questionWeightageTypeSubscription = this.assessmentForm.get('questionWeightageType')?.valueChanges.subscribe((newValue) => {

      this.previousQuestionWeightageType = newValue
      // Reset fields when switching weightage type
      this.assessmentForm.get('numberOfQuestionsToDisplay')?.setValue(0, { emitEvent: false })
      this.assessmentForm.get('noOfSection')?.setValue(1, { emitEvent: false })
      this.updateSections(1)
      this.selectedSectionIndex = 0
      this.updateValidators()

    })
  }

  setupNoOfSectionSubscription(): void {
    this.noOfSectionSubscription = this.assessmentForm.get('noOfSection')?.valueChanges.subscribe((value) => {
      if (value && value >= 1 && value <= 5) {
        this.updateSections(value)
        if (this.selectedSectionIndex >= value) {
          this.selectedSectionIndex = value - 1
        }
        this.updateValidators()
      }
    })
  }

  updateSections(count: number): void {
    const sections = this.assessmentForm.get('sections') as FormArray
    const currentLength = sections.length

    if (count > currentLength) {
      // Add new sections
      for (let i = currentLength; i < count; i++) {
        sections.push(this.createSectionGroup())
      }
    } else if (count < currentLength) {
      // Remove extra sections
      for (let i = currentLength - 1; i >= count; i--) {
        sections.removeAt(i)
      }
    }
  }

  createSectionGroup(): FormGroup {
    return this.fb.group({
      paragraph: [false],
      difficultyLevels: this.fb.array(
        this.difficultyLevels.map(() => this.createDifficultyLevelGroup())
      )
    })
  }

  createDifficultyLevelGroup(): FormGroup {
    return this.fb.group({
      numberOfQuestions: [0, [Validators.min(0)]],
      marksPerQuestion: [0, [Validators.min(0)]]
    })
  }

  get sections(): FormArray {
    return this.assessmentForm.get('sections') as FormArray
  }

  get hasMultipleSections(): boolean {
    const rawValue = this.assessmentForm.getRawValue()
    return (rawValue.noOfSection || 1) > 1
  }

  getSectionDifficultyLevels(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('difficultyLevels') as FormArray
  }

  calculateTotalMarks(sectionIndex: number, levelIndex: number): number {
    const difficultyLevels = this.getSectionDifficultyLevels(sectionIndex)
    const level = difficultyLevels.at(levelIndex)
    const questions = level.get('numberOfQuestions')?.value || 0
    const marks = level.get('marksPerQuestion')?.value || 0
    return questions * marks
  }

  getSectionTotalQuestions(sectionIndex: number): number {
    const difficultyLevels = this.getSectionDifficultyLevels(sectionIndex)
    let total = 0
    for (let i = 0; i < difficultyLevels.length; i++) {
      total += difficultyLevels.at(i).get('numberOfQuestions')?.value || 0
    }
    return total
  }

  getSectionTotalMarks(sectionIndex: number): number {
    const difficultyLevels = this.getSectionDifficultyLevels(sectionIndex)
    let total = 0
    for (let i = 0; i < difficultyLevels.length; i++) {
      total += this.calculateTotalMarks(sectionIndex, i)
    }
    return total
  }

  getGrandTotalQuestions(): number {
    let grandTotal = 0
    for (let i = 0; i < this.sections.length; i++) {
      grandTotal += this.getSectionTotalQuestions(i)
    }
    return grandTotal
  }

  getGrandTotalMarks(): number {
    let grandTotal = 0
    for (let i = 0; i < this.sections.length; i++) {
      grandTotal += this.getSectionTotalMarks(i)
    }
    return grandTotal
  }

  selectSection(index: number): void {
    this.selectedSectionIndex = index
  }

  populateForm(data: any): void {
    // Determine assessment type based on compatibilityLevel
    const assessmentType = data.compatibilityLevel === NsAssessment.ECompatibilityLevel.ADVANCED ? 'advanced' : 'basic'

    // Basic fields
    this.assessmentForm.patchValue({
      assessmentType: assessmentType,
      name: data.name || '',
      description: data.description || '',
      showTimer: data.showTimer !== undefined ? data.showTimer : true,
      maxAssessmentRetakeAttempts: data.maxAssessmentRetakeAttempts !== undefined && data.maxAssessmentRetakeAttempts !== null ? data.maxAssessmentRetakeAttempts : null,
      scoreCutoffType: data.scoreCutoffType || 'AssessmentLevel',
      coolOffPeriod: data.coolOffPeriod !== undefined && data.coolOffPeriod !== null ? data.coolOffPeriod : null
    }, { emitEvent: false })

    // Duration - convert from seconds to hours, minutes, seconds
    if (data.expectedDuration) {
      const hours = Math.floor(data.expectedDuration / 3600)
      const minutes = Math.floor((data.expectedDuration % 3600) / 60)
      const seconds = data.expectedDuration % 60

      this.assessmentForm.patchValue({
        durationHours: hours,
        durationMinutes: minutes,
        durationSeconds: seconds
      }, { emitEvent: false })
    }

    // Advanced assessment specific fields
    if (assessmentType === 'advanced') {
      this.assessmentForm.patchValue({
        questionWeightageType: data.assessmentType || null,
        noOfSection: data.noOfSection || 1
      }, { emitEvent: false })

      // Question Weightage specific fields
      if (data.assessmentType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
        this.assessmentForm.patchValue({
          showMarks: data.showMarks || 'No',
          minimumPassPercentage: data.minimumPassPercentage || 50,
          negativeMarkingPercentage: data.negativeMarkingPercentage || '0%',
          sectionalPassPercentage: data.sectionalPassPercentage || 'No',
          sectionTimeBound: data.sectionTimeBound || 'No'
        }, { emitEvent: false })

        // Populate sections if available
        if (data.children && data.children.length > 0) {
          // Update sections count
          this.updateSections(data.children.length)

          // Populate each section
          const sectionsArray = this.assessmentForm.get('sections') as FormArray
          data.children.forEach((section: any, sectionIndex: number) => {
            const sectionGroup = sectionsArray.at(sectionIndex) as FormGroup
            // Check sectionType field to determine if it's a paragraph section
            const isParagraph = section.sectionType === 'paragraph' || false
            sectionGroup.patchValue({
              paragraph: isParagraph
            }, { emitEvent: false })

            // Populate difficulty levels from sectionLevelDefinition
            if (section.sectionLevelDefinition) {
              const difficultyLevelsArray = sectionGroup.get('difficultyLevels') as FormArray
              this.difficultyLevels.forEach((levelName: string, levelIndex: number) => {
                const levelData = section.sectionLevelDefinition[levelName]
                const levelGroup = difficultyLevelsArray.at(levelIndex) as FormGroup
                levelGroup.patchValue({
                  numberOfQuestions: levelData?.noOfQuestions || 0,
                  marksPerQuestion: levelData?.marksForQuestion || 0
                }, { emitEvent: false })
              })
            }
          })
        }
      }

      // Option Weightage specific fields
      if (data.assessmentType === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE) {
        this.assessmentForm.patchValue({
          numberOfQuestionsToDisplay: data.totalQuestions || 0,
        }, { emitEvent: false })
      }

    }

    // Update validators after populating
    this.updateValidators()

    // Store current questionWeightageType for change detection
    this.previousQuestionWeightageType = this.assessmentForm.get('questionWeightageType')?.value

    // Disable fields when editing existing assessment
    this.assessmentForm.get('assessmentType')?.disable()
    this.assessmentForm.get('scoreCutoffType')?.disable()
    this.assessmentForm.get('questionWeightageType')?.disable()
    this.assessmentForm.get('noOfSection')?.disable()

    // Disable all section forms
    const sectionsArray = this.assessmentForm.get('sections') as FormArray
    sectionsArray.controls.forEach(sectionControl => {
      sectionControl.get('paragraph')?.disable()
      const difficultyLevels = sectionControl.get('difficultyLevels') as FormArray
      difficultyLevels.controls.forEach(levelControl => {
        levelControl.get('numberOfQuestions')?.disable()
        levelControl.get('marksPerQuestion')?.disable()
      })
    })

    // If read-only mode, disable the entire form (after populating values)
    if (this.isReadOnly) {
      this.assessmentForm.disable()
    }
  }

  updateValidators(): void {
    const showTimer = this.assessmentForm.get('showTimer')?.value
    const assessmentType = this.assessmentForm.get('assessmentType')?.value
    const questionWeightageTypeValue = this.assessmentForm.get('questionWeightageType')?.value
    const durationHours = this.assessmentForm.get('durationHours')
    const durationMinutes = this.assessmentForm.get('durationMinutes')
    const durationSeconds = this.assessmentForm.get('durationSeconds')
    const maxAssessmentRetakeAttempts = this.assessmentForm.get('maxAssessmentRetakeAttempts')
    const scoreCutoffType = this.assessmentForm.get('scoreCutoffType')
    const questionWeightageType = this.assessmentForm.get('questionWeightageType')
    const numberOfQuestionsToDisplay = this.assessmentForm.get('numberOfQuestionsToDisplay')
    const coolOffPeriod = this.assessmentForm.get('coolOffPeriod')

    // coolOffPeriod validator - only required when contextCategory matches
    if (this.showCoolOffPeriod) {
      coolOffPeriod?.setValidators([Validators.required, Validators.min(1), Validators.max(7)])
    } else {
      coolOffPeriod?.clearValidators()
    }

    // Duration validators
    if (this.isFinalAssessment || (this.isPracticeAssessment && showTimer)) {
      durationHours?.setValidators([Validators.required, Validators.min(0), Validators.max(23)])
      durationMinutes?.setValidators([Validators.required, Validators.min(0), Validators.max(59)])
      durationSeconds?.setValidators([Validators.required, Validators.min(0), Validators.max(59)])
    } else {
      durationHours?.setValidators([Validators.min(0), Validators.max(23)])
      durationMinutes?.setValidators([Validators.min(0), Validators.max(59)])
      durationSeconds?.setValidators([Validators.min(0), Validators.max(59)])
    }

    // maxAssessmentRetakeAttempts validator - only required for Final Assessment
    if (this.isFinalAssessment) {
      maxAssessmentRetakeAttempts?.setValidators([Validators.required])
    } else {
      maxAssessmentRetakeAttempts?.clearValidators()
    }

    // scoreCutoffType validator - only required for Final Assessment with Basic assessment type
    if (this.isFinalAssessment && assessmentType === 'basic') {
      scoreCutoffType?.setValidators([Validators.required])
    } else {
      scoreCutoffType?.clearValidators()
    }

    // questionWeightageType validator - only required for Advanced Assessment
    if (assessmentType === 'advanced') {
      questionWeightageType?.setValidators([Validators.required])
    } else {
      questionWeightageType?.clearValidators()
    }

    // numberOfQuestionsToDisplay validator - only required for Option Weightage
    if (assessmentType === 'advanced' && questionWeightageTypeValue === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE) {
      numberOfQuestionsToDisplay?.setValidators([Validators.required, Validators.min(0)])
    } else {
      numberOfQuestionsToDisplay?.clearValidators()
    }

    // noOfSection validator - only required for Question Weightage
    const noOfSection = this.assessmentForm.get('noOfSection')
    if (assessmentType === 'advanced' && questionWeightageTypeValue === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      noOfSection?.setValidators([Validators.required, Validators.min(1), Validators.max(5)])
    } else {
      noOfSection?.clearValidators()
    }

    // Question Weightage specific validators
    const showMarks = this.assessmentForm.get('showMarks')
    const sectionalPassPercentage = this.assessmentForm.get('sectionalPassPercentage')
    const sectionTimeBound = this.assessmentForm.get('sectionTimeBound')
    const minimumPassPercentage = this.assessmentForm.get('minimumPassPercentage')
    const negativeMarkingPercentage = this.assessmentForm.get('negativeMarkingPercentage')

    if (assessmentType === 'advanced' && questionWeightageTypeValue === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      showMarks?.setValidators([Validators.required])
      minimumPassPercentage?.setValidators([Validators.required, Validators.min(0), Validators.max(100)])
      negativeMarkingPercentage?.setValidators([Validators.required])

      // Sectional validators only when more than 1 section
      const rawValue = this.assessmentForm.getRawValue()
      const totalSections = rawValue.noOfSection || 1
      if (totalSections > 1) {
        sectionalPassPercentage?.setValidators([Validators.required])
        sectionTimeBound?.setValidators([Validators.required])
      } else {
        sectionalPassPercentage?.clearValidators()
        sectionTimeBound?.clearValidators()
      }
    } else {
      showMarks?.clearValidators()
      sectionalPassPercentage?.clearValidators()
      sectionTimeBound?.clearValidators()
      minimumPassPercentage?.clearValidators()
      negativeMarkingPercentage?.clearValidators()
    }

    durationHours?.updateValueAndValidity({ emitEvent: false })
    durationMinutes?.updateValueAndValidity({ emitEvent: false })
    durationSeconds?.updateValueAndValidity({ emitEvent: false })
    coolOffPeriod?.updateValueAndValidity({ emitEvent: false })
    maxAssessmentRetakeAttempts?.updateValueAndValidity({ emitEvent: false })
    scoreCutoffType?.updateValueAndValidity({ emitEvent: false })
    questionWeightageType?.updateValueAndValidity({ emitEvent: false })
    numberOfQuestionsToDisplay?.updateValueAndValidity({ emitEvent: false })
    noOfSection?.updateValueAndValidity({ emitEvent: false })
    showMarks?.updateValueAndValidity({ emitEvent: false })
    sectionalPassPercentage?.updateValueAndValidity({ emitEvent: false })
    sectionTimeBound?.updateValueAndValidity({ emitEvent: false })
    minimumPassPercentage?.updateValueAndValidity({ emitEvent: false })
    negativeMarkingPercentage?.updateValueAndValidity({ emitEvent: false })
  }

  initForm(): void {
    this.assessmentForm = this.fb.group({
      assessmentType: ['basic', Validators.required],
      questionWeightageType: [null],
      numberOfQuestionsToDisplay: [0],
      noOfSection: [1],
      sections: this.fb.array([this.createSectionGroup()]),
      name: ['', [Validators.required, Validators.maxLength(this.nameMaxLength), Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\]*!'\s]+$/)]],
      scoreCutoffType: ['AssessmentLevel', Validators.required],
      maxAssessmentRetakeAttempts: [null, Validators.required],
      durationHours: [0, [Validators.min(0), Validators.max(23)]],
      durationMinutes: [0, [Validators.min(0), Validators.max(59)]],
      durationSeconds: [0, [Validators.min(0), Validators.max(59)]],
      coolOffPeriod: [null, [Validators.min(1), Validators.max(7)]],
      description: ['', Validators.maxLength(this.instructionsMaxLength)],
      showTimer: [true],
      // Question Weightage settings
      showMarks: ['No'],
      sectionalPassPercentage: ['No'],
      sectionTimeBound: ['No'],
      minimumPassPercentage: [50, [Validators.min(0), Validators.max(100)]],
      negativeMarkingPercentage: ['0%']
    })
  }

  get nameLength(): number {
    return this.assessmentForm.get('name')?.value?.length || 0
  }

  get descriptionLength(): number {
    return this.assessmentForm.get('description')?.value?.length || 0
  }

  get controls() {
    return this.assessmentForm.controls
  }

  get totalDuration(): number {
    const hours = this.assessmentForm.get('durationHours')?.value || 0
    const minutes = this.assessmentForm.get('durationMinutes')?.value || 0
    const seconds = this.assessmentForm.get('durationSeconds')?.value || 0
    return hours + minutes + seconds
  }

  get isDurationRequired(): boolean {
    return this.isFinalAssessment || (this.isPracticeAssessment && this.assessmentForm.get('showTimer')?.value)
  }

  get isDurationInvalid(): boolean {
    return this.durationTouched && this.isDurationRequired && this.totalDuration <= 0
  }

  get isFormValid(): boolean {
    if (!this.assessmentForm.valid) {
      return false
    }
    // Additional check: if duration is required, total duration must be > 0
    if (this.isDurationRequired && this.totalDuration <= 0) {
      return false
    }
    // For Question Weightage: validate that if questions > 0, marks must also be > 0
    if (this.assessmentForm.get('questionWeightageType')?.value === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      if (!this.areSectionDifficultyLevelsValid()) {
        return false
      }
    }
    return true
  }

  /**
   * Validates that for each difficulty level, questions and marks must be consistent
   * (both > 0 or both = 0)
   */
  areSectionDifficultyLevelsValid(): boolean {
    const sectionsArray = this.assessmentForm.get('sections') as FormArray
    for (let sectionIndex = 0; sectionIndex < sectionsArray.length; sectionIndex++) {
      const section = sectionsArray.at(sectionIndex)
      const difficultyLevels = section.get('difficultyLevels') as FormArray
      for (let levelIndex = 0; levelIndex < difficultyLevels.length; levelIndex++) {
        const level = difficultyLevels.at(levelIndex)
        const numberOfQuestions = level.get('numberOfQuestions')?.value || 0
        const marksPerQuestion = level.get('marksPerQuestion')?.value || 0
        // If questions are added but no marks assigned, it's invalid
        if (numberOfQuestions > 0 && marksPerQuestion <= 0) {
          return false
        }
        // If marks are added but no questions assigned, it's invalid
        if (marksPerQuestion > 0 && numberOfQuestions <= 0) {
          return false
        }
      }
    }
    return true
  }

  /**
   * Checks if a specific difficulty level has questions but no marks assigned
   */
  isDifficultyLevelMarksInvalid(sectionIndex: number, levelIndex: number): boolean {
    const section = this.sections.at(sectionIndex)
    if (!section) return false
    const difficultyLevels = section.get('difficultyLevels') as FormArray
    const level = difficultyLevels.at(levelIndex)
    if (!level) return false
    const numberOfQuestions = level.get('numberOfQuestions')?.value || 0
    const marksPerQuestion = level.get('marksPerQuestion')?.value || 0
    return numberOfQuestions > 0 && marksPerQuestion <= 0
  }

  /**
   * Checks if a specific difficulty level has marks but no questions assigned
   */
  isDifficultyLevelQuestionsInvalid(sectionIndex: number, levelIndex: number): boolean {
    const section = this.sections.at(sectionIndex)
    if (!section) return false
    const difficultyLevels = section.get('difficultyLevels') as FormArray
    const level = difficultyLevels.at(levelIndex)
    if (!level) return false
    const numberOfQuestions = level.get('numberOfQuestions')?.value || 0
    const marksPerQuestion = level.get('marksPerQuestion')?.value || 0
    return marksPerQuestion > 0 && numberOfQuestions <= 0
  }

  get isReadOnly(): boolean {
    return this.assessmentService.getReadOnly()
  }

  onDurationBlur(): void {
    this.durationTouched = true
  }

  onUpdate(): void {
    if (!this.isFormValid) {
      return
    }

    // Get raw form values (includes disabled fields)
    const formValues = this.assessmentForm.getRawValue()
    const changedData: any = {}

    // Check name
    const trimmedName = formValues.name?.trim() || ''
    if (trimmedName !== this.assessmentData.name) {
      changedData.name = trimmedName
    }

    // Check description
    if (formValues.description !== this.assessmentData.description) {
      changedData.description = formValues.description
    }

    // Check duration
    const durationInSeconds =
      (formValues.durationHours * 3600) +
      (formValues.durationMinutes * 60) +
      formValues.durationSeconds

    if (durationInSeconds !== this.assessmentData.expectedDuration) {
      changedData.expectedDuration = durationInSeconds
    }

    // Check maxAssessmentRetakeAttempts (for Final Assessment)
    if (this.isFinalAssessment && formValues.maxAssessmentRetakeAttempts !== this.assessmentData.maxAssessmentRetakeAttempts) {
      changedData.maxAssessmentRetakeAttempts = formValues.maxAssessmentRetakeAttempts
    }

    // Check showTimer (for Practice Assessment)
    if (this.isPracticeAssessment && formValues.showTimer !== this.assessmentData.showTimer) {
      changedData.showTimer = formValues.showTimer
    }

    // Check coolOffPeriod
    if (this.showCoolOffPeriod && formValues.coolOffPeriod !== this.assessmentData.coolOffPeriod) {
      changedData.coolOffPeriod = formValues.coolOffPeriod
    }

    // Check Question Weightage fields
    if (formValues.questionWeightageType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      if (formValues.showMarks !== this.assessmentData.showMarks) {
        changedData.showMarks = formValues.showMarks
      }
      if (formValues.minimumPassPercentage !== this.assessmentData.minimumPassPercentage) {
        changedData.minimumPassPercentage = formValues.minimumPassPercentage
      }
      if (formValues.negativeMarkingPercentage !== this.assessmentData.negativeMarkingPercentage) {
        changedData.negativeMarkingPercentage = formValues.negativeMarkingPercentage
      }
      if (formValues.noOfSection > 1) {
        if (formValues.sectionalPassPercentage !== this.assessmentData.sectionalPassPercentage) {
          changedData.sectionalPassPercentage = formValues.sectionalPassPercentage
        }
        if (formValues.sectionTimeBound !== this.assessmentData.sectionTimeBound) {
          changedData.sectionTimeBound = formValues.sectionTimeBound
        }
      }
    }

    // Check Option Weightage fields
    if (formValues.questionWeightageType === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE) {
      if (formValues.numberOfQuestionsToDisplay !== this.assessmentData.totalQuestions) {
        // Update root assessment totals
        changedData.totalQuestions = formValues.numberOfQuestionsToDisplay
        changedData.maxQuestions = formValues.numberOfQuestionsToDisplay

        // If assessment has children (sections), update them as well
        if (this.assessmentData.children && this.assessmentData.children.length > 0) {
          changedData.updateChildren = true
          changedData.childrenUpdates = {
            totalQuestions: formValues.numberOfQuestionsToDisplay,
            maxQuestions: formValues.numberOfQuestionsToDisplay
          }
        }
      }
    }

    // Only emit if there are changes
    if (Object.keys(changedData).length > 0) {
      // For option weightage with sections, ensure parent changes are included
      const emitData: any = { changedData, identifier: this.assessmentData.identifier }

      if (formValues.questionWeightageType === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE &&
        changedData.totalQuestions !== undefined && changedData.maxQuestions !== undefined) {
        emitData.parentChanges = {
          totalQuestions: changedData.totalQuestions,
          maxQuestions: changedData.maxQuestions
        }
      }

      this.updated.emit(emitData)
    } else {
      // No changes detected
      this.snackBar.open('No changes detected')
    }
  }

  onSave(): void {
    if (!this.isFormValid) {
      return
    }

    // Get raw form values (includes disabled fields)
    const formValues = this.assessmentForm.getRawValue()

    // Creating new assessment - send all data
    let randomNumber = ''
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < 16; i++) {
      randomNumber += Math.floor(Math.random() * 10)
    }

    const assessmentData: any = {
      code: randomNumber,
      assessmentType: formValues.questionWeightageType || '',
      name: formValues.name?.trim() || '',
      description: formValues.description,
      primaryCategory: this.config?.primaryCategory,
      contextCategory: this.config?.contextCategory,
      compatibilityLevel: (formValues.assessmentType === 'basic') ? NsAssessment.ECompatibilityLevel.BASIC : NsAssessment.ECompatibilityLevel.ADVANCED,
      createdBy: this.configSvc.userProfile?.userId || '',
      createdFor: [this.configSvc.userProfile?.rootOrgId || ''],
      framework: 'igot',
      license: 'CC BY 4.0',
      mimeType: 'application/vnd.sunbird.questionset',
      language: ['English']
    }

    // Duration - convert to total seconds
    const durationInSeconds =
      (formValues.durationHours * 3600) +
      (formValues.durationMinutes * 60) +
      formValues.durationSeconds

    if (this.isDurationRequired && durationInSeconds > 0) {
      assessmentData.expectedDuration = durationInSeconds
    }

    // Cool off period - only include if shown
    if (this.showCoolOffPeriod && formValues.coolOffPeriod) {
      assessmentData.coolOffPeriod = formValues.coolOffPeriod
    }

    // Final Assessment specific fields
    if (this.isFinalAssessment) {
      assessmentData.maxAssessmentRetakeAttempts = formValues.maxAssessmentRetakeAttempts

      if (formValues.assessmentType === 'basic') {
        assessmentData.scoreCutoffType = formValues.scoreCutoffType
        assessmentData.noOfSection = formValues.noOfSection || 1
      } else if (formValues.assessmentType === 'advanced') {
        // For advanced assessments, determine scoreCutoffType based on number of sections
        if (formValues.questionWeightageType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
          assessmentData.scoreCutoffType = formValues.noOfSection === 1 ? 'AssessmentLevel' : 'SectionLevel'
        } else {
          assessmentData.scoreCutoffType = 'AssessmentLevel'
        }
      }
    }

    // Practice Assessment specific fields
    if (this.isPracticeAssessment) {
      assessmentData.showTimer = formValues.showTimer
    }

    // Advanced Assessment specific fields
    if (formValues.assessmentType === 'advanced') {

      if (formValues.questionWeightageType === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE) {
        assessmentData.totalQuestions = formValues.numberOfQuestionsToDisplay
        assessmentData.maxQuestions = formValues.numberOfQuestionsToDisplay
        assessmentData.noOfSection = 1
      }

      if (formValues.questionWeightageType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
        assessmentData.questionTagging = 'EMDH' // Default question tagging
        assessmentData.noOfSection = formValues.noOfSection
        assessmentData.showMarks = formValues.showMarks
        assessmentData.minimumPassPercentage = formValues.minimumPassPercentage
        assessmentData.negativeMarkingPercentage = formValues.negativeMarkingPercentage

        if (formValues.noOfSection > 1) {
          assessmentData.sectionalPassPercentage = formValues.sectionalPassPercentage
          assessmentData.sectionTimeBound = formValues.sectionTimeBound
        }

        // Include sections data with difficulty levels in sectionLevelDefinition format
        assessmentData.children = formValues.sections.map((section: any, index: number) => {
          const sectionLevelDefinition: any = {}
          section.difficultyLevels.forEach((level: any, levelIndex: number) => {
            const levelName = this.difficultyLevels[levelIndex]
            sectionLevelDefinition[levelName] = {
              noOfQuestions: level.numberOfQuestions,
              marksForQuestion: level.marksPerQuestion
            }
          })

          return {
            sectionIndex: index,
            paragraph: section.paragraph,
            sectionLevelDefinition: sectionLevelDefinition,
            totalQuestions: this.getSectionTotalQuestions(index),
            totalMarks: this.getSectionTotalMarks(index)
          }
        })

        // Add grand totals
        assessmentData.totalQuestions = this.getGrandTotalQuestions()
        assessmentData.totalMarks = this.getGrandTotalMarks()
        assessmentData.maxQuestions = this.getGrandTotalQuestions()
      }
    }
    // Emit the assessment data
    this.saved.emit(assessmentData)
  }

  onCancel(): void {
    this.cancelled.emit()
  }

}
