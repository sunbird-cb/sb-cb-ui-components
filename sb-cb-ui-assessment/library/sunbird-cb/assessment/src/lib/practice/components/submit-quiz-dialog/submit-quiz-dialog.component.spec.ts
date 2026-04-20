import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SubmitQuizDialogComponent } from './submit-quiz-dialog.component'

describe('SubmitQuizDialogComponent', () => {
  let component: SubmitQuizDialogComponent
  let fixture: ComponentFixture<SubmitQuizDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitQuizDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitQuizDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
