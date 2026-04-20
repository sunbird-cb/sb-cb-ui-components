import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ErrorSomethingWrongComponent } from './error-something-wrong.component'

describe('ErrorSomethingWrongComponent', () => {
  let component: ErrorSomethingWrongComponent
  let fixture: ComponentFixture<ErrorSomethingWrongComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorSomethingWrongComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSomethingWrongComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
