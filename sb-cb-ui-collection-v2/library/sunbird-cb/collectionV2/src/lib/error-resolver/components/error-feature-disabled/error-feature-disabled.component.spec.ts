import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ErrorFeatureDisabledComponent } from './error-feature-disabled.component'

describe('ErrorFeatureDisabledComponent', () => {
  let component: ErrorFeatureDisabledComponent
  let fixture: ComponentFixture<ErrorFeatureDisabledComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorFeatureDisabledComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFeatureDisabledComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
