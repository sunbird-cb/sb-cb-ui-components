import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

interface BlankOption {
  id: number
  text: string
  blankNumber: string | null
}

@Component({
  selector: 'sb-uic-fill-up-the-blanks',
  templateUrl: './fill-up-the-blanks.component.html',
  styleUrls: ['./fill-up-the-blanks.component.scss']
})
export class FillUpTheBlanksComponent implements OnInit, OnChanges {
  @Input() options: BlankOption[] = []
  @Input() ftbCount: number = 0
  @Input() isReadOnly: boolean = false
  @Input() compatibilityLevel: number | undefined
  @Output() optionsUpdated = new EventEmitter<BlankOption[]>()

  blankList: any[] = []
  maxOptions: number = 7
  minOptions: number = 1

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.initializeBlankList()
    if (this.options.length === 0) {
      this.addInitialOptions()
    } else if (this.isBasicAssessment() && this.ftbCount > 0) {
      // For basic assessments with existing options, ensure blank numbers are assigned
      this.adjustOptionsForBasicAssessment()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ftbCount']) {
      this.initializeBlankList()
      // For basic assessments, auto-adjust options to match blank count
      if (this.isBasicAssessment() && this.ftbCount > 0) {
        this.adjustOptionsForBasicAssessment()
      }
    }
    // Also reinitialize if options change and we have ftbCount
    if (changes['options'] && this.ftbCount > 0) {
      this.initializeBlankList()
    }
  }

  initializeBlankList(): void {
    this.blankList = [{ name: 'None', id: 'none' }]
    if (this.ftbCount > 0) {
      for (let index = 0; index < this.ftbCount; index++) {
        this.blankList.push({ name: `Blank ${index + 1}`, id: `B${index + 1}` })
      }
    }
  }

  addInitialOptions(): void {
    // For basic assessments, add options based on ftbCount if available
    if (this.isBasicAssessment() && this.ftbCount > 0) {
      for (let i = 0; i < this.ftbCount; i++) {
        this.addOption(true, `B${i + 1}`)
      }
    } else {
      this.minOptions = this.isBasicAssessment() && this.ftbCount === 0 ? 1 : 2
      // Add minimum required options for advanced assessments
      for (let i = 0; i < this.minOptions; i++) {
        this.addOption()
      }
    }
  }

  addOption(autoAssign: boolean = false, blankNumber: string | null = null): void {
    if (this.options.length < this.maxOptions) {
      const newOption: BlankOption = {
        id: this.options.length + 1,
        text: '',
        blankNumber: autoAssign ? blankNumber : null
      }
      this.options.push(newOption)
      this.emitUpdatedOptions()
    }
  }

  removeOption(index: number): void {
    if (this.options.length > this.minOptions) {
      this.options.splice(index, 1)
      // Update IDs
      this.options.forEach((opt, idx) => {
        opt.id = idx + 1
      })
      this.emitUpdatedOptions()
    }
  }

  onBlankSelectionChange(index: number, selectedBlank: any): void {
    // Check if this blank is already assigned to another option
    // Allow multiple options to have "None" selected
    if (selectedBlank !== null && selectedBlank !== 'none' && selectedBlank !== '') {
      const alreadyAssigned = this.options.find(
        (opt, idx) => idx !== index && opt.blankNumber === selectedBlank
      )
      if (alreadyAssigned) {
        // Reset to None
        setTimeout(() => {
          this.options[index].blankNumber = ''
        }, 0)
        // You might want to show a notification here
        this.snackBar.open('This blank is already assigned to another option.')
        this.emitUpdatedOptions()
        return
      }
    }
    this.options[index].blankNumber = selectedBlank
    this.emitUpdatedOptions()
  }

  onTextChange(index: number, text: string): void {
    this.options[index].text = text
    this.emitUpdatedOptions()
  }

  canAddMoreOptions(): boolean {
    return this.options.length < this.maxOptions
  }

  private emitUpdatedOptions(): void {
    this.optionsUpdated.emit(this.options)
  }

  getRomanNumeral(num: number): string {
    const romanNumerals: { [key: number]: string } = {
      1: 'i', 2: 'ii', 3: 'iii', 4: 'iv', 5: 'v',
      6: 'vi', 7: 'vii', 8: 'viii', 9: 'ix', 10: 'x'
    }
    return romanNumerals[num] || num.toString()
  }

  isBasicAssessment(): boolean {
    return this.compatibilityLevel === 6
  }

  adjustOptionsForBasicAssessment(): void {
    if (!this.isBasicAssessment()) {
      return
    }

    const targetCount = this.ftbCount
    const currentCount = this.options.length

    if (targetCount > currentCount) {
      // Add more options to match ftbCount
      for (let i = currentCount; i < targetCount && i < this.maxOptions; i++) {
        this.addOption(true, `B${i + 1}`)
      }
    } else if (targetCount < currentCount && targetCount > 0) {
      // Remove extra options
      this.options = this.options.slice(0, targetCount)
    }

    // Always update IDs and blank numbers for all options
    this.options.forEach((opt, idx) => {
      opt.id = idx + 1
      opt.blankNumber = `B${idx + 1}`
    })

    this.emitUpdatedOptions()
  }
}
