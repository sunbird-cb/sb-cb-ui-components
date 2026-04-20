import { Component, OnInit, Inject } from '@angular/core'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import * as XLSX from 'xlsx'
import { v4 as uuidv4 } from 'uuid'
import { AssessmentService } from '../../service/assessment.service'
import { NsAssessment } from '../../service/assessment.model'
import { HttpClient } from '@angular/common/http'

interface QuestionData {
  identifier: string
  code: string
  objectType: string
  mimeType: string
  primaryCategory: string
  qType: string
  answer: string
  name: string
  body: string
  choices: any
  editorState: any
  rhsChoices?: any[]
  questionLevel?: string
  totalMarks?: number
  compatibilityLevel?: number
}

interface ColumnValidation {
  [key: string]: {
    allowedList: string[]
  }
}

@Component({
  selector: 'sb-uic-bulk-upload-all-type-question',
  templateUrl: './bulk-upload-all-type-question.component.html',
  styleUrls: ['./bulk-upload-all-type-question.component.scss']
})
export class BulkUploadAllTypeQuestionComponent implements OnInit {
  maxFileSize: number = 400 * 1024 * 1024 // 400 MB
  questionTracking: any[] = []

  file: File | null = null
  validUploadedValues: QuestionData[] = []
  selectedQuestions: QuestionData[] = []
  isProcessing = false
  uploadProgress = 0
  assessmentData: any
  isDragOver = false
  totalQuestions: number | null = null
  compatibilityLevel: any
  assessmentType: any
  existingQuestionsCount: number = 0
  isOldTemplate: boolean = false

  columnValidate: ColumnValidation = {
    questionWeightage: {
      allowedList: ['QuestionNo', 'QuestionType', 'QuestionTagging', 'Question', 'Option1', 'isOption1Correct', 'Option2',
        'isOption2Correct', 'Option3', 'isOption3Correct', 'Option4', 'isOption4Correct', 'Option5', 'isOption5Correct',
        'Option6', 'isOption6Correct', 'Option7', 'isOption7Correct'],
    },
    optionalWeightage: {
      allowedList: ['QuestionNo', 'QuestionType', 'Question', 'Option1', 'isOption1Correct', 'Option2', 'isOption2Correct',
        'Option3', 'isOption3Correct', 'Option4', 'isOption4Correct', 'Option5', 'isOption5Correct', 'Option6', 'isOption6Correct',
        'Option7', 'isOption7Correct', 'Option8', 'isOption8Correct', 'Option9', 'isOption9Correct', 'Option10', 'isOption10Correct'],
    },
    questionOptionWeightage: {
      allowedList: ['QuestionNo', 'QuestionType', 'Question', 'MaximumMarks', 'Option1', 'Option1Weight', 'Option2', 'Option2Weight',
        'Option3', 'Option3Weight', 'Option4', 'Option4Weight', 'Option5', 'Option5Weight', 'Option6', 'Option6Weight',
        'Option7', 'Option7Weight', 'Option8', 'Option8Weight', 'Option9', 'Option9Weight', 'Option10', 'Option10Weight'],
    },
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BulkUploadAllTypeQuestionComponent>,
    private snackBar: MatSnackBar,
    private assessmentService: AssessmentService,
    private http: HttpClient,
  ) {
    // Set data from dialog input
    if (data) {
      this.maxFileSize = data.maxFileSize || this.maxFileSize
      this.totalQuestions = data.totalQuestions || null
      this.compatibilityLevel = data.compatibilityLevel
      this.assessmentType = data.assessmentType
      this.existingQuestionsCount = data.existingQuestionsCount || 0

      // Transform questionTracking object to array format
      if (data.questionTracking) {
        this.questionTracking = Object.keys(data.questionTracking).map(key => ({
          value: key,
          name: key,
          total: data.questionTracking[key].noOfQuestions || 0,
          marks: data.questionTracking[key].marksForQuestion || 0,
          count: 0
        }))
      } else {
        this.questionTracking = []
      }
    }
  }

