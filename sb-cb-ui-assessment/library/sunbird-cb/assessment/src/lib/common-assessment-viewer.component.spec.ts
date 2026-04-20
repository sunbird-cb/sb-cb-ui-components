import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CommonAssessmentViewerComponent } from './common-assessment-viewer.component'

describe('CommonAssessmentViewerComponent', () => {
  let component: CommonAssessmentViewerComponent
  let fixture: ComponentFixture<CommonAssessmentViewerComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommonAssessmentViewerComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAssessmentViewerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
