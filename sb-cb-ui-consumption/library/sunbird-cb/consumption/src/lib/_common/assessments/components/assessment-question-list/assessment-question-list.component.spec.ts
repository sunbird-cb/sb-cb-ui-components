import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuestionListComponent } from './assessment-question-list.component';

describe('AssessmentQuestionListComponent', () => {
  let component: AssessmentQuestionListComponent;
  let fixture: ComponentFixture<AssessmentQuestionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentQuestionListComponent]
    });
    fixture = TestBed.createComponent(AssessmentQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
