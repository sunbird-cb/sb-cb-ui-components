import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CompletionSpinnerComponent } from './completion-spinner.component'

describe('CompletionSpinnerComponent', () => {
  let component: CompletionSpinnerComponent
  let fixture: ComponentFixture<CompletionSpinnerComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompletionSpinnerComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletionSpinnerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
