import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'

@Component({
  selector: 'sb-uic-match-the-following',
  templateUrl: './match-the-following.component.html',
  styleUrls: ['./match-the-following.component.scss']
})
export class MatchTheFollowingComponent implements OnInit, OnChanges {
  @Input() options: any[] = []
  @Input() isReadOnly: boolean = false
  @Output() optionsUpdated = new EventEmitter<any[]>()
  @Output() addOptionRequest = new EventEmitter<void>()

  pairsList: any[] = []
  maxOptions: number = 7
  minOptions: number = 2

  ngOnInit(): void {
    this.initializePairs()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && !changes['options'].firstChange && this.options && this.options.length > 0) {
      this.initializePairs()
    }
  }

  initializePairs(): void {
    if (this.options && this.options.length > 0) {
      this.pairsList = this.options
    } else {
      // Initialize with 2 empty pairs
      this.pairsList = [
        { id: 1, question: '', answer: '' },
        { id: 2, question: '', answer: '' }
      ]
    }
  }

  onQuestionTextChange(pair: any, text: string): void {
    pair.question = text
    this.emitOptionsUpdate()
  }

  onAnswerTextChange(pair: any, text: string): void {
    pair.answer = text
    this.emitOptionsUpdate()
  }

  addPair(): void {
    if (this.canAddMorePairs()) {
      const newId = this.pairsList.length > 0 ? Math.max(...this.pairsList.map(p => p.id)) + 1 : 1
      this.pairsList.push({
        id: newId,
        question: '',
        answer: ''
      })
      this.emitOptionsUpdate()
    }
  }

  removePair(index: number): void {
    if (this.pairsList.length > this.minOptions) {
      this.pairsList.splice(index, 1)
      this.emitOptionsUpdate()
    }
  }

  canAddMorePairs(): boolean {
    return this.pairsList.length < this.maxOptions
  }

  emitOptionsUpdate(): void {
    this.optionsUpdated.emit(this.pairsList)
  }
}
