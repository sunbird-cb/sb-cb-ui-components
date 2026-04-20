import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { FinalAssessmentPopupComponent } from './final-assessment-popup.component'

describe('FinalAssessmentPopupComponent', () => {
  let component: FinalAssessmentPopupComponent
  let fixture: ComponentFixture<FinalAssessmentPopupComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FinalAssessmentPopupComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalAssessmentPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