  ngOnInit(): void {
    this.assessmentData = this.assessmentService.getAssessmentHierarchyData()
    // Initialize selected questions with tracking
    if (this.questionTracking && this.questionTracking.length > 0) {
      this.questionTracking.forEach(item => {
        item.count = item.count || 0
      })
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.processFile(file)
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = true
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = false
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = false

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      this.processFile(files[0])
    }
  }

  processFile(file: File): void {
    const fileName = file.name.replace(/[^A-Za-z0-9_.]/g, '')

    if (!fileName.toLowerCase().endsWith('.csv')) {
      this.snackBar.open('Invalid file format. Please upload a CSV file.')
      return
    }

    if (file.size > this.maxFileSize) {
      this.snackBar.open('File size exceeds maximum limit of 400 MB.')
      return
    }

    this.file = file
    this.isProcessing = true
    this.parseCSVFile()
  }

  parseCSVFile(): void {
    if (!this.file) return

    const fileReader = new FileReader()
    fileReader.onload = (e: any) => {
      try {
        const arrayBuffer = e.target.result
        const data = new Uint8Array(arrayBuffer)
        // Improved UTF-8 decoding
        const decoder = new TextDecoder('utf-8')
        const bstr = decoder.decode(data)
        const workbook = XLSX.read(bstr, { type: 'binary', raw: true })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const rawData = XLSX.utils.sheet_to_json(worksheet, { raw: true })

        // Filter and clean data
        const validValues = rawData.filter((row: any) => row.Question).map((row: any) => {
          // Clean string values
          Object.keys(row).forEach(key => {
            if (typeof row[key] === 'string') {
              row[key] = row[key].replace(/[\t\n\r]/gm, '').trim()
            }
          })
          return row
        })

        if (!this.validateTemplate(validValues)) {
          this.file = null
          this.isProcessing = false
          return
        }

        this.convertToQuestionFormat(validValues)
        this.isProcessing = false
      } catch (error) {
        console.error('Error parsing CSV:', error)
        this.snackBar.open('Error parsing CSV file. Please check the file format.')
        this.file = null
        this.isProcessing = false
      }
    }

    fileReader.readAsArrayBuffer(this.file)
  }

