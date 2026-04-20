import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ErrorServiceUnavailableComponent } from './error-service-unavailable.component'

describe('ErrorServiceUnavailableComponent', () => {
  let component: ErrorServiceUnavailableComponent
  let fixture: ComponentFixture<ErrorServiceUnavailableComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorServiceUnavailableComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorServiceUnavailableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