  validateTemplate(data: any[]): boolean {
    if (!data || data.length === 0) {
      this.snackBar.open('No valid questions found in the uploaded file.')
      return false
    }

    const firstRow = data[0]
    const isOldTemplate = !('QuestionNo' in firstRow) && !('QuestionType' in firstRow)

    // If it's a NEW template (advanced) and assessment is BASIC, reject it
    if (!isOldTemplate && this.compatibilityLevel === NsAssessment.ECompatibilityLevel.BASIC) {
      this.snackBar.open('Advanced template format is not supported for basic assessments. Please use the basic MCQ template.', '', { duration: 4000 })
      return false
    }

    // For old template (basic MCQ), only Question and Option1 are required
    if (isOldTemplate) {
      // Check if old template is allowed (only for basic assessments)
      if (this.compatibilityLevel !== NsAssessment.ECompatibilityLevel.BASIC) {
        this.snackBar.open('Old template format is only supported for basic assessments. Please use the new template format.', '', { duration: 4000 })
        return false
      }

      if (!('Question' in firstRow) || !('Option1' in firstRow)) {
        this.snackBar.open('Invalid template. Missing required columns: Question, Option1')
        return false
      }

      // Old template is valid
      return true
    }

    // For new template, check for required columns
    const requiredColumns = ['QuestionNo', 'QuestionType', 'Question', 'Option1']
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))

    if (missingColumns.length > 0) {
      this.snackBar.open(`Invalid template. Missing columns: ${missingColumns.join(', ')}`)
      return false
    }

    // Validate column structure based on assessment type
    if (!this.validateColumnStructure(data)) {
      return false
    }

    // Validate question types
    const validTypes = ['MCQ-SCA', 'MCQ-MCA', 'T/F', 'FTB', 'MTF', 'MCQ-MCA-W', 'MCQ-SCA-W']
    const invalidTypes = data.filter(row => !validTypes.includes(row.QuestionType))
    if (invalidTypes.length > 0) {
      this.snackBar.open(
        'Invalid question type found. Supported types: MCQ-SCA, MCQ-MCA, T/F, FTB, MTF, MCQ-MCA-W',
        '',
        { duration: 3000 }
      )
      return false
    }

    // Validate question tagging for QUESTION_WEIGHTAGE
    if (this.assessmentData?.assessmentType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      if (!this.checkValidQuestionTagging(data)) {
        this.snackBar.open(
          'Invalid question tagging. Please upload with valid question tagging.',
          '',
          { duration: 3000 }
        )
        return false
      }
    }

    return true
  }

  validateColumnStructure(data: any[]): boolean {
    if (!this.assessmentData?.assessmentType) {
      return true
    }

    let validationKey = ''
    if (this.assessmentData.assessmentType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      validationKey = 'questionWeightage'
    } else if (this.assessmentData.assessmentType === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE) {
      validationKey = 'optionalWeightage'
    } else if (this.assessmentData.assessmentType === NsAssessment.EAssessmentType.QUESTION_OPTION_WEIGHTAGE) {
      validationKey = 'questionOptionWeightage'
    }

    if (validationKey && this.columnValidate[validationKey]) {
      const allowedColumns = this.columnValidate[validationKey].allowedList
      const invalidRows = data.filter((row: any) => {
        const rowColumns = Object.keys(row)
        const invalidColumns = rowColumns.filter(col => !allowedColumns.includes(col))
        return invalidColumns.length > 0
      })

      if (invalidRows.length > 0) {
        this.snackBar.open('Invalid template uploaded. Please download and use the correct template.')
        return false
      }
    }

    return true
  }

  checkValidQuestionTagging(values: any[]): boolean {
    const validTags = [
      'Proficiency1',
      'Proficiency2',
      'Proficiency3',
      'Proficiency4',
      'Easy',
      'Medium',
      'Difficult',
      'HOTS',
    ]

    return values?.every((ele: any) => validTags.includes(ele.QuestionTagging)) ?? false
  }

  convertToQuestionFormat(rawData: any[]): void {
    const isOldTemplate = !rawData[0].QuestionType
    this.isOldTemplate = isOldTemplate // Store for later use

    // Convert MCQ-SCA-W to MCQ-MCA-W for new template
    if (!isOldTemplate) {
      rawData.forEach((row: any) => {
        if (row.QuestionType === 'MCQ-SCA-W') {
          row.QuestionType = 'MCQ-MCA-W'
        }
      })
    }

    this.validUploadedValues = rawData.map(q => {
      const questionText = q.Question
      const options: any[] = []
      const choicesOptions: any[] = []
      let rhsChoices: any[] = []
      const isWeightedQuestion = q.QuestionType === 'MCQ-MCA-W'
      const isQuestionOptionWeightage = this.assessmentData?.assessmentType === NsAssessment.EAssessmentType.QUESTION_OPTION_WEIGHTAGE

      // Process options based on template type
      let optionIndex = 0
      const startIndex = 1 // Both old and new templates start from Option1
      const maxOptions = 10

      for (let i = startIndex; i <= maxOptions; i++) {
        const optionKey = `Option${i}`
        const optionValue = q[optionKey]

        if (optionValue !== undefined && optionValue !== null && optionValue !== '') {
          let isCorrect: any = false

          if (isOldTemplate) {
            // Old template uses IsOption0Correct, IsOption1Correct format (capital I and S)
            const correctKey = `IsOption${i}Correct`
            const correctValue = q[correctKey]

            if (correctValue !== undefined && correctValue !== null) {
              const correctStr = String(correctValue).trim()
              // Handle boolean values with spaces or string representations
              if (correctStr.toLowerCase() === 'true' || correctStr === 'TRUE') {
                isCorrect = true
              } else if (correctStr.toLowerCase() === 'false' || correctStr === 'FALSE') {
                isCorrect = false
              } else {
                // Try to parse as boolean
                isCorrect = correctValue === true || correctValue === 'true'
              }
            } else {
              isCorrect = false
            }
          } else if (isQuestionOptionWeightage) {
            // For question-option weightage, use Option1Weight, Option2Weight, etc.
            const weightKey = `Option${i}Weight`
            isCorrect = q[weightKey] !== undefined ? q[weightKey] : 0
          } else if (q.QuestionType === 'FTB') {
            // For FTB, check if option is assigned to a blank
            const correctKey = `isOption${i}Correct`
            const correctValue = q[correctKey]
            isCorrect = correctValue && correctValue.toLowerCase() !== 'none' ? correctValue : 'none'
            isCorrect = isCorrect.toLowerCase().split('blank').join('B')
          } else if (q.QuestionType === 'MTF') {
            // For MTF, the correct answer is the matching pair
            isCorrect = q[`isOption${i}Correct`] || ''
          } else if (isWeightedQuestion) {
            // For weighted MCQ, answer is a number (weight)
            const correctKey = `isOption${i}Correct`
            const correctValue = q[correctKey]
            isCorrect = correctValue !== undefined ? Number(correctValue) : 0
          } else {
            // For MCQ types
            const correctKey = `isOption${i}Correct`
            isCorrect = q[correctKey] && q[correctKey].toLowerCase() === 'yes'
          }

          options.push({
            answer: isCorrect,
            value: {
              body: String(optionValue),
              value: optionIndex
            }
          })

          choicesOptions.push({
            value: {
              body: String(optionValue),
              value: optionIndex
            }
          })

          if (q.QuestionType === 'MTF') {
            rhsChoices.push(isCorrect)
          }

          optionIndex++
        }
      }

      // Auto-detect question type for old template
      let detectedQType = q.QuestionType
      if (isOldTemplate) {
        const correctCount = options.filter(o => o.answer === true).length
        detectedQType = correctCount > 1 ? 'MCQ-MCA' : 'MCQ-SCA'
      }

      // Build question object
      const questionData: QuestionData = {
        identifier: uuidv4(),
        code: 'question',
        objectType: 'Question',
        mimeType: 'application/vnd.sunbird.question',
        primaryCategory: this.getPrimaryCategory(detectedQType),
        qType: this.getQType(detectedQType),
        answer: this.getAnswerIndex(options, detectedQType),
        name: questionText,
        body: questionText,
        choices: { options: choicesOptions },
        editorState: {
          options: options,
          question: questionText
        },
        compatibilityLevel: this.assessmentData?.compatibilityLevel,
      }

      if (q.QuestionType === 'MTF') {
        questionData.rhsChoices = rhsChoices
      }

      if (q.QuestionTagging) {
        questionData.questionLevel = q.QuestionTagging
        const trackingItem = this.questionTracking.find(t => t.value === q.QuestionTagging)
        if (trackingItem) {
          questionData.totalMarks = trackingItem.marks
        }
      }

      // Set total marks for question-option weightage
      if (q.MaximumMarks) {
        questionData.totalMarks = Number(q.MaximumMarks)
      }

      return questionData
    })

    // Auto-select all questions
    this.selectedQuestions = [...this.validUploadedValues]
    this.updateQuestionTracking()
  }

  getPrimaryCategory(questionType: string): string {
    switch (questionType) {
      case 'MCQ-SCA':
      case 'MCQ-MCA':
      case 'T/F':
      case 'MCQ-MCA-W':
      case 'MCQ-SCA-TF':
        return 'Multiple Choice Question'
      case 'FTB':
        return 'FTB Question'
      case 'MTF':
        return 'MTF Question'
      default:
        return 'Multiple Choice Question'
    }
  }

  getQType(questionType: string): string {
    switch (questionType) {
      case 'T/F':
        return 'MCQ-SCA-TF'
      case 'MCQ-SCA-W':
        return 'MCQ-MCA-W'
      default:
        return questionType
    }
  }

  getAnswerIndex(options: any[], questionType: string): string {
    const indices: string[] = []
    options.forEach((opt, index) => {
      if (questionType === 'MCQ-MCA-W') {
        // For weighted questions, include if answer is 0 or greater
        if (opt.answer !== undefined && opt.answer !== null && opt.answer !== false && opt.answer !== 'none') {
          indices.push(String(index))
        }
      } else {
        if (opt.answer && opt.answer !== 'none' && opt.answer !== false) {
          indices.push(String(index))
        }
      }
    })
    return indices.join(',')
  }

  onQuestionToggle(event: MatCheckboxChange, question: QuestionData): void {
    if (event.checked) {
      this.selectedQuestions.push(question)
      if (question.questionLevel) {
        const trackingItem = this.questionTracking.find(t => t.value === question.questionLevel)
        if (trackingItem) {
          trackingItem.count++
        }
      }
    } else {
      this.selectedQuestions = this.selectedQuestions.filter(q => q.identifier !== question.identifier)
      if (question.questionLevel) {
        const trackingItem = this.questionTracking.find(t => t.value === question.questionLevel)
        if (trackingItem && trackingItem.count > 0) {
          trackingItem.count--
        }
      }
    }
  }

  updateQuestionTracking(): void {
    // Reset counts before updating
    if (this.questionTracking && this.questionTracking.length > 0) {
      this.questionTracking.forEach(item => {
        item.count = 0
      })
    }

    // Count selected questions by level
    if (this.questionTracking && this.selectedQuestions) {
      this.selectedQuestions.forEach(q => {
        if (q.questionLevel) {
          const trackingItem = this.questionTracking.find(t => t.value === q.questionLevel)
          if (trackingItem) {
            trackingItem.count++
          }
        }
      })
    }
  }

  isQuestionSelected(question: QuestionData): boolean {
    return this.selectedQuestions.some(q => q.identifier === question.identifier)
  }

  clearFile(): void {
    this.file = null
    this.validUploadedValues = []
    this.selectedQuestions = []

    // Reset question tracking counts
    if (this.questionTracking && this.questionTracking.length > 0) {
      this.questionTracking.forEach(item => {
        item.count = 0
      })
    }
  }

  onCreateQuestions(): void {
    if (this.selectedQuestions.length === 0) {
      this.snackBar.open('Please select at least one question.')
      return
    }

    // Check if adding selected questions exceeds the total limit
    if (this.totalQuestions !== null) {
      const totalAfterAdding = this.existingQuestionsCount + this.selectedQuestions.length
      if (totalAfterAdding > this.totalQuestions) {
        const availableSlots = this.totalQuestions - this.existingQuestionsCount
        this.snackBar.open(
          `Cannot add ${this.selectedQuestions.length} questions. You can only add ${availableSlots} more question(s). (${this.existingQuestionsCount} already added, ${this.totalQuestions} total limit)`,
          '',
          { duration: 5000 }
        )
        return
      }
    }

    // Validate questions before creating
    const validation = this.validateQuestions()
    if (!validation.valid) {
      this.snackBar.open(validation.message, '', { duration: 4000 })
      return
    }

    // Close dialog and return selected questions
    this.dialogRef.close({
      action: 'CREATE',
      questions: this.selectedQuestions,
      isOldTemplate: this.isOldTemplate
    })
  }

  validateQuestions(): { valid: boolean; message: string } {
    for (const question of this.selectedQuestions) {
      // Check if question has options
      if (!question.editorState?.options || question.editorState.options.length === 0) {
        return {
          valid: false,
          message: `Question "${question.name.substring(0, 50)}..." has no options.`
        }
      }

      // Check if at least one option has a correct answer
      const hasCorrectAnswer = question.editorState.options.some((o: any) => o.answer === true)
      if (!hasCorrectAnswer && question.qType !== 'FTB' && question.qType !== 'MTF' && question.qType !== 'MCQ-MCA-W') {
        return {
          valid: false,
          message: `Question "${question.name.substring(0, 50)}..." must have at least one correct answer.`
        }
      }

      // Validate based on question type
      if (question.qType === 'MCQ-SCA' || question.qType === 'MCQ-SCA-TF') {
        const correctCount = question.editorState.options.filter((o: any) => o.answer === true).length
        if (correctCount !== 1) {
          return {
            valid: false,
            message: `Single choice question must have exactly one correct answer.`
          }
        }
      } else if (question.qType === 'MCQ-MCA') {
        const correctCount = question.editorState.options.filter((o: any) => o.answer === true).length
        if (correctCount < 1) {
          return {
            valid: false,
            message: `Multiple choice question must have at least one correct answer.`
          }
        }
      } else if (question.qType === 'MTF') {
        const allHaveAnswers = question.editorState.options.every((o: any) => o.answer && o.answer.trim())
        if (!allHaveAnswers) {
          return {
            valid: false,
            message: `All match the following pairs must have answers.`
          }
        }
      } else if (question.qType === 'FTB') {
        const hasAssignedBlanks = question.editorState.options.some(
          (o: any) => o.answer && o.answer !== 'none'
        )
        if (!hasAssignedBlanks) {
          return {
            valid: false,
            message: `Fill in the blanks question must have at least one blank assignment.`
          }
        }
      } else if (question.qType === 'MCQ-MCA-W') {
        // Validate weighted questions
        const allHaveWeights = question.editorState.options.every(
          (o: any) => o.answer !== undefined && o.answer !== null && o.answer >= 0 && o.answer <= 100
        )
        if (!allHaveWeights) {
          return {
            valid: false,
            message: `Weighted question options must have weights between 0 and 100.`
          }
        }
      }
    }

    return { valid: true, message: '' }
  }

  onCancel(): void {
    this.dialogRef.close({
      action: 'CANCEL',
      questions: []
    })
  }

  downloadTemplate() {
    if (this.assessmentData.assessmentType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      const csvUrl = '/assets/questions/QW_template_new.csv'
      this.http.get(csvUrl, { responseType: 'text' }).subscribe(csvContent => {
        this.downloadCSV(csvContent, 'QW_template_new.csv')
      })
    } else if (this.assessmentData.assessmentType === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE) {
      const csvUrl = '/assets/questions/OW_template_new.csv'
      this.http.get(csvUrl, { responseType: 'text' }).subscribe(csvContent => {
        this.downloadCSV(csvContent, 'OW_template_new.csv')
      })
    } else if (this.assessmentData.assessmentType === NsAssessment.EAssessmentType.QUESTION_OPTION_WEIGHTAGE) {
      const csvUrl = '/assets/questions/QOW_template_new.csv'
      this.http.get(csvUrl, { responseType: 'text' }).subscribe(csvContent => {
        this.downloadCSV(csvContent, 'QOW_template_new.csv')
      })
    } else if (this.assessmentData.compatibilityLevel === NsAssessment.ECompatibilityLevel.BASIC) {
      const csvUrl = '/assets/questions/mcq_template.csv'
      this.http.get(csvUrl, { responseType: 'text' }).subscribe(csvContent => {
        this.downloadCSV(csvContent, 'mcq_template.csv')
      })
    }
  }

  downloadReadMe() {
    if (this.assessmentData.assessmentType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      this.downloadPDF('/assets/questions/QW_read_me.pdf', 'QW_read_me.pdf')
    } else if (this.assessmentData.assessmentType === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE) {
      this.downloadPDF('/assets/questions/OW_read_me.pdf', 'OW_read_me.pdf')
    }
  }

  downloadPDF(pdfContent: string, fileName: string) {
    const link = document.createElement('a')
    link.setAttribute('type', 'hidden')
    link.href = pdfContent
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  downloadCSV(csvContent: string, filename: string): void {
    const utf8Content = new TextEncoder().encode(csvContent)
    const blob = new Blob(['\ufeff', utf8Content], { type: 'text/csv; charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  getQuestionTypeName(qType: string): string {
    switch (qType) {
      case 'MCQ-SCA':
        return 'Single Choice'
      case 'MCQ-MCA':
        return 'Multiple Choice'
      case 'MCQ-SCA-TF':
        return 'True/False'
      case 'FTB':
        return 'Fill in the Blanks'
      case 'MTF':
        return 'Match the Following'
      case 'MCQ-MCA-W':
        return 'Multiple Choice (Weighted)'
      default:
        return qType
    }
  }
}
